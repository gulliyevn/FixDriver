import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, TouchableOpacity, Animated, Easing, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { MapService } from '../services/MapService';
import { MapViewStyles, createMapViewStyles } from '../styles/components/MapView.styles';
import { useTheme } from '../context/ThemeContext';

interface MapLocation {
  latitude: number;
  longitude: number;
}

interface MapViewComponentProps {
  initialLocation?: MapLocation;
  onLocationSelect?: (location: MapLocation) => void;
  showNearbyDrivers?: boolean;
  onDriverVisibilityToggle?: number;
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
}) => {
  const mapRef = useRef<MapView>(null);
  const { isDark } = useTheme();
  const styles = createMapViewStyles(isDark);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDriverExpanded, setIsDriverExpanded] = useState(false);
  const [isDriverVisible, setIsDriverVisible] = useState(true);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const driverExpandAnim = useRef(new Animated.Value(0)).current;
  const driverVisibilityAnim = useRef(new Animated.Value(1)).current;
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
    vehicle_photo: require('../../assets/vehicles/toyota-camry.jpg'), // Фото авто
  };

  const getDriverInfo = (driverId: string) => {
    const schedules = ['пн-пт', 'пн, ср, пт', 'вт, чт, сб', 'пн-сб'];
    const packages = ['Basic', 'Plus', 'Premium', 'VIP'];
    const stops = [2, 3, 4, 5];
    const driverIndex = parseInt(driverId.replace(/\D/g, '')) % schedules.length;
    return { schedule: schedules[driverIndex], package: packages[driverIndex], stops: stops[driverIndex] };
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

  const handleDriverExpand = () => {
    const toValue = isDriverExpanded ? 0 : 1;
    setIsDriverExpanded(!isDriverExpanded);
    
    Animated.timing(driverExpandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleDriverVisibility = () => {
    const toValue = isDriverVisible ? 0 : 1;
    setIsDriverVisible(!isDriverVisible);
    
    Animated.timing(driverVisibilityAnim, {
      toValue,
      duration: 400,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

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

  // Отслеживаем изменения пропса для управления видимостью карточки водителя
  useEffect(() => {
    if (onDriverVisibilityToggle) {
      handleDriverVisibility();
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

      {/* Полный элемент водителя с анимацией видимости */}
      <Animated.View 
                  style={[
            styles.driverItem, 
            { 
              position: 'absolute', 
              bottom: 10, 
              left: 2, 
              right: 2,
              opacity: driverVisibilityAnim,
              transform: [{
                translateY: driverVisibilityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [200, 0]
                })
              }]
            }
          ]}
      >
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
            </View>
            <View style={styles.vehicleExpandRow}>
              <View style={styles.vehicleInfoContainer}>
                <Text style={styles.vehicleInfo}>{`${mockDriver.vehicle_brand} ${mockDriver.vehicle_model}`}</Text>
                <Text style={styles.vehicleNumber}>{mockDriver.vehicle_number}</Text>
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
          <View style={styles.premiumInfo}>
            <Ionicons name="diamond" size={16} color="#FFD700" />
            <Text style={styles.premiumText}>{getDriverInfo(mockDriver.id).package}</Text>
          </View>
          <View style={styles.stopsInfo}>
            <Ionicons name="location" size={16} color="#9CA3AF" />
            <Text style={styles.stopsText}>{getDriverInfo(mockDriver.id).stops}</Text>
          </View>
          <View style={styles.ballInfo}>
            <Text style={styles.ballText}>Сын</Text>
            <Ionicons name="football" size={16} color="#9CA3AF" />
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
      </Animated.View>
      
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