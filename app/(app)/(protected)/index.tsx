import React, { useState, useEffect, useCallback } from "react";

import useHealthData from "@/hooks/useHealthData";
import { Button, Card, Layout, Text } from "@ui-kitten/components";
import { StyleSheet, View, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { usePopulateSleepData } from "@/lib/database/populateSleepData";

// Helper function to generate the last 7 days including today
const generateLast7Days = () => {
	const today = new Date();
	const days = [];

	for (let i = 6; i >= 0; i--) {
		const day = new Date();
		day.setDate(today.getDate() - i);
		days.push({
			date: day.getDate(), // Numeric date
			dayAbbreviation: day.toLocaleString("en-US", { weekday: "short" }), // Abbreviation of day (e.g., Mon, Tue)
			dayName: day.toLocaleString("en-US", { weekday: "long" }), // Full day name (e.g., Monday)
		});
	}

	return days;
};

// Sample sleep stats (dummy data, but you could tie this to actual stats if available)
const sleepStats = {
	Monday: { hours: 6, quality: "Poor" },
	Tuesday: { hours: 7.5, quality: "Good" },
	Wednesday: { hours: 8, quality: "Great" },
	Thursday: { hours: 6.5, quality: "Fair" },
	Friday: { hours: 9, quality: "Excellent" },
	Saturday: { hours: 7, quality: "Good" },
	Sunday: { hours: 8.5, quality: "Great" },
};

// Header Component for Greeting with a dark purple night-time gradient
const Header = ({ greeting }: { greeting: string }): React.ReactElement => (
	<LinearGradient
		colors={["#4B0082", "#800080", "#191970"]} // Dark purple gradient
		style={styles.greetingCard}
	>
		<View style={styles.greetingContainer}>
			<Text category="h1" style={styles.greetingText}>
				{greeting} 🌙
			</Text>
			<Text category="s1" style={styles.subGreetingText}>
				You have slept 09:30 that is above your recommendation.
			</Text>
		</View>
	</LinearGradient>
);

// Footer Component with Action Buttons
const Footer = (): React.ReactElement => (
	<View style={styles.footerContainer}>
		<Button
			style={styles.footerControl}
			size="small"
			onPress={() => router.push("/(app)/modal")}
		>
			Stats
		</Button>
	</View>
);

// Header for Alarm Clock Card
const AlarmHeader = (): React.ReactElement => (
	<View>
		<Text category="h6">Alarm Clock</Text>
	</View>
);

export default function Home() {
	// State to store current time
	const [currentTime, setCurrentTime] = useState("");
	// State to store alarm time (selected by user)
	const [alarmTime, setAlarmTime] = useState(new Date());
	// State to track whether alarm is active
	const [alarmSet, setAlarmSet] = useState(false);
	// State for greeting based on time of day
	const [greeting, setGreeting] = useState("Good Morning");
	// State to track selected day and sleep stats
	const [selectedDay, setSelectedDay] = useState("Saturday");
	const [selectedStats, setSelectedStats] = useState(sleepStats["Saturday"]);
	// Generate last 7 days
	const last7Days = generateLast7Days();
	// State for showing the time picker
	const [showTimePicker, setShowTimePicker] = useState(false);

	const [date, setDate] = useState(new Date());
	const { sleepData, restingHeartRateSamples } = useHealthData(date);
	const { populateSleepData } = usePopulateSleepData();

	const changeDate = (numDays: string) => {
		const currentDate = new Date(date);

		currentDate.setDate(currentDate.getDate() + parseInt(numDays, 10));

		setDate(currentDate);
	};

	useFocusEffect(
		useCallback(() => {
			populateSleepData(sleepData).then(() => {
				console.log("Populated sleep data");
			});
			return () => {};
		}, []),
	);

	// useEffect hook to update current time and greeting every second
	useEffect(() => {
		const intervalId = setInterval(() => {
			const now = new Date();
			const timeString = now.toLocaleTimeString("en-US", { hour12: true });
			setCurrentTime(timeString);

			// Update greeting based on the current hour
			const currentHour = now.getHours();
			if (currentHour < 12) {
				setGreeting("Good Morning");
			} else if (currentHour < 18) {
				setGreeting("Good Afternoon");
			} else {
				setGreeting("Good Evening");
			}

			// Check if current time matches alarm time
			if (
				alarmSet &&
				now.toLocaleTimeString() === alarmTime.toLocaleTimeString()
			) {
				alert("Alarm ringing!");
				setAlarmSet(false); // Reset alarm after ringing
			}
		}, 1000);

		return () => clearInterval(intervalId); // Cleanup interval on component unmount
	}, [alarmTime, alarmSet]);

	// Function to handle time change from the picker
	const onTimeChange = (selectedTime: Date) => {
		const currentTime = selectedTime || alarmTime;
		setShowTimePicker(false); // Hide the picker once time is chosen
		setAlarmTime(currentTime);
	};

	// Function to confirm and set the alarm
	const confirmAlarm = () => {
		setAlarmSet(true);
		alert(
			`Alarm set for ${alarmTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
		);
	};

	// Function to handle day selection and update sleep stats
	const handleDaySelection = (dayName: string) => {
		setSelectedDay(dayName);
		setSelectedStats(sleepStats?.[dayName] || { hours: 0, quality: "No Data" });
	};

	return (
		<Layout style={styles.container}>
			{/* First Card (Welcome Message) */}
			<Card
				style={styles.card}
				header={() => <Header greeting={greeting} />}
				footer={Footer}
			>
				<Text category="p1">
					You slept for {selectedStats.hours} hours on {selectedDay}. Sleep
					quality: {selectedStats.quality}.
				</Text>
			</Card>

			{/* Sleep Calendar (Scrollable horizontally) */}
			<Card
				style={styles.card}
				header={() => <Text category="h6">Your Sleep Calendar</Text>}
			>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.calendarContainer}>
						{last7Days.map(({ date, dayAbbreviation, dayName }) => (
							<View style={styles.dayContainer} key={date}>
								<Text style={styles.dayAbbreviation}>{dayAbbreviation}</Text>
								<Button
									style={[
										styles.dayButton,
										dayName === selectedDay && styles.selectedDayButton,
									]}
									size="tiny"
									onPress={() => handleDaySelection(dayName)}
								>
									{date} {/* Numeric date inside circle */}
								</Button>
							</View>
						))}
					</View>
				</ScrollView>
			</Card>

			{/* Second Card (Alarm Clock) */}
			<Card style={styles.card} header={AlarmHeader}>
				{/* Time Picker */}
				<View style={styles.timePickerContainer}>
					<DateTimePicker
						value={alarmTime}
						mode="time"
						display="default"
						onChange={onTimeChange}
						is24Hour={false}
					/>
				</View>

				{/* Confirm Alarm Button */}
				<View style={{ marginTop: 10 }}>
					<Button onPress={confirmAlarm} style={styles.footerControl}>
						Confirm Alarm
					</Button>
				</View>

				{alarmSet && (
					<Text category="p1" style={styles.alarmSetText}>
						Alarm set for {alarmTime.toLocaleTimeString()}
					</Text>
				)}
			</Card>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
	},
	card: {
		margin: 16,
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	footerControl: {
		marginHorizontal: 4,
	},
	alarmSetText: {
		marginTop: 10,
		color: "green",
	},
	calendarContainer: {
		flexDirection: "row",
		justifyContent: "space-between", // Space out the days
	},
	dayContainer: {
		alignItems: "center",
		marginHorizontal: 8, // Add some space between days
	},
	dayAbbreviation: {
		marginBottom: 4,
		fontSize: 12, // Smaller font for abbreviations
	},
	dayButton: {
		borderRadius: 25, // Make button circular
		width: 40, // Smaller circle size
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	selectedDayButton: {
		backgroundColor: "#000000", // Black color for selected day
	},
	timePickerContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	greetingCard: {
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
	},
	greetingContainer: {
		flexDirection: "column",
		alignItems: "center",
	},
	greetingText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 28,
	},
	subGreetingText: {
		color: "white",
		marginTop: 8,
		fontSize: 16,
		textAlign: "center",
	},
});
