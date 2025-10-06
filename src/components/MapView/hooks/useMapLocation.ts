import { useState, useEffect } from "react";
import { MapLocation, MapRegion } from "../types/map.types";
import { MapService } from "../../../services/MapService";

export const useMapLocation = (initialLocation?: MapLocation) => {
  const [region, setRegion] = useState<MapRegion>({
    latitude: initialLocation?.latitude || 40.3777,
    longitude: initialLocation?.longitude || 49.892,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Обновление региона при изменении initialLocation
  useEffect(() => {
    if (
      initialLocation &&
      initialLocation.latitude &&
      initialLocation.longitude
    ) {
      const newRegion = {
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setRegion(newRegion);
    }
  }, [initialLocation?.latitude, initialLocation?.longitude, initialLocation]); // Используем конкретные значения вместо объекта

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
      } catch (error) {
        console.warn('Failed to initialize map location:', error);
      }
    };

    if (!initialLocation) {
      initializeMap();
    }
  }, [initialLocation]);

  const updateRegion = (newRegion: Partial<MapRegion>) => {
    setRegion((prev) => ({ ...prev, ...newRegion }));
  };

  return {
    region,
    updateRegion,
  };
};
