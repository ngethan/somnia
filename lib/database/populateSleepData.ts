import { useState } from "react";
import { HealthValue } from "react-native-health";
import { useSupabase } from "../../context/supabase-provider";
import { supabase } from "../../config/supabase";
import { OpenAI } from "openai";

const openai = new OpenAI({
	apiKey:
		"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",
});

export async function getAISuggestions(
	minutesSlept: number,
	timesWokenUp: number,
	startDate: Date,
	endDate: Date,
) {
	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "system",
				content:
					"You are a sleep expert whose job is to give sleep recommendations.",
			},
			{
				role: "user",
				content: `Based on the following sleep data: time slept = ${minutesSlept} minutes, times woken up = ${timesWokenUp}, time slept = ${startDate}, time woken up = ${endDate} provide a sleep recommendation.`,
			},
		],
	});
	return Response.json(completion.choices[0].message);
}

function mergeConsecutiveSleepEntries(data: HealthValue[]) {
	if (data.length === 0) {
		return [];
	}

	const result = [data[0]];

	for (let i = 1; i < data.length; i++) {
		if (data[i].value !== result[result.length - 1].value) {
			result.push(data[i]);
		}
	}

	return result;
}

function aggregateSleepMinutes(healthValues: HealthValue[]) {
	const sleepStages = new Set(["ASLEEP", "DEEP", "CORE", "REM"]);

	return healthValues
		.filter((d) => sleepStages.has(d.value))
		.reduce((totalMinutes, d) => {
			return (
				totalMinutes +
				(new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) /
					(1000 * 60)
			);
		}, 0);
}

function aggregateWakeUps(healthValues: HealthValue[]) {
	const sleepStages = new Set(["ASLEEP", "DEEP", "CORE", "REM"]);
	let wakeUps = 0;
	let wasAsleep = false;

	for (let i = 0; i < healthValues.length; i++) {
		const currentValue = healthValues[i].value;

		if (sleepStages.has(currentValue)) {
			wasAsleep = true;
		} else if (currentValue === "INBED" && wasAsleep) {
			wakeUps++;
			wasAsleep = false;
		}
	}

	return wakeUps;
}

export function usePopulateSleepData() {
	const { session } = useSupabase();

	async function populateSleepData(data: HealthValue[]) {
		if (!session) {
			return {
				success: false,
				message: "User not signed in",
			};
		}
		const { data: lastRecord, error } = await supabase
			.from("sleep_data")
			.select("endDate")
			.order("endDate", { ascending: false })
			.eq("userId", session.user.id)
			.limit(1);

		if (error) {
			console.error("Error fetching data:", error);
			return null;
		}

		const lastDate = lastRecord?.[0]?.endDate
			? new Date(lastRecord[0].endDate)
			: null;

		let conciseData = mergeConsecutiveSleepEntries(data);

		if (
			// if last data is not from today
			lastDate &&
			`${lastDate.getMonth()}/${lastDate.getDate()}/${lastDate.getFullYear()}` !==
				`${new Date().getMonth()}/${new Date().getDate()}/${new Date().getFullYear()}`
		) {
			conciseData = conciseData.filter(
				(d) => new Date(d.startDate).getTime() > lastDate.getTime(),
			);
		}

		if (!conciseData?.[0]) return;

		const minutesSlept = aggregateSleepMinutes(conciseData);
		const timesWokenUp = aggregateWakeUps(conciseData);
		const startDate = new Date(conciseData?.[0].startDate);
		const endDate = new Date(conciseData[conciseData.length - 1].endDate);

		const aiData = await getAISuggestions(
			minutesSlept,
			timesWokenUp,
			startDate,
			endDate,
		);

		const { error: insertionError } = await supabase.from("sleep_data").insert([
			{
				userId: session.user.id,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				sleepDuration: minutesSlept,
				sleepQuality: 0,
				suggestions: aiData,
			},
		]);

		if (insertionError) {
			console.error("Error inserting data:", insertionError);
			return { success: false, message: "Error inserting sleep data" };
		}

		return { success: true, message: "Data inserted successfully" };
	}

	return { populateSleepData };
}
