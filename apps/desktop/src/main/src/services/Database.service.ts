import {
  DrizzleAdapter,
  ExpectedError,
  RepositoryLocalData
} from '@mono/assist-api'
import type BetterSqlite3 from 'better-sqlite3'
type Adapter = DrizzleAdapter<BetterSqlite3.Database>

export class DatabaseService {
  private static instance: DatabaseService
  private adapter: Adapter | null = null

  public Repo!: {
    LocalData: RepositoryLocalData
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  public setAdapter(adapter: Adapter): void {
    this.adapter = adapter

    this.Repo = {
      LocalData: new RepositoryLocalData(adapter.db)
    }
  }

  public getAdapter(): Adapter {
    if (!this.adapter) {
      throw new ExpectedError('db.drizzleNoInit')
    }
    return this.adapter
  }
}
