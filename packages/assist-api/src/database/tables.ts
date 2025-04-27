import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Table_PreviousAppIds = sqliteTable('previousAppIds', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  createdAt: int('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const Table_LocalData = sqliteTable('localData', {
  currentName: text('currentName').notNull(),
  currentAppId: text('currentAppId')
    .references(() => Table_PreviousAppIds.id)
    .notNull(),
});

export const TableRelation_LocalData = relations(Table_LocalData, ({ one }) => ({
  currentApp: one(Table_PreviousAppIds, {
    fields: [Table_LocalData.currentAppId],
    references: [Table_PreviousAppIds.id],
  }),
}));

export const Table_ListeningTo = sqliteTable('listeningTo', {
  id: int('id').primaryKey({ autoIncrement: true }),
  appId: text('appId').notNull(),
  name: text('name').notNull(),
  lastSeen: int('lastSeen', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});
