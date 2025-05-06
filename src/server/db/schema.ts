import { relations, sql } from 'drizzle-orm'
import { index, int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const actionEnum = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const

export type Action = (typeof actionEnum)[keyof typeof actionEnum]

export const entityTypeEnum = {
  BOARD: 'BOARD',
  LIST: 'LIST',
  CARD: 'CARD',
} as const

export type EntityType = (typeof entityTypeEnum)[keyof typeof entityTypeEnum]

export const boards = sqliteTable('board', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  orgId: text('orgId').notNull(),
  title: text('title').notNull(),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
})

export type BoardSelect = typeof boards.$inferSelect
export type BoardInser = typeof boards.$inferInsert

export const lists = sqliteTable(
  'list',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    order: integer('order').notNull(),
    boardId: integer('board_id').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
  },
  (t) => [index('board_idx').on(t.boardId)],
)

export type ListSelect = typeof lists.$inferSelect
export type ListInser = typeof lists.$inferInsert

export const cards = sqliteTable(
  'card',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    order: integer('order').notNull(),
    description: text('description'),
    listId: integer('list_id').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
  },
  (t) => [index('listIdx').on(t.listId)],
)

export type CardSelect = typeof cards.$inferSelect
export type CardInser = typeof cards.$inferInsert

export const auditLogs = sqliteTable('audit_log', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  orgId: text('org_id').notNull(),
  action: text('action').$type<Action>().notNull(),
  entityId: integer('entity_id').notNull(),
  entityType: text('entity_type').$type<EntityType>().notNull(),
  entityTitle: text('entity_title').notNull(),
  userId: text('user_id').notNull(),
  userImage: text('user_image').notNull(),
  userName: text('user_name').notNull(),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
})

export type AuditLogsSelect = typeof auditLogs.$inferSelect
export type AuditLogsInser = typeof auditLogs.$inferInsert

export const boardRelations = relations(boards, ({ many }) => ({
  lists: many(lists),
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

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})
