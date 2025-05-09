import { useQuery } from '@tanstack/react-query';

import { useRouter } from 'expo-router';
import React, { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

type ISessionStore = {
  name: string;
  appId: string;
  changeName: (v: string) => Promise<void>;
};

const SessionCtx = createContext<ISessionStore | null>(null);

export function useSession(): ISessionStore {
  const value = useContext(SessionCtx);

  if (!value) {
    throw new Error('cannot use useSession outside SessionProvider');
  }

  return value;
}

/**
 *  Provides basic user information.
 *
 *  Double name validation just in case somehow the name is changed outside the app
 */
export function SessionProvider(props: PropsWithChildren) {
  const router = useRouter();
  // const { data, isLoading } = useQuery({
  // 	queryKey: [QueryKey.GetLocalName],
  // 	queryFn: async () => {
  // 		let [name, appId] = await Promise.all([
  // 			LocalStoreService.getLocalName(),
  // 			LocalStoreService.getAppId(),
  // 		]);
  // 		if (!appId) {
  // 			appId = ExpoCrypto.randomUUID();
  // 			await LocalStoreService.updateAppId(appId);
  // 		}
  // 		return { name, appId };
  // 	},
  // });

  // useEffect(() => {
  // 	if (data?.name) router.replace("/(dashboard)/emitter");
  // 	else router.replace("/register");
  // }, [router]);

  // if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  return props.children;
}
