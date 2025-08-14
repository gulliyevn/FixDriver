import React, { useRef, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { View, Alert, Animated } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { createMapViewStyles } from '../../styles/components/MapView.styles';
import DriverModal from '../DriverModal';

// Импорты из новой структуры
import { MapViewComponentProps, MapRef } from './types/map.types';
import { useMapZoom } from './hooks/useMapZoom';
import { useMapMarkers } from './hooks/useMapMarkers';
import { useMapLocation } from './hooks/useMapLocation';
import MapControls from './components/MapControls';
import MapMarkersComponent from './components/MapMarkers';

const MapViewComponent = forwardRef<MapRef, MapViewComponentProps>(({
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

  // Используем созданные хуки
  const { handleZoomIn, handleZoomOut } = useMapZoom(mapRef);
  const { region, updateRegion } = useMapLocation(initialLocation);
  const { mapMarkers, clientMarker, refreshMapMarkers, handleMarkerPress } = useMapMarkers(
    markers,
    role,
    clientLocationActive,
    initialLocation,
    onDriverVisibilityToggle
  );

  // Экспортируем методы карты через ref
  useImperativeHandle(ref, () => ({
    getCamera: () => mapRef.current?.getCamera(),
    animateCamera: (camera: any) => mapRef.current?.animateCamera(camera),
    animateToRegion: (region: any, duration?: number) => mapRef.current?.animateToRegion(region, duration),
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
  }));

  // Анимации для кнопок (оставляем как есть, так как это UI логика)
  const buttonAnimations = useMemo(() => [
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ], []);

  const handleMapPress = useCallback((event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const location = { latitude, longitude };
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  }, [onLocationSelect]);

  const handleDriverModalClose = useCallback(() => {
    if (onDriverModalClose) {
      onDriverModalClose();
    }
  }, [onDriverModalClose]);

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

  // Плавная анимация центрирования карты при изменении initialLocation
  React.useEffect(() => {
    if (initialLocation && initialLocation.latitude && initialLocation.longitude) {
      const newRegion = {
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      updateRegion(newRegion);
      
      // Плавная анимация центрирования карты
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 500);
      }
    }
  }, [initialLocation]); // Убираем updateRegion из зависимостей

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
            "stylers": [{ "color": "#242f3e" }]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#746855" }]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#242f3e" }]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#263c3f" }]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#6b9a76" }]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#38414e" }]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#212a37" }]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9ca5b3" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "color": "#746855" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#1f2835" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#f3d19c" }]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{ "color": "#2f3948" }]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#17263c" }]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#515c6d" }]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#17263c" }]
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
        <MapMarkersComponent
          markers={mapMarkers}
          clientMarker={clientMarker}
          onMarkerPress={handleMarkerPress}
        />
      </MapView>

      {/* Модальное окно водителя */}
      <DriverModal
        isVisible={isDriverModalVisible}
        onClose={handleDriverModalClose}
        onOverlayClose={handleDriverModalClose}
        role={role}
        onChat={handleChatPress}
      />

      {/* Дополнительные кнопки управления */}
      <MapControls
        buttonAnimations={buttonAnimations}
        onRefresh={refreshMapMarkers}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </View>
  );
});

export default MapViewComponent;
