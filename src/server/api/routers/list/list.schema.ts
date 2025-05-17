import { z } from 'zod';
import * as common from '../../schemas/common';

/**
 * Schema for list item in batch update operations
 */
const listItemSchema = z.object({
  id: common.id,
  title: common.title,
  order: common.order,
});

/**
 * Update multiple lists' order in a single operation
 */
export const ZUpdateListOrder = z.object({
  items: z.array(listItemSchema).min(1, { 
    message: 'At least one item is required.' 
  }),
});

export type TUpdateListOrder = z.infer<typeof ZUpdateListOrder>;

/**
 * Create a new list in a board
 */
export const ZCreateList = z.object({
  title: common.title,
  boardId: common.id,
});

export type TCreateList = z.infer<typeof ZCreateList>;

/**
 * Get all lists with their cards for a board
 */
export const ZGetlistsWithCards = z.object({
  boardId: common.id,
});

export type TGetlistsWithCards = z.infer<typeof ZGetlistsWithCards>;

/**
 * Copy a list with all its cards
 */
export const ZCopyList = z.object({
  listId: common.id,
  boardId: common.id,
});

export type TCopyList = z.infer<typeof ZCopyList>;

/**
 * Delete a list
 */
export const ZDeleteList = z.object({
  listId: common.id,
  boardId: common.id,
});

export type TDeleteList = z.infer<typeof ZDeleteList>;

/**
 * Update a list's properties
 */
export const ZUpdateList = z.object({
  title: common.title,
  listId: common.id,
  boardId: common.id,
  order: common.order.optional(),
});

export type TUpdateList = z.infer<typeof ZUpdateList>;

/**
 * Get a list by its ID
 */
export const ZGetListById = z.object({
  id: common.id,
});

export type TGetListById = z.infer<typeof ZGetListById>;

/**
 * Get all lists for a board
 */
export const ZGetListsByBoardId = z.object({
  boardId: common.id,
});

export type TGetListsByBoardId = z.infer<typeof ZGetListsByBoardId>;