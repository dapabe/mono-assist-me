import { AssistanceRoomProvider } from '#src/components/AssistanceRoom.provider';
import { useLocalNameQuery } from '#src/hooks/useLocalName.query';
import { QueryKey } from '#src/query-client';
import { LocalStoreService } from '#src/services/LocalStore.service';
import { usePrefetchQuery } from '@tanstack/react-query';
import * as ExpoCrypto from 'expo-crypto';
import { Redirect, Stack } from 'expo-router';

export default function HomeLayout() {
  usePrefetchQuery({
    queryKey: [QueryKey.GetAppId],
    queryFn: async () => {
      let appId = await LocalStoreService.getAppId();
      if (!appId) {
        appId = ExpoCrypto.randomUUID();
        await LocalStoreService.updateAppId(appId);
      }
      return appId;
    },
  });
  const { currentName } = useLocalNameQuery();

  if (currentName.error) return <Redirect href={'/(home)/register'} />;

  return (
    <AssistanceRoomProvider>
      <Stack initialRouteName="(dashboard)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="register" />
      </Stack>
    </AssistanceRoomProvider>
  );
}
