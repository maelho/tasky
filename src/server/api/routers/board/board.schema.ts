import { z } from 'zod';
import * as common from '../../schemas/common';

/**
 * Board schemas with optimized validation using common validators
 */

// Create a new board
export const ZCreateBoard = z.object({
  title: common.title,
});

export type TCreateBoard = z.infer<typeof ZCreateBoard>;

// Get all boards (empty input as we use the user from session)
export const ZGetBoards = z.object({});

export type TGetBoards = z.infer<typeof ZGetBoards>;

// Get a specific board by ID with options
export const ZGetBoardById = z.object({
  boardId: common.id,
  includeListsAndCards: z.boolean().optional().default(false),
});

export type TGetBoardById = z.infer<typeof ZGetBoardById>;

// Delete a board
export const ZDeleteBoard = z.object({
  boardId: common.id,
});

export type TDeleteBoard = z.infer<typeof ZDeleteBoard>;

// Update a board
export const ZUpdateBoard = z.object({
  boardId: common.id,
  title: common.title,
});

export type TUpdateBoard = z.infer<typeof ZUpdateBoard>;

// Get board statistics
export const ZGetBoardStats = z.object({
  boardId: common.id,
});

export type TGetBoardStats = z.infer<typeof ZGetBoardStats>;