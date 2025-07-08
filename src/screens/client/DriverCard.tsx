import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RatingStars from '../../components/RatingStars';
import AppCard from '../../components/AppCard';
import { DriversScreenStyles as styles } from '../../styles/screens/DriversScreen.styles';

export interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  carModel: string;
  carNumber: string;
  isOnline: boolean;
  distance: string;
  estimatedTime: string;
  isAvailable: boolean;
  photo?: string;
  package: 'base' | 'plus' | 'premium';
  price: number;
  experience: number;
  vehicleYear: number;
  hasAirCondition: boolean;
  hasWifi: boolean;
  hasCharger: boolean;
  forMember: 'me' | 'daughter' | 'son' | 'wife' | 'husband';
  tripDays: string;
  addresses: string[];
  departureTime: string;
  arrivalTime: string;
  schedule?: string;
}

interface MemberData {
  name: string;
  icon: string;
}

interface DriverCardProps {
  driver: Driver;
  isExpanded: boolean;
  isDark: boolean;
  memberData: MemberData;
  onExpand: (driverId: string) => void;
  onCall: (driver: Driver) => void;
  onChat: (driver: Driver) => void;
}

const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  isExpanded,
  isDark,
  memberData,
  onExpand,
  onCall,
  onChat,
}) => {
  return (
    <AppCard key={driver.id} style={styles.driverCard} margin={8}>
      <TouchableOpacity 
        style={styles.driverContent}
        onPress={() => onExpand(driver.id)}
        activeOpacity={0.9}
      >
        {/* Компактная карточка водителя */}
        <View style={styles.driverCompactHeader}>
          {/* Аватар слева */}
          <View style={styles.driverAvatar}>
            <Ionicons name="person" size={32} color="#1E3A8A" />
          </View>
          {/* Информация о водителе */}
          <View style={styles.driverInfo}>
            {/* Имя и рейтинг в одной строке */}
            <View style={styles.nameRatingRow}>
              <Text style={[styles.driverName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}> {driver.name} </Text>
              <View style={styles.driverRating}>
                <RatingStars rating={driver.rating} />
                <Text style={[styles.ratingText, { color: isDark ? '#10B981' : '#059669' }]}> {driver.rating} </Text>
              </View>
            </View>
            {/* Автомобиль и номер */}
            <View style={styles.carInfoRow}>
              <Text style={[styles.carInfoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}> {driver.carModel} • {driver.carNumber} </Text>
            </View>
            {/* Статус водителя */}
            <View style={styles.statusInfo}>
              <View style={[styles.statusDot, { backgroundColor: driver.isOnline ? '#10B981' : '#6B7280' }]} />
              <Text style={[styles.statusText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}> {driver.isOnline ? 'Онлайн' : 'Офлайн'} </Text>
            </View>
            {/* Тег для кого водитель */}
            <View style={styles.memberTagRowSpaced}>
              <View style={[styles.memberTagCompact, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}> 
                <Ionicons 
                  name={memberData.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                  style={styles.memberIcon}
                />
                <Text style={[styles.memberName, { color: isDark ? '#9CA3AF' : '#6B7280' }]}> {memberData.name} </Text>
              </View>
            </View>
          </View>
          {/* Стрелка раскрытия */}
          <View style={styles.expandArrow}>
            <Ionicons 
              name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>
        </View>
        {/* Раскрывающиеся детали */}
        {isExpanded && (
          <View style={styles.driverExpanded}>
            {/* Маршрутная информация с временем справа от каждого адреса */}
            <View style={styles.routeSection}>
              {driver.addresses.map((address, index) => {
                let pinColor: string;
                let pinIcon: string;
                let timeToShow: string;
                if (index === 0) {
                  pinColor = '#10B981';
                  pinIcon = 'ellipse';
                  timeToShow = driver.departureTime;
                } else if (index === driver.addresses.length - 1) {
                  pinColor = '#3B82F6';
                  pinIcon = 'location';
                  timeToShow = driver.arrivalTime;
                } else {
                  pinColor = '#3B82F6';
                  pinIcon = 'ellipse';
                  const hours = parseInt(driver.departureTime.split(':')[0]);
                  const minutes = parseInt(driver.departureTime.split(':')[1]);
                  const intermediateTime = new Date();
                  intermediateTime.setHours(hours + index, minutes + (index * 15));
                  timeToShow = `${intermediateTime.getHours().toString().padStart(2, '0')}:${intermediateTime.getMinutes().toString().padStart(2, '0')}`;
                }
                return (
                  <View key={index} style={styles.routePointWithTime}>
                    <View style={styles.routeLeftSide}>
                      <View style={styles.routePinContainer}>
                        <Ionicons 
                          name={pinIcon as keyof typeof Ionicons.glyphMap}
                          size={pinIcon === 'ellipse' ? 12 : 20}
                          color={pinColor}
                        />
                      </View>
                      <Text style={[styles.routeText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}> {address} </Text>
                    </View>
                    <Text style={[styles.routeTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}> {timeToShow} </Text>
                  </View>
                );
              })}
            </View>
            {/* Дополнительная информация */}
            <View style={styles.tripDetails}>
              <View style={styles.tripDetailItem}>
                <Ionicons name="calendar" size={16} color="#6B7280" />
                <Text style={[styles.tripDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}> {driver.tripDays} </Text>
              </View>
              <View style={styles.tripDetailItem}>
                <Ionicons name="diamond" size={16} color="#6B7280" />
                <Text style={[styles.tripDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}> {driver.package === 'base' ? 'Базовый' : driver.package === 'plus' ? 'Плюс' : 'Премиум'} </Text>
              </View>
              <View style={styles.tripDetailItem}>
                <Text style={[styles.tripDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}> {driver.addresses.length} остановок </Text>
              </View>
            </View>
            {/* Кнопки действий */}
            <View style={styles.expandedActions}>
              <TouchableOpacity 
                style={styles.callButtonExpanded}
                onPress={() => onCall(driver)}
              >
                <Ionicons name="call" size={20} color="#FFFFFF" />
                <Text style={styles.callButtonText}>Позвонить</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.chatButtonExpanded,
                  !driver.isOnline && styles.chatButtonDisabled
                ]}
                onPress={() => onChat(driver)}
                disabled={!driver.isOnline}
              >
                <Ionicons 
                  name="chatbubble" 
                  size={20} 
                  color={driver.isOnline ? "#1E3A8A" : "#9CA3AF"} 
                />
                <Text style={[
                  styles.chatButtonText,
                  !driver.isOnline && styles.chatButtonTextDisabled
                ]}>
                  Чат
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </AppCard>
  );
};

export default DriverCard; 