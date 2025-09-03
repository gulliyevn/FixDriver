import { useState, useEffect } from 'react';
import { MapRegion } from '../types/map.types';
import { Location } from '../../../../../../../shared/types/user';
import { MapService } from '../../../../../../../data/datasources/grpc/MapService';

const mapService = new MapService();

export const useMapLocation = (initialLocation?: Location) => {
  const [region, setRegion] = useState<MapRegion>({
    latitude: initialLocation?.latitude || 40.3777,
    longitude: initialLocation?.longitude || 49.8920,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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
    }
  }, [initialLocation?.latitude, initialLocation?.longitude]); // Используем конкретные значения вместо объекта

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const location = await mapService.getCurrentLocation();
        if (location) {
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        console.error('Error getting current location:', error);
      }
    };

    if (!initialLocation) {
      initializeMap();
    }
  }, [initialLocation]);

  const updateRegion = (newRegion: Partial<MapRegion>) => {
    setRegion(prev => ({ ...prev, ...newRegion }));
  };

  return {
    region,
    updateRegion,
  };
};
