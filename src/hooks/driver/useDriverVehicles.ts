import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DriverVehicle,
  VehicleFormData,
  VehicleFormErrors,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from "../../types/driver/DriverVehicle";
import { useI18n } from "../useI18n";
import { useAuth } from "../../context/AuthContext";
import { useUserStorageKey } from "../../utils/storageKeys";
import { DriverVehicleService } from "../../services/driver/DriverVehicleService";

export const useDriverVehicles = () => {
  const [vehicles, setVehicles] = useState<DriverVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVehicle, setCurrentVehicle] = useState<DriverVehicle | null>(
    null,
  );
  const { t } = useI18n();
  const { user } = useAuth();
  const vehiclesKey = useUserStorageKey("@driver_vehicles");

  // Загрузка списка автомобилей
  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (__DEV__) {
        // DEV: загружаем из AsyncStorage
        const storedVehicles = await AsyncStorage.getItem(vehiclesKey);
        setVehicles(storedVehicles ? JSON.parse(storedVehicles) : []);
      } else {
        // PROD: загружаем из API
        if (user?.id) {
          const service = DriverVehicleService.getInstance();
          const response = await service.getDriverVehicles();
          const apiVehicles = Array.isArray(response.data) ? response.data : [];
          setVehicles(apiVehicles);
        } else {
          setVehicles([]);
        }
      }
    } catch (err) {
      setError(t("profile.vehicles.loadError"));
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [t, user?.id, vehiclesKey]);

  // Загрузка конкретного автомобиля
  const loadVehicle = useCallback(
    async (vehicleId: string) => {
      setLoading(true);
      setError(null);

      try {
        if (__DEV__) {
          // DEV: ищем в локальном массиве
          const vehicle = vehicles.find((v) => v.id === vehicleId);
          if (vehicle) {
            setCurrentVehicle(vehicle);
            return vehicle;
          } else {
            setError(t("profile.vehicles.loadError"));
            return null;
          }
        } else {
          // PROD: загружаем из API
          const service = DriverVehicleService.getInstance();
          const response = await service.getDriverVehicle(vehicleId);
          const vehicle = response.data;
          if (vehicle) {
            setCurrentVehicle(vehicle);
            return vehicle;
          } else {
            setError(t("profile.vehicles.loadError"));
            return null;
          }
        }
      } catch (err) {
        setError(t("profile.vehicles.loadError"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, vehicles],
  );

  // Создание нового автомобиля
  const createVehicle = useCallback(
    async (vehicleData: CreateVehicleRequest) => {
      setLoading(true);
      setError(null);

      try {
        if (__DEV__) {
          // DEV: создаём локально и сохраняем в AsyncStorage
          const newVehicle: DriverVehicle = {
            id: Date.now().toString(),
            driverId: user?.id || "driver-1",
            ...vehicleData,
            isActive: true,
            isVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const updatedVehicles = [...vehicles, newVehicle];
          setVehicles(updatedVehicles);
          await AsyncStorage.setItem(
            vehiclesKey,
            JSON.stringify(updatedVehicles),
          );
          return newVehicle;
        } else {
          // PROD: создаём через API
          if (!user?.id) {
            setError(t("profile.vehicles.createError"));
            return null;
          }
          // const service = DriverVehicleService.getInstance();
          // const response = await service.createVehicle(vehicleData); // Метод будет добавлен при подключении к бэкенду
          const response = {
            success: true,
            data: {
              vehicle: {
                ...vehicleData,
                id: Date.now().toString(),
                driverId: user.id,
                isActive: true,
                isVerified: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          };
          const newVehicle = response.data?.vehicle;
          if (newVehicle) {
            setVehicles((prev) => [...prev, newVehicle]);
            return newVehicle;
          }
          return null;
        }
      } catch (err) {
        setError(t("profile.vehicles.createError"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, vehicles, user?.id, vehiclesKey],
  );

  // Обновление автомобиля
  const updateVehicle = useCallback(
    async (vehicleData: UpdateVehicleRequest) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const updatedVehicle: DriverVehicle = {
          ...vehicleData,
          driverId: "driver-1",
          isActive: true,
          isVerified: false, // При обновлении сбрасываем верификацию
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setVehicles((prev) =>
          prev.map((vehicle) =>
            vehicle.id === vehicleData.id ? updatedVehicle : vehicle,
          ),
        );
        if (currentVehicle?.id === vehicleData.id) {
          setCurrentVehicle(updatedVehicle);
        }
        return updatedVehicle;
      } catch (err) {
        setError(t("profile.vehicles.updateError"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, currentVehicle],
  );

  // Удаление автомобиля
  const deleteVehicle = useCallback(
    async (vehicleId: string) => {
      setLoading(true);
      setError(null);

      try {
        if (__DEV__) {
          // DEV: удаляем локально и сохраняем в AsyncStorage
          const updatedVehicles = vehicles.filter(
            (vehicle) => vehicle.id !== vehicleId,
          );
          setVehicles(updatedVehicles);
          if (currentVehicle?.id === vehicleId) {
            setCurrentVehicle(null);
          }
          await AsyncStorage.setItem(
            vehiclesKey,
            JSON.stringify(updatedVehicles),
          );
          return true;
        } else {
          // PROD: удаляем через API
          // const success = await DriverVehicleService.getInstance().deleteVehicle(vehicleId); // Метод будет добавлен при подключении к бэкенду
          const success = true; // Временно true для DEV режима
          if (success) {
            setVehicles((prev) =>
              prev.filter((vehicle) => vehicle.id !== vehicleId),
            );
            if (currentVehicle?.id === vehicleId) {
              setCurrentVehicle(null);
            }
            return true;
          }
          return false;
        }
      } catch (err) {
        setError(t("profile.vehicles.deleteError"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [t, currentVehicle, vehicles, vehiclesKey],
  );

  // Активация/деактивация автомобиля
  const toggleVehicleActive = useCallback(
    async (vehicleId: string, isActive: boolean) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        setVehicles((prev) =>
          prev.map((vehicle) =>
            vehicle.id === vehicleId ? { ...vehicle, isActive } : vehicle,
          ),
        );
        if (currentVehicle?.id === vehicleId) {
          setCurrentVehicle({ ...currentVehicle, isActive });
        }
        return currentVehicle;
      } catch (err) {
        setError(t("profile.vehicles.toggleError"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, currentVehicle],
  );

  // Загрузка фото техпаспорта
  const uploadPassportPhoto = useCallback(
    async (vehicleId: string, photoFile: File) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const photoUrl = URL.createObjectURL(photoFile);

        setVehicles((prev) =>
          prev.map((vehicle) =>
            vehicle.id === vehicleId
              ? { ...vehicle, passportPhoto: photoUrl }
              : vehicle,
          ),
        );
        if (currentVehicle?.id === vehicleId) {
          setCurrentVehicle({ ...currentVehicle, passportPhoto: photoUrl });
        }
        return currentVehicle;
      } catch (err) {
        setError(t("profile.vehicles.photoUploadError"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, currentVehicle],
  );

  // Валидация формы автомобиля
  const validateVehicleForm = useCallback(
    (formData: VehicleFormData): VehicleFormErrors => {
      const errors: VehicleFormErrors = {};

      if (!formData.vehicleNumber?.trim()) {
        errors.vehicleNumber = t("profile.vehicles.vehicleNumberRequired");
      }

      if (!formData.tariff?.trim()) {
        errors.tariff = t("profile.vehicles.tariffRequired");
      }

      if (!formData.carBrand?.trim()) {
        errors.carBrand = t("profile.vehicles.carBrandRequired");
      }

      if (!formData.carModel?.trim()) {
        errors.carModel = t("profile.vehicles.carModelRequired");
      }

      if (!formData.carYear?.trim()) {
        errors.carYear = t("profile.vehicles.carYearRequired");
      }

      if (!formData.carMileage?.trim()) {
        errors.carMileage = t("profile.vehicles.carMileageRequired");
      }

      return errors;
    },
    [t],
  );

  // Получение активного автомобиля
  const getActiveVehicle = useCallback(() => {
    return vehicles.find((vehicle) => vehicle.isActive) || null;
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
