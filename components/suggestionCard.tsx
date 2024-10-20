import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from '@ui-kitten/components';

interface SuggestionCardProps {
  sleepScore: number;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ sleepScore }) => (
  <Card style={styles.suggestionCard}>
    <View>
      <Text style={styles.boldText}>Your sleep last night was poor</Text>

      <Text style={styles.smallHeading}>
        Click below to generate a recommendation for how you can improve your sleep
      </Text>

      {/* "generate" Text Positioned at the Bottom-Right */}
      <Text category="label" style={styles.generateText}>
        generate
      </Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  suggestionCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    paddingVertical: 15,
    marginVertical: 15,
    borderRadius: 8,
  },
  boldText: {
    fontWeight: 'bold',
    marginBottom: 10, 
  },
  smallHeading: {
    fontSize: 12,
    marginBottom: 5,
  },
  generateText: {
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-end', 
    marginTop: 12,
    marginRight: 16,
    color: "purple",
  },
});

export default SuggestionCard;
