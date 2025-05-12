import { RoomServiceStatus, useRoomStore } from '@mono/assist-api';
import { Icon } from '@rneui/themed';
import { Tabs } from 'expo-router';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, PressableProps } from 'react-native';

export default function DashboardLayout() {
  const { t } = useTranslation();

  const ctx = useRoomStore();
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="emitter"
        options={{
          title: t('Dashboard.PageEmitter.Title'),
          tabBarIcon: (p) => <Icon {...p} type="feather" name="radio" />,
        }}
      />
      <Tabs.Screen
        name="receiver"
        options={{
          title: t('Dashboard.PageReceiver.Title'),
          tabBarIcon: (p) => <Icon {...p} type="feather" name="list" />,
          // tabBarButton: (p) => <ReceiverTabButton {...p} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: true,
          title: t('Dashboard.PageSettings.Title'),
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
