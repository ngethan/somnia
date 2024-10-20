import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card } from "@ui-kitten/components";

interface SleepCalendarProps {
	last7Days: { date: number; dayAbbreviation: string; dayName: string }[];
	selectedDay: string;
	handleDaySelection: (day: string) => void;
}

const SleepCalendar: React.FC<SleepCalendarProps> = ({
	last7Days,
	selectedDay,
	handleDaySelection,
}) => (
	<Card
		style={styles.card}
		header={() => <Text category="h6">Your Sleep Calendar</Text>}
	>
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
						{date}
					</Button>
				</View>
			))}
		</View>
	</Card>
);

const styles = StyleSheet.create({
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
		backgroundColor: "black", // Default background for unselected day
	},
	selectedDayButton: {
		backgroundColor: "purple", // Purple background for the selected day
	},
	card: {
		flex: 1,
		marginHorizontal: 5,
		alignItems: "center",
		paddingVertical: 15,
	},
});

export default SleepCalendar;
