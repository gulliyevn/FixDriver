import React from 'react';
import { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { MapMarker } from '../types/map.types';

interface MapMarkersProps {
  markers: MapMarker[];
  clientMarker: MapMarker | null;
  onMarkerPress: (marker: MapMarker) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  markers,
  clientMarker,
  onMarkerPress,
}) => {
  const getMarkerColor = (type?: string) => {
    switch (type) {
      case 'driver':
        return '#2563EB';
      case 'client':
        return '#059669';
      case 'destination':
        return '#EF4444';
      case 'start':
        return '#059669'; // slightly darker green
      case 'waypoint':
        return '#9CA3AF'; // slightly lighter gray
      case 'end':
        return '#3B82F6'; // brighter blue
      default:
        return '#EF4444';
    }
  };

  const Pin = ({ color }: { color: string }) => (
    <View style={styles.pinContainer}>
      <View style={[styles.pinHead, { backgroundColor: color }]}>
        <View style={styles.pinHeadInner} />
      </View>
      <View style={[styles.pinBody, { backgroundColor: color }]} />
    </View>
  );

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          onPress={() => onMarkerPress(marker)}
        >
          <Pin color={marker.colorHex || getMarkerColor(marker.type)} />
        </Marker>
      ))}
      
      {/* Клиентский маркер для водителей */}
      {clientMarker && (
        <Marker
          key={clientMarker.id}
          coordinate={clientMarker.coordinate}
          title={clientMarker.title}
          description={clientMarker.description}
          onPress={() => onMarkerPress(clientMarker)}
        >
          <Pin color={getMarkerColor('client')} />
        </Marker>
      )}
    </>
  );
};

export default MapMarkers;

const styles = StyleSheet.create({
  pinContainer: {
    alignItems: 'center',
  },
  pinHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHeadInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  pinBody: {
    width: 3,
    height: 16,
    marginTop: -2,
    borderRadius: 1.5,
  },
});
