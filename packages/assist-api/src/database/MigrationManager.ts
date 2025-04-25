import { DatabaseMismatchError } from '../errors/DatabaseMismatch.error';
import { DrizzleAdapter } from './DatabaseAdapter';
import { migrations } from './migrations';

export interface IMigration {
  id: number;
  name: string;
  up: (db: DrizzleAdapter<unknown>) => Promise<void>;
  down: (db: DrizzleAdapter<unknown>) => Promise<void>;
}

export class MigrationManager {
  private static instance: MigrationManager;
  private db: DrizzleAdapter<unknown>;
  /** Current table schema version */
  private static APP_VERSION = 1;

  private constructor(db: DrizzleAdapter<unknown>) {
    this.db = db;
  }

  public static getInstance(db: DrizzleAdapter<unknown>): MigrationManager {
    if (!MigrationManager.instance) {
      MigrationManager.instance = new MigrationManager(db);
    }
    return MigrationManager.instance;
  }

  private async createMigrationsTable(): Promise<void> {
    // @ts-expect-error Platform specific implementation
    await this.db.db.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);
  }

  private async getAppliedMigrations(): Promise<number[]> {
    // @ts-expect-error Platform specific implementation
    const result = await this.db.db.execute('SELECT id FROM migrations ORDER BY id ASC');
    return result.map((row: any) => row.id);
  }

  private async markMigrationAsApplied(migration: IMigration): Promise<void> {
    // @ts-expect-error Platform specific implementation
    await this.db.db.execute('INSERT INTO migrations (id, name) VALUES (?, ?)', [
      migration.id,
      migration.name,
    ]);
  }

  private async getCurrentVersion(): Promise<number> {
    // @ts-expect-error Platform specific implementation
    const result = await this.db.db.execute('SELECT id FROM migrations ORDER BY id DESC LIMIT 1');
    return result.length ? result[0].id : 0;
  }

  public async migrateToLatest(migrations: IMigration[]): Promise<void> {
    await this.createMigrationsTable();
    const currentVersion = await this.getCurrentVersion();

    //  Prevent outdated app versions from running
    if (currentVersion > MigrationManager.APP_VERSION) {
      throw new DatabaseMismatchError(currentVersion, MigrationManager.APP_VERSION);
    }
    const appliedMigrations = await this.getAppliedMigrations();

    for (const migration of migrations) {
      if (
        !appliedMigrations.includes(migration.id) &&
        migration.id <= MigrationManager.APP_VERSION
      ) {
        try {
          await migration.up(this.db);
          await this.markMigrationAsApplied(migration);
          console.log(`[Migration] Applied: ${migration.name}`);
        } catch (error) {
          console.error(`[Migration] Failed: ${migration.name}`, error);
          throw error;
        }
      }
    }
  }

  private async removeMigration(migration: IMigration): Promise<void> {
    // @ts-expect-error Platform specific implementation
    await this.db.db.execute('DELETE FROM migrations WHERE id = ?', [migration.id]);
  }

  public async rollbackTo(version: number): Promise<void> {
    await this.createMigrationsTable();
    const currentVersion = await this.getCurrentVersion();

    if (version > currentVersion) {
      throw new Error(
        `Cannot rollback to version ${version}, current version is ${currentVersion}`
      );
    }

    if (version < 1) {
      throw new Error('Cannot rollback to version less than 1');
    }

    const appliedMigrations = await this.getAppliedMigrations();
    const migrationsToRollback = migrations
      .filter((m) => appliedMigrations.includes(m.id) && m.id > version)
      .sort((a, b) => b.id - a.id);

    for (const migration of migrationsToRollback) {
      try {
        await migration.down(this.db);
        await this.removeMigration(migration);
        console.log(`[Migration] Rolled back: ${migration.name}`);
      } catch (error) {
        console.error(`[Migration] Rollback failed: ${migration.name}`, error);
        throw error;
      }
    }

    // Important: Update app version after rollback
    MigrationManager.APP_VERSION = version;
  }
}
