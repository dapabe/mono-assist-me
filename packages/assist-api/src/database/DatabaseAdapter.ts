import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { MissingLocalDataError } from '../errors/MissingLocalData.error';
import { ILocalData } from '../schemas/LocalData.schema';
import { UUID } from '../types/common';
import { MigrationManager } from './MigrationManager';
import { migrations } from './migrations';
import * as schema from './tables';

abstract class DatabaseAdapter<TDriver> {
  protected abstract db: ReturnType<typeof drizzle>;
  protected abstract driver: TDriver;

  abstract init(): Promise<void>;
  abstract close(): Promise<void>;
  abstract getLocalData(): Promise<ILocalData>;
  abstract patchLocalData(data: Partial<ILocalData>): Promise<void>;
  abstract addListeningTo(appId: string, name: string): Promise<void>;
  abstract removeListeningTo(appId: string): Promise<void>;
  abstract getListeningTo(): Promise<{ appId: string; name: string; lastSeen: string }[]>;
  abstract patchLastSeen(appId: string): Promise<void>;
}

export class DrizzleAdapter<TDriver> extends DatabaseAdapter<TDriver> {
  protected db!: ReturnType<typeof drizzle<typeof schema>>;
  protected driver: TDriver;

  constructor(driver: TDriver) {
    super();
    this.driver = driver;
  }

  async init(): Promise<void> {
    //@ts-expect-error Driver type varies between platforms
    this.db = drizzle(this.driver, { schema });
    // Run migrations
    const m = MigrationManager.getInstance(this);
    await m.migrateToLatest(migrations);
  }

  async close(): Promise<void> {
    //@ts-expect-error Driver type varies between platforms
    if ('close' in this.driver && typeof this.driver.close === 'function') {
      await this.driver.close();
    }
  }

  async getLocalData(): Promise<ILocalData> {
    const result = await this.db.query.localData.findFirst({
      with: {
        currentApp: true,
      },
    });

    if (!result) throw new Error('No local data found');

    const previousIds = await this.db
      .select()
      .from(schema.previousAppIds)
      .orderBy(schema.previousAppIds.createdAt);

    return {
      currentName: result.currentName,
      currentAppId: result.currentAppId,
      previousAppIds: previousIds.map((p) => p.id),
    };
  }

  async patchLocalData(data: Partial<ILocalData>): Promise<void> {
    if (data.currentAppId) {
      await this.db.insert(schema.previousAppIds).values({ id: data.currentAppId });
    }

    const result = await this.db.select().from(schema.localData).limit(1);
    if (result.length === 0) {
      throw new MissingLocalDataError();
    }
    // If we're changing the app ID, save current one to history
    if (data.currentAppId && data.currentAppId !== result[0].currentAppId) {
      await this.db.insert(schema.previousAppIds).values({
        id: data.currentAppId,
      });
    }
    await this.db
      .update(schema.localData)
      .set({
        ...(data.currentName && { currentName: data.currentName }),
        ...(data.currentAppId && { currentAppId: data.currentAppId }),
      })
      .where(eq(schema.localData.currentAppId, result[0].currentAppId));
  }

  async addListeningTo(appId: UUID, name: string): Promise<void> {
    await this.db
      .insert(schema.listeningTo)
      .values({
        appId,
        name,
        lastSeen: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.listeningTo.appId,
        set: { name, lastSeen: new Date() },
      });
  }

  async removeListeningTo(appId: UUID): Promise<void> {
    await this.db.delete(schema.listeningTo).where(eq(schema.listeningTo.appId, appId));
  }

  async getListeningTo(): Promise<{ appId: UUID; name: string; lastSeen: string }[]> {
    const result = await this.db.select().from(schema.listeningTo);
    return result.map((row) => ({
      appId: row.appId,
      name: row.name,
      lastSeen: new Date(row.lastSeen).toISOString(),
    }));
  }

  async patchLastSeen(appId: UUID): Promise<void> {
    await this.db
      .update(schema.listeningTo)
      .set({ lastSeen: new Date() })
      .where(eq(schema.listeningTo.appId, appId));
  }
}
