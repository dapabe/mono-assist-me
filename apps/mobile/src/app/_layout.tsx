import { UITheme } from "#src/common/ui-theme";
import { NetworkProvider } from "#src/components/Network.provider";
import { queryClient } from "#src/query-client";
import { ThemeProvider } from "@rneui/themed";
import { onlineManager, QueryClientProvider } from "@tanstack/react-query";
import * as network from "expo-network";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
	onlineManager.setEventListener((setOnline) => {
		const eventSubscription = network.addNetworkStateListener((state) => {
			setOnline(!!state.isConnected);
		});
		return eventSubscription.remove;
	});

	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaProvider>
				<StatusBar style="dark" />
				<NetworkProvider>
					<ThemeProvider theme={UITheme}>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="(home)" />
							<Stack.Screen name="+not-found" />
						</Stack>
					</ThemeProvider>
				</NetworkProvider>
			</SafeAreaProvider>
		</QueryClientProvider>
	);
}
