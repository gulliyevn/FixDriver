import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type DriverInfoBarProps = {
  styles: any;
  role?: 'client' | 'driver';
  schedule: string;
  price: string;
  distance: string;
  timeOrChildType: string;
  onPress: () => void;
};

const DriverInfoBar: React.FC<DriverInfoBarProps> = ({ styles, role = 'client', schedule, price, distance, timeOrChildType, onPress }) => {
  return (
    <TouchableOpacity style={styles.driverInfoBar} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.scheduleInfo}>
        <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
        <Text style={styles.scheduleText}>{schedule}</Text>
      </View>
      <View style={styles.priceInfo}>
        <Ionicons name={role === 'driver' ? 'wallet' : 'pricetag-outline'} size={16} color="#9CA3AF" />
        <Text style={styles.priceText}>{price}</Text>
      </View>
      <View style={styles.distanceInfo}>
        <Ionicons name="location" size={16} color="#9CA3AF" />
        <Text style={styles.distanceText}>{distance}</Text>
      </View>
      <View style={styles.timeInfo}>
        <Ionicons name={role === 'driver' ? 'time' : 'football'} size={16} color="#9CA3AF" />
        <Text style={styles.timeText}>{timeOrChildType}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(DriverInfoBar);


