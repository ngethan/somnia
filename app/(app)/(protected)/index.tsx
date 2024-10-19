import { View } from "react-native";
import { Button, Text } from "@ui-kitten/components";
import { H1, Muted } from "@/components/ui/typography";
import { router } from "expo-router";

export default function Home() {
	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Welcome to Somnia!</H1>
			<Text category="h6" className="text-center">
				We’re glad to have you here.
			</Text>
			<Muted className="text-center">
				You are now authenticated, and your session will persist even after
				closing the app.
			</Muted>
			<Button
				style={{ width: "100%" }}
				onPress={() => router.push("/(app)/modal")}
			>
				Open Modal
			</Button>
		</View>
	);
}
