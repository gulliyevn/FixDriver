import { useCallback } from 'react';
import { useI18n } from '../useI18n';
import { DriverVehicle } from '../../types/driver/DriverVehicle';

/**
 * Hook for vehicle photo operations
 */
export const useVehiclePhotos = () => {
  const { t } = useI18n();

  const uploadPassportPhoto = useCallback(async (
    vehicleId: string, 
    photoFile: File,
    vehicles: DriverVehicle[],
    setVehicles: (vehicles: DriverVehicle[]) => void,
    currentVehicle: DriverVehicle | null,
    setCurrentVehicle: (vehicle: DriverVehicle | null) => void
  ): Promise<DriverVehicle | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const photoUrl = URL.createObjectURL(photoFile);
      
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle.id === vehicleId ? { ...vehicle, passportPhoto: photoUrl } : vehicle
      );
      
      setVehicles(updatedVehicles);
      
      if (currentVehicle?.id === vehicleId) {
        const updatedCurrentVehicle = { ...currentVehicle, passportPhoto: photoUrl };
        setCurrentVehicle(updatedCurrentVehicle);
        return updatedCurrentVehicle;
      }
      
      return null;
    } catch (error) {
      console.error('Error uploading passport photo:', error);
      throw new Error(t('profile.vehicles.photoUploadError'));
    }
  }, [t]);

  return {
    uploadPassportPhoto,
  };
};
