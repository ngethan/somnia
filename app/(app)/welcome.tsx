import { useRouter } from "expo-router";
import React from "react";
import { Layout, Text, Button, Icon } from "@ui-kitten/components";

import { View } from "react-native";

export default function WelcomeScreen() {
	const router = useRouter();

	return (
		<Layout
			style={{
				flex: 1,
				padding: 24,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{/* Logo (Optional) */}

			{/* App Title */}
			<Text category="h1" status="primary" style={{ marginBottom: 16 }}>
				Somnia
			</Text>

			{/* Subtitle */}
			<Text category="s1" style={{ textAlign: "center", marginBottom: 32 }}>
				Track your sleep, improve your mental health, and compete with friends!
			</Text>

			{/* Sign Up Button */}
			<Button
				style={{ marginBottom: 16, width: "100%" }}
				status="primary"
				size="large"
				// accessoryLeft={(props) => <Icon {...props} name="rocket-outline" />}
				onPress={() => router.push("/sign-up")}
			>
				Sign Up
			</Button>

			{/* Sign In Button */}
			<Button
				style={{ width: "100%" }}
				status="basic"
				size="large"
				// accessoryLeft={(props) => <Icon {...props} name="key-outline" />}
				onPress={() => router.push("/sign-in")}
			>
				Sign In
			</Button>

			{/* Testimonials */}
			<View style={{ marginTop: 48 }}>
				<Text
					category="p1"
					style={{ textAlign: "center", fontStyle: "italic" }}
				>
					"This app changed my sleep habits forever!"
				</Text>
				<Text
					category="p1"
					style={{ textAlign: "center", fontStyle: "italic", marginTop: 8 }}
				>
					"Best app for improving mental health!"
				</Text>
			</View>
		</Layout>
	);
}
