import { DatabaseService, schemaBarrel } from '@mono/assist-api';
import migrations from '@mono/assist-api/migrations';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';
import { createContext, PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

const DatabaseContext = createContext<null | ExpoSQLiteDatabase<typeof schemaBarrel>>(null);

type Props = PropsWithChildren<{
  setStep: (step: string, value?: string) => void;
}>;

export function DatabaseProvider(props: Props): ReactNode {
  const dbRef = useRef(() => {
    const expo = openDatabaseSync('assist.db');
    const db = drizzle(expo, { schema: schemaBarrel });
    DatabaseService.getInstance().setAdapter(db);
    return db;
  }).current();

  const { error, success } = useMigrations(dbRef, migrations);

  if (error) props.setStep('db.error', error.message);

  if (!success) props.setStep('db.migrate');
  return <DatabaseContext value={dbRef}>{props.children}</DatabaseContext>;
}
