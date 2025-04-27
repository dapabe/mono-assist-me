import fss from 'node:fs'
import path from 'node:path'
import BetterSqlite3 from 'better-sqlite3'
import { app, dialog } from 'electron'
import { DrizzleAdapter } from '@mono/assist-api'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { DatabaseService } from './services/Database.service'

export async function initializeDatabase(): Promise<void> {
  try {
    let dbPath = path.join(app.getPath('appData'), 'assist.db')
    if (import.meta.env.DEV) {
      const dirPath = path.resolve('.temp')
      fss.mkdirSync(path.dirname(dirPath), { recursive: true })
      dbPath = path.join(dirPath, 'sqlite.db')
    }
    const adapter = new DrizzleAdapter(new BetterSqlite3(dbPath))
    adapter.init()
    migrate(adapter.db, {
      migrationsFolder: './node_modules/@mono/assist-api/migrations'
    })
    DatabaseService.getInstance().setAdapter(adapter)
  } catch (error) {
    const message =
      (error as Error)?.message || 'Failed to start the application'

    dialog.showErrorBox('Application Error', message)
    app.quit()
    throw error
  }
}
