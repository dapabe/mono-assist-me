import { schemaBarrel, Table_LocalData } from '@mono/assist-api';
import migrations from '@mono/assist-api/migrations';
import { sql } from 'drizzle-orm';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';
import { createContext, PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

const DatabaseContext = createContext<null | ExpoSQLiteDatabase<typeof schemaBarrel>>(null);
const expo = openDatabaseSync('assist.db');
const db = drizzle(expo, { schema: schemaBarrel });

export function DatabaseProvider(props: PropsWithChildren): ReactNode {
  const { error, success } = useMigrations(db, migrations);

  useEffect(() => {
    const d = db.run(sql`SELECT * FROM sqlite_master;`);
    console.log(d);
  }, []);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return <DatabaseContext value={db}>{props.children}</DatabaseContext>;
}
