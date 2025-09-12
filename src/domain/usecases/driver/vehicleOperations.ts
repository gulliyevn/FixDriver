import { DriverVehicle, CreateVehicleRequest, UpdateVehicleRequest } from '../../../shared/types/driver/DriverVehicle';
import { mockDriverVehicles } from '../../../shared/mocks/driver/driverVehiclesMock';
import { VEHICLE_CONSTANTS } from '../../../shared/constants/vehicleConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Domain usecase for vehicle operations
 * Abstracts data layer access from presentation layer
 */
export const vehicleOperations = {
  /**
   * Load vehicles from storage
   */
  async loadVehicles(): Promise<DriverVehicle[]> {
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
  },

  /**
   * Save vehicles to storage
   */
  async saveVehicles(vehicles: DriverVehicle[]): Promise<void> {
    try {
      await AsyncStorage.setItem(VEHICLE_CONSTANTS.STORAGE_KEYS.DRIVER_VEHICLES, JSON.stringify(vehicles));
    } catch (error) {
      console.error('Error saving vehicles to storage:', error);
      throw error;
    }
  },

  /**
   * Create new vehicle
   */
  async createVehicle(vehicleData: CreateVehicleRequest, existingVehicles: DriverVehicle[]): Promise<DriverVehicle> {
    const newVehicle: DriverVehicle = {
      id: Date.now().toString(),
      driverId: VEHICLE_CONSTANTS.DEFAULTS.DRIVER_ID,
      ...vehicleData,
      isActive: VEHICLE_CONSTANTS.DEFAULTS.IS_ACTIVE,
      isVerified: VEHICLE_CONSTANTS.DEFAULTS.IS_VERIFIED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedVehicles = [...existingVehicles, newVehicle];
    await this.saveVehicles(updatedVehicles);
    
    return newVehicle;
  },

  /**
   * Update vehicle
   */
  async updateVehicle(vehicleData: UpdateVehicleRequest, existingVehicles: DriverVehicle[]): Promise<DriverVehicle> {
    const updatedVehicle: DriverVehicle = {
      ...vehicleData,
      driverId: VEHICLE_CONSTANTS.DEFAULTS.DRIVER_ID,
      isActive: VEHICLE_CONSTANTS.DEFAULTS.IS_ACTIVE,
      isVerified: VEHICLE_CONSTANTS.DEFAULTS.IS_VERIFIED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedVehicles = existingVehicles.map(vehicle => 
      vehicle.id === vehicleData.id ? updatedVehicle : vehicle
    );

    await this.saveVehicles(updatedVehicles);
    
    return updatedVehicle;
  },

  /**
   * Delete vehicle
   */
  async deleteVehicle(vehicleId: string, existingVehicles: DriverVehicle[]): Promise<DriverVehicle[]> {
    const updatedVehicles = existingVehicles.filter(vehicle => vehicle.id !== vehicleId);
    await this.saveVehicles(updatedVehicles);
    return updatedVehicles;
  },

  /**
   * Toggle vehicle active status
   */
  async toggleVehicleActive(vehicleId: string, isActive: boolean, existingVehicles: DriverVehicle[]): Promise<DriverVehicle[]> {
    const updatedVehicles = existingVehicles.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, isActive } : vehicle
    );
    await this.saveVehicles(updatedVehicles);
    return updatedVehicles;
  },

  /**
   * Upload passport photo
   */
  async uploadPassportPhoto(vehicleId: string, photoUrl: string, existingVehicles: DriverVehicle[]): Promise<DriverVehicle[]> {
    const updatedVehicles = existingVehicles.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, passportPhoto: photoUrl } : vehicle
    );
    await this.saveVehicles(updatedVehicles);
    return updatedVehicles;
  }
};
