import { APIClient } from '../APIClient';
import {
  DriverVehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleResponse,
  VehiclesListResponse,
} from '../../types/driver/DriverVehicle';

export class DriverVehicleService {
  private static instance: DriverVehicleService;
  private apiClient: APIClient;

  private constructor() {
    this.apiClient = APIClient.getInstance();
  }

  public static getInstance(): DriverVehicleService {
    if (!DriverVehicleService.instance) {
      DriverVehicleService.instance = new DriverVehicleService();
    }
    return DriverVehicleService.instance;
  }

  /**
   * Получить список автомобилей водителя
   */
  async getDriverVehicles(): Promise<VehiclesListResponse> {
    try {
      const response = await this.apiClient.get('/driver/vehicles');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Не удалось загрузить автомобили',
      };
    }
  }

  /**
   * Получить конкретный автомобиль по ID
   */
  async getDriverVehicle(vehicleId: string): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.get(`/driver/vehicles/${vehicleId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Не удалось загрузить автомобиль',
      };
    }
  }

  /**
   * Создать новый автомобиль
   */
  async createDriverVehicle(vehicleData: CreateVehicleRequest): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.post('/driver/vehicles', vehicleData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Не удалось создать автомобиль',
      };
    }
  }

  /**
   * Обновить существующий автомобиль
   */
  async updateDriverVehicle(vehicleData: UpdateVehicleRequest): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.put(`/driver/vehicles/${vehicleData.id}`, vehicleData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Не удалось обновить автомобиль',
      };
    }
  }

  /**
   * Удалить автомобиль
   */
  async deleteDriverVehicle(vehicleId: string): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.delete(`/driver/vehicles/${vehicleId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Не удалось удалить автомобиль',
      };
    }
  }

  /**
   * Активировать/деактивировать автомобиль
   */
  async toggleVehicleActive(vehicleId: string, isActive: boolean): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.patch(`/driver/vehicles/${vehicleId}/toggle`, {
        isActive,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Не удалось изменить статус автомобиля',
      };
    }
  }

  /**
   * Загрузить фото техпаспорта
   */
  async uploadPassportPhoto(vehicleId: string, photoFile: File): Promise<VehicleResponse> {
    try {
      const formData = new FormData();
      formData.append('passportPhoto', photoFile);

      const response = await this.apiClient.post(
        `/driver/vehicles/${vehicleId}/passport-photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Не удалось загрузить фото техпаспорта',
      };
    }
  }
}
