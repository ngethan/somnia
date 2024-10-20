import React, { useState, useEffect, useCallback } from "react";
import useHealthData from "@/hooks/useHealthData";
import { Button, Card, Layout, Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { usePopulateSleepData } from "@/lib/database/populateSleepData";
import { supabase } from "@/config/supabase";

function generateWeekDates(): { date: Date; dayName: string }[] {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const lastSunday = new Date(today);
	lastSunday.setDate(today.getDate() - dayOfWeek);

	const daysOfWeek = [
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
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

const Header = ({ greeting, timeSlept }: { greeting: string, timeSlept: number }): React.ReactElement => (
	<LinearGradient
		colors={["#4B0082", "#4B0082", "#191970"]}
		style={styles.greetingCard}
	>
		<View style={styles.greetingContainer}>
			<Text category="h1" style={styles.greetingText}>
				{greeting} {greeting.includes("evening") ? "🌙" : "🌞"}
			</Text>
			<Text category="s1" style={styles.subGreetingText}>
				You have slept {timeSlept} hours, which is {Math.abs(8 - timeSlept) >= 1 ? "optimal!" : timeSlept < 7 ? "below your recommendation" : "above your recommendation"}
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
		<Text category="h6" style={styles.boldText}>Alarm Clock</Text>
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
	const [timeSlept, setTimeSlept] = useState(0);

	useEffect(() => {
		const getTimeSlept = async () => {
			const { data: sleepData, error: sleepError } = await supabase.from('sleep_data').select().limit(1).eq("date", new Date().toDateString());
			if (sleepData?.[0]) setTimeSlept(Math.round((sleepData?.[0].sleepDuration )/ 60))
		};

		getTimeSlept();
	}, [])

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
				header={() => <Header greeting={greeting} timeSlept={timeSlept} />}
			>
				
			</Card>
			<Card style={styles.card} header={AlarmHeader}>
			<View style={styles.timePickerContainer}>
    <DateTimePicker
        value={alarmTime}
        mode="time"
        display="spinner"
        onChange={onTimeChange}
        is24Hour={false}
		textColor="#FFF"
    />
</View>

				<View style={{ marginTop: 10 }}>
					<Button onPress={confirmAlarm} style={styles.footerControl}>
						Confirm Alarm
					</Button>
				</View>

				{alarmSet && (
					<Text category="p1" style={styles.alarmSetText}>
					Alarm set for {alarmTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
				  </Text>
				)}
			</Card>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
	  backgroundColor: "#1C1C28", // Dark background
	  flex: 1,
	  padding: 16,
	  justifyContent: "center",
	},
	card: {
	  borderColor: "#2F2F40", // Darker border to blend with the background
	  backgroundColor: "#2F2F40", // Dark card background
	  marginVertical: 10, // Add vertical margin for better spacing
	  borderRadius: 12, // Rounded corners for the card
	  padding: 20, // Padding inside the card
	},
	footerContainer: {
	  flexDirection: "row",
	  justifyContent: "flex-end",
	  paddingVertical: 10, // Padding for the footer to create space
	},
	footerControl: {
	  marginHorizontal: 8,
	  backgroundColor: "#4B0082", // Indigo background for the buttons
	  borderColor: "#4B0082", // Consistent button border color
	  borderRadius: 8, // Rounded button corners
	},
	alarmSetText: {
	  marginTop: 10,
	  color: "#32CD32", // Light green to indicate success
	  fontWeight: "bold",
	},
	timePickerContainer: {
	  flexDirection: "row",
	  justifyContent: "center",
	  alignItems: "center",
	  marginVertical: 20, // Add vertical space for better layout
	},
	greetingCard: {
	  borderRadius: 12,
	  padding: 20,
	  marginBottom: 20,
	  shadowColor: "#000", // Add shadow for better card depth
	  shadowOffset: { width: 0, height: 2 },
	  shadowOpacity: 0.2,
	  shadowRadius: 8,
	},
	greetingContainer: {
	  flexDirection: "column",
	  alignItems: "center",
	},
	greetingText: {
	  color: "white",
	  fontWeight: "bold",
	  fontSize: 28,
	  textAlign: "center", // Align the text to the center
	},
	subGreetingText: {
	  color: "white",
	  marginTop: 8,
	  fontSize: 16,
	  textAlign: "center",
	  opacity: 0.8, // Lighter text for secondary information
	},
	boldText: {
	  color: "white",
	  fontWeight: "bold",
	  fontSize: 18, // Slightly larger bold text
	},
  });