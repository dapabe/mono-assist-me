import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const previousAppIds = sqliteTable('previousAppIds', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  createdAt: int('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const localData = sqliteTable('localData', {
  currentName: text('currentName').notNull(),
  currentAppId: text('currentAppId')
    .references(() => previousAppIds.id)
    .notNull(),
});

export const localDataRelations = relations(localData, ({ one }) => ({
  currentApp: one(previousAppIds, {
    fields: [localData.currentAppId],
    references: [previousAppIds.id],
  }),
}));

export const listeningTo = sqliteTable('listeningTo', {
  id: int('id').primaryKey({ autoIncrement: true }),
  appId: text('appId').notNull(),
  name: text('name').notNull(),
  lastSeen: int('lastSeen', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});
