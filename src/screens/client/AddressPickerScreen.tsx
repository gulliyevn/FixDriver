import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Dimensions,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ClientScreenProps } from '../../types/navigation';

const { width, height } = Dimensions.get('window');

const AddressPickerScreen: React.FC<ClientScreenProps<'AddressPicker'>> = ({ 
  navigation, 
  route 
}) => {
  const { onAddressSelected } = route.params;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Запрашиваем разрешения
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходим доступ к геолокации для выбора адреса');
        return;
      }

      // Получаем текущее местоположение
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      setSelectedLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // Получаем адрес по координатам
      await getAddressFromCoordinates(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

    } catch (error) {
      
      Alert.alert('Ошибка', 'Не удалось получить местоположение');
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      
      // Используем встроенный геокодинг Expo Location
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (reverseGeocode && reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        const addressParts = [
          location.street,
          location.streetNumber,
          location.city,
          location.region,
          location.postalCode,
          location.country
        ].filter(Boolean);
        
        const formattedAddress = addressParts.join(', ');
        setAddress(formattedAddress || 'Адрес не найден');
      } else {
        setAddress('Адрес не найден');
      }
    } catch (error) {
      
      setAddress('Ошибка получения адреса');
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    setSelectedLocation({ latitude, longitude });
    await getAddressFromCoordinates(latitude, longitude);
  };

  const handleConfirmAddress = () => {
    if (selectedLocation && address) {
      onAddressSelected(address, selectedLocation.latitude, selectedLocation.longitude);
      navigation.goBack();
    } else {
      Alert.alert('Ошибка', 'Выберите местоположение на карте');
    }
  };

  const initialRegion = {
    latitude: 55.7558, // Москва по умолчанию
    longitude: 37.6176,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Выберите адрес</Text>
        <TouchableOpacity onPress={handleConfirmAddress} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Готово</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Выбранный адрес"
              description={address}
            />
          )}
        </MapView>
      </View>

      <View style={styles.addressContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#003366" />
            <Text style={styles.loadingText}>Получение адреса...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.addressLabel}>Выбранный адрес:</Text>
            <Text style={styles.addressText}>{address || 'Нажмите на карту для выбора адреса'}</Text>
          </>
        )}
      </View>

      <View style={styles.instructions}>
        <Ionicons name="information-circle-outline" size={20} color="#666" />
        <Text style={styles.instructionsText}>
          Нажмите на карту, чтобы выбрать адрес, или используйте текущее местоположение
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    flex: 1,
    textAlign: 'center',
  },
  confirmButton: {
    padding: 8,
    backgroundColor: '#003366',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  instructionsText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
});

export default AddressPickerScreen; 