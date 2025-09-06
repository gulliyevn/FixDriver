import { Address } from '../../../shared/mocks/residenceMock';

export interface IAddressService {
  getAddresses(): Promise<Address[]>;
  createAddress(addressData: Partial<Address>): Promise<Address>;
  updateAddress(addressId: string, addressData: Partial<Address>): Promise<Address>;
  deleteAddress(addressId: string): Promise<boolean>;
  validateAddress(address: string): Promise<AddressValidationResult>;
  validateCoordinates(lat: number, lng: number): Promise<boolean>;
  validateAddressData(addressData: Partial<Address>): Promise<AddressValidationResult>;
  geocodeAddress(address: string): Promise<GeocodingResponse>;
  reverseGeocode(lat: number, lng: number): Promise<GeocodingResponse>;
  getAddressFromCoordinates(lat: number, lng: number): Promise<string>;
  formatAddress(address: Address): string;
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number;
  parseAddressComponents(address: string): AddressComponents;
}

export interface AddressValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface GeocodingResponse {
  success: boolean;
  data?: {
    lat: number;
    lng: number;
    address: string;
    components: AddressComponents;
  };
  error?: string;
}

export interface AddressComponents {
  country?: string;
  city?: string;
  street?: string;
  house?: string;
  apartment?: string;
  postalCode?: string;
}

export interface ExternalGeocodingResponse {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    country?: string;
    city?: string;
    road?: string;
    house_number?: string;
    postcode?: string;
  };
}

export interface GoogleGeocodingResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }>;
  status: string;
}

export interface YandexGeocodingResponse {
  response: {
    GeoObjectCollection: {
      featureMember: Array<{
        GeoObject: {
          Point: {
            pos: string;
          };
          metaDataProperty: {
            GeocoderMetaData: {
              text: string;
              Address: {
                Components: Array<{
                  kind: string;
                  name: string;
                }>;
              };
            };
          };
        };
      }>;
    };
  };
}
