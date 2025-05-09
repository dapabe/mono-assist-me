import { AssistanceRoomProvider } from '#src/components/AssistanceRoom.provider';
import { Redirect, Stack } from 'expo-router';

export default function HomeLayout() {
  // if (true) return <Redirect href={'/(home)/register'} />;

  return (
    <AssistanceRoomProvider>
      <Stack initialRouteName="(dashboard)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="register" />
      </Stack>
    </AssistanceRoomProvider>
  );
}
