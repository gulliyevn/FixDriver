import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/context/ThemeContext';
import { createDriverModalStyles } from '../styles/DriverModal.styles';

export type DriverInfoBarProps = {
  role?: 'client' | 'driver';
  schedule: string;
  price: string;
  distance: string;
  timeOrChildType: string;
  onPress?: () => void;
};

const DriverInfoBar: React.FC<DriverInfoBarProps> = ({ role = 'client', schedule, price, distance, timeOrChildType, onPress }) => {
  const { isDark } = useTheme();
  const styles = createDriverModalStyles(isDark, role);
  return (
    <TouchableOpacity style={styles.driverInfoBar} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.scheduleInfo}>
        <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
        <Text style={styles.scheduleText}>{schedule}</Text>
      </View>
      <View style={styles.priceInfo}>
        <Ionicons name="pricetag-outline" size={16} color="#9CA3AF" />
        <Text style={styles.priceText}>{price}</Text>
      </View>
      <View style={styles.distanceInfo}>
        <Ionicons name="location" size={16} color="#9CA3AF" />
        <Text style={styles.distanceText}>{distance}</Text>
      </View>
      <View style={styles.timeInfo}>
        <Ionicons name="football" size={16} color="#9CA3AF" />
        <Text style={styles.timeText}>{timeOrChildType}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(DriverInfoBar);