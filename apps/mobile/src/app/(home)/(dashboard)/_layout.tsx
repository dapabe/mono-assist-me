import { RoomServiceStatus, useRoomStore } from '@mono/assist-api';
import { Icon } from '@rneui/themed';
import { Tabs } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';

export default function DashboardLayout() {
  const ctx = useRoomStore.getState();
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="emitter">
      <Tabs.Screen
        name="emitter"
        options={{
          title: 'Llamar',

          tabBarIcon: (p) => <Icon {...p} type="feather" name="radio" />,
        }}
      />
      <Tabs.Screen
        name="receiver"
        options={{
          title: `${ctx.roomsListeningTo.size}-${ctx.roomsToDiscover.size}`,
          tabBarIcon: (p) => <Icon {...p} type="feather" name="list" />,
          tabBarButton: (p) => <ReceiverTabButton {...p} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: true,
          title: 'Configuración',
          tabBarIcon: (p) => <Icon {...p} type="feather" name="settings" />,
        }}
      />
      <Tabs.Screen
        name="[ipEmitter]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

function ReceiverTabButton(props: PressableProps): ReactNode {
  const ctx = useRoomStore.getState();
  return <Pressable {...props} disabled={ctx.status !== RoomServiceStatus.Up} />;
}
