import { z } from 'zod';
import * as common from '../../schemas/common';

/**
 * Schema for creating a new card in a list
 */
export const ZCreateCard = z.object({
  title: common.title,
  listId: common.id,
});

export type TCreateCard = z.infer<typeof ZCreateCard>;

/**
 * Schema for a card item in batch update operations
 */
const cardItemSchema = z.object({
  id: common.id,
  order: common.order,
  listId: common.id,
});

/**
 * Schema for updating multiple cards' order in a single operation
 * Supports moving cards between lists
 */
export const ZUpdateCardOrder = z.object({
  items: z.array(cardItemSchema).min(1, { 
    message: 'At least one item is required.' 
  }),
});

export type TUpdateCardOrder = z.infer<typeof ZUpdateCardOrder>;

/**
 * Schema for getting a card by its ID
 */
export const ZGetCardById = z.object({
  id: common.id,
});

export type TGetCardById = z.infer<typeof ZGetCardById>;

/**
 * Schema for updating a card's properties
 */
export const ZUpdateCard = z.object({
  id: common.id,
  title: common.title.optional(),
  description: z.string().optional(),
  order: common.order.optional(),
  listId: common.id.optional(),
});

export type TUpdateCard = z.infer<typeof ZUpdateCard>;

/**
 * Schema for copying a card
 */
export const ZCopyCard = z.object({
  id: common.id,
  boardId: common.id,
});

export type TCopyCard = z.infer<typeof ZCopyCard>;

/**
 * Schema for deleting a card
 */
export const ZDeleteCard = z.object({
  id: common.id,
  boardId: common.id,
});

export type TDeleteCard = z.infer<typeof ZDeleteCard>;

/**
 * Schema for getting all cards in a list
 */
export const ZGetCardsByListId = z.object({
  listId: common.id,
});

export type TGetCardsByListId = z.infer<typeof ZGetCardsByListId>;