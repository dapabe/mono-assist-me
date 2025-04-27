import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './tables';
import { ExpectedError } from '../errors/ExpectedError';
import { ILocalData } from '../schemas/LocalData.schema';
import { UUID } from '../types/common';
import { IRegisterLocalSchema } from '../schemas/RegisterLocal.schema';
import cuid2 from '@paralleldrive/cuid2';

export class DrizzleAdapter<TDriver> {
  public db!: ReturnType<typeof drizzle<typeof schema>>;
  protected driver: TDriver;

  constructor(driver: TDriver) {
    this.driver = driver;
  }

  init(): void {
    //@ts-expect-error Driver type varies between platforms
    this.db = drizzle(this.driver, { schema });
  }

  async close(): Promise<void> {
    //@ts-expect-error Driver type varies between platforms
    if ('close' in this.driver && typeof this.driver.close === 'function') {
      await this.driver.close();
    }
  }

  async getLocalData(): Promise<ILocalData> {
    const result = await this.db.query.Table_LocalData.findFirst({
      with: {
        currentApp: true,
      },
    });

    if (!result) throw new ExpectedError('db.missingLocalData');

    const previousIds = await this.db
      .select()
      .from(schema.Table_PreviousAppIds)
      .orderBy(schema.Table_PreviousAppIds.createdAt);

    return {
      currentName: result.currentName,
      currentAppId: result.currentAppId,
      previousAppIds: previousIds.map((p) => p.id),
    };
  }

  async createLocalData(data: IRegisterLocalSchema) {
    await this.db
      .insert(schema.Table_LocalData)
      .values({ currentName: data.name, currentAppId: cuid2.createId() });
  }

  async patchLocalData(data: Partial<ILocalData>): Promise<void> {
    if (data.currentAppId) {
      await this.db.insert(schema.Table_PreviousAppIds).values({ id: data.currentAppId });
    }

    const result = await this.db.select().from(schema.Table_LocalData).limit(1);
    if (result.length === 0) {
      throw new ExpectedError('db.missingLocalData');
    }
    // If we're changing the app ID, save current one to history
    if (data.currentAppId && data.currentAppId !== result[0].currentAppId) {
      await this.db.insert(schema.Table_PreviousAppIds).values({
        id: data.currentAppId,
      });
    }
    await this.db
      .update(schema.Table_LocalData)
      .set({
        ...(data.currentName && { currentName: data.currentName }),
        ...(data.currentAppId && { currentAppId: data.currentAppId }),
      })
      .where(eq(schema.Table_LocalData.currentAppId, result[0].currentAppId));
  }

  async addListeningTo(appId: UUID, name: string): Promise<void> {
    await this.db
      .insert(schema.Table_ListeningTo)
      .values({
        appId,
        name,
        lastSeen: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.Table_ListeningTo.appId,
        set: { name, lastSeen: new Date() },
      });
  }

  async removeListeningTo(appId: UUID): Promise<void> {
    await this.db.delete(schema.Table_ListeningTo).where(eq(schema.Table_ListeningTo.appId, appId));
  }

  async getListeningTo(): Promise<{ appId: UUID; name: string; lastSeen: string }[]> {
    const result = await this.db.select().from(schema.Table_ListeningTo);
    return result.map((row) => ({
      appId: row.appId,
      name: row.name,
      lastSeen: new Date(row.lastSeen).toISOString(),
    }));
  }

  async patchLastSeen(appId: UUID): Promise<void> {
    await this.db
      .update(schema.Table_ListeningTo)
      .set({ lastSeen: new Date() })
      .where(eq(schema.Table_ListeningTo.appId, appId));
  }
}
