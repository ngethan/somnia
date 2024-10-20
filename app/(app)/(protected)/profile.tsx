import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import {
	Layout,
	Text,
	Button,
	Divider,
	Card,
	Icon,
	IconProps,
} from "@ui-kitten/components";
import { LineChart } from "react-native-chart-kit";
import { router } from "expo-router";
import SleepInfoCard from "@/components/sleepInfoCard";
import SuggestionCard from "@/components/suggestionCard";
import SleepCalendar from "@/components/sleepCalendar";

// Define types for the sleep data
interface SleepQuality {
	sleepScore: number;
	bedTime: Date;
	wakeUpTime: Date;
}

const sleepQualityData: SleepQuality = {
	sleepScore: 45,
	bedTime: new Date(2024, 9, 19, 22, 30),
	wakeUpTime: new Date(2024, 9, 20, 6, 30),
};

const Header = ({ greeting }: { greeting: string }): React.ReactElement => (
	<View style={styles.greetingContainer}>
		<Text category="h1" style={styles.greetingText}>
			{greeting} 🌙
		</Text>
		<Text category="s1" style={styles.subGreetingText}>
			You have slept 09:30, which is above your recommendation.
		</Text>
	</View>
);

const generateWeekDates = (): { date: Date; dayName: string }[] => {
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
};

const last7Days = generateWeekDates();

const ProfileScreen: React.FC = () => {
	const [date, setDate] = useState(new Date());
	const [selectedStats, setSelectedStats] = useState({
		hours: 0,
		quality: "No Data",
	});

	const handleDaySelection = (selectedDate: Date) => {
		setDate(selectedDate);
		setSelectedStats({ hours: 0, quality: "No Data" });
	};

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

	const yLabels = ["time", "awake", "REM", "n-Rem", "light"];
const data = {
  labels: ["1am", "2am", "3am", "4am", "5am"],
  datasets: [
    {
      // Map the string values to numbers
      data: [5, 4, 3, 2, 5],
      strokeWidth: 2, // Optional
    },
  ],
};


	const screenWidth = Dimensions.get("window").width;

	const chartConfig = {
		backgroundGradientFrom: "#1C1C28",
		backgroundGradientFromOpacity: 1,
		backgroundGradientTo: "#1C1C28",
		backgroundGradientToOpacity: 1,
		color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(231, 231, 231, ${opacity})`,
		strokeWidth: 2,
		barPercentage: 0.5,
	  };
	  

	return (
		<ScrollView style={styles.container}>
			<Layout style={styles.header} level="1">
			<Card style={styles.card}>
				<Text category="p1" style={styles.greetingText}>
					You slept for {selectedStats.hours} hours on{" "}
					{date.toLocaleDateString()}. Sleep quality: {selectedStats.quality}.
				</Text>
			</Card>

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
			</Layout>

			<Divider />

			<Layout style={styles.statsContainer}>
				<Text category="h6" style={styles.sectionTitle}>
					Sleep quality
				</Text>
				<View style={styles.cardsContainer}>
					<SleepInfoCard
						sleepScore={sleepQualityData.sleepScore}
						bedTime={sleepQualityData.bedTime}
						wakeUpTime={sleepQualityData.wakeUpTime}
					/>
				</View>

				<Text category="h6" style={styles.sectionTitle}>
					Sleep Suggestions
				</Text>
				<View style={styles.cardsContainer}>
					<SuggestionCard sleepScore={sleepQualityData.sleepScore} />
				</View>
			</Layout>

			<Divider />

			<Layout style={styles.goalContainer}>
				<Text category="h6" style={styles.sectionTitle}>
					My Sleep Data
				</Text>
				<View style={styles.chart}>
				<LineChart
      data={data}
      width={screenWidth}
      height={256}
      verticalLabelRotation={30}
      chartConfig={chartConfig}
      bezier
      // Custom y-axis label function
      yAxisLabel={""}
      yAxisSuffix={""}
      formatYLabel={(value) => yLabels[parseInt(value) - 1]} // Mapping numeric values back to strings
      withInnerLines={false}
      withVerticalLines={false}
    />
				</View>
			</Layout>
		</ScrollView>
	);
};

// Cleaned styles
const styles = StyleSheet.create({
	container: {
		backgroundColor: "#1C1C28",
		padding: 16,
		flex: 1,
	},
	header: {
		backgroundColor: "#1C1C28",
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	statsContainer: {
		backgroundColor: "#1C1C28",
		padding: 20,
	},
	sectionTitle: {
		color: "#FFF",
		marginVertical: 15,
		marginTop: 30,
	},
	cardsContainer: {
		backgroundColor: "#1C1C28",
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 16,
	},
	card: {
		borderColor: "#1C1C28",
		backgroundColor: "#1C1C28",
		flex: 1,
		marginHorizontal: 5,
		alignItems: "center",
		paddingVertical: 15,
	},
	goalContainer: {
		backgroundColor: "#1C1C28",
		padding: 20,
		alignItems: "center",
	},
	chart: {
		backgroundColor: "#1C1C28",
	},
	calendarContainer: {
		backgroundColor: "#1C1C28",
		flexDirection: "row",
	},
	dayContainer: {
		alignItems: "center",
		width: "14%",
		marginHorizontal: 2,
	},
	dayAbbreviation: {
		marginBottom: 4,
		fontSize: 12,
		color: "#8A2BE2",
	},
	dayButton: {
		backgroundColor: "#1C1C28",
		borderColor: "#1C1C28"
	},
	selectedDayButton: {
		fontSize:4,
		alignItems: "center",
		borderRadius: 25,
		width: 40,
		height: 40,
		backgroundColor: "#8A2BE2",
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	footerControl: {
		marginHorizontal: 4,
	},
	greetingCard: {
		backgroundColor: "#1C1C28",
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
		fontSize: 14,
	},
	subGreetingText: {
		color: "white",
		marginTop: 8,
		fontSize: 16,
		textAlign: "center",
	},
});

export default ProfileScreen;
