import fss from 'node:fs'
import path from 'node:path'
import BetterSqlite3 from 'better-sqlite3'
import { app, dialog } from 'electron'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import {
  DatabaseService,
  schemaBarrel,
  vanillaRoomStore
} from '@mono/assist-api'
import { drizzle } from 'drizzle-orm/better-sqlite3'

export async function initializeDatabase(): Promise<void> {
  try {
    let dbPath = path.join(app.getPath('appData'), 'assist.db')
    if (import.meta.env.DEV) {
      const dirPath = path.resolve('.temp')
      fss.mkdirSync(path.dirname(dirPath), { recursive: true })
      dbPath = path.join(dirPath, 'sqlite.db')
    }
    const client = new BetterSqlite3(dbPath)
    client.exec('PRAGMA journal_mode = WAL;')
    const adapter = drizzle({
      client,
      schema: schemaBarrel
    })

    migrate(adapter, {
      migrationsFolder: './node_modules/@mono/assist-api/migrations'
    })

    DatabaseService.getInstance().setAdapter(adapter)
    await vanillaRoomStore
      .getState()
      .syncDatabase(DatabaseService.getInstance().Repo)
  } catch (error) {
    const message =
      (error as Error)?.message || 'Failed to start the application'

    dialog.showErrorBox('Application Error', message)
    app.quit()
    throw error
  }
}
