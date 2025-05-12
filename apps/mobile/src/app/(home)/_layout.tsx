import { AssistanceRoomProvider } from '#src/components/AssistanceRoom.provider';
import { LocalSessionGuard } from '#src/components/LocalSession.guard';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <LocalSessionGuard>
      <AssistanceRoomProvider>
        <Stack initialRouteName="(dashboard)" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(dashboard)" />
        </Stack>
      </AssistanceRoomProvider>
    </LocalSessionGuard>
  );
}
