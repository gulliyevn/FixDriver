/**
 * useLocation hook
 * Handles location services and current location
 */

import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number;
  longitude: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission not granted');
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(currentLocation);
      setSelectedLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

    } catch (error) {
      console.error('Location error:', error);
      setError('Failed to get current location. Please check location settings.');
      
      // Set default location (Baku, Azerbaijan)
      const defaultLocation = {
        latitude: 40.3777,
        longitude: 49.8920,
      };
      setSelectedLocation(defaultLocation);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSelectedLocation = useCallback((newLocation: LocationState) => {
    setSelectedLocation(newLocation);
  }, []);

  return {
    location,
    selectedLocation,
    loading,
    error,
    getCurrentLocation,
    setSelectedLocation: updateSelectedLocation,
  };
};
