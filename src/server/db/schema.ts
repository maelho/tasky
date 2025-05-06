import { relations, sql } from 'drizzle-orm'
import { index, int, integer, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'

export const createTable = sqliteTableCreator((name) => `tasky-v2_${name}`)

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

export const boards = createTable('board', {
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

export const lists = createTable(
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

// Define the Card table
export const cards = createTable(
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

// Define the AuditLog table
export const auditLogs = createTable('audit_log', {
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
