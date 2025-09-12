/**
 * TripItem component
 * Individual trip item display
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useTripStatus } from '../../hooks/useTripStatus';
import { TripsScreenStyles as styles } from '../../styles/TripsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';
import { Trip } from '../../../../../../shared/types/Trip';

interface TripItemProps {
  trip: Trip;
  isDriver: boolean;
}

export const TripItem: React.FC<TripItemProps> = ({ trip, isDriver }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const { getTripIcon, getTripColor, getStatusColor, getStatusText } = useTripStatus();

  const getDriverLabel = () => {
    return isDriver ? t('trips.client') : t('trips.driver');
  };

  return (
    <View style={[styles.tripItem, { backgroundColor: currentColors.surface }]}>
      {/* Trip Header */}
      <View style={styles.tripHeader}>
        <View style={styles.tripInfo}>
          <Ionicons 
            name={getTripIcon(trip.type) as any} 
            size={24} 
            color={getTripColor(trip.type)} 
          />
          <View style={styles.tripDetails}>
            <Text style={[styles.tripTitle, { color: currentColors.text }]}>
              {trip.title}
            </Text>
            <Text style={[styles.tripDateTime, { color: currentColors.textSecondary }]}>
              {trip.date} • {trip.time}
            </Text>
          </View>
        </View>
        
        <View style={styles.tripActions}>
          <Text style={[styles.amountText, { color: getTripColor(trip.type) }]}>
            {trip.amount}
          </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(trip.status) }
          ]}>
            <Text style={styles.statusText}>
              {getStatusText(trip.status)}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Trip Description */}
      {trip.description && (
        <Text style={[styles.tripDescription, { color: currentColors.textSecondary }]}>
          {trip.description}
        </Text>
      )}
      
      {/* Driver Information */}
      {trip.driver && (
        <Text style={[styles.driverInfo, { color: currentColors.textSecondary }]}>
          {getDriverLabel()}: {trip.driver}
        </Text>
      )}
    </View>
  );
};
