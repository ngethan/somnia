import { Button, Text } from "@ui-kitten/components";
import { router } from "expo-router";
import { View } from "react-native";

import { H1, Muted } from "@/components/ui/typography";
import useHealthData from "@/hooks/useHealthData";

export default function Home() {
	const today = new Date();
	const { sleepData, restingHeartRateSamples, respiratoryRateSamples } =
		useHealthData({
			startDate: new Date(today.setMonth(today.getMonth() - 1)).toString(),
			endDate: today.toString(),
			includeManuallyAdded: false,
		});

	console.log(sleepData, "sleep data");
	console.log(restingHeartRateSamples, "resting heart rate samples");
	console.log(respiratoryRateSamples, "respiratory rate samples");

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
