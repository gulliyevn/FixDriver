import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { createDriverModalStyles } from '../styles/components/DriverModal.styles';

interface DriverModalProps {
  isVisible: boolean;
  onClose: () => void;
  onOverlayClose: () => void;
  role?: 'client' | 'driver';
}

const DriverModal: React.FC<DriverModalProps> = ({
  isVisible,
  onClose,
  onOverlayClose,
  role = 'client',
}) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const styles = createDriverModalStyles(isDark);
  
  const [isDriverExpanded, setIsDriverExpanded] = useState(false);
  const driverExpandAnim = useRef(new Animated.Value(0)).current;

  // Mock data для водителя
  const mockDriver = {
    id: '1',
    first_name: 'Алексей',
    last_name: 'Петров',
    rating: 4.8,
    vehicle_brand: 'Toyota',
    vehicle_model: 'Camry',
    vehicle_number: 'A123БВ777',
    isFavorite: true,
    vehicle_photo: require('../../assets/vehicles/toyota-camry.jpg'),
  };

  const getDriverInfo = (driverId: string) => {
    const schedules = ['пн-пт', 'пн, ср, пт', 'вт, чт, сб', 'пн-сб'];
    const prices = ['25.5', '18.75', '22.0', '30.0'];
    const distances = ['5.2', '3.8', '4.5', '6.1'];
    const times = ['30', '25', '28', '35'];
    const childNames = ['Алиса', 'Михаил', 'Елена', 'Дмитрий'];
    const childAges = ['8', '12', '10', '9'];
    const childTypes = ['дочь', 'сын', 'дочь', 'сын'];
    const driverIndex = parseInt(driverId.replace(/\D/g, '')) % schedules.length;
    return { 
      schedule: schedules[driverIndex],
      price: prices[driverIndex], 
      distance: distances[driverIndex], 
      time: times[driverIndex],
      childName: childNames[driverIndex],
      childAge: childAges[driverIndex],
      childType: childTypes[driverIndex]
    };
  };

  const getDriverTrips = (driverId: string) => {
    const tripTemplates = [
      ['Дом', 'Офис', 'Школа'],
      ['Центр города', 'Аэропорт', 'Торговый центр'],
      ['Больница', 'Университет', 'Парк'],
      ['Вокзал', 'Рынок', 'Спортзал'],
    ];
    const timeTemplates = [
      ['07:30', '08:15', '17:45'],
      ['08:00', '09:30', '18:30'],
      ['07:45', '12:00', '19:15'],
      ['08:30', '14:20', '20:00'],
    ];
    const driverIndex = parseInt(driverId.replace(/\D/g, '')) % tripTemplates.length;
    const trips = tripTemplates[driverIndex];
    const times = timeTemplates[driverIndex];
    return trips.map((trip, index) => ({
      text: trip,
      time: times[index],
      dotStyle: index === 0 ? 'default' : index === 1 ? 'blue' : 'location',
    }));
  };

  const handleDriverExpand = useCallback(() => {
    const toValue = isDriverExpanded ? 0 : 1;
    setIsDriverExpanded(!isDriverExpanded);
    
    Animated.timing(driverExpandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDriverExpanded, driverExpandAnim]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onOverlayClose}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          {/* Контент водителя */}
          <View style={styles.driverItem}>
            <TouchableOpacity style={styles.driverHeader} onPress={handleDriverExpand} activeOpacity={0.7}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.driverMainInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.driverName}>{`${mockDriver.first_name} ${mockDriver.last_name}`}</Text>
                  <Ionicons name="diamond" size={16} color="#9CA3AF" style={styles.premiumIcon} />
                </View>
                <View style={styles.vehicleExpandRow}>
                  <View style={styles.vehicleInfoContainer}>
                    {role === 'driver' && (
                      <Ionicons name="football" size={16} color="#9CA3AF" style={styles.childIcon} />
                    )}
                    <Text style={styles.vehicleInfo}>
                      {role === 'driver'
                        ? `${getDriverInfo(mockDriver.id).childName} • ${getDriverInfo(mockDriver.id).childAge} лет`
                        : `${mockDriver.vehicle_brand} ${mockDriver.vehicle_model} • ${mockDriver.vehicle_number}`
                      }
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Фото авто */}
              <View style={styles.vehiclePhotoContainer}>
                {mockDriver.vehicle_photo ? (
                  <Image 
                    source={mockDriver.vehicle_photo} 
                    style={styles.vehiclePhoto}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.vehiclePhotoPlaceholder}>
                    <Ionicons name="car" size={24} color="#9CA3AF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.driverInfoBar}>
              <View style={styles.scheduleInfo}>
                <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                <Text style={styles.scheduleText}>{getDriverInfo(mockDriver.id).schedule}</Text>
              </View>
              <View style={styles.priceInfo}>
                <Ionicons 
                  name={role === 'driver' ? "wallet" : "pricetag-outline"} 
                  size={16} 
                  color="#9CA3AF" 
                />
                <Text style={styles.priceText}>{getDriverInfo(mockDriver.id).price}</Text>
              </View>
              <View style={styles.distanceInfo}>
                <Ionicons name="location" size={16} color="#9CA3AF" />
                <Text style={styles.distanceText}>{getDriverInfo(mockDriver.id).distance}</Text>
              </View>
              <View style={styles.timeInfo}>
                <Ionicons
                  name={role === 'driver' ? "time" : "football"}
                  size={16}
                  color="#9CA3AF"
                />
                <Text style={styles.timeText}>
                  {role === 'driver'
                    ? getDriverInfo(mockDriver.id).time
                    : getDriverInfo(mockDriver.id).childType
                  }
                </Text>
              </View>
            </View>

            <Animated.View
              style={[
                styles.expandableContent,
                {
                  maxHeight: driverExpandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 300] }),
                  opacity: driverExpandAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0, 1] }),
                },
              ]}
            >
              <View style={styles.tripsContainer}>
                {getDriverTrips(mockDriver.id).map((trip, index) => (
                  <React.Fragment key={`trip-${mockDriver.id}-${index}`}>
                    <View style={styles.tripItem}>
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
                  </React.Fragment>
                ))}
              </View>

              <View style={styles.bottomBorder} />

              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.leftButton}>
                  <View style={styles.buttonContent}>
                    <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.leftButtonText}>Чат</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rightButton}>
                  <View style={styles.rightButtonContent}>
                    <Ionicons name="call-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
                    <Text style={styles.rightButtonText}>Звонок</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default DriverModal;
