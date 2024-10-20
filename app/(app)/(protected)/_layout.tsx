import { Tabs } from "expo-router";
import React from "react";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import * as eva from "@eva-design/eva"; // Import the default Eva theme
import { Ionicons } from "@expo/vector-icons";

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "dark"
							? colors.dark.background
							: colors.light.background,
				},
				tabBarActiveTintColor:
					colorScheme === "dark"
						? colors.dark.foreground
						: colors.light.foreground,
				tabBarShowLabel: false,
				// Add tabBarIcon here
				tabBarIcon: ({ color, size }) => {
					let icon = <Ionicons name="home" size={size} color={color} />;

					if (route.name === "settings") {
						icon = <Ionicons name="settings" size={size} color={color} />;
					} else if (route.name === "leaderboard") {
						icon = <Ionicons name="trophy" size={size} color={color} />;
					} else if (route.name === "profile") {
						icon = <Ionicons name="bed" size={size} color={color} />;
					}

					return icon;
				},
			})}
		>
			<Tabs.Screen name="index" options={{ title: "Home" }} />
			<Tabs.Screen name="profile" options={{ title: "Sleep" }} />
			<Tabs.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
			<Tabs.Screen name="settings" options={{ title: "Settings" }} />
		</Tabs>
	);
}
