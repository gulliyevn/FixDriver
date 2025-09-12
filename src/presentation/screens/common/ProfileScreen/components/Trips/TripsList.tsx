/**
 * TripsList component
 * List of trip items with scroll functionality
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import { TripItem } from './TripItem';
import { TripsScreenStyles as styles } from '../../styles/TripsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';
import { useTheme } from '../../../../context/ThemeContext';
import { Trip } from '../../../../../../shared/types/Trip';

interface TripsListProps {
  trips: Trip[];
  isDriver: boolean;
}

export const TripsList: React.FC<TripsListProps> = ({ trips, isDriver }) => {
  const { isDark } = useTheme();
  const currentColors = isDark ? darkColors : lightColors;

  return (
    <ScrollView 
      style={styles.content}
      contentContainerStyle={[
        styles.contentContainer, 
        { backgroundColor: currentColors.background }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.tripsContainer}>
        {trips.map((trip) => (
          <TripItem
            key={trip.id}
            trip={trip}
            isDriver={isDriver}
          />
        ))}
      </View>
    </ScrollView>
  );
};
