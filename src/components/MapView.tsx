import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { View, Alert, TouchableOpacity, Animated, Easing, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MapService } from '../services/MapService';
import { MapViewStyles, createMapViewStyles } from '../styles/components/MapView.styles';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DriverModal from './DriverModal';

interface MapLocation {
  latitude: number;
  longitude: number;
}

interface MapViewComponentProps {
  initialLocation?: MapLocation;
  onLocationSelect?: (location: MapLocation) => void;
  showNearbyDrivers?: boolean;
  onDriverVisibilityToggle?: (timestamp: number) => void;
  role?: 'client' | 'driver';
  clientLocationActive?: boolean; // Активна ли клиентская локация
  isDriverModalVisible?: boolean; // Видимость модалки водителя
  onDriverModalClose?: () => void; // Функция закрытия модалки
  mapType?: 'standard' | 'satellite' | 'hybrid'; // Тип карты
  markers?: Array<{
    id: string;
    coordinate: MapLocation;
    title: string;
    description?: string;
    type?: 'driver' | 'client' | 'destination';
  }>;
}

const MapViewComponent = forwardRef<any, MapViewComponentProps>(({
  initialLocation,
  onLocationSelect,
  onDriverVisibilityToggle,
  markers = [],
  role = 'client',
  clientLocationActive = false,
  isDriverModalVisible = false,
  onDriverModalClose,
  mapType = 'standard',
}, ref) => {
  const mapRef = useRef<MapView>(null);
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const styles = createMapViewStyles(isDark);

  // Экспортируем методы карты через ref
  useImperativeHandle(ref, () => ({
    getCamera: () => mapRef.current?.getCamera(),
    animateCamera: (camera: any) => mapRef.current?.animateCamera(camera),
    animateToRegion: (region: any, duration?: number) => mapRef.current?.animateToRegion(region, duration),
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
  }));
  const [isExpanded, setIsExpanded] = useState(false);
  const isZoomingRef = useRef(false); // Флаг для предотвращения множественных зумов
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const buttonAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  
  const [region, setRegion] = useState({
    latitude: initialLocation?.latitude || 40.3777,
    longitude: initialLocation?.longitude || 49.8920,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Состояние для маркеров водителей и клиентов
  const [mapMarkers, setMapMarkers] = useState(markers);
  
  // Состояние для клиентского маркера (показывается водителям)
  const [clientMarker, setClientMarker] = useState<{
    id: string;
    coordinate: MapLocation;
    title: string;
    description?: string;
  } | null>(null);



  const handleDriverModalClose = () => {
    if (onDriverModalClose) {
      onDriverModalClose();
    }
    // Возвращаем шеврон в исходное состояние
    setIsExpanded(false);
    
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Анимация скрытия дополнительных кнопок
    const animations = buttonAnimations.map((anim) => {
      return Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      });
    });
    
    Animated.parallel(animations).start();
  };

  const handleChatPress = useCallback((driver: any) => {
    try {
      // Закрываем модалку водителя
      handleDriverModalClose();
      
      // Для обеих ролей используем одинаковую навигацию к стеку чатов
      navigation.navigate('Chat');
      
      setTimeout(() => {
        // Навигируем к конкретному чату внутри стека
        navigation.navigate('Chat', {
          screen: 'ChatConversation',
          params: {
            driverId: driver.id,
            driverName: `${driver.first_name} ${driver.last_name}`,
            driverCar: `${driver.vehicle_brand} ${driver.vehicle_model}`,
            driverNumber: driver.phone_number,
            driverRating: driver.rating.toString(),
            driverStatus: driver.isAvailable ? 'online' : 'offline'
          }
        });
      }, 100);
    } catch (error) {
      console.warn('Chat navigation failed, falling back to Chat tab:', error);
      navigation.navigate('Chat');
    }
  }, [navigation, handleDriverModalClose]);

  // Обновление маркеров при изменении пропсов
  useEffect(() => {
    if (markers && markers.length > 0) {
      setMapMarkers(markers);
    }
  }, [markers]);

  // Мемоизируем маркеры для оптимизации рендеринга
  const memoizedMarkers = useMemo(() => mapMarkers, [mapMarkers]);

  // Обновление региона при изменении initialLocation
  useEffect(() => {
    if (initialLocation && initialLocation.latitude && initialLocation.longitude) {
      const newRegion = {
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setRegion(newRegion);
      
      // Плавная анимация центрирования карты
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 500); // Увеличиваем время анимации для плавности
      }
    }
  }, [initialLocation]);

  // Обработка клиентской локации для водителей
  useEffect(() => {
    if (role === 'driver' && clientLocationActive && initialLocation) {
      // Показываем клиентский маркер водителям
      setClientMarker({
        id: 'active_client',
        coordinate: initialLocation,
        title: 'Активный клиент',
        description: 'Клиент готов к поездке'
      });
    } else if (!clientLocationActive || role !== 'driver') {
      // Скрываем клиентский маркер только при изменении состояния
      setClientMarker(null);
    }
  }, [clientLocationActive, role]); // Убираем initialLocation из зависимостей

  const refreshMapMarkers = useCallback(async () => {
    try {
      console.log('Refreshing map markers...');
      
      // Обновляем только маркеры карты, не трогая состояние DriverModal
      if (typeof onDriverVisibilityToggle === 'function') {
        // Вызываем колбэк для обновления видимости водителей
        onDriverVisibilityToggle(Date.now());
      }
      
      // Обновляем текущую локацию без влияния на другие состояния
      const location = await MapService.getCurrentLocation();
      if (location && !initialLocation) {
        setRegion(prevRegion => ({
          ...prevRegion,
          latitude: location.latitude,
          longitude: location.longitude,
        }));
      }
      
    } catch (error) {
      console.error('Error refreshing map markers:', error);
    }
  }, [onDriverVisibilityToggle, initialLocation]);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const location = await MapService.getCurrentLocation();
        if (location) {
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch {
        Alert.alert('Ошибка', 'Не удалось получить текущее местоположение');
      }
    };

    if (!initialLocation) {
      initializeMap();
    }
  }, []); // Убираем зависимость initialLocation, чтобы избежать бесконечного цикла

  // Убираем второй проблемный useEffect

  const handleMapPress = (event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const location: MapLocation = { latitude, longitude };
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const handleMarkerPress = (marker: {
    id: string;
    coordinate: MapLocation;
    title: string;
    description?: string;
    type?: 'driver' | 'client' | 'destination';
    onPress?: (marker: {
      id: string;
      coordinate: MapLocation;
      title: string;
      description?: string;
      type?: 'driver' | 'client' | 'destination';
    }) => void;
  }) => {
    if (marker.onPress) {
      marker.onPress(marker);
    }
  };

  const handleExpandPress = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.timing(rotateAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Анимация появления/скрытия дополнительных кнопок
    const animations = buttonAnimations.map((anim, index) => {
      return Animated.timing(anim, {
        toValue: isExpanded ? 0 : 1,
        duration: 200,
        delay: isExpanded ? 0 : index * 50, // Задержка для каскадного появления
        useNativeDriver: true,
      });
    });

    Animated.parallel(animations).start();
  };

  const handleZoomIn = () => {
    console.log('MapViewComponent: handleZoomIn called');
    if (isZoomingRef.current) {
      console.log('MapViewComponent: zoom already in progress');
      return;
    }
    
    isZoomingRef.current = true;
    
    if (mapRef.current) {
      // Плавный зум с animateCamera
      mapRef.current.getCamera().then((camera) => {
        const newZoom = Math.min(camera.zoom + 1, 20);
        mapRef.current?.animateCamera({
          ...camera,
          zoom: newZoom,
        }, { duration: 500 });
        
        setTimeout(() => {
          isZoomingRef.current = false;
        }, 600);
      }).catch(() => {
        isZoomingRef.current = false;
      });
    } else {
      isZoomingRef.current = false;
    }
  };

  const handleZoomOut = () => {
    console.log('MapViewComponent: handleZoomOut called');
    if (isZoomingRef.current) {
      console.log('MapViewComponent: zoom already in progress');
      return;
    }
    
    isZoomingRef.current = true;
    
    if (mapRef.current) {
      // Плавный зум с animateCamera
      mapRef.current.getCamera().then((camera) => {
        const newZoom = Math.max(camera.zoom - 1, 5);
        mapRef.current?.animateCamera({
          ...camera,
          zoom: newZoom,
        }, { duration: 500 });
        
        setTimeout(() => {
          isZoomingRef.current = false;
        }, 600);
      }).catch(() => {
        isZoomingRef.current = false;
      });
    } else {
      isZoomingRef.current = false;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsTraffic={false}
        showsBuildings={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsPointsOfInterest={false}
        mapType={mapType}
        customMapStyle={isDark && mapType === 'standard' ? [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#242f3e"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#746855"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#242f3e"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#d59563"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#d59563"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#263c3f"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#6b9a76"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#38414e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#212a37"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9ca5b3"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#746855"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#1f2835"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#f3d19c"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#2f3948"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#d59563"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#17263c"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#515c6d"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#17263c"
              }
            ]
          }
        ] : undefined}
        userLocationPriority="high"
        userLocationUpdateInterval={5000}
        userLocationFastestInterval={2000}
        followsUserLocation={true}
        toolbarEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        minZoomLevel={5}
        maxZoomLevel={20}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#ffffff"
        moveOnMarkerPress={true}
        liteMode={false}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {memoizedMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onPress={() => handleMarkerPress(marker)}
            pinColor={
              marker.type === 'driver' ? 'blue' :
              marker.type === 'client' ? 'green' :
              marker.type === 'destination' ? 'red' : 'red'
            }
          />
        ))}
        
        {/* Клиентский маркер для водителей */}
        {clientMarker && (
          <Marker
            key={clientMarker.id}
            coordinate={clientMarker.coordinate}
            title={clientMarker.title}
            description={clientMarker.description}
            onPress={() => handleMarkerPress(clientMarker)}
            pinColor="green"
          />
        )}
      </MapView>

      {/* Модальное окно водителя */}
      <DriverModal
        isVisible={isDriverModalVisible}
        onClose={handleDriverModalClose}
        onOverlayClose={handleDriverModalClose}
        role={role}
        onChat={handleChatPress}
      />
      


      {/* Дополнительные кнопки */}
      <View style={styles.additionalButtonsContainer}>
        {buttonAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={{
              opacity: anim,
              transform: [{
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }}
          >
            <TouchableOpacity 
              style={styles.additionalButton}
              onPress={() => {
                if (index === 0) refreshMapMarkers(); // refresh-outline
                if (index === 4) handleZoomIn(); // add-outline
                if (index === 5) handleZoomOut(); // remove-outline
              }}
            >
              <Ionicons 
                name={([
                  "refresh-outline",
                  "location-sharp",
                  "locate-outline",
                  "layers-outline",
                  "add-outline",
                  "remove-outline"
                ] as const)[index]}
                size={20} 
                color={isDark ? '#F9FAFB' : '#111827'} 
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
});

export default MapViewComponent; 