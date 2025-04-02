import { useAssistanceRoom } from "#src/components/AssistanceRoom.provider";
import { ReceiverSearchDevices } from "#src/components/receiver-lists/Receiver.SearchDevices";
import { ReceiverSelectedDevices } from "#src/components/receiver-lists/Receiver.SelectedDevices";
import { Tab, TabView } from "@rneui/themed";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReceiverScreen() {
	const [currentTab, setTab] = useState(0);

	const ctx = useAssistanceRoom();

	useEffect(() => {
		if (!ctx.roomsListeningTo.size) setTab(1);
	}, [ctx.roomsListeningTo]);

	return (
		<SafeAreaView style={styles.root}>
			<TabView value={currentTab} onChange={setTab} animationType="spring">
				<TabView.Item style={styles.searchView}>
					<ReceiverSelectedDevices />
				</TabView.Item>
				<TabView.Item style={styles.searchView}>
					<ReceiverSearchDevices currentTab={currentTab} />
				</TabView.Item>
			</TabView>
			<Tab value={currentTab} onChange={setTab}>
				<Tab.Item
					title={"Mis elegidos"}
					icon={{ type: "feather", name: "activity" }}
				/>

				<Tab.Item title={"Buscar"} icon={{ type: "feather", name: "search" }} />
			</Tab>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	root: {
		// paddingHorizontal: 40,
		// width: "100%",
		flex: 1,
	},
	searchView: {
		flexGrow: 1,
	},

	addEmitterContainer: {
		flex: 1,
		justifyContent: "space-between",
		flexDirection: "column",
	},
});
