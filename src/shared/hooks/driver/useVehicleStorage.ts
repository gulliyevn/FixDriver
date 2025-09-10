import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverVehicle } from '../../types/driver/DriverVehicle';
import { mockDriverVehicles } from '../../mocks/driverVehiclesMock';
import { VEHICLE_CONSTANTS } from '../../../shared/constants/vehicleConstants';

/**
 * Hook for vehicle storage operations
 */
export const useVehicleStorage = () => {
  const loadVehiclesFromStorage = useCallback(async (): Promise<DriverVehicle[]> => {
    try {
      const storedVehicles = await AsyncStorage.getItem(VEHICLE_CONSTANTS.STORAGE_KEYS.DRIVER_VEHICLES);
      
      if (storedVehicles) {
        return JSON.parse(storedVehicles);
      } else {
        // If no saved data, use mock data and save it
        await AsyncStorage.setItem(VEHICLE_CONSTANTS.STORAGE_KEYS.DRIVER_VEHICLES, JSON.stringify(mockDriverVehicles));
        return mockDriverVehicles;
      }
    } catch (error) {
      console.error('Error loading vehicles from storage:', error);
      return mockDriverVehicles;
    }
  }, []);

  const saveVehiclesToStorage = useCallback(async (vehicles: DriverVehicle[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(VEHICLE_CONSTANTS.STORAGE_KEYS.DRIVER_VEHICLES, JSON.stringify(vehicles));
    } catch (error) {
      console.error('Error saving vehicles to storage:', error);
      throw error;
    }
  }, []);

  const clearVehiclesFromStorage = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(VEHICLE_CONSTANTS.STORAGE_KEYS.DRIVER_VEHICLES);
    } catch (error) {
      console.error('Error clearing vehicles from storage:', error);
      throw error;
    }
  }, []);

  return {
    loadVehiclesFromStorage,
    saveVehiclesToStorage,
    clearVehiclesFromStorage,
  };
};
