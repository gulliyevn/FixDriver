import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { getCurrentColors } from '../../../../constants/colors';
import { createDriversScreenStyles } from '../../../../styles/screens/drivers/DriversScreen.styles';
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

// Моковые данные для водителей
const drivers = [
  {
    id: 1,
    name: 'Александр Смирнов',
    vehicle: 'Toyota Camry • А123БВ',
    isOnline: true,
    rating: 4.8,
    emergencyDriver: {
      name: 'Сергей Петров',
      vehicle: 'BMW X5 • М777НН'
    }
  },
  {
    id: 2,
    name: 'Михаил Козлов',
    vehicle: 'Honda Accord • В456ГД',
    isOnline: true,
    rating: 4.9,
    emergencyDriver: {
      name: 'Игорь Сидоров',
      vehicle: 'Mercedes C-Class • А888ВВ'
    }
  },
  {
    id: 3,
    name: 'Дмитрий Волков',
    vehicle: 'Nissan Altima • Е789ЖЗ',
    isOnline: false,
    rating: 4.7,
    emergencyDriver: {
      name: 'Виктор Иванов',
      vehicle: 'Audi A6 • К999ММ'
    }
  },
  {
    id: 4,
    name: 'Андрей Морозов',
    vehicle: 'Hyundai Sonata • И012КЛ',
    isOnline: true,
    rating: 4.6,
    emergencyDriver: {
      name: 'Павел Николаев',
      vehicle: 'Volkswagen Passat • Р555СС'
    }
  }
];

const FixDriveConfirm: React.FC<FixDriveConfirmProps> = ({ 
  scheduleData, 
  addressData 
}) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const { t } = useLanguage();
  const styles = useMemo(() => createDriversScreenStyles(isDark), [isDark]);
  
  const [expandedDrivers, setExpandedDrivers] = useState<number[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    console.log('🔄 selectedDriverId changed to:', selectedDriverId);
  }, [selectedDriverId]);

  // Детерминированное расстояние (Haversine) и мемоизированная цена
  const distance = useMemo(() => {
    if (!addressData?.addresses || addressData.addresses.length < 2) return 0;
    const from = addressData.addresses[0]?.coordinates;
    const to = addressData.addresses[1]?.coordinates;
    if (!from || !to) return 0;

    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // км
    const dLat = toRad(to.latitude - from.latitude);
    const dLon = toRad(to.longitude - from.longitude);
    const lat1 = toRad(from.latitude);
    const lat2 = toRad(to.latitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, [addressData?.addresses]);

  const price = useMemo(() => (distance * 0.3).toFixed(2), [distance]);

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

  const toggleDriverExpanded = (driverId: number) => {
    setExpandedDrivers(prev => 
      prev.includes(driverId) 
        ? prev.filter(id => id !== driverId)
        : [...prev, driverId]
    );
  };



  const selectDriver = useCallback((driverId: number) => {
    console.log('Selecting driver:', driverId);
    setSelectedDriverId(driverId);
  }, []);

  const deselectDriver = useCallback(() => {
    console.log('Deselecting driver');
    setSelectedDriverId(null);
  }, []);

  const toggleDriverSelection = useCallback((driverId: number) => {
    setSelectedDriverId(prev => prev === driverId ? null : driverId);
  }, []);

  // Компонент фиксированной кнопки - показывается только после выбора
  const FixedBottomButton = () => {
    // Показываем кнопку только если выбран водитель
    if (!selectedDriverId) {
      return null;
    }

    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'transparent',
      }}>
        <TouchableOpacity 
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
          onPress={() => {
            console.log('Подтверждение выбора водителя:', selectedDriverId);
            // Здесь будет логика подтверждения
          }}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={20} 
            color="#FFFFFF" 
            style={{ marginRight: 8 }} 
          />
          <Text style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
          }}>
            Подтвердить выбор
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDriverCard = (driver: typeof drivers[0]) => {
    const isExpanded = expandedDrivers.includes(driver.id);
    const isSelected = selectedDriverId === driver.id;

    return (
      <View key={driver.id} style={styles.driverItem}>
        {isSelected && (
          <View style={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: 14,
            zIndex: 0,
          }} />
        )}
        {/* Хедер водителя - кликабельный */}
        <TouchableOpacity 
          style={styles.driverHeader}
          onPress={() => toggleDriverExpanded(driver.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.avatarContainer, { position: 'absolute', top: 0, left: 10 }]}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#FFFFFF" />
            </View>
            <View style={[styles.onlineIndicator, { 
              backgroundColor: driver.isOnline ? '#10B981' : '#9CA3AF' 
            }]} />
            {isExpanded && (
              <>
                <View style={{
                  position: 'absolute',
                  bottom: -50,
                  left: '50%',
                  transform: [{ translateX: -1 }],
                  width: 2,
                  height: 40,
                  backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
                }} />
                <View style={{
                  position: 'absolute',
                  bottom: -50,
                  left: '50%',
                  width: 20,
                  height: 2,
                  backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
                }} />
              </>
            )}
          </View>
          <View style={[styles.driverMainInfo, { marginLeft: 80 }]}>
            <View style={styles.nameRatingRow}>
              <View style={styles.nameContainer}>
                <Text 
                  style={styles.driverName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {driver.name}
                </Text>
                <Ionicons name="diamond" size={16} color="#9CA3AF" style={styles.premiumIcon} />
              </View>
              <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
            </View>
            
            {/* Блок с данными автомобиля */}
            <View style={[styles.vehicleInfoContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
              <Text style={styles.vehicleInfo}>
                {driver.vehicle}
              </Text>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#9CA3AF" 
              />
            </View>
            
            {/* Разворачиваемый контент над линией */}
            {isExpanded && (
              <View style={{
                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                borderRadius: 8,
                padding: 12,
                marginTop: 20,
                marginBottom: 8,
              }}>
                {/* Экстренный водитель */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#EF4444',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}>
                    <Ionicons name="person" size={20} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text 
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: isDark ? '#F9FAFB' : '#111827',
                          marginRight: 8,
                          flex: 1,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {driver.emergencyDriver.name}
                      </Text>
                      <View style={{ position: 'absolute', right: -4 }}>
                        <Ionicons name="flash" size={16} color="#EF4444" />
                      </View>
                    </View>
                    <Text style={{
                      fontSize: 12,
                      color: isDark ? '#D1D5DB' : '#6B7280',
                    }}>
                      {driver.emergencyDriver.vehicle}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>

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

          <View style={[styles.buttonsContainer, { zIndex: 10 }]}>
            <TouchableOpacity 
              style={[styles.rightButton, { 
                backgroundColor: colors.primary,
                borderColor: colors.primary,
                zIndex: 10
              }]}
              onPress={() => {
                console.log('Button pressed for driver:', driver.id, 'Current selected:', selectedDriverId);
                toggleDriverSelection(driver.id);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.rightButtonContent}>
                <Ionicons name="checkmark-outline" size={18} color="#FFFFFF" />
                <Text style={[styles.rightButtonText, { 
                  color: '#FFFFFF'
                }]}
                >
                  {isSelected ? 'Выбрано' : 'Выбрать'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };



  const visibleDrivers = useMemo(() => {
    if (selectedDriverId == null) return drivers;
    const selected = drivers.find(d => d.id === selectedDriverId);
    return selected ? [selected] : drivers;
  }, [selectedDriverId]);

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView 
        style={styles.flatListContainer}
        contentContainerStyle={[styles.driversList, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {visibleDrivers.map(renderDriverCard)}
      </ScrollView>
      
      <FixedBottomButton />
    </View>
  );
};

export default FixDriveConfirm;
