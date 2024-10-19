import { router } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

async function fetchSleepRecommendation(time_slept: number, times_woken_up: number){
	const url = `../../(api)/openai+api.ts?time_slept=${time_slept}&times_woken_up=${times_woken_up}`;
	const response = await fetch(url, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch sleep recommendation");
    }

    const data = await response.json();

    alert(data);
}

export default function Home() {
	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Home</H1>
			<Muted className="text-center">
				You are now authenticated and this session will persist even after
				closing the app.
			</Muted>
			<Button
				className="w-full"
				variant="default"
				size="default"
				onPress={() => router.push("/(app)/modal")}
			>
				<Text>Open Modal</Text>
			</Button>
			<Button
				className="w-full"
				variant="default"
				size="default"
				onPress={() => fetchSleepRecommendation(4, 5)}
			>
				<Text>OpenAI API Request</Text>
			</Button>
		</View>
	);
}
