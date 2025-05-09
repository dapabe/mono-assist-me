import { DatabaseService, schemaBarrel } from '@mono/assist-api';
import migrations from '@mono/assist-api/migrations';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';
import { createContext, PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

const DatabaseContext = createContext<null | ExpoSQLiteDatabase<typeof schemaBarrel>>(null);

export function DatabaseProvider(props: PropsWithChildren): ReactNode {
  const dbRef = useRef(() => {
    const expo = openDatabaseSync('assist.db');
    const db = drizzle(expo, { schema: schemaBarrel });
    DatabaseService.getInstance().setAdapter(db);
    return db;
  }).current();

  const { error, success } = useMigrations(dbRef, migrations);

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

  return <DatabaseContext value={dbRef}>{props.children}</DatabaseContext>;
}
