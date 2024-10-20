import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import {
	Text,
	List,
	ListItem,
	Divider,
	Avatar,
	Card,
} from "@ui-kitten/components";
import { SafeAreaView } from "@/components/safe-area-view";
import { useSupabase } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";
import { SleepData, User } from "@/types/global";

// Define the types for the leaderboard data
interface LeaderboardItem {
	name: string;
	score: number;
	avatar: string;
}

type LeaderboardFetch = {
	user: User;
	sleepData: SleepData;
};

const Leaderboard: React.FC = () => {
	const { session } = useSupabase();
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch leaderboard data
	useEffect(() => {
		const fetchLeaderboardData = async () => {
			if (session?.user) {
				try {
					const { data, error } = await supabase
						.from("sleep_data")
						.select()
						.order("sleepQuality", { nullsFirst: false, ascending: false })
						.limit(10)
						.gte("date", new Date().toDateString());

					if (error) {
						setError("Error fetching leaderboard data");
						setLoading(false);
						return;
					}

					const leaderboardUsers: LeaderboardFetch[] = [];

					await Promise.all(
						data.map(async (d: SleepData) => {
							const { data: user } = await supabase
								.from("users")
								.select()
								.eq("id", d.userId)
								.limit(1);
							if (user?.[0])
								leaderboardUsers.push({
									user: user?.[0]!,
									sleepData: d,
								});
						}),
					);

					console.log(leaderboardUsers);

					setLeaderboardData(
						leaderboardUsers
							.map((d) => ({
								name: d.user.fullName,
								score: d.sleepData.sleepQuality,
								avatar: "",
							}))
							.sort((a, b) => b.score - a.score) as LeaderboardItem[],
					); // Ensure the data matches the type
				} catch (fetchError) {
					setError("Error fetching leaderboard data");
				} finally {
					setLoading(false);
				}
			}
		};

		fetchLeaderboardData();
	}, [session?.user]);

	// Render each leaderboard item
	const renderItem = ({
		item,
		index,
	}: {
		item: LeaderboardItem;
		index: number;
	}) => (
		<ListItem
			title={`${index + 1}. ${item.name}`} // Rank and name
			description={`Score: ${item.score}`} // Display the score
			accessoryLeft={() => (
				<Avatar source={{ uri: item.avatar }} size="medium" /> // Avatar
			)}
		/>
	);

	// Render loading or error states
	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text status="danger">{error}</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.headerText}>Leaderboard</Text>
			</View>
			<Card>
				{/* Leaderboard List */}
				<List
					data={leaderboardData}
					ItemSeparatorComponent={Divider}
					renderItem={renderItem}
					keyExtractor={(item) => item.name}
				/>
			</Card>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#222B45",
	},
	headerContainer: {
		marginTop: 16,
		marginBottom: 14,
	},
	headerText: {
		textAlign: "center",
		fontWeight: "bold",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Leaderboard;
