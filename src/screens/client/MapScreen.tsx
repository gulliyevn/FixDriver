import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert,
  TextInput,
  ScrollView,
  Animated,
  StyleSheet
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { MapService } from '../../services/MapService';
import { colors, SIZES, SHADOWS } from '../../constants/colors';
import MapViewComponent from '../../components/MapView';
import { mockDrivers } from '../../mocks';

interface MapLocation {
  latitude: number;
  longitude: number;
}

type NavigationProp = StackNavigationProp<ClientStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const currentColors = isDark ? colors.dark : colors.light;
  
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    getCurrentLocation();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await MapService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось получить ваше местоположение');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: MapLocation) => {
    // Логика выбора точки назначения
  };

  const handleDriverSelect = (driver: any) => {
    setSelectedDriver(driver);
  };

  const handleMenuPress = () => {
    navigation.navigate('Drivers');
  };

  const handleChatPress = () => {
    navigation.navigate('ChatList');
  };

  const handlePlusPress = () => {
    navigation.navigate('Plus');
  };

  const markers = mockDrivers.map(driver => ({
    id: driver.id,
    coordinate: driver.location || { latitude: 40.3777, longitude: 49.8920 },
    title: `${driver.first_name} ${driver.last_name}`,
    description: `${driver.vehicle_brand} ${driver.vehicle_model}`,
    type: 'driver' as const,
    driver: driver,
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <Animated.View style={[
        styles.header, 
        { backgroundColor: currentColors.card, opacity: fadeAnim }
      ]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuPress}
        >
          <Ionicons name="menu" size={24} color={currentColors.text} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={currentColors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: currentColors.text }]}
            placeholder="Куда поехать?"
            placeholderTextColor={currentColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleChatPress}
          >
            <Ionicons name="chatbubbles-outline" size={24} color={currentColors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handlePlusPress}
          >
            <Ionicons name="add-circle" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapViewComponent
          initialLocation={currentLocation || undefined}
          onLocationSelect={handleLocationSelect}
          showNearbyDrivers={true}
          markers={markers}
        />
      </View>

      {/* Driver Cards */}
      {selectedDriver && (
        <Animated.View style={[
          styles.driverCard,
          { backgroundColor: currentColors.card, opacity: fadeAnim }
        ]}>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={24} color={currentColors.primary} />
            </View>
            <View style={styles.driverDetails}>
              <Text style={[styles.driverName, { color: currentColors.text }]}>
                {selectedDriver.first_name} {selectedDriver.last_name}
              </Text>
              <Text style={[styles.driverCar, { color: currentColors.textSecondary }]}>
                {selectedDriver.vehicle_brand} {selectedDriver.vehicle_model}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={[styles.rating, { color: currentColors.textSecondary }]}>
                  {selectedDriver.rating}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={[styles.orderButton, { backgroundColor: currentColors.primary }]}>
            <Text style={[styles.orderButtonText, { color: currentColors.card }]}>
              Заказать
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingCard, { backgroundColor: currentColors.card }]}>
            <Ionicons name="location" size={32} color={currentColors.primary} />
            <Text style={[styles.loadingText, { color: currentColors.text }]}>
              Определяем ваше местоположение...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    ...SHADOWS.light.medium,
  },
  menuButton: {
    padding: SIZES.sm,
    marginRight: SIZES.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: SIZES.radius.lg,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    marginRight: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.sm,
    fontSize: SIZES.fontSize.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: SIZES.sm,
    marginLeft: SIZES.xs,
  },
  mapContainer: {
    flex: 1,
  },
  driverCard: {
    position: 'absolute',
    bottom: SIZES.xxl,
    left: SIZES.lg,
    right: SIZES.lg,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.lg,
    ...SHADOWS.light.large,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  driverCar: {
    fontSize: SIZES.fontSize.sm,
    marginBottom: SIZES.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: SIZES.fontSize.sm,
    marginLeft: SIZES.xs,
  },
  orderButton: {
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
  },
  orderButtonText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    padding: SIZES.xl,
    borderRadius: SIZES.radius.lg,
    alignItems: 'center',
    ...SHADOWS.light.large,
  },
  loadingText: {
    fontSize: SIZES.fontSize.md,
    marginTop: SIZES.md,
    textAlign: 'center',
  },
});

export default MapScreen;
