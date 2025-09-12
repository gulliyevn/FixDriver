/**
 * useGeocoding hook
 * Handles address geocoding and reverse geocoding
 */

import { useState, useCallback } from 'react';
import { AddressGeocodingService } from '../../../../../data/datasources/address/AddressGeocodingService';

export const useGeocoding = () => {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getAddressFromCoordinates = useCallback(async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      
      // Use AddressGeocodingService for reverse geocoding
      const result = await AddressGeocodingService.reverseGeocode(latitude, longitude);
      
      if (result.success && result.data) {
        setAddress(result.data.address);
      } else {
        setAddress('Address not found');
      }
      
    } catch (error) {
      console.warn('Geocoding error:', error);
      setAddress('Address not found');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCoordinatesFromAddress = useCallback(async (address: string) => {
    try {
      setLoading(true);
      
      // Use AddressGeocodingService for forward geocoding
      const result = await AddressGeocodingService.geocodeAddress(address);
      
      if (result.success && result.data) {
        return {
          latitude: result.data.lat,
          longitude: result.data.lng,
        };
      }
      
      return null;
    } catch (error) {
      console.warn('Geocoding error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAddress = useCallback(() => {
    setAddress('');
  }, []);

  return {
    address,
    loading,
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
    clearAddress,
  };
};
