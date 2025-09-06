import APIClient from '../api/APIClient';
import {
  DriverVehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleResponse,
  VehiclesListResponse,
} from '../../../shared/types/driver/DriverVehicle';
import { VEHICLE_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export interface VehicleService {
  getDriverVehicles(): Promise<VehiclesListResponse>;
  getDriverVehicle(vehicleId: string): Promise<VehicleResponse>;
  createDriverVehicle(vehicleData: CreateVehicleRequest): Promise<VehicleResponse>;
  updateDriverVehicle(vehicleData: UpdateVehicleRequest): Promise<VehicleResponse>;
  deleteDriverVehicle(vehicleId: string): Promise<VehicleResponse>;
  toggleVehicleActive(vehicleId: string, isActive: boolean): Promise<VehicleResponse>;
  uploadPassportPhoto(vehicleId: string, photoFile: File): Promise<VehicleResponse>;
}

export class DriverVehicleService {
  private static instance: DriverVehicleService;
  private apiClient: typeof APIClient;

  private constructor() {
    this.apiClient = APIClient;
  }

  public static getInstance(): DriverVehicleService {
    if (!DriverVehicleService.instance) {
      DriverVehicleService.instance = new DriverVehicleService();
    }
    return DriverVehicleService.instance;
  }

  /**
   * Get driver vehicles list
   */
  async getDriverVehicles(): Promise<VehiclesListResponse> {
    try {
      const response = await this.apiClient.get(VEHICLE_CONSTANTS.ENDPOINTS.VEHICLES);
      return {
        success: true,
        data: response.data as DriverVehicle[],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : VEHICLE_CONSTANTS.ERRORS.LOAD_VEHICLES_FAILED,
      };
    }
  }

  /**
   * Get specific vehicle by ID
   */
  async getDriverVehicle(vehicleId: string): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.get(VEHICLE_CONSTANTS.ENDPOINTS.VEHICLE_BY_ID(vehicleId));
      return {
        success: true,
        data: response.data as DriverVehicle,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : VEHICLE_CONSTANTS.ERRORS.LOAD_VEHICLE_FAILED,
      };
    }
  }

  /**
   * Create new vehicle
   */
  async createDriverVehicle(vehicleData: CreateVehicleRequest): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.post(VEHICLE_CONSTANTS.ENDPOINTS.VEHICLES, vehicleData as unknown as Record<string, unknown>);
      return {
        success: true,
        data: response.data as DriverVehicle,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : VEHICLE_CONSTANTS.ERRORS.CREATE_VEHICLE_FAILED,
      };
    }
  }

  /**
   * Update existing vehicle
   */
  async updateDriverVehicle(vehicleData: UpdateVehicleRequest): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.put(VEHICLE_CONSTANTS.ENDPOINTS.VEHICLE_BY_ID(vehicleData.id), vehicleData as unknown as Record<string, unknown>);
      return {
        success: true,
        data: response.data as DriverVehicle,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : VEHICLE_CONSTANTS.ERRORS.UPDATE_VEHICLE_FAILED,
      };
    }
  }

  /**
   * Delete vehicle
   */
  async deleteDriverVehicle(vehicleId: string): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.delete(VEHICLE_CONSTANTS.ENDPOINTS.VEHICLE_BY_ID(vehicleId));
      return {
        success: true,
        data: response.data as DriverVehicle,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : VEHICLE_CONSTANTS.ERRORS.DELETE_VEHICLE_FAILED,
      };
    }
  }

  /**
   * Activate/deactivate vehicle
   */
  async toggleVehicleActive(vehicleId: string, isActive: boolean): Promise<VehicleResponse> {
    try {
      const response = await this.apiClient.patch(VEHICLE_CONSTANTS.ENDPOINTS.TOGGLE_STATUS(vehicleId), {
        isActive,
      });
      return {
        success: true,
        data: response.data as DriverVehicle,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : VEHICLE_CONSTANTS.ERRORS.CHANGE_STATUS_FAILED,
      };
    }
  }

  /**
   * Upload vehicle passport photo
   */
  async uploadPassportPhoto(vehicleId: string, photoFile: File): Promise<VehicleResponse> {
    try {
      const formData = new FormData();
      formData.append(VEHICLE_CONSTANTS.FORM_DATA.PASSPORT_PHOTO, photoFile);

      const response = await this.apiClient.post(
        VEHICLE_CONSTANTS.ENDPOINTS.PASSPORT_PHOTO(vehicleId),
        formData as unknown as Record<string, unknown>
      );
      return {
        success: true,
        data: response.data as DriverVehicle,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : VEHICLE_CONSTANTS.ERRORS.UPLOAD_PHOTO_FAILED,
      };
    }
  }

  /**
   * Get driver vehicles via gRPC
   * TODO: Implement real gRPC call
   */
  async getDriverVehiclesGrpc(): Promise<VehiclesListResponse> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : VEHICLE_CONSTANTS.ERRORS.LOAD_VEHICLES_FAILED,
      };
    }
  }

  /**
   * Create vehicle via gRPC
   * TODO: Implement real gRPC call
   */
  async createDriverVehicleGrpc(vehicleData: CreateVehicleRequest): Promise<VehicleResponse> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: {
          id: Date.now().toString(),
          driverId: 'mock-driver-id',
          ...vehicleData,
          isActive: true,
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : VEHICLE_CONSTANTS.ERRORS.CREATE_VEHICLE_FAILED,
      };
    }
  }
}
