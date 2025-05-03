import { UITheme } from '#src/common/ui-theme';
import { useImplicitToggle } from '#src/hooks/useImplicitToggle.hook';
import { useRoomStore } from '@mono/assist-api';
import { Button, Icon, ListItem } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  currentTab: number;
};

export function ReceiverSearchDevices({ currentTab }: Props) {
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
        data={[...ctx.roomsToDiscover.values()]}
        keyExtractor={(x) => x.appId}
        estimatedItemSize={10}
        refreshing={isRefreshing}
        renderItem={({ item }) => (
          <ListItem onPress={() => ctx.addToListeningTo(item.appId)} bottomDivider>
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
        title={'Detectar otros dispositivos'}
        iconPosition="top"
        icon={{ type: 'feather', name: 'radio' }}
        onPress={handleSearchDevices}
      >
        <Text>Detectar otros dispositivos</Text>
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
