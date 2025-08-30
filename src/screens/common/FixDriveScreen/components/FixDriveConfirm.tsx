import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { getCurrentColors } from '../../../../constants/colors';
import { createDriversScreenStyles } from '../../../../styles/screens/drivers/DriversScreen.styles';
import { mockDrivers } from '../../../../mocks/data/users';
import { AddressData } from '../types/fix-drive.types';

interface FixDriveConfirmProps {
  scheduleData: {
    scheduleType: string;
    selectedDays: string[];
    selectedTime: string;
    returnTime?: string;
    returnTripTime?: string;
    returnWeekdaysTime?: string;
    isReturnTrip: boolean;
  };
  addressData: AddressData | null;
}

const FixDriveConfirm: React.FC<FixDriveConfirmProps> = ({ 
  scheduleData, 
  addressData 
}) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const { t } = useLanguage();
  const styles = useMemo(() => createDriversScreenStyles(isDark), [isDark]);

  // Выбираем первого доступного водителя из моков (только базовые данные)
  const selectedDriver = mockDrivers.find(driver => driver.isAvailable) || mockDrivers[0];

  // Вычисляем расстояние по координатам адресов (если есть)
  const calculateDistance = () => {
    if (!addressData?.addresses || addressData.addresses.length < 2) return 0;
    // Простая формула для демонстрации - в реальности используем геолокацию
    return Math.random() * 10 + 2; // от 2 до 12 км
  };

  const distance = calculateDistance();
  const price = (distance * 0.3).toFixed(2); // Цена = расстояние × 0.3 AFc

  // Формируем расписание из реальных данных
  const scheduleText = scheduleData.selectedDays.map(day => t(`common.${day}`)).join(', ') || 'Не выбрано';

  // Формируем маршрут из реальных адресов
  const realTrips = addressData?.addresses.map((addr, index) => ({
    text: addr.address,
    time: index === 0 ? scheduleData.selectedTime : 
          index === 1 && scheduleData.returnTime ? scheduleData.returnTime :
          `${(8 + index)}:${(index * 15) % 60}`,
    dotStyle: addr.type === 'from' ? 'default' : 
              addr.type === 'to' ? 'location' : 'blue'
  })) || [];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.flatListContainer}
        contentContainerStyle={styles.driversList}
        showsVerticalScrollIndicator={false}
      >
        {/* Заголовок */}
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '600', 
          color: colors.text,
          textAlign: 'center',
          marginBottom: 24,
          marginHorizontal: 20
        }}>
          Рекомендуемый водитель
        </Text>

        {/* Информация о водителе как в DriverListItem */}
        <View style={styles.driverItem}>
          {/* Хедер водителя */}
          <View style={styles.driverHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.driverMainInfo}>
              <View style={styles.nameRatingRow}>
                <View style={styles.nameContainer}>
                  <Text style={styles.driverName}>
                    {`${selectedDriver.first_name} ${selectedDriver.last_name}`}
                  </Text>
                  <Ionicons name="diamond" size={16} color="#9CA3AF" style={styles.premiumIcon} />
                </View>
                <Text style={styles.ratingText}>{selectedDriver.rating.toFixed(1)}</Text>
              </View>
              <View style={styles.vehicleInfoContainer}>
                <Text style={styles.vehicleInfo}>
                  {`${selectedDriver.vehicle_brand} ${selectedDriver.vehicle_model} • ${selectedDriver.vehicle_number}`}
                </Text>
              </View>
            </View>
          </View>

          {/* Инфо панель водителя */}
          <View style={styles.driverInfoBar}>
            <View style={styles.scheduleInfo}>
              <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
              <Text style={styles.scheduleText}>{scheduleText}</Text>
            </View>
            <View style={styles.priceInfo}>
              <Ionicons name="pricetag-outline" size={16} color="#9CA3AF" />
              <Text style={styles.priceText}>{price} AFc</Text>
            </View>
            <View style={styles.distanceInfo}>
              <Ionicons name="location" size={16} color="#9CA3AF" />
              <Text style={styles.distanceText}>{distance.toFixed(1)} км</Text>
            </View>
            <View style={styles.timeInfo}>
              <Ionicons name="football" size={16} color="#9CA3AF" />
              <Text style={styles.timeText}>{addressData?.familyMemberName || 'Участник семьи'}</Text>
            </View>
          </View>

          {/* Маршрут водителя - с реальными адресами */}
          <View style={styles.expandableContent}>
            <View style={styles.tripsContainer}>
              {realTrips.map((trip, index) => (
                <View key={index} style={styles.tripItem}>
                  <View
                    style={[
                      styles.tripDot,
                      trip.dotStyle === 'blue' && styles.tripDotBlue,
                      trip.dotStyle === 'location' && styles.tripDotLocation,
                    ]}
                  />
                  <Text style={styles.tripText}>{trip.text}</Text>
                  <Text style={styles.tripTime}>{trip.time}</Text>
                </View>
              ))}
            </View>

            <View style={styles.bottomBorder} />

            <View style={styles.buttonsContainer}>
              <View style={styles.rightButton}>
                <View style={styles.rightButtonContent}>
                  <Ionicons name="call-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
                  <Text style={styles.rightButtonText}>
                    {t('client.driversScreen.actions.call')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FixDriveConfirm;
