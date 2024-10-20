import React from "react";
import { useRouter } from "expo-router";
import { Layout, Text, Button } from "@ui-kitten/components";
import { View, Image, StyleSheet } from "react-native";

export default function WelcomeScreen() {
	const router = useRouter();

	return (
		<Layout style={styles.container}>
			<View style={styles.content}>
				{/* Logo */}
				<Image
					source={require("./somnia.png")} // Path to your logo image
					style={{ width: 150, height: 150, marginBottom: 16 }} // Adjust size to fit your design
				/>

				{/* App Title */}
				<Text category="h1" style={styles.title}>
					Somnia
				</Text>

				{/* Subtitle */}
				<Text category="s1" style={styles.subtitle}>
					Track your sleep, improve your health, and compete with friends!
				</Text>

				{/* Sign Up Button */}
				<Button
					style={styles.signUpButton}
					size="large"
					status="primary"
					onPress={() => router.push("/sign-up")}
				>
					Sign Up
				</Button>

				{/* Sign In Button */}
				<Button
					style={styles.signInButton}
					size="large"
					status="basic"
					onPress={() => router.push("/sign-in")}
				>
					Sign In
				</Button>
			</View>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		backgroundColor: "#000000", // Always dark mode background
	},
	content: {
		alignItems: "center",
	},
	title: {
		color: "#FFFFFF", // Always white text
		marginBottom: 16,
	},
	subtitle: {
		color: "#FFFFFF", // Always white text
		textAlign: "center",
		marginBottom: 32,
	},
	signUpButton: {
		width: 250,
		marginBottom: 16,
		backgroundColor: "#8E44AD", // Purple background for the sign-up button
	},
	signInButton: {
		width: 250,
		backgroundColor: "#FFFFFF", // White background for the sign-in button
		color: "#000000", // Black text on sign-in button
	},
});
