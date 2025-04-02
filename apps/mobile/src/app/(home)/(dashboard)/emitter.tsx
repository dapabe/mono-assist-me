import { UITheme } from '#src/common/ui-theme';
import { useImplicitToggle } from '#src/hooks/useImplicitToggle.hook';
import { RoomServiceStatus, useRoomStore } from '@mono/assist-api';
import { Icon, Switch, Text } from '@rneui/themed';
import { useMemo } from 'react';
import { Dimensions, StyleSheet, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmitterScreen() {
  const ctx = useRoomStore.getState();
  const [tooltipVisible, toggleTooltip] = useImplicitToggle();

  const isHelpDisabled = useMemo(() => {
    return ctx.status !== RoomServiceStatus.Up || !ctx.currentListeners.size || !!ctx.HELP_INTERVAL;
  }, [ctx.status, ctx.currentListeners, ctx.HELP_INTERVAL]);

  const btnColor = useMemo(() => {
    if (isHelpDisabled) return 'gray';
    if (ctx.status === RoomServiceStatus.Up) return 'blue';
    return 'gray';
  }, [ctx.status, isHelpDisabled]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.btnContainer}>
        <TouchableHighlight
          style={[
            styles.btn,
            {
              backgroundColor: btnColor,
            },
          ]}
          disabled={isHelpDisabled}
          // onPress={ctx.actions.help}
        >
          <Text disabled={ctx.status !== RoomServiceStatus.Up}>Llamar</Text>
          {/* <MedicalCross /> */}
        </TouchableHighlight>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.rowGroup}>
          <Icon type="feather" name="users" />
          <Text style={{ color: UITheme.lightColors?.primary }}>{ctx.currentListeners.size}</Text>
        </View>
        <View style={styles.rowGroup}>
          <Text>¿Responder a busquedas?</Text>
          <Switch
            value={true}
            // onValueChange={ctx.toggleWillRespondToSearch}
          ></Switch>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: 'center',
  },
  btnContainer: {
    flexGrow: 1,
    paddingHorizontal: UITheme.spacing?.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.9,
  },
  bottomContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: UITheme.lightColors?.white,
    paddingVertical: UITheme.spacing?.lg,
  },
  rowGroup: {
    flexDirection: 'row',
    columnGap: UITheme.spacing?.md,
    alignItems: 'center',
  },
});
