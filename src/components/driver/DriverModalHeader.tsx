import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Driver = {
  first_name?: string;
  last_name?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_number?: string;
};

export type DriverModalHeaderProps = {
  styles: any;
  role?: 'client' | 'driver';
  driver?: Driver | null;
  childName?: string;
  childAge?: string;
};

const DriverModalHeader: React.FC<DriverModalHeaderProps> = ({ styles, role = 'client', driver, childName, childAge }) => {
  return (
    <View style={styles.avatarAndInfoRow}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#FFFFFF" />
        </View>
        <View style={styles.onlineIndicator} />
      </View>
      <View style={styles.driverMainInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.driverName}>{`${driver?.first_name ?? ''} ${driver?.last_name ?? ''}`}</Text>
          <Ionicons name="diamond" size={16} color="#9CA3AF" style={styles.premiumIcon} />
        </View>
        <View style={styles.vehicleExpandRow}>
          <View style={styles.vehicleInfoContainer}>
            {role === 'driver' && (
              <Ionicons name="football" size={16} color="#9CA3AF" style={styles.childIcon} />
            )}
            <Text style={styles.vehicleInfo}>
              {role === 'driver'
                ? `${childName ?? ''} • ${childAge ?? ''} лет`
                : `${driver?.vehicle_brand ?? ''} ${driver?.vehicle_model ?? ''} • ${driver?.vehicle_number ?? ''}`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(DriverModalHeader);


