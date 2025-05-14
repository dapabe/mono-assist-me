import { ConnMethod, IConnAdapter, UdpSocketClient, useRoomStore } from '@mono/assist-api';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useNetworkAppState } from './Network.provider';
import { ReactNativeSocketAdapter } from '../common/udp-react-native.adapter';
import { useLocalDataRepository } from '#src/hooks/useLocalData.repo';
import * as Device from 'expo-device';

export function AssistanceRoomProvider({ children }: PropsWithChildren) {
  const appState = useRef(AppState.currentState);
  const { Internal_IPv4 } = useNetworkAppState();

  const room = useRoomStore();
  const adapterRef = useRef<IConnAdapter>(null);

  const localData = useLocalDataRepository.getLocalData();

  // useEffect(() => {
  // 	const handleAppStateChange = (nextAppState: AppStateStatus) => {
  // 		if (
  // 			appState.current.match(/inactive|background/) &&
  // 			nextAppState === "active"
  // 		) {
  // 		}
  // 		if (
  // 			appState.current === "active" &&
  // 			nextAppState.match(/inactive|background/)
  // 		)
  // 			appState.current = nextAppState;
  // 	};

  // 	const suscription = AppState.addEventListener(
  // 		"change",
  // 		handleAppStateChange
  // 	);
  // 	return () => {
  // 		suscription.remove();
  // 	};
  // }, []);

  useEffect(() => {
    if (room.connMethod === ConnMethod.None) {
      if (adapterRef.current) return;
      room.updateMemoryState('currentName', localData.data?.currentName ?? 'Unknown');
      room.updateMemoryState('currentAppId', localData.data?.currentAppId ?? 'Unknown');
      room.updateMemoryState('currentDevice', Device.deviceName ?? 'Unknown Device');
      const client = new UdpSocketClient({
        adapter: new ReactNativeSocketAdapter(),
        store: room,
        // For some reason using the native current ipv4 address wont allow it to receive packets, using
        // 0.0.0.0 do allows it, only tested in Android, idk IOS
        address: '0.0.0.0',
      });
      client.init();
      adapterRef.current = client;
    }

    return () => {
      if (room.connAdapter) {
        room.connAdapter.close();
        adapterRef.current = null;
      }
    };
  }, [room.connMethod]);

  return children;
}
