import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider, Card } from '@ui-kitten/components';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface SleepQuality {
  sleepScore: number;
  bedTime: Date;
  wakeUpTime: Date;
}

const SleepInfoCard = ({ sleepScore, bedTime, wakeUpTime }: { sleepScore: number, bedTime: Date, wakeUpTime: Date }) => (
  <Card style={styles.card}>
    <View style={styles.cardContent}>

      {/* Circular Progress */}
      <AnimatedCircularProgress
        size={120}
        width={12}
        fill={sleepScore} // Use the sleepScore prop to fill the circle
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
        <Text category="label" style={styles.smallHeading}>Time Slept</Text>
        <Text>{bedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {wakeUpTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>

        <Divider style={styles.innerDivider} />

        <Text category="label" style={styles.smallHeading}>Quality of Sleep</Text>
        <Text>Good</Text>
      </View>

    </View>
  </Card>
);

const styles = StyleSheet.create({
  cardContent: {
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
  },
  boldText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  innerDivider: {
    marginVertical: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  labelText: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    margin: 10,
    borderRadius: 8,
  },
});

export default SleepInfoCard;
