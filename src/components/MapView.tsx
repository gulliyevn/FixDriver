import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { useTheme } from '../context/ThemeContext';
import { lightColors, darkColors } from '../constants/colors';
import { MAP_CONFIG, MARKER_TYPES } from '../constants/map';
import { DriverLocation } from '../services/MapService';
import MapService from '../services/MapService';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface RouteSegment {
  coordinates: { latitude: number; longitude: number }[];
  trafficLevel: 'free' | 'low' | 'medium' | 'high' | 'heavy';
  duration: number; // в минутах
}

export interface MapViewRef {
  scrollToUserLocation: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  animateToRegion: (region: Region) => void;
}

interface MapViewProps {
  onDriverPress?: (driver: DriverLocation) => void;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  showUserLocation?: boolean;
  showDrivers?: boolean;
  style?: any;
  routePoints?: { latitude: number; longitude: number }[];
  routeSegments?: RouteSegment[];
  routeCoordinates?: { latitude: number; longitude: number }[];
  totalDuration?: number;
  scrollToUserLocation?: boolean;
  mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain';
  driverLocation?: { latitude: number; longitude: number } | null;
}

const MapViewComponent = forwardRef<any, MapViewProps>(({
  onDriverPress,
  onMapPress,
  showUserLocation = true,
  showDrivers = true,
  style,
  routePoints = [],
  routeSegments = [],
  routeCoordinates = [],
  totalDuration = 0,
  scrollToUserLocation = false,
  mapType = 'standard',
  driverLocation = null,
}, ref) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const mapRef = useRef<MapView>(null);
  
  const [region, setRegion] = useState<Region>(MAP_CONFIG.defaultRegion);
  const [drivers, setDrivers] = useState<DriverLocation[]>([]);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    scrollToUserLocation: goToUserLocation,
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
    animateToRegion: (region: Region) => {
      mapRef.current?.animateToRegion(region, MAP_CONFIG.animationDuration);
    },
  }));

  // Получение текущей локации пользователя
  useEffect(() => {
    if (showUserLocation) {
      getCurrentLocation();
    }
  }, [showUserLocation]);

  // Получение водителей поблизости
  useEffect(() => {
    if (showDrivers && userLocation) {
      getNearbyDrivers();
    }
  }, [showDrivers, userLocation]);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await MapService.getCurrentLocation();
      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setUserLocation(newRegion);
    } catch (error) {
      console.error('Ошибка получения локации:', error);
      Alert.alert('Ошибка', 'Не удалось получить вашу локацию');
    } finally {
      setLoading(false);
    }
  };

  const goToUserLocation = async () => {
    if (userLocation) {
      // Если локация уже есть, сразу переходим с увеличенным zoom'ом
      const zoomedRegion = {
        ...userLocation,
        latitudeDelta: 0.01, // Увеличенное приближение
        longitudeDelta: 0.01,
      };
      mapRef.current?.animateToRegion(zoomedRegion, MAP_CONFIG.animationDuration);
    } else {
      // Если локации нет, получаем её и переходим
      try {
        setLoading(true);
        const location = await MapService.getCurrentLocation();
        const newRegion = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01, // Увеличенное приближение
          longitudeDelta: 0.01,
        };
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, MAP_CONFIG.animationDuration);
      } catch (error) {
        console.error('Ошибка получения локации:', error);
        Alert.alert('Ошибка', 'Не удалось получить вашу локацию');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleZoomIn = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 0.5, // Уменьшаем дельту для приближения
      longitudeDelta: region.longitudeDelta * 0.5,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleZoomOut = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 2, // Увеличиваем дельту для удаления
      longitudeDelta: region.longitudeDelta * 2,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const getNearbyDrivers = async () => {
    if (!userLocation) return;
    
    try {
      const nearbyDrivers = await MapService.getNearbyDrivers(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        MAP_CONFIG.searchRadius
      );
      setDrivers(nearbyDrivers);
    } catch (error) {
      console.error('Ошибка получения водителей:', error);
    }
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    onMapPress?.(coordinate);
  };

  const handleDriverPress = (driver: DriverLocation) => {
    onDriverPress?.(driver);
  };

  const getMapStyle = () => {
    return theme === 'dark' ? MAP_CONFIG.styles.dark : MAP_CONFIG.styles.street;
  };

  const getMarkerColor = (type: string, isAvailable: boolean = true) => {
    switch (type) {
      case MARKER_TYPES.DRIVER:
        return isAvailable ? '#4CAF50' : '#FF9800';
      case MARKER_TYPES.CLIENT:
        return '#2196F3';
      case MARKER_TYPES.PICKUP:
        return '#FF5722';
      case MARKER_TYPES.DESTINATION:
        return '#9C27B0';
      default:
        return '#666666';
    }
  };

  const getTrafficColor = (trafficLevel: 'free' | 'low' | 'medium' | 'high' | 'heavy') => {
    switch (trafficLevel) {
      case 'free':
        return '#22C55E'; // Ярко-зеленый - свободно
      case 'low':
        return '#10B981'; // Зеленый - легкие пробки
      case 'medium':
        return '#F59E0B'; // Желтый - средние пробки
      case 'high':
        return '#F97316'; // Оранжевый - сильные пробки
      case 'heavy':
        return '#EF4444'; // Красный - очень сильные пробки
      default:
        return '#10B981';
    }
  };

  const getRouteCenterPoint = () => {
    // Если есть полные координаты маршрута, берем центральную точку
    if (routeCoordinates && routeCoordinates.length > 0) {
      const centerIndex = Math.floor(routeCoordinates.length / 2);
      return routeCoordinates[centerIndex];
    }
    
    // Fallback на простой расчет между A и B
    if (routePoints.length !== 2) return null;
    
    const [pointA, pointB] = routePoints;
    return {
      latitude: (pointA.latitude + pointB.latitude) / 2,
      longitude: (pointA.longitude + pointB.longitude) / 2,
    };
  };



  // Функция для получения всех координат маршрута как единый массив
  const getAllRouteCoordinates = () => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      return routeCoordinates;
    }
    
    // Fallback: простая линия между A и B
    if (routePoints.length === 2) {
      return routePoints;
    }
    
    return [];
  };



  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChange}
        onPress={handleMapPress}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        showsBuildings={true}
        mapType={mapType}
        userLocationPriority="high"
        userLocationUpdateInterval={10000}
        userLocationFastestInterval={5000}
        followsUserLocation={false}
        loadingEnabled={true}
        loadingIndicatorColor={colors.primary}
        loadingBackgroundColor={colors.background}
      >
        {/* Маркеры маршрута A и B */}
        {routePoints && routePoints.length === 2 && [
          <Marker
            key="A"
            coordinate={routePoints[0]}
            title="A"
            description="Точка отправления"
          >
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              borderWidth: 2,
              borderColor: '#222',
              padding: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="location-sharp" size={28} color="#222" />
            </View>
          </Marker>,
          <Marker
            key="B"
            coordinate={routePoints[1]}
            title="B"
            description="Точка назначения"
          >
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              borderWidth: 2,
              borderColor: '#10B981',
              padding: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="location-sharp" size={28} color="#10B981" />
            </View>
          </Marker>,
        ]}

        {/* Маркер водителя */}
        {driverLocation && (
          <Marker
            key="driver"
            coordinate={driverLocation}
            title="Водитель"
            description="Ваш водитель"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={{
              backgroundColor: '#1E3A8A',
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}>
              <Ionicons name="car" size={20} color="#FFFFFF" />
            </View>
          </Marker>
        )}

        {/* Базовая линия маршрута */}
        {getAllRouteCoordinates().length > 0 && (
          <Polyline
            coordinates={getAllRouteCoordinates()}
            strokeColor="#D1D5DB"
            strokeWidth={10}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Цветные сегменты пробок поверх базовой линии - полное покрытие */}
        {routeSegments.map((segment, index) => (
          <Polyline
            key={`traffic-segment-${index}`}
            coordinates={segment.coordinates}
            strokeColor={getTrafficColor(segment.trafficLevel)}
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
          />
        ))}



        {/* Маркер времени точно по середине маршрута */}
        {totalDuration > 0 && getRouteCenterPoint() && (
          <Marker
            coordinate={getRouteCenterPoint()!}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={{
              backgroundColor: '#1F2937',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderWidth: 2,
              borderColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 12,
                fontWeight: '600',
              }}>
                {totalDuration} мин
              </Text>
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapViewComponent; 