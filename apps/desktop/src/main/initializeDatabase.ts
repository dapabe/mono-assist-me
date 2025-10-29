import fss from 'node:fs'
import path from 'node:path'
import BetterSqlite3 from 'better-sqlite3'
import { app, dialog } from 'electron'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { DatabaseService, schemaBarrel } from '@mono/assist-api'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { is } from '@electron-toolkit/utils'

function getDatabasePath(): string {
  let dbPath = path.join(app.getPath('appData'), 'assist.db')
  if (is.dev) {
    const dirPath = path.resolve('.temp')
    fss.mkdirSync(dirPath, { recursive: true })
    dbPath = path.join(dirPath, 'sqlite.db')
  }
  return dbPath
}
function getMigrationsPath(): string {
  let migrationsPath: string
  console.log(path.join(process.resourcesPath))
  if (is.dev) {
    migrationsPath = './node_modules/@mono/assist-api/migrations'
  } else {
    migrationsPath = path.join(process.resourcesPath, 'migrations')
  }

  if (!fss.existsSync(migrationsPath)) {
    throw new Error(`Migrations folder not found at: ${migrationsPath}`)
  }

  return migrationsPath
}

export async function initializeDatabase(): Promise<DatabaseService> {
  try {
    if (fss.existsSync(process.resourcesPath)) {
      console.log('Resources content:', fss.readdirSync(process.resourcesPath))
    }
    const dbPath = getDatabasePath()
    const migrationsPath = getMigrationsPath()

    const client = new BetterSqlite3(dbPath)
    client.exec('PRAGMA journal_mode = WAL;')
    const adapter = drizzle({
      client,
      schema: schemaBarrel
    })

    migrate(adapter, {
      migrationsFolder: migrationsPath
    })

    const instance = DatabaseService.getInstance()
    instance.setAdapter(adapter)

    return instance
  } catch (error) {
    const message =
      (error as Error)?.message || 'Failed to start the application'

    dialog.showErrorBox('Application Error', message)
    app.quit()
    throw error
  }
}
