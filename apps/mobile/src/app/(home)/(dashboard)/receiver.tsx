import { ReceiverSearchDevices } from '#src/components/receiver-lists/Receiver.SearchDevices';
import { ReceiverSelectedDevices } from '#src/components/receiver-lists/Receiver.SelectedDevices';
import { useRoomStore } from '@mono/assist-api';
import { useTranslation } from 'react-i18next';
import { Tab, TabView } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReceiverScreen() {
  const { t } = useTranslation();

  const [currentTab, setTab] = useState(0);

  const ctx = useRoomStore();

  useEffect(() => {
    if (!ctx.roomsListeningTo.length) setTab(1);
  }, [ctx.roomsListeningTo]);

  return (
    <SafeAreaView style={styles.root}>
      <TabView value={currentTab} onChange={setTab} animationType="spring">
        <TabView.Item style={styles.searchView}>
          <ReceiverSelectedDevices />
        </TabView.Item>
        <TabView.Item style={styles.searchView}>
          <ReceiverSearchDevices currentTab={currentTab} />
        </TabView.Item>
      </TabView>
      <Tab value={currentTab} onChange={setTab}>
        <Tab.Item
          title={t('Dashboard.PageReceiver.SelectedDevicesTab.Title')}
          icon={{ type: 'feather', name: 'activity' }}
        />

        <Tab.Item
          title={t('Dashboard.PageReceiver.SearchDevicesTab.Title')}
          icon={{ type: 'feather', name: 'search' }}
        />
      </Tab>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    // paddingHorizontal: 40,
    // width: "100%",
    flex: 1,
  },
  searchView: {
    flexGrow: 1,
  },

  addEmitterContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});
