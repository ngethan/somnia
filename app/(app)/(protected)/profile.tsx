//sleep score, bedTime, and wakeUp time need to be passed to this page

import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
	Layout,
	Text,
	Avatar,
	Button,
	Divider,
	Card,
	Icon,
	IconProps,
} from "@ui-kitten/components";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
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

const generateLast7Days = () => {
	const today = new Date();
	const days = [];

	for (let i = 6; i >= 0; i--) {
		const day = new Date();
		day.setDate(today.getDate() - i);
		days.push({
			date: day.getDate(), // Numeric date
			dayAbbreviation: day.toLocaleString('en-US', { weekday: 'short' }), // Abbreviation of day (e.g., Mon, Tue)
			dayName: day.toLocaleString('en-US', { weekday: 'long' }), // Full day name (e.g., Monday)
		});
	}

	return days;
};



const ProfileScreen: React.FC = () => {
	// Function to render the edit icon for the Edit Profile button
	const renderEditIcon = (props: IconProps) => (
		<Icon {...props} name="edit-outline" />
	);

	// Simulated sleep data

	const data = {
		labels: [
			"",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		],
		datasets: [
			{
				data: [5, 7, 6, 7, 8, 8],
				color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // optional
				strokeWidth: 2, // optional
			},
		],
	};

	const screenWidth = Dimensions.get("window").width;

	const chartConfig = {
		backgroundGradientFrom: "#FFFFFF",
		backgroundGradientFromOpacity: 1,
		backgroundGradientTo: "#FFFFFF",
		backgroundGradientToOpacity: 1,
		color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
		strokeWidth: 2, // optional, default 3
		barPercentage: 0.5,
		useShadowColorFromDataset: false, // optional
	};

	return (
		<ScrollView style={styles.container}>
			{/* Header with Avatar and User Info */}
			<Layout style={styles.header} level="1">
				<Avatar
					size="giant"
					source={{ uri: "https://your-avatar-url.com/avatar.jpg" }}
					style={styles.avatar}
				/>
				<Text category="h5" style={styles.nameText}>
					John Doe
				</Text>
				<Text appearance="hint" style={styles.emailText}>
					johndoe@gmail.com
				</Text>
				<View style={{ flex: 1 }}></View>
			</Layout>

			<Divider />

			{/* Sleep Stats */}
			<Layout style={styles.statsContainer}>
				<Text category="h6" style={styles.sectionTitle}>
					Sleep quality
				</Text>


				<View style={styles.cardsContainer}>
                {/* sleep calendar*/}
				</View>

				<View style={styles.cardsContainer}>
					<SleepInfoCard
						sleepScore={45}
						bedTime={sleepQualityData.bedTime}
						wakeUpTime={sleepQualityData.wakeUpTime}
					/>
				</View>

				<View style={styles.cardsContainer}>
					<SuggestionCard sleepScore={45} />
				</View>
			</Layout>

			<Divider />

			{/* Sleep Goal */}

			<Layout style={styles.goalContainer}>
				<Text category="h6" style={styles.sectionTitle}>
					My Sleep Data
				</Text>
				<View>
					<LineChart
						withInnerLines={false}
						withVerticalLines={false}
						data={data}
						width={screenWidth}
						height={256}
						verticalLabelRotation={30}
						chartConfig={chartConfig}
						bezier
					/>
				</View>
			</Layout>
		</ScrollView>
	);
};

// Define the styles for the profile screen
const styles = StyleSheet.create({
	container: {
		padding: 16,
		flex: 1,
	},
	header: {
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	avatar: {
		marginBottom: 15,
	},
	nameText: {
		marginBottom: 5,
	},
	emailText: {
		marginBottom: 15,
	},
	editButton: {
		marginTop: 10,
	},
	statsContainer: {
		padding: 20,
	},
	sectionTitle: {
		marginBottom: 15,
	},
	cardsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	card: {
		flex: 1,
		marginHorizontal: 5,
		alignItems: "center",
		paddingVertical: 15,
	},
	suggestionCard: {
		flex: 1,
		marginHorizontal: 5,
		alignItems: "center",
		paddingVertical: 15,
		marginVertical: 15,
	},
	cardTitle: {
		marginBottom: 5,
	},
	goalContainer: {
		padding: 20,
		alignItems: "center",
	},
	goalText: {
		marginBottom: 10,
	},
	goalButton: {
		marginTop: 10,
	},
	cardContent: {
		flexDirection: "row", // Align graph and sleep details in a row
		justifyContent: "space-between", // Space between the two sections
		alignItems: "center", // Vertically align items
	},
	graphPlaceholder: {
		width: "40%", // Adjust width for the graph
		height: 100, // Set height for the placeholder
		backgroundColor: "#E0E0E0", // Light gray background for the placeholder
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
	},
	placeholderText: {
		fontStyle: "italic",
		color: "#888", // Light gray text for the placeholder
	},
	verticalDivider: {
		width: 1, // Vertical divider width
		height: "80%", // Set height for the divider
		backgroundColor: "#C0C0C0", // Light gray color for the divider
		marginHorizontal: 10, // Space between the graph and sleep details
	},
	sleepDetails: {
		width: "55%", // Adjust width for the sleep details
	},
	smallHeading: {
		marginBottom: 5, // Space under the heading
		fontSize: 12,
	},
	boldText: {
		fontWeight: "bold",
		marginBottom: 10, // Space under the bold text
	},
	innerDivider: {
		marginVertical: 10, // Space around the internal divider
	},
	generateText: {
		fontSize: 12,
		fontWeight: "bold",
		alignSelf: "flex-end", // Align the text to the bottom right
		marginTop: 12, // Push the "generate" text to the bottom
		marginRight: 16,
		color: "purple",
	},
	scoreText: {
		fontSize: 24,
		fontWeight: "bold",
	},
	labelText: {
		fontSize: 14,
		color: "#666",
	},
	calendarContainer: {
		flexDirection: "row",
		justifyContent: "space-between", // Ensure even spacing across the screen
	},
	dayContainer: {
		alignItems: "center",
		width: "14%", // Ensure all 7 days fit on one row
		marginHorizontal: 2, // Add a bit of space between circles
	},
	dayAbbreviation: {
		marginBottom: 4,
		fontSize: 12, // Smaller font for abbreviations
		color: "purple", // Make the abbreviation purple
	},
	dayButton: {
		borderRadius: 25, // Make button circular
		width: 40, // Circle size for the day
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "black", // Default white background for unselected day
	},
	selectedDayButton: {
		backgroundColor: "purple", // Purple background for the selected day
	},
});

export default ProfileScreen;
