import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  onDriverVisibilityToggle?: number;
  role?: 'client' | 'driver';
  markers?: Array<{
    id: string;
    coordinate: MapLocation;
    title: string;
    description?: string;
    type?: 'driver' | 'client' | 'destination';
  }>;
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({
  initialLocation,
  onLocationSelect,
  onDriverVisibilityToggle,
  markers = [],
  role = 'client',
}) => {
  const mapRef = useRef<MapView>(null);
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const styles = createMapViewStyles(isDark);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);
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



  const handleDriverModalOpen = () => {
    setIsDriverModalVisible(true);
  };

  const handleDriverModalClose = () => {
    setIsDriverModalVisible(false);
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
      navigation.navigate('Chat' as any);
      
      setTimeout(() => {
        // Навигируем к конкретному чату внутри стека
        (navigation as any).navigate('Chat', {
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
      navigation.navigate('Chat' as any);
    }
  }, [navigation, handleDriverModalClose]);

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
  }, [initialLocation]);

  // Отслеживаем изменения пропса для открытия модального окна водителя
  useEffect(() => {
    if (onDriverVisibilityToggle) {
      handleDriverModalOpen();
    }
  }, [onDriverVisibilityToggle]);

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
    if (mapRef.current) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta * 0.5,
        longitudeDelta: region.longitudeDelta * 0.5,
      };
      
      mapRef.current.animateToRegion(newRegion, 3500);
      setRegion(newRegion);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      };
      
      mapRef.current.animateToRegion(newRegion, 3500);
      setRegion(newRegion);
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
        showsCompass={true}
        showsScale={true}
        showsTraffic={true}
        showsBuildings={true}
        showsIndoors={true}
        showsIndoorLevelPicker={true}
        showsPointsOfInterest={true}
        mapType="standard"
        customMapStyle={isDark ? [
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
        {markers.map((marker) => (
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
};

export default MapViewComponent; 