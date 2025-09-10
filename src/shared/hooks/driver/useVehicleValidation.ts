import { useCallback } from 'react';
import { useI18n } from '../useI18n';
import { VehicleFormData, VehicleFormErrors } from '../../types/driver/DriverVehicle';

/**
 * Hook for vehicle form validation
 */
export const useVehicleValidation = () => {
  const { t } = useI18n();

  const validateVehicleForm = useCallback((formData: VehicleFormData): VehicleFormErrors => {
    const errors: VehicleFormErrors = {};

    if (!formData.vehicleNumber?.trim()) {
      errors.vehicleNumber = t('profile.vehicles.vehicleNumberRequired');
    }

    if (!formData.tariff?.trim()) {
      errors.tariff = t('profile.vehicles.tariffRequired');
    }

    if (!formData.carBrand?.trim()) {
      errors.carBrand = t('profile.vehicles.carBrandRequired');
    }

    if (!formData.carModel?.trim()) {
      errors.carModel = t('profile.vehicles.carModelRequired');
    }

    if (!formData.carYear?.trim()) {
      errors.carYear = t('profile.vehicles.carYearRequired');
    }

    if (!formData.carMileage?.trim()) {
      errors.carMileage = t('profile.vehicles.carMileageRequired');
    }

    return errors;
  }, [t]);

  return {
    validateVehicleForm,
  };
};
