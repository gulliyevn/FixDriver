import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { useDriverVehicles } from '../../../../../../shared/hooks/driver/useDriverVehicles';
import { VehicleFormData } from '../../../../../../shared/types/driver/DriverVehicle';
import vehicleSegments from '../../../../../../shared/constants/vehicleSegments.json';
import { carBrands, carModelsByBrand } from '../../../../../../shared/utils/driverData';

/**
 * Hook for Add Vehicle Modal logic
 * 
 * Manages vehicle form state and business logic
 */

export const useAddVehicle = (visible: boolean, onVehicleAdded: () => void, onClose: () => void) => {
  const { t } = useI18n();
  const { createVehicle, validateVehicleForm } = useDriverVehicles();

  // Form state
  const [vehicleForm, setVehicleForm] = useState<VehicleFormData>({
    vehicleNumber: '',
    tariff: '',
    carBrand: '',
    carModel: '',
    carYear: '',
    carMileage: '',
    passportPhoto: '',
  });
  const [vehicleErrors, setVehicleErrors] = useState<any>({});
  const [brandOptions, setBrandOptions] = useState(carBrands);
  const [modelOptions, setModelOptions] = useState<{ label: string; value: string; tariff?: string }[]>([]);
  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState<'vehicle' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      setVehicleForm({
        vehicleNumber: '',
        tariff: '',
        carBrand: '',
        carModel: '',
        carYear: '',
        carMileage: '',
        passportPhoto: '',
      });
      setVehicleErrors({});
      setBrandOptions(carBrands);
      setModelOptions([]);
      setVehiclePhoto(null);
    }
  }, [visible]);

  // Handle tariff change - update brand options
  useEffect(() => {
    if (vehicleForm.tariff) {
      setBrandOptions(vehicleSegments[vehicleForm.tariff]?.brands || carBrands);
      setModelOptions([]);
      setVehicleForm((prev) => ({ ...prev, carBrand: '', carModel: '' }));
    }
  }, [vehicleForm.tariff]);

  const handleVehicleChange = useCallback((field: string, value: string) => {
    setVehicleForm((prev) => ({ ...prev, [field]: value }));
    setVehicleErrors((prev: any) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleBrandChange = useCallback((brand: string) => {
    setVehicleForm((prev) => ({ ...prev, carBrand: brand, carModel: '' }));
    setModelOptions(vehicleSegments[vehicleForm.tariff]?.models[brand] || []);
  }, [vehicleForm.tariff]);

  const handleModelChange = useCallback((model: string) => {
    setVehicleForm((prev) => ({ ...prev, carModel: model }));
    const selectedBrand = vehicleForm.carBrand;
    const found = (carModelsByBrand[selectedBrand] || []).find((m) => m.value === model);
    if (found?.tariff) {
      setVehicleForm((prev) => ({ ...prev, tariff: found.tariff }));
    }
  }, [vehicleForm.carBrand]);

  const handleTariffChange = useCallback((tariff: string) => {
    setVehicleForm((prev) => ({ ...prev, tariff }));
  }, []);

  const handleYearChange = useCallback((option: { label: string; value: string | number }) => {
    setVehicleForm((prev) => ({ ...prev, carYear: option.value.toString() }));
    setVehicleErrors((prev: any) => ({ ...prev, carYear: undefined }));
  }, []);

  const validateVehicle = useCallback(() => {
    const errors = validateVehicleForm(vehicleForm);
    setVehicleErrors(errors);
    return Object.keys(errors).length === 0;
  }, [vehicleForm, validateVehicleForm]);

  const handleSaveVehicle = useCallback(async () => {
    if (!validateVehicle()) return;
    
    setIsLoading(true);
    
    try {
      const result = await createVehicle(vehicleForm);
      if (result) {
        Alert.alert(
          t('profile.vehicles.vehicleSaved'),
          t('profile.vehicles.vehicleSaved'),
          [{ 
            text: 'OK', 
            onPress: () => {
              onVehicleAdded();
              onClose();
            }
          }]
        );
      } else {
        Alert.alert(
          t('profile.vehicles.vehicleSaveError'),
          t('profile.vehicles.createError')
        );
      }
    } catch (err) {
      Alert.alert(
        t('profile.vehicles.vehicleSaveError'),
        t('profile.vehicles.createError')
      );
    } finally {
      setIsLoading(false);
    }
  }, [vehicleForm, validateVehicle, createVehicle, t, onVehicleAdded, onClose]);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    onClose();
  }, [isLoading, onClose]);

  const handlePhotoChange = useCallback((uri: string | null) => {
    setVehiclePhoto(uri);
  }, []);

  const handlePhotoError = useCallback((err: string) => {
    setVehicleErrors((prev: any) => ({ ...prev, vehiclePhoto: err }));
  }, []);

  const handleUploadingChange = useCallback((flag: boolean) => {
    setUploadingPhoto(flag ? 'vehicle' : null);
  }, []);

  return {
    // State
    vehicleForm,
    vehicleErrors,
    brandOptions,
    modelOptions,
    vehiclePhoto,
    uploadingPhoto,
    isLoading,
    
    // Handlers
    handleVehicleChange,
    handleBrandChange,
    handleModelChange,
    handleTariffChange,
    handleYearChange,
    handleSaveVehicle,
    handleClose,
    handlePhotoChange,
    handlePhotoError,
    handleUploadingChange,
  };
};
