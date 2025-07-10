import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Driver } from '../../types/driver';
import { DriverCardStyles, DriverCardDarkStyles } from '../../styles/screens/drivers/DriverCard.styles';
import { useTheme } from '../../context/ThemeContext';

interface DriverCardProps {
  driver: Driver;
  onCall?: (driver: Driver) => void;
  onChat?: (driver: Driver) => void;
  onPress?: (driver: Driver) => void;
}

const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onCall,
  onChat,
  onPress,
}) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const styles = isDark ? { ...DriverCardStyles, ...DriverCardDarkStyles } : DriverCardStyles;

  const handleCall = () => {
    if (onCall) {
      onCall(driver);
    } else {
      Alert.alert('Звонок', `Звоним водителю ${driver.name}`);
    }
  };

  const handleChat = () => {
    if (onChat) {
      onChat(driver);
    } else {
      Alert.alert('Чат', `Открываем чат с ${driver.name}`);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(driver);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Показываем только часы:минуты
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.driverContent}>
        <View style={styles.driverCompactHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {driver.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.nameRatingRow}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{driver.rating}</Text>
            </View>
          </View>

          <View style={styles.carInfoRow}>
            <Text style={styles.carInfoText}>
              {driver.carModel} • {driver.carNumber}
            </Text>
          </View>

          <View style={styles.statusInfo}>
            <View style={[styles.statusDot, { backgroundColor: driver.isOnline ? '#10B981' : '#6B7280' }]} />
            <Text style={styles.statusText}>
              {driver.isOnline ? 'Онлайн' : 'Офлайн'}
            </Text>
          </View>

          <View style={styles.memberTagRowSpaced}>
            <View style={styles.memberTagCompact}>
              <Ionicons
                name="person"
                size={12}
                style={styles.memberIcon}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <Text style={styles.memberName}>
                {driver.clientsPerDay} клиентов/день
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.expandArrow}>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>
      </View>

      {isExpanded && (
        <View style={styles.driverExpanded}>
          <View style={styles.routeSection}>
            <Text style={styles.routeTitle}>Маршрут</Text>
            {driver.addresses.map((address, index) => (
              <View key={index} style={styles.routePointWithTime}>
                <View style={styles.routeLeftSide}>
                  <View style={styles.routePinContainer}>
                    <View style={styles.routePin} />
                  </View>
                  <Text style={styles.routeText}>{address}</Text>
                </View>
                <Text style={styles.routeTime}>
                  {formatTime(driver.times[index] || '08:00')}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.tripDetailItem}>
              <Text style={styles.tripDetailText}>{driver.tripDays}</Text>
            </View>
            <View style={styles.tripDetailItem}>
              <Text style={styles.tripDetailText}>
                {driver.package === 'base' ? 'Базовый' : driver.package === 'plus' ? 'Плюс' : 'Премиум'}
              </Text>
            </View>
            <View style={styles.tripDetailItem}>
              <Text style={styles.tripDetailText}>{driver.addresses.length} остановок</Text>
            </View>
          </View>

          <View style={styles.expandedActions}>
            <TouchableOpacity
              style={styles.callButtonExpanded}
              onPress={handleCall}
            >
              <Text style={styles.callButtonText}>Позвонить</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chatButtonExpanded,
                !driver.isOnline && styles.chatButtonDisabled
              ]}
              onPress={handleChat}
              disabled={!driver.isOnline}
            >
              <Text style={[
                styles.chatButtonText,
                !driver.isOnline && styles.chatButtonTextDisabled
              ]}>
                Написать
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DriverCard; 