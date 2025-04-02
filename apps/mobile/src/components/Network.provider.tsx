import * as network from "expo-network";
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Alert, BackHandler } from "react-native";

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
		throw new Error("useNetworkAppState must be used inside NetworkProvider");
	}
	return ctx;
}

export function NetworkProvider({ children }: PropsWithChildren) {
	const [ip, setIp] = useState<string>("0.0.0.0");
	const netState = network.useNetworkState();

	useEffect(() => {
		//	This should change when bluetooth is added
		network.getIpAddressAsync().then((currentIp) => {
			if (currentIp === "0.0.0.0" || netState.isConnected === false)
				Alert.alert("Error", "No connection", [
					{ text: "Exit", onPress: BackHandler.exitApp },
				]);
			else setIp(currentIp);
		});
		return () => setIp("0.0.0.0");
	}, [netState.isConnected]);

	const value = useMemo<INetworkState>(
		() => ({ Internal_IPv4: ip }),
		[netState.isConnected]
	);

	return <NetworkCtx.Provider value={value}>{children}</NetworkCtx.Provider>;
}
