import { schemaBarrel, Table_LocalData } from '@mono/assist-api';
import migrations from '@mono/assist-api/migrations/migrations';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';
import { createContext, PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

const DatabaseContext = createContext(null);
const expo = openDatabaseSync('assist.db');
const db = drizzle(expo, { schema: schemaBarrel });

export function DatabaseProvider(props: PropsWithChildren): ReactNode {
  const { error, success } = useMigrations(db, migrations);

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

  useEffect(() => {
    const d = db.select().from(Table_LocalData).all();
    console.log(d);
  }, []);

  return <DatabaseContext.Provider value={null}>{props.children}</DatabaseContext.Provider>;
}
