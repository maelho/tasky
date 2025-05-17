import { z } from 'zod';

/**
 * Common schema validators for reuse across the application
 * 
 * This centralized approach ensures:
 * 1. Consistent validation rules across all API endpoints
 * 2. Reduced code duplication
 * 3. Easier maintenance when validation rules need to change
 * 4. Improved performance through reuse of validator instances
 */

// ID validators
export const id = z.number().int().positive({
  message: 'ID must be a positive integer.',
});

export const boardId = z.object({
  boardId: id,
});

export const listId = z.object({
  listId: id,
});

export const cardId = z.object({
  id,
});

// Title validators (used for boards, lists, cards)
export const title = z.string()
  .trim()
  .min(3, { message: 'Title must be at least 3 characters long.' })
  .max(255, { message: 'Title must be at most 255 characters long.' });

export const titleOptional = title.optional();

// Order validators (used for sorting lists and cards)
export const order = z.number().int().nonnegative({
  message: 'Order must be a non-negative integer.',
});

export const orderOptional = order.optional();

// Description validators (used for cards)
export const description = z.string()
  .max(10000, { message: 'Description cannot exceed 10000 characters.' });

export const descriptionOptional = description.optional();

// Common array validators
export const nonEmptyArray = <T extends z.ZodTypeAny>(schema: T) => 
  z.array(schema).min(1, { message: 'At least one item is required.' });

// Common composite validators
export const withId = <T extends z.ZodRawShape>(schema: T) => 
  z.object({ ...schema, id });

export const withBoardId = <T extends z.ZodRawShape>(schema: T) => 
  z.object({ ...schema, boardId: id });

export const withListId = <T extends z.ZodRawShape>(schema: T) => 
  z.object({ ...schema, listId: id });

// Boolean validators
export const flag = z.boolean();
export const flagOptional = flag.optional();

// Time-related validators
export const timestamp = z.number().int().nonnegative();
export const isoDate = z.string().datetime();

// Pagination parameters
export const paginationParams = z.object({
  page: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().max(100).default(20),
});

// Sorting parameters
export const sortDirection = z.enum(['asc', 'desc']).default('asc');
export const sortParams = z.object({
  sortBy: z.string().default('createdAt'),
  sortDirection,
});