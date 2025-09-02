import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DriverVehicle,
  VehicleFormData,
  VehicleFormErrors,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../../types/driver/DriverVehicle';
import { useI18n } from '../useI18n';
import { mockDriverVehicles } from '../../mocks/driverVehiclesMock';

export const useDriverVehicles = () => {
  const [vehicles, setVehicles] = useState<DriverVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVehicle, setCurrentVehicle] = useState<DriverVehicle | null>(null);
  const { t } = useI18n();

  // Загрузка списка автомобилей
  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Пытаемся загрузить из AsyncStorage
      const storedVehicles = await AsyncStorage.getItem('driver_vehicles');
      
      if (storedVehicles) {
        // Если есть сохраненные данные, используем их
        setVehicles(JSON.parse(storedVehicles));
      } else {
        // Если нет сохраненных данных, используем мок-данные
        setVehicles(mockDriverVehicles);
        // Сохраняем мок-данные в AsyncStorage
        await AsyncStorage.setItem('driver_vehicles', JSON.stringify(mockDriverVehicles));
      }
    } catch (err) {
      setError(t('profile.vehicles.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Загрузка конкретного автомобиля
  const loadVehicle = useCallback(async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const vehicle = mockDriverVehicles.find(v => v.id === vehicleId);
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
  }, [t]);

  // Создание нового автомобиля
  const createVehicle = useCallback(async (vehicleData: CreateVehicleRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newVehicle: DriverVehicle = {
        id: Date.now().toString(),
        driverId: 'driver-1',
        ...vehicleData,
        isActive: true,
        isVerified: false, // Новые автомобили по умолчанию не верифицированы
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedVehicles = [...vehicles, newVehicle];
      setVehicles(updatedVehicles);
      
      // Сохраняем в AsyncStorage
      await AsyncStorage.setItem('driver_vehicles', JSON.stringify(updatedVehicles));
      
      return newVehicle;
    } catch (err) {
      setError(t('profile.vehicles.createError'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, vehicles]);

  // Обновление автомобиля
  const updateVehicle = useCallback(async (vehicleData: UpdateVehicleRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedVehicle: DriverVehicle = {
        ...vehicleData,
        driverId: 'driver-1',
        isActive: true,
        isVerified: false, // При обновлении сбрасываем верификацию
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === vehicleData.id ? updatedVehicle : vehicle
        )
      );
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
  }, [t, currentVehicle]);

  // Удаление автомобиля
  const deleteVehicle = useCallback(async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
      setVehicles(updatedVehicles);
      
      if (currentVehicle?.id === vehicleId) {
        setCurrentVehicle(null);
      }
      
      // Сохраняем в AsyncStorage
      await AsyncStorage.setItem('driver_vehicles', JSON.stringify(updatedVehicles));
      
      return true;
    } catch (err) {
      setError(t('profile.vehicles.deleteError'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [t, currentVehicle, vehicles]);

  // Активация/деактивация автомобиля
  const toggleVehicleActive = useCallback(async (vehicleId: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === vehicleId ? { ...vehicle, isActive } : vehicle
        )
      );
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
  }, [t, currentVehicle]);

  // Загрузка фото техпаспорта
  const uploadPassportPhoto = useCallback(async (vehicleId: string, photoFile: File) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const photoUrl = URL.createObjectURL(photoFile);
      
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === vehicleId ? { ...vehicle, passportPhoto: photoUrl } : vehicle
        )
      );
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
  }, [t, currentVehicle]);

  // Валидация формы автомобиля
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

  // Получение активного автомобиля
  const getActiveVehicle = useCallback(() => {
    return vehicles.find(vehicle => vehicle.isActive) || null;
  }, [vehicles]);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Очистка текущего автомобиля
  const clearCurrentVehicle = useCallback(() => {
    setCurrentVehicle(null);
  }, []);

  // Загрузка автомобилей при монтировании
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  return {
    // Состояние
    vehicles,
    loading,
    error,
    currentVehicle,
    
    // Методы
    loadVehicles,
    loadVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicleActive,
    uploadPassportPhoto,
    validateVehicleForm,
    getActiveVehicle,
    clearError,
    clearCurrentVehicle,
  };
};
