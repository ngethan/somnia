import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider, Card } from '@ui-kitten/components';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface SleepQuality {
  sleepScore: number;
  bedTime: Date;
  wakeUpTime: Date;
}

const SleepInfoCard = ({ sleepScore, bedTime, wakeUpTime }: { sleepScore?: number, bedTime?: Date, wakeUpTime?: Date }) => (
  <Card style={styles.card}>
    <View style={styles.cardContent}>

      {/* Circular Progress */}
      <AnimatedCircularProgress
        size={120}
        width={12}
        fill={sleepScore ?? 0} // Use the sleepScore prop to fill the circle
        tintColor="#8A2BE2"
        backgroundColor="#F0F0F0"
        duration={800}
      >
        {(fill) => (
          <>
            <Text style={styles.scoreText}>{Math.round(fill)}</Text>
            <Text style={styles.labelText}>Score</Text>
          </>
        )}
      </AnimatedCircularProgress>

      {/* Vertical Divider */}
      <View style={styles.verticalDivider} />

      {/* Sleep Details */}
      <View style={styles.sleepDetails}>
        <Text style={styles.smallHeading}>Time Slept</Text>
        <Text style={styles.boldText}>{bedTime instanceof Date ? bedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""} - {wakeUpTime instanceof Date ? wakeUpTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</Text>

        <Divider style={styles.innerDivider} />

        <Text style={styles.smallHeading}>Quality of Sleep</Text>
        <Text style={styles.boldText}>{!sleepScore ? "" : sleepScore < 20
  ? "Terrible"
  : sleepScore < 40
  ? "Bad"
  : sleepScore < 60
  ? "Okay"
  : sleepScore < 80
  ? "Good"
  : "Terrific"}
</Text>
      </View>

    </View>
  </Card>
);

const styles = StyleSheet.create({
  cardContent: {
    padding: 4,
    backgroundColor: '#2B2B38',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#C0C0C0',
    marginHorizontal: 10,
  },
  sleepDetails: {
    width: '55%',
  },
  smallHeading: {
    marginBottom: 5,
    fontSize: 12,
    color: '#B3B3BD',
    
  },
  boldText: {
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#FFF'
  },
  innerDivider: {
    marginVertical: 10,
  },
  scoreText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  labelText: {
    fontSize: 14,
    color: '#B3B3BD',
  },
  card: {
    backgroundColor:'#2B2B38',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    paddingVertical: 8,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#2B2B38',
  },
});

export default SleepInfoCard;
