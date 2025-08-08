import React, { useState, useEffect, useRef } from 'react';
import { View, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
  markers = [],
}) => {
  const mapRef = useRef<MapView>(null);
  const { isDark } = useTheme();
  const styles = createMapViewStyles(isDark);
  const [region, setRegion] = useState({
    latitude: initialLocation?.latitude || 40.3777,
    longitude: initialLocation?.longitude || 49.8920,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={true}
        showsBuildings={true}
        showsIndoors={true}
        showsIndoorLevelPicker={true}
        showsPointsOfInterest={true}
        mapType="standard"
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
    </View>
  );
};

export default MapViewComponent; 