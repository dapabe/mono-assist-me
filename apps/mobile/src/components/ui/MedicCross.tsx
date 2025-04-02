import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

const MedicalCross = () => {
	// Create animation value for opacity
	const opacity = useRef(new Animated.Value(0)).current;

	// Start the infinite fade in/out animation when component mounts
	useEffect(() => {
		// Create an infinite loop of fade in/out
		Animated.loop(
			Animated.sequence([
				// Fade in
				Animated.timing(opacity, {
					toValue: 1,
					duration: 1500,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
				// Fade out
				Animated.timing(opacity, {
					toValue: 0,
					duration: 1500,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
			])
		).start();

		// Clean up animation on unmount
		return () => opacity.stopAnimation();
	}, []);

	// Set up canvas dimensions
	const canvasWidth = 300;
	const canvasHeight = 300;

	// Cross dimensions (standard medical cross has equal length arms)
	const crossWidth = 200;
	const crossHeight = 200;
	const armWidth = 60;

	// Center point
	const centerX = canvasWidth / 2;
	const centerY = canvasHeight / 2;

	// Create the main cross path
	const crossPath = Skia.Path.Make();

	// Create shape as a single path with both bars
	// Start at top of vertical bar
	crossPath.moveTo(centerX - armWidth / 2, centerY - crossHeight / 2);
	// Top right of vertical bar
	crossPath.lineTo(centerX + armWidth / 2, centerY - crossHeight / 2);
	// Upper right corner where vertical meets horizontal
	crossPath.lineTo(centerX + armWidth / 2, centerY - armWidth / 2);
	// Right end of horizontal bar
	crossPath.lineTo(centerX + crossWidth / 2, centerY - armWidth / 2);
	// Bottom right of horizontal bar
	crossPath.lineTo(centerX + crossWidth / 2, centerY + armWidth / 2);
	// Bottom right where horizontal meets vertical
	crossPath.lineTo(centerX + armWidth / 2, centerY + armWidth / 2);
	// Bottom right of vertical bar
	crossPath.lineTo(centerX + armWidth / 2, centerY + crossHeight / 2);
	// Bottom left of vertical bar
	crossPath.lineTo(centerX - armWidth / 2, centerY + crossHeight / 2);
	// Bottom left where vertical meets horizontal
	crossPath.lineTo(centerX - armWidth / 2, centerY + armWidth / 2);
	// Left end of horizontal bar
	crossPath.lineTo(centerX - crossWidth / 2, centerY + armWidth / 2);
	// Top left of horizontal bar
	crossPath.lineTo(centerX - crossWidth / 2, centerY - armWidth / 2);
	// Top left where horizontal meets vertical
	crossPath.lineTo(centerX - armWidth / 2, centerY - armWidth / 2);
	// Back to start
	crossPath.close();

	// Create a larger path for the offset outline
	const outlinePath = Skia.Path.Make();
	const outlineOffset = 15; // Increased offset for the outline

	// Create outline path with offset
	// Start at top of vertical bar
	outlinePath.moveTo(
		centerX - armWidth / 2 - outlineOffset,
		centerY - crossHeight / 2 - outlineOffset
	);
	// Top right of vertical bar
	outlinePath.lineTo(
		centerX + armWidth / 2 + outlineOffset,
		centerY - crossHeight / 2 - outlineOffset
	);
	// Upper right corner where vertical meets horizontal
	outlinePath.lineTo(
		centerX + armWidth / 2 + outlineOffset,
		centerY - armWidth / 2 - outlineOffset
	);
	// Right end of horizontal bar
	outlinePath.lineTo(
		centerX + crossWidth / 2 + outlineOffset,
		centerY - armWidth / 2 - outlineOffset
	);
	// Bottom right of horizontal bar
	outlinePath.lineTo(
		centerX + crossWidth / 2 + outlineOffset,
		centerY + armWidth / 2 + outlineOffset
	);
	// Bottom right where horizontal meets vertical
	outlinePath.lineTo(
		centerX + armWidth / 2 + outlineOffset,
		centerY + armWidth / 2 + outlineOffset
	);
	// Bottom right of vertical bar
	outlinePath.lineTo(
		centerX + armWidth / 2 + outlineOffset,
		centerY + crossHeight / 2 + outlineOffset
	);
	// Bottom left of vertical bar
	outlinePath.lineTo(
		centerX - armWidth / 2 - outlineOffset,
		centerY + crossHeight / 2 + outlineOffset
	);
	// Bottom left where vertical meets horizontal
	outlinePath.lineTo(
		centerX - armWidth / 2 - outlineOffset,
		centerY + armWidth / 2 + outlineOffset
	);
	// Left end of horizontal bar
	outlinePath.lineTo(
		centerX - crossWidth / 2 - outlineOffset,
		centerY + armWidth / 2 + outlineOffset
	);
	// Top left of horizontal bar
	outlinePath.lineTo(
		centerX - crossWidth / 2 - outlineOffset,
		centerY - armWidth / 2 - outlineOffset
	);
	// Top left where horizontal meets vertical
	outlinePath.lineTo(
		centerX - armWidth / 2 - outlineOffset,
		centerY - armWidth / 2 - outlineOffset
	);
	// Back to start
	outlinePath.close();

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Canvas style={{ width: canvasWidth, height: canvasHeight }}>
				{/* Red cross */}
				<Path path={crossPath} color="red" style="fill" />
			</Canvas>

			<Animated.View
				style={{
					position: "absolute",
					opacity: opacity,
				}}
			>
				<Canvas style={{ width: canvasWidth, height: canvasHeight }}>
					{/* Blue outline with larger offset */}
					<Path
						path={outlinePath}
						color="blue"
						style="stroke"
						strokeWidth={10}
					/>
				</Canvas>
			</Animated.View>
		</View>
	);
};

export { MedicalCross };
