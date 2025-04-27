import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './tables';

export abstract class DatabaseRepository {
  protected schema = schema;
  constructor(protected db: ReturnType<typeof drizzle<typeof schema>>) {}
}
