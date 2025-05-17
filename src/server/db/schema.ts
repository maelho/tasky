import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

/**
 * Common column creators for reuse throughout the schema
 */
const createIdColumn = (name = 'id') => integer(name, { mode: 'number' }).primaryKey({ autoIncrement: true })

const createStringIdColumn = (name = 'id') => text(name).primaryKey()

const createTimestamps = () => ({
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
})

/**
 * Task Management Tables
 */
export const boards = sqliteTable(
  'board',
  {
    id: createIdColumn(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    ...createTimestamps(),
  },
  (board) => [index('board_user_id_idx').on(board.userId)],
)

export type BoardSelect = typeof boards.$inferSelect
export type BoardInsert = typeof boards.$inferInsert

export const lists = sqliteTable(
  'list',
  {
    id: createIdColumn(),
    title: text('title').notNull(),
    order: integer('order').notNull(),
    boardId: integer('board_id')
      .notNull()
      .references(() => boards.id, { onDelete: 'cascade' }),
    ...createTimestamps(),
  },
  (list) => [index('list_board_id_idx').on(list.boardId), index('list_board_order_idx').on(list.boardId, list.order)],
)

export type ListSelect = typeof lists.$inferSelect
export type ListInsert = typeof lists.$inferInsert

export const cards = sqliteTable(
  'card',
  {
    id: createIdColumn(),
    title: text('title').notNull(),
    order: integer('order').notNull(),
    description: text('description'),
    listId: integer('list_id')
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),
    ...createTimestamps(),
  },
  (card) => [index('card_list_id_idx').on(card.listId), index('card_list_order_idx').on(card.listId, card.order)],
)

export type CardSelect = typeof cards.$inferSelect
export type CardInsert = typeof cards.$inferInsert

/**
 * Authentication Tables
 */
export const user = sqliteTable(
  'user',
  {
    id: createStringIdColumn(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
    image: text('image'),
    ...createTimestamps(),
  },
  (user) => [uniqueIndex('user_email_idx').on(user.email)],
)

export type UserSelect = typeof user.$inferSelect
export type UserInsert = typeof user.$inferInsert

export const session = sqliteTable(
  'session',
  {
    id: createStringIdColumn(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    token: text('token').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    ...createTimestamps(),
  },
  (session) => [
    uniqueIndex('session_token_idx').on(session.token),
    index('session_user_id_idx').on(session.userId),
    index('session_expires_at_idx').on(session.expiresAt),
  ],
)

export type SessionSelect = typeof session.$inferSelect
export type SessionInsert = typeof session.$inferInsert

export const account = sqliteTable(
  'account',
  {
    id: createStringIdColumn(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
    scope: text('scope'),
    password: text('password'),
    ...createTimestamps(),
  },
  (account) => [
    uniqueIndex('account_user_provider_idx').on(account.userId, account.providerId),
    index('account_user_id_idx').on(account.userId),
  ],
)

export type AccountSelect = typeof account.$inferSelect
export type AccountInsert = typeof account.$inferInsert

export const verification = sqliteTable(
  'verification',
  {
    id: createStringIdColumn(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    ...createTimestamps(),
  },
  (verification) => [
    uniqueIndex('verification_identifier_value_idx').on(verification.identifier, verification.value),
    index('verification_expires_at_idx').on(verification.expiresAt),
  ],
)

export type VerificationSelect = typeof verification.$inferSelect
export type VerificationInsert = typeof verification.$inferInsert

/**
 * Relations definitions
 */
export const boardRelations = relations(boards, ({ many, one }) => ({
  lists: many(lists),
  user: one(user, {
    fields: [boards.userId],
    references: [user.id],
  }),
}))

export const listRelations = relations(lists, ({ one, many }) => ({
  board: one(boards, {
    fields: [lists.boardId],
    references: [boards.id],
  }),
  cards: many(cards),
}))

export const cardRelations = relations(cards, ({ one }) => ({
  list: one(lists, {
    fields: [cards.listId],
    references: [lists.id],
  }),
}))

export const userRelations = relations(user, ({ many }) => ({
  boards: many(boards),
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))
