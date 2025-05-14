import { UITheme } from '#src/common/ui-theme';
import { useImplicitToggle } from '#src/hooks/useImplicitToggle.hook';
import { useRoomStore } from '@mono/assist-api';
import { Button, Icon, ListItem } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type Props = {
  currentTab: number;
};

export function ReceiverSearchDevices({ currentTab }: Props) {
  const { t } = useTranslation();

  const ctx = useRoomStore();
  const [isRefreshing, toggleRefresh] = useImplicitToggle();

  const handleSearchDevices = () => {
    toggleRefresh();
    ctx.sendDiscovery();
    toggleRefresh();
  };

  // Search for devices on the initial screen render
  // useEffect(handleSearchDevices, [currentTab]);

  return (
    <View style={styles.root}>
      <FlashList
        data={ctx.roomsToDiscover}
        keyExtractor={(x) => x.appId}
        estimatedItemSize={10}
        refreshing={isRefreshing}
        renderItem={({ item }) => (
          <ListItem key={item.appId} onPress={() => ctx.addToListeningTo(item.appId)} bottomDivider>
            <Icon type="feather" name="user-plus" />
            <ListItem.Content>
              <ListItem.Title>{item.callerName}</ListItem.Title>
              <ListItem.Subtitle>{item.device}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
      <Button
        buttonStyle={styles.searchButton}
        radius={UITheme.spacing?.xl}
        type="solid"
        iconPosition="top"
        icon={{ type: 'feather', name: 'radio' }}
        onPress={handleSearchDevices}
      >
        <Text>{t('Dashboard.PageReceiver.SearchDevicesTab.DetectButton')}</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  searchButton: {
    marginInline: UITheme.spacing?.lg,
  },
});
