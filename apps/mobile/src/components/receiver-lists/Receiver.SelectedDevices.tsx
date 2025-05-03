import { UITheme } from '#src/common/ui-theme';
import { useImplicitToggle } from '#src/hooks/useImplicitToggle.hook';
import { IWSRoomListener, useRoomStore } from '@mono/assist-api';
import { Button, ListItem } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';

export function ReceiverSelectedDevices() {
  const ctx = useRoomStore();
  const [isRefreshing, toggleRefresh] = useImplicitToggle();

  const getColorStatus = (room: IWSRoomListener): string => {
    if (room.needsAssist) return 'red';
    if (room.disconnected) return 'gray';
    return 'green';
  };

  const handleDelete = (appId: string) => {
    toggleRefresh();
    const emitter = ctx.roomsListeningTo.find((x) => x.appId === appId);
    Alert.alert(
      `¿Seguro desea eliminar a '${emitter?.callerName}'?`,
      'Tendras que volver a añadir esta persona',
      [
        {
          isPreferred: true,
          text: 'No',
          style: 'cancel',
          onPress: () => {
            toggleRefresh();
          },
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: () => {
            ctx.deleteListeningTo(appId);
            toggleRefresh();
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <View style={styles.root}>
      <FlashList
        data={[...ctx.roomsListeningTo.values()]}
        estimatedItemSize={10}
        keyExtractor={(x) => x.appId}
        refreshing={isRefreshing}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() => {
              if (item.needsAssist) ctx.respondToHelp(item.appId);
            }}
          >
            <View
              style={[
                styles.statusCircle,
                {
                  backgroundColor: getColorStatus(item),
                },
              ]}
            />
            <ListItem.Content>
              <ListItem.Title>{item.callerName}</ListItem.Title>
              <ListItem.Subtitle>{item.device}</ListItem.Subtitle>
            </ListItem.Content>
            <Button
              type="clear"
              icon={{ type: 'feather', name: 'delete' }}
              onPress={() => handleDelete(item.appId)}
            />
          </ListItem>
        )}
      />
      {/* <Tooltip
				visible={isTooltipOpen}
				onOpen={toggleTooltip}
				onClose={toggleTooltip}
				popover={<SelectedDevicesTooltip />}
				// containerStyle={styles.tooltip}
			>
				<View style={styles.tooltipContainer}>
					<Text>Info</Text>
				</View>
			</Tooltip> */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  statusCircle: {
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: Dimensions.get('window').width * 0.1,
    height: Dimensions.get('window').width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    justifyContent: 'center',
    backgroundColor: UITheme.lightColors?.primary,
    alignItems: 'center',
    borderRadius: UITheme.spacing?.xl,
    marginInline: UITheme.spacing?.lg,
    paddingVertical: UITheme.spacing?.xl,
  },
  tooltip: {
    backgroundColor: 'blue',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
