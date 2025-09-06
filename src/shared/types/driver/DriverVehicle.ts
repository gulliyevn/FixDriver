export interface DriverVehicle {
  id: string;
  driverId: string;
  vehicleNumber: string;
  tariff: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  carMileage: string;
  passportPhoto?: string;
  isActive: boolean;
  isVerified: boolean; // Статус верификации автомобиля
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  vehicleNumber: string;
  tariff: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  carMileage: string;
  passportPhoto?: string;
}

export interface VehicleFormErrors {
  vehicleNumber?: string;
  tariff?: string;
  carBrand?: string;
  carModel?: string;
  carYear?: string;
  carMileage?: string;
  passportPhoto?: string;
}

export interface CreateVehicleRequest {
  vehicleNumber: string;
  tariff: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  carMileage: string;
  passportPhoto?: string;
}

export interface UpdateVehicleRequest extends CreateVehicleRequest {
  id: string;
}

export interface VehicleResponse {
  success: boolean;
  data?: DriverVehicle;
  error?: string;
}

export interface VehiclesListResponse {
  success: boolean;
  data?: DriverVehicle[];
  error?: string;
}
