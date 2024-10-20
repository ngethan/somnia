import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, List, ListItem, Divider, Avatar, Card } from '@ui-kitten/components';
import { SafeAreaView } from '@/components/safe-area-view';

// Define the types for the leaderboard data
interface LeaderboardItem {
  name: string;
  score: number;
  avatar: string;
}

// Example leaderboard data
const leaderboardData: LeaderboardItem[] = [
  { name: 'User1', score: 1200, avatar: 'https://your-avatar-url.com/user1.jpg' },
  { name: 'User2', score: 1150, avatar: 'https://your-avatar-url.com/user2.jpg' },
  { name: 'User3', score: 1100, avatar: 'https://your-avatar-url.com/user3.jpg' },
  { name: 'User4', score: 1050, avatar: 'https://your-avatar-url.com/user4.jpg' },
  { name: 'User5', score: 1000, avatar: 'https://your-avatar-url.com/user5.jpg' },
  // Add more users as needed
];

const Leaderboard: React.FC = () => {
  const renderItem = ({ item, index }: { item: LeaderboardItem; index: number }) => (
    <ListItem
      title={`${index + 1}. ${item.name}`}  // Rank and name
      description={`Score: ${item.score}`}  // Display the score
      accessoryLeft={() => (
        <Avatar source={{ uri: item.avatar }} size="medium" />  // Avatar
      )}
    />
  );

  return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
            <Text style={styles.headerText}>LeaderBoard</Text>

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
    backgroundColor: '#f7f9fc',  // UI Kitten light background
    marginTop: 12,
  },
  headerContainer: {
    marginBottom: 14,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  titleText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    paddingVertical: 15,
  },
});

export default Leaderboard;
