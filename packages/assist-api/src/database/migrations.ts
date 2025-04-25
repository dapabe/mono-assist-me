import { IMigration } from './MigrationManager';

/**
 *  Always add migrations, dont modify existing ones
 */
export const migrations: IMigration[] = [
  {
    id: 1,
    name: 'initial_schema',
    up: async (db) => {
      // @ts-expect-error Platform specific implementation
      await db.db.execute(`
        CREATE TABLE IF NOT EXISTS previousAppIds (
          id TEXT PRIMARY KEY,
          createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        CREATE TABLE IF NOT EXISTS localData (
          currentName TEXT NOT NULL,
          currentAppId TEXT NOT NULL,
          FOREIGN KEY (currentAppId) REFERENCES previousAppIds(id)
        );

        CREATE TABLE IF NOT EXISTS listeningTo (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          appId TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          lastSeen INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );
      `);
    },
    down: async () => {},
  },
];
