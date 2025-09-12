/**
 * OrderCard component
 * Reusable order card component for lists
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { OrdersScreenStyles as styles } from '../../styles/OrdersScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  rating: number;
  isAvailable: boolean;
  phone_number: string;
  price?: string;
}

interface OrderCardProps {
  order: Driver;
  isSelected: boolean;
  selectionMode: boolean;
  onPress: (order: Driver) => void;
  onLongPress: () => void;
  isDriver: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isSelected,
  selectionMode,
  onPress,
  onLongPress,
  isDriver
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  const getOrderName = () => {
    return `${order.first_name} ${order.last_name}`;
  };

  const getVehicleInfo = () => {
    return `${order.vehicle_brand} ${order.vehicle_model}`;
  };

  const getStatusColor = () => {
    return order.isAvailable ? currentColors.success : currentColors.textSecondary;
  };

  const getStatusText = () => {
    return order.isAvailable ? t('orders.status.online') : t('orders.status.offline');
  };

  const getPriceText = () => {
    return order.price || t('orders.price.negotiable');
  };

  return (
    <TouchableOpacity
      style={[
        styles.orderCard,
        { backgroundColor: currentColors.surface },
        isSelected && { borderColor: currentColors.primary, borderWidth: 2 }
      ]}
      onPress={() => onPress(order)}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Selection indicator */}
      {selectionMode && (
        <View style={[
          styles.selectionIndicator,
          { backgroundColor: isSelected ? currentColors.primary : currentColors.border }
        ]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
      )}

      {/* Order Avatar */}
      <View style={styles.avatarContainer}>
        <View style={[
          styles.avatar,
          { backgroundColor: currentColors.primary + '20' }
        ]}>
          <Text style={[styles.avatarText, { color: currentColors.primary }]}>
            {order.first_name.charAt(0)}{order.last_name.charAt(0)}
          </Text>
        </View>
        <View style={[
          styles.statusDot,
          { backgroundColor: getStatusColor() }
        ]} />
      </View>

      {/* Order Info */}
      <View style={styles.orderInfo}>
        <View style={styles.orderHeader}>
          <Text style={[styles.orderName, { color: currentColors.text }]}>
            {getOrderName()}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={currentColors.warning} />
            <Text style={[styles.ratingText, { color: currentColors.textSecondary }]}>
              {order.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <Text style={[styles.vehicleInfo, { color: currentColors.textSecondary }]}>
          {getVehicleInfo()}
        </Text>

        <View style={styles.orderFooter}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          <Text style={[styles.priceText, { color: currentColors.primary }]}>
            {getPriceText()}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: currentColors.primary }]}
        onPress={() => onPress(order)}
      >
        <Ionicons 
          name={isDriver ? "checkmark" : "car"} 
          size={20} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
