import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DynamicCallerScreen() {
	const { ipEmitter } = useLocalSearchParams<{ ipEmitter: string }>();
	return (
		<View>
			<Text>x</Text>
		</View>
	);
}
