import { TRPCError } from '@trpc/server';
import { and, asc, eq, sql } from 'drizzle-orm';
import type { ProtectedContext } from '~/server/api/trpc';
import { boards, cards, lists } from '~/server/db/schema';
import type * as Schema from './card.schema';
import type { CardSelect } from '~/server/db/schema';

/**
 * Get the next order value for a new card in a list using SQL MAX
 */
async function getNextCardOrder(ctx: ProtectedContext, listId: number): Promise<number> {
  const result = await ctx.db
    .select({ maxOrder: sql<number>`COALESCE(MAX(${cards.order}), 0)` })
    .from(cards)
    .where(eq(cards.listId, listId))
    .get();

  return (result?.maxOrder ?? 0) + 1;
}

/**
 * Create a new card in a list
 */
export async function createCard({ ctx, input }: { ctx: ProtectedContext; input: Schema.TCreateCard }) {
  const { title, listId } = input;
  
  // Get the next order value
  const newOrder = await getNextCardOrder(ctx, listId);

  // Create the card
  const [card] = await ctx.db
    .insert(cards)
    .values({
      title,
      listId,
      order: newOrder,
    })
    .returning();

  if (!card) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create card' });
  }

  return card;
}

/**
 * Update the order of multiple cards in a single transaction
 */
export async function updateCardOrder({ ctx, input }: { ctx: ProtectedContext; input: Schema.TUpdateCardOrder }) {
  const { items } = input;

  if (!items?.length) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Items not found' });
  }

  // Update all cards in a single transaction for better performance
  await ctx.db.transaction(async (tx) => {
    const updatePromises = items.map((item) =>
      tx
        .update(cards)
        .set({ 
          order: item.order,
          listId: item.listId 
        })
        .where(eq(cards.id, item.id))
    );

    await Promise.all(updatePromises);
  });

  return { success: true, count: items.length };
}

/**
 * Get a card by ID with its list information
 */
export async function getCardById({ ctx, input }: { ctx: ProtectedContext; input: Schema.TGetCardById }) {
  const { id } = input;

  // Get card with its list in a single query
  const card = await ctx.db.query.cards.findFirst({
    where: eq(cards.id, id),
    with: {
      list: true
    }
  });

  if (!card) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Card not found' });
  }

  return card;
}

/**
 * Get all cards for a list
 */
export async function getCardsByListId({ ctx, input }: { ctx: ProtectedContext; input: Schema.TGetCardsByListId }) {
  const { listId } = input;

  // Get cards with ordering
  const cardsList = await ctx.db.query.cards.findMany({
    where: eq(cards.listId, listId),
    orderBy: [asc(cards.order)]
  });

  return cardsList;
}

/**
 * Update a card's properties
 */
export async function updateCard({ ctx, input }: { ctx: ProtectedContext; input: Schema.TUpdateCard }) {
  const { id, ...updateData } = input;

  // Update the card
  const [updatedCard] = await ctx.db
    .update(cards)
    .set(updateData)
    .where(eq(cards.id, id))
    .returning();

  if (!updatedCard) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Card not found' });
  }

  return updatedCard;
}

/**
 * Copy a card
 */
export async function copyCard({ ctx, input }: { ctx: ProtectedContext; input: Schema.TCopyCard }) {
  const { id, boardId } = input;

  // Get the card to copy
  const cardToCopy = await ctx.db.query.cards.findFirst({
    where: eq(cards.id, id),
    with: {
      list: true
    }
  });

  if (!cardToCopy) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Card not found' });
  }

  // Verify the list belongs to the specified board
  const listInBoard = await ctx.db.query.lists.findFirst({
    where: and(
      eq(lists.id, cardToCopy.listId),
      eq(lists.boardId, boardId)
    )
  });
  
  if (!listInBoard) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Card is not in the specified board' });
  }

  // Get next order
  const newOrder = await getNextCardOrder(ctx, cardToCopy.listId);

  // Create the copy
  const [newCard] = await ctx.db
    .insert(cards)
    .values({
      title: `${cardToCopy.title} - Copy`,
      description: cardToCopy.description,
      listId: cardToCopy.listId,
      order: newOrder
    })
    .returning();

  if (!newCard) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create card copy' });
  }

  return newCard;
}

/**
 * Delete a card
 */
export async function deleteCard({ ctx, input }: { ctx: ProtectedContext; input: Schema.TDeleteCard }) {
  const { id, boardId } = input;

  // Verify the card exists and belongs to a list in the specified board
  const card = await ctx.db.query.cards.findFirst({
    where: eq(cards.id, id),
    with: {
      list: {
        columns: {
          boardId: true
        }
      }
    }
  });

  if (!card) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Card not found' });
  }

  // Verify card is in the specified board
  if (card.list.boardId !== boardId) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Card is not in the specified board' });
  }

  // Delete the card and remember its info for the return value
  const id_to_return = card.id;
  const title_to_return = card.title;
  
  await ctx.db
    .delete(cards)
    .where(eq(cards.id, id));

  return { 
    id: id_to_return, 
    title: title_to_return
  };
}