import React, { useState, useEffect, useCallback } from "react";
import useHealthData from "@/hooks/useHealthData";
import { Button, Card, Layout, Text } from "@ui-kitten/components";
import { StyleSheet, View, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { usePopulateSleepData } from "@/lib/database/populateSleepData";

function generateWeekDates(): { date: Date; dayName: string }[] {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const lastSunday = new Date(today);
	lastSunday.setDate(today.getDate() - dayOfWeek);

	const daysOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const dates = [];

	for (let i = 0; i < 7; i++) {
		const currentDate = new Date(lastSunday);
		currentDate.setDate(lastSunday.getDate() + i);
		dates.push({
			date: currentDate,
			dayName: daysOfWeek[currentDate.getDay()],
		});
	}

	return dates;
}

const Header = ({ greeting }: { greeting: string }): React.ReactElement => (
	<LinearGradient
		colors={["#4B0082", "#800080", "#191970"]}
		style={styles.greetingCard}
	>
		<View style={styles.greetingContainer}>
			<Text category="h1" style={styles.greetingText}>
				{greeting} 🌙
			</Text>
			<Text category="s1" style={styles.subGreetingText}>
				You have slept 09:30, which is above your recommendation.
			</Text>
		</View>
	</LinearGradient>
);

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

const AlarmHeader = (): React.ReactElement => (
	<View>
		<Text category="h6">Alarm Clock</Text>
	</View>
);

export default function Home() {
	const [currentTime, setCurrentTime] = useState("");
	const [alarmTime, setAlarmTime] = useState(new Date());
	const [alarmSet, setAlarmSet] = useState(false);
	const [greeting, setGreeting] = useState("Good Morning");
	const [selectedStats, setSelectedStats] = useState({
		hours: 0,
		quality: "No Data",
	});
	const last7Days = generateWeekDates();
	const [showTimePicker, setShowTimePicker] = useState(false);

	const [date, setDate] = useState(new Date());
	const { sleepData } = useHealthData(date);
	const { populateSleepData } = usePopulateSleepData();

	const handleDaySelection = (selectedDate: Date) => {
		setDate(selectedDate);
		setSelectedStats({ hours: 0, quality: "No Data" });
	};

	useFocusEffect(
		useCallback(() => {
			populateSleepData(sleepData).then(() => {
				console.log("Populated sleep data");
			});
		}, [sleepData]),
	);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const now = new Date();
			setCurrentTime(now.toLocaleTimeString("en-US", { hour12: true }));

			const currentHour = now.getHours();
			setGreeting(
				currentHour < 12
					? "Good Morning"
					: currentHour < 18
						? "Good Afternoon"
						: "Good Evening",
			);

			if (
				alarmSet &&
				now.toLocaleTimeString() === alarmTime.toLocaleTimeString()
			) {
				alert("Alarm ringing!");
				setAlarmSet(false);
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [alarmTime, alarmSet]);

	const onTimeChange = (event: any, selectedTime?: Date) => {
		setShowTimePicker(false);
		if (selectedTime) setAlarmTime(selectedTime);
	};

	const confirmAlarm = () => {
		setAlarmSet(true);
		alert(
			`Alarm set for ${alarmTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
		);
	};

	return (
		<Layout style={styles.container}>
			<Card
				style={styles.card}
				header={() => <Header greeting={greeting} />}
				footer={Footer}
			>
				<Text category="p1">
					You slept for {selectedStats.hours} hours on{" "}
					{date.toLocaleDateString()}. Sleep quality: {selectedStats.quality}.
				</Text>
			</Card>

			<Card
				style={styles.card}
				header={() => <Text category="h6">Your Sleep Calendar</Text>}
			>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.calendarContainer}>
						{last7Days.map(({ date: buttonDate, dayName }) => (
							<View style={styles.dayContainer} key={dayName}>
								<Text style={styles.dayAbbreviation}>
									{dayName.substring(0, 3)}
								</Text>
								<Button
									style={[
										styles.dayButton,
										date.toDateString() ===
											new Date(buttonDate).toDateString() &&
											styles.selectedDayButton,
									]}
									size="tiny"
									onPress={() => handleDaySelection(buttonDate)}
								>
									{buttonDate.getDate()}
								</Button>
							</View>
						))}
					</View>
				</ScrollView>
			</Card>

			<Card style={styles.card} header={AlarmHeader}>
				<View style={styles.timePickerContainer}>
					{showTimePicker && (
						<DateTimePicker
							value={alarmTime}
							mode="time"
							display="default"
							onChange={onTimeChange}
							is24Hour={false}
						/>
					)}
				</View>

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
		justifyContent: "space-between",
	},
	dayContainer: {
		alignItems: "center",
		marginHorizontal: 8,
	},
	dayAbbreviation: {
		marginBottom: 4,
		fontSize: 12,
	},
	dayButton: {
		borderRadius: 25,
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	selectedDayButton: {
		backgroundColor: "#000000",
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
