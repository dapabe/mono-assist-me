import { useLocalDataRepository } from '#src/hooks/useLocalData.repo';
import { QueryKey } from '#src/query-client';
import { DatabaseService } from '@mono/assist-api';
import { useQuery } from '@tanstack/react-query';

import { useFocusEffect, useRouter } from 'expo-router';
import { PropsWithChildren, useCallback, ReactNode } from 'react';
import { ActivityIndicator, Alert, BackHandler } from 'react-native';

export function LocalSessionGuard(props: PropsWithChildren): ReactNode {
  const router = useRouter();
  const exists = useLocalDataRepository.entryExists();

  useFocusEffect(
    useCallback(() => {
      if (!exists?.data) router.replace('/register');
    }, [exists.data])
  );

  if (exists.isLoading) return <ActivityIndicator size={'large'} color="#0000ff" />;
  return props.children;
}
