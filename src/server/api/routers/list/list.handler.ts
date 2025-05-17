import { TRPCError } from '@trpc/server';
import { and, asc, desc, eq, exists, sql } from 'drizzle-orm';
import type { ProtectedContext } from '~/server/api/trpc';
import { boards, cards, lists } from '~/server/db/schema';
import type * as Schema from './list.schema';

/**
 * Get the next order value for a list in a board using efficient MAX function
 */
async function getNextListOrder(ctx: ProtectedContext, boardId: number): Promise<number> {
  const result = await ctx.db
    .select({ maxOrder: sql<number>`COALESCE(MAX(${lists.order}), 0)` })
    .from(lists)
    .where(eq(lists.boardId, boardId))
    .get();

  return (result?.maxOrder ?? 0) + 1;
}

export async function updateListOrder({ ctx, input }: { ctx: ProtectedContext; input: Schema.TUpdateListOrder }) {
  const { items } = input;

  if (!items.length) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Items not found' });
  }

  // Batch update all lists in a single transaction for better performance
  await ctx.db.transaction(async (tx) => {
    const updatePromises = items.map((item) =>
      tx
        .update(lists)
        .set({ order: item.order })
        .where(eq(lists.id, item.id))
    );
    
    await Promise.all(updatePromises);
  });
  
  return { success: true };
}

export async function createList({ ctx, input }: { ctx: ProtectedContext; input: Schema.TCreateList }) {
  const { title, boardId } = input;

  // Get next order value efficiently with MAX function
  const newOrder = await getNextListOrder(ctx, boardId);

  // Create the list
  const [list] = await ctx.db
    .insert(lists)
    .values({
      title,
      boardId,
      order: newOrder,
    })
    .returning();

  return list;
}

export async function getlistsWithCards({ ctx, input }: { ctx: ProtectedContext; input: Schema.TGetlistsWithCards }) {
  const { boardId } = input;

  // Get lists with cards in a single query for better performance
  const listsWithCards = await ctx.db.query.lists.findMany({
    where: eq(lists.boardId, boardId),
    with: {
      cards: {
        orderBy: [asc(cards.order)],
      },
    },
    orderBy: [asc(lists.order)],
  });

  return listsWithCards;
}

export async function copyList({ ctx, input }: { ctx: ProtectedContext; input: Schema.TCopyList }) {
  const { listId, boardId } = input;

  // Get the list to copy
  const listToCopy = await ctx.db.query.lists.findFirst({
    where: and(
      eq(lists.id, listId),
      eq(lists.boardId, boardId)
    ),
  });

  if (!listToCopy) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'List not found' });
  }
  
  // Get cards for this list
  const cardsToCopy = await ctx.db.query.cards.findMany({
    where: eq(cards.listId, listId),
  });

  // Get next order value
  const newOrder = await getNextListOrder(ctx, boardId);

  // Use transaction for atomic operation
  return await ctx.db.transaction(async (tx) => {
    // Create the new list
    const [newList] = await tx
      .insert(lists)
      .values({
        boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
      })
      .returning();

    if (!newList) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create list copy' });
    }

    // Copy all cards if there are any
    if (cardsToCopy.length > 0) {
      const cardInsertValues = cardsToCopy.map(card => ({
        listId: newList.id,
        title: card.title,
        description: card.description,
        order: card.order,
      }));

      await tx.insert(cards).values(cardInsertValues);
    }

    return newList;
  });
}

export async function deleteList({ ctx, input }: { ctx: ProtectedContext; input: Schema.TDeleteList }) {
  const { listId, boardId } = input;

  // Cards will be automatically deleted due to cascade constraint in schema
  const [deletedList] = await ctx.db
    .delete(lists)
    .where(and(
      eq(lists.id, listId),
      eq(lists.boardId, boardId)
    ))
    .returning();

  if (!deletedList) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'List not found' });
  }

  return deletedList;
}

export async function updateList({ ctx, input }: { ctx: ProtectedContext; input: Schema.TUpdateList }) {
  const { title, listId, boardId, order } = input;

  // Update list properties
  const [updatedList] = await ctx.db
    .update(lists)
    .set({
      title,
      ...(order !== undefined ? { order } : {}),
    })
    .where(and(
      eq(lists.id, listId),
      eq(lists.boardId, boardId)
    ))
    .returning();

  if (!updatedList) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'List not found' });
  }

  return updatedList;
}

export async function getListById({ ctx, input }: { ctx: ProtectedContext; input: Schema.TGetListById }) {
  const { id } = input;

  const list = await ctx.db.query.lists.findFirst({
    where: eq(lists.id, id),
    with: {
      cards: {
        orderBy: [asc(cards.order)]
      }
    }
  });

  if (!list) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'List not found' });
  }

  return list;
}

export async function getListsByBoardId({ ctx, input }: { ctx: ProtectedContext; input: Schema.TGetListsByBoardId }) {
  const { boardId } = input;

  // Get lists for the board with efficient ordering
  const boardLists = await ctx.db.query.lists.findMany({
    where: eq(lists.boardId, boardId),
    orderBy: [asc(lists.order)],
  });

  return boardLists;
}