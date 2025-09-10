import { useState, useEffect, useCallback } from 'react';
import {
  DriverVehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../../types/driver/DriverVehicle';
import { useI18n } from '../useI18n';
import { useVehicleValidation } from './useVehicleValidation';
import { vehicleOperations } from '../../../domain/usecases/driver/vehicleOperations';
import { VEHICLE_CONSTANTS } from '../../constants/vehicleConstants';

/**
 * Main hook for driver vehicles management
 */
export const useDriverVehicles = () => {
  const [vehicles, setVehicles] = useState<DriverVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVehicle, setCurrentVehicle] = useState<DriverVehicle | null>(null);
  
  const { t } = useI18n();
  const { validateVehicleForm } = useVehicleValidation();

  // Load vehicles list
  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedVehicles = await vehicleOperations.loadVehicles();
      setVehicles(loadedVehicles);
    } catch (err) {
      setError(t('profile.vehicles.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Load specific vehicle
  const loadVehicle = useCallback(async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, VEHICLE_CONSTANTS.TIMEOUTS.LOAD_VEHICLE));
      
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        setCurrentVehicle(vehicle);
        return vehicle;
      } else {
        setError(t('profile.vehicles.loadError'));
        return null;
      }
    } catch (err) {
      setError(t('profile.vehicles.loadError'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, vehicles]);

  // Create new vehicle
  const createVehicle = useCallback(async (vehicleData: CreateVehicleRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newVehicle = await vehicleOperations.createVehicle(vehicleData, vehicles);
      setVehicles(prev => [...prev, newVehicle]);
      return newVehicle;
    } catch (err) {
      setError(t('profile.vehicles.createError'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, vehicles]);

  // Update vehicle
  const updateVehicle = useCallback(async (vehicleData: UpdateVehicleRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, VEHICLE_CONSTANTS.TIMEOUTS.UPDATE_VEHICLE));
      
      const updatedVehicle = await vehicleOperations.updateVehicle(vehicleData, vehicles);
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleData.id ? updatedVehicle : vehicle
      ));
      
      if (currentVehicle?.id === vehicleData.id) {
        setCurrentVehicle(updatedVehicle);
      }
      
      return updatedVehicle;
    } catch (err) {
      setError(t('profile.vehicles.updateError'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, vehicles, currentVehicle]);

  // Delete vehicle
  const deleteVehicle = useCallback(async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedVehicles = await vehicleOperations.deleteVehicle(vehicleId, vehicles);
      setVehicles(updatedVehicles);
      
      if (currentVehicle?.id === vehicleId) {
        setCurrentVehicle(null);
      }
      
      return true;
    } catch (err) {
      setError(t('profile.vehicles.deleteError'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [t, vehicles, currentVehicle]);

  // Activate/deactivate vehicle
  const toggleVehicleActive = useCallback(async (vehicleId: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, VEHICLE_CONSTANTS.TIMEOUTS.TOGGLE_VEHICLE));
      
      const updatedVehicles = await vehicleOperations.toggleVehicleActive(vehicleId, isActive, vehicles);
      setVehicles(updatedVehicles);
      
      if (currentVehicle?.id === vehicleId) {
        setCurrentVehicle({ ...currentVehicle, isActive });
      }
      
      return currentVehicle;
    } catch (err) {
      setError(t('profile.vehicles.toggleError'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, vehicles, currentVehicle]);

  // Upload passport photo
  const handleUploadPassportPhoto = useCallback(async (vehicleId: string, photoFile: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const photoUrl = URL.createObjectURL(photoFile);
      const updatedVehicles = await vehicleOperations.uploadPassportPhoto(vehicleId, photoUrl, vehicles);
      setVehicles(updatedVehicles);
      
      if (currentVehicle?.id === vehicleId) {
        setCurrentVehicle({ ...currentVehicle, passportPhoto: photoUrl });
      }
      
      return currentVehicle;
    } catch (err) {
      setError(t('profile.vehicles.photoUploadError'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, vehicles, currentVehicle]);

  // Get active vehicle
  const getActiveVehicle = useCallback(() => {
    return vehicles.find(vehicle => vehicle.isActive) || null;
  }, [vehicles]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current vehicle
  const clearCurrentVehicle = useCallback(() => {
    setCurrentVehicle(null);
  }, []);

  // Load vehicles on mount
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  return {
    // State
    vehicles,
    loading,
    error,
    currentVehicle,
    
    // Methods
    loadVehicles,
    loadVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicleActive,
    uploadPassportPhoto: handleUploadPassportPhoto,
    validateVehicleForm,
    getActiveVehicle,
    clearError,
    clearCurrentVehicle,
  };
};