export interface DriverFormData {
  country?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleNumber?: string;
  experience?: string;
  tariff?: string;
  carBrand?: string;
  carModel?: string;
  carYear?: string;
  carMileage?: string;
  licensePhotoUri?: string;
  techPassportPhotoUri?: string;
}

export interface DriverFieldsProps {
  t: (k: string) => string;
  styles: any;
  driverStyles: any;
  formData: DriverFormData;
  errors: Partial<DriverFormData>;
  onChange: (field: keyof DriverFormData, value: string) => void;
  onOpenSelect: (field: keyof DriverFormData, title: string) => void;
}

export type PhotoType = 'license' | 'tech';
