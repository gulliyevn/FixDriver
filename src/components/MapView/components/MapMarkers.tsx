import React from 'react';
import { Marker } from 'react-native-maps';
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
        return 'blue';
      case 'client':
        return 'green';
      case 'destination':
        return 'red';
      default:
        return 'red';
    }
  };

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          onPress={() => onMarkerPress(marker)}
          pinColor={getMarkerColor(marker.type)}
        />
      ))}
      
      {/* Клиентский маркер для водителей */}
      {clientMarker && (
        <Marker
          key={clientMarker.id}
          coordinate={clientMarker.coordinate}
          title={clientMarker.title}
          description={clientMarker.description}
          onPress={() => onMarkerPress(clientMarker)}
          pinColor="green"
        />
      )}
    </>
  );
};

export default MapMarkers;
