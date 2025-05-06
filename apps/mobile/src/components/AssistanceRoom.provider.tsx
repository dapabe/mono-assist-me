import { ConnMethod, IConnAdapter, UdpSocketClient, useRoomStore } from '@mono/assist-api';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useNetworkAppState } from './Network.provider';
import { ReactNativeSocketAdapter } from '../common/udp-client.adapter';

import { useAppIdQuery } from '#src/hooks/useAppId.query';
import { useLocalNameQuery } from '#src/hooks/useLocalName.query';

export function AssistanceRoomProvider({ children }: PropsWithChildren) {
  const appState = useRef(AppState.currentState);
  const { Internal_IPv4 } = useNetworkAppState();

  const { currentName } = useLocalNameQuery();
  const { currentAppId } = useAppIdQuery();

  const room = useRoomStore();
  const adapterRef = useRef<IConnAdapter>(null);

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
      room.updateMemoryState('currentName', currentName.data);
      room.updateMemoryState('currentAppId', 'currentAppId');
      const client = new UdpSocketClient({
        adapter: new ReactNativeSocketAdapter(),
        store: room,
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
