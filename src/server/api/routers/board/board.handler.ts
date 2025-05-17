import { TRPCError } from '@trpc/server';
import { and, asc, count, desc, eq } from 'drizzle-orm';
import type { ProtectedContext } from '~/server/api/trpc';
import { boards, lists, cards } from '~/server/db/schema';
import type * as Schema from './board.schema';

/**
 * Create a new board for the authenticated user
 */
export async function createBoard({ ctx, input }: { ctx: ProtectedContext; input: Schema.TCreateBoard }) {
  const { title } = input;

  const [board] = await ctx.db
    .insert(boards)
    .values({
      title,
      userId: ctx.session.user.id,
    })
    .returning();

  if (!board) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create board',
    });
  }

  return board;
}

/**
 * Get all boards for the authenticated user, ordered by most recent first
 */
export async function getBoards({ ctx }: { ctx: ProtectedContext; input: Schema.TGetBoards }) {
  const boardResults = await ctx.db.query.boards.findMany({
    where: eq(boards.userId, ctx.session.user.id),
    orderBy: [desc(boards.createdAt)],
  });

  return boardResults;
}

/**
 * Get a board by ID, with optional lists and cards included
 */
export async function getBoardById({ ctx, input }: { ctx: ProtectedContext; input: Schema.TGetBoardById }) {
  const { boardId, includeListsAndCards } = input;

  // Option 1: Get board with lists and cards if requested
  if (includeListsAndCards) {
    const boardWithLists = await ctx.db.query.boards.findFirst({
      where: and(
        eq(boards.id, boardId),
        eq(boards.userId, ctx.session.user.id)
      ),
      with: {
        lists: {
          orderBy: (lists, { asc }) => [asc(lists.order)],
          with: {
            cards: {
              orderBy: (cards, { asc }) => [asc(cards.order)]
            }
          }
        }
      }
    });

    if (!boardWithLists) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Board not found' });
    }

    return boardWithLists;
  }

  // Option 2: Just get the board without lists for better performance
  const board = await ctx.db.query.boards.findFirst({
    where: and(
      eq(boards.id, boardId),
      eq(boards.userId, ctx.session.user.id)
    )
  });

  if (!board) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Board not found' });
  }

  return board;
}

/**
 * Delete a board and all its associated lists and cards (cascade delete)
 */
export async function deleteBoard({ ctx, input }: { ctx: ProtectedContext; input: Schema.TDeleteBoard }) {
  const { boardId } = input;

  // Fetch the board first to make sure it exists and user has access
  const boardToDelete = await ctx.db.query.boards.findFirst({
    where: and(
      eq(boards.id, boardId),
      eq(boards.userId, ctx.session.user.id)
    )
  });

  if (!boardToDelete) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Board not found',
    });
  }

  // Delete the board (lists and cards will cascade delete due to foreign key constraints)
  const [deletedBoard] = await ctx.db
    .delete(boards)
    .where(eq(boards.id, boardId))
    .returning();

  return deletedBoard;
}

/**
 * Update a board's title
 */
export async function updateBoard({ ctx, input }: { ctx: ProtectedContext; input: Schema.TUpdateBoard }) {
  const { title, boardId } = input;

  const [updatedBoard] = await ctx.db
    .update(boards)
    .set({ title })
    .where(and(
      eq(boards.id, boardId),
      eq(boards.userId, ctx.session.user.id)
    ))
    .returning();

  if (!updatedBoard) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Board not found',
    });
  }

  return updatedBoard;
}

/**
 * Get board statistics (count of lists and cards)
 */
export async function getBoardStats({ ctx, input }: { ctx: ProtectedContext; input: Schema.TGetBoardStats }) {
  const { boardId } = input;

  // Make sure the board exists and user has access to it
  const board = await ctx.db.query.boards.findFirst({
    where: and(
      eq(boards.id, boardId),
      eq(boards.userId, ctx.session.user.id)
    ),
  });

  if (!board) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Board not found',
    });
  }

  // Get list count
  const listCount = await ctx.db
    .select({ count: count() })
    .from(lists)
    .where(eq(lists.boardId, boardId))
    .get();

  // Get card count
  const cardCount = await ctx.db
    .select({ count: count() })
    .from(cards)
    .innerJoin(lists, eq(cards.listId, lists.id))
    .where(eq(lists.boardId, boardId))
    .get();

  return {
    board,
    stats: {
      listCount: listCount?.count ?? 0,
      cardCount: cardCount?.count ?? 0,
    }
  };
}