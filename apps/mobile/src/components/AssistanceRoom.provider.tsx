import { ConnMethod, UdpSocketClient } from '@mono/assist-api';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useNetworkAppState } from './Network.provider';
import { ReactNativeSocketAdapter } from '../common/udp-client.adapter';

import { useAppIdQuery } from '#src/hooks/useAppId.query';
import { useLocalNameQuery } from '#src/hooks/useLocalName.query';
import { useRoomStore } from '#src/hooks/useRoomStore';

export function AssistanceRoomProvider({ children }: PropsWithChildren) {
  const appState = useRef(AppState.currentState);
  const { Internal_IPv4 } = useNetworkAppState();

  const { currentName } = useLocalNameQuery();
  const { currentAppId } = useAppIdQuery();

  const room = useRoomStore();

  //	Room state handled here
  // const [state, roomMethods] = useRoomReducer();

  // const udpRoom = useLimitedBroadcast({
  // 	roomMethods,
  // 	state,
  // 	currentAppId: currentAppId.data!,
  // 	currentName: currentName.data!,
  // });

  // const toggleRespondToSearches = () => {
  // 	roomMethods.dispatchEvent({
  // 		event: RoomEventLiteralSideEffect.respo,
  // 	});
  // };

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
      (async () => {
        await new UdpSocketClient({
          adapter: new ReactNativeSocketAdapter(),
          store: room,
          address: Internal_IPv4,
          port: UdpSocketClient.DISCOVERY_PORT,
        }).init();
      })();
    }

    return () => {
      if (room.connAdapter) {
        room.connAdapter.close();
      }
    };
  }, [room.connMethod]);

  return children;
}
