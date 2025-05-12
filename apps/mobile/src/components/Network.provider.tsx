import { useQuery } from '@tanstack/react-query';
import { useNetworkState, getIpAddressAsync } from 'expo-network';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  Suspense,
  use,
} from 'react';
import { Alert, BackHandler, Text } from 'react-native';

type INetworkState = {
  /**
   * 	Local network IP
   */
  Internal_IPv4: string;
};

const NetworkCtx = createContext<INetworkState | null>(null);

export function useNetworkAppState(): INetworkState {
  const ctx = useContext(NetworkCtx);
  if (!ctx) {
    throw new Error('useNetworkAppState must be used inside NetworkProvider');
  }
  return ctx;
}

export function NetworkProvider({ children }: PropsWithChildren) {
  // const [ip, setIp] = useState<string>('0.0.0.0');

  const ip = useQuery({
    queryKey: ['ip'],
    queryFn: () => getIpAddressAsync(),
  });

  useEffect(() => {
    if (ip.data === '0.0.0.0' || ip.isError) {
      Alert.alert('Error', ip.error?.message, [{ text: 'Exit', onPress: BackHandler.exitApp }]);
    }
  }, [ip.data, ip.isError]);

  const value = useMemo<INetworkState>(() => ({ Internal_IPv4: ip.data! }), [ip.data]);

  if (ip.isLoading) return <Text>Loading ip</Text>;

  return <NetworkCtx.Provider value={value}>{children}</NetworkCtx.Provider>;
}
