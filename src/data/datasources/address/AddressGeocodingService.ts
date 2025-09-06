import { ADDRESS_CONSTANTS } from '../../../shared/constants';
import { 
  GeocodingResponse, 
  ExternalGeocodingResponse, 
  GoogleGeocodingResponse, 
  YandexGeocodingResponse,
  AddressComponents 
} from './AddressTypes';

export class AddressGeocodingService {
  /**
   * Geocode address to coordinates
   */
  static async geocodeAddress(address: string): Promise<GeocodingResponse> {
    try {
      // Try OpenStreetMap Nominatim first (free)
      const nominatimResult = await this.geocodeWithNominatim(address);
      if (nominatimResult.success) {
        return nominatimResult;
      }

      // Fallback to Google Geocoding API
      if (ADDRESS_CONSTANTS.EXTERNAL_APIS.GOOGLE_API_KEY) {
        const googleResult = await this.geocodeWithGoogle(address);
        if (googleResult.success) {
          return googleResult;
        }
      }

      // Fallback to Yandex Geocoding API
      if (ADDRESS_CONSTANTS.EXTERNAL_APIS.YANDEX_API_KEY) {
        const yandexResult = await this.geocodeWithYandex(address);
        if (yandexResult.success) {
          return yandexResult;
        }
      }

      return {
        success: false,
        error: 'All geocoding services failed',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Geocoding failed',
      };
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  static async reverseGeocode(lat: number, lng: number): Promise<GeocodingResponse> {
    try {
      const response = await fetch(
        `${ADDRESS_CONSTANTS.EXTERNAL_APIS.NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExternalGeocodingResponse = await response.json();
      
      return {
        success: true,
        data: {
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lon),
          address: data.display_name,
          components: this.parseNominatimAddress(data.address),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Reverse geocoding failed',
      };
    }
  }

  /**
   * Get address from coordinates
   */
  static async getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    const result = await this.reverseGeocode(lat, lng);
    return result.success ? result.data!.address : '';
  }

  /**
   * Geocode with OpenStreetMap Nominatim
   */
  private static async geocodeWithNominatim(address: string): Promise<GeocodingResponse> {
    try {
      const response = await fetch(
        `${ADDRESS_CONSTANTS.EXTERNAL_APIS.NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExternalGeocodingResponse[] = await response.json();
      
      if (data.length === 0) {
        return { success: false, error: 'Address not found' };
      }

      const result = data[0];
      return {
        success: true,
        data: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name,
          components: this.parseNominatimAddress(result.address),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Nominatim geocoding failed',
      };
    }
  }

  /**
   * Geocode with Google Geocoding API
   */
  private static async geocodeWithGoogle(address: string): Promise<GeocodingResponse> {
    try {
      const response = await fetch(
        `${ADDRESS_CONSTANTS.EXTERNAL_APIS.GOOGLE_BASE_URL}?address=${encodeURIComponent(address)}&key=${ADDRESS_CONSTANTS.EXTERNAL_APIS.GOOGLE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GoogleGeocodingResponse = await response.json();
      
      if (data.status !== 'OK' || data.results.length === 0) {
        return { success: false, error: 'Address not found' };
      }

      const result = data.results[0];
      return {
        success: true,
        data: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: result.formatted_address,
          components: this.parseGoogleAddress(result.address_components),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google geocoding failed',
      };
    }
  }

  /**
   * Geocode with Yandex Geocoding API
   */
  private static async geocodeWithYandex(address: string): Promise<GeocodingResponse> {
    try {
      const response = await fetch(
        `${ADDRESS_CONSTANTS.EXTERNAL_APIS.YANDEX_BASE_URL}?geocode=${encodeURIComponent(address)}&apikey=${ADDRESS_CONSTANTS.EXTERNAL_APIS.YANDEX_API_KEY}&format=json&results=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: YandexGeocodingResponse = await response.json();
      
      if (data.response.GeoObjectCollection.featureMember.length === 0) {
        return { success: false, error: 'Address not found' };
      }

      const result = data.response.GeoObjectCollection.featureMember[0].GeoObject;
      const [lng, lat] = result.Point.pos.split(' ').map(Number);
      
      return {
        success: true,
        data: {
          lat,
          lng,
          address: result.metaDataProperty.GeocoderMetaData.text,
          components: this.parseYandexAddress(result.metaDataProperty.GeocoderMetaData.Address.Components),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Yandex geocoding failed',
      };
    }
  }

  /**
   * Parse Nominatim address components
   */
  private static parseNominatimAddress(address?: any): AddressComponents {
    if (!address) return {};
    
    return {
      country: address.country,
      city: address.city || address.town || address.village,
      street: address.road,
      house: address.house_number,
      postalCode: address.postcode,
    };
  }

  /**
   * Parse Google address components
   */
  private static parseGoogleAddress(components: any[]): AddressComponents {
    const result: AddressComponents = {};
    
    components.forEach(component => {
      const types = component.types;
      if (types.includes('country')) result.country = component.long_name;
      if (types.includes('locality')) result.city = component.long_name;
      if (types.includes('route')) result.street = component.long_name;
      if (types.includes('street_number')) result.house = component.long_name;
      if (types.includes('postal_code')) result.postalCode = component.long_name;
    });
    
    return result;
  }

  /**
   * Parse Yandex address components
   */
  private static parseYandexAddress(components: any[]): AddressComponents {
    const result: AddressComponents = {};
    
    components.forEach(component => {
      switch (component.kind) {
        case 'country':
          result.country = component.name;
          break;
        case 'locality':
          result.city = component.name;
          break;
        case 'street':
          result.street = component.name;
          break;
        case 'house':
          result.house = component.name;
          break;
        case 'postal_code':
          result.postalCode = component.name;
          break;
      }
    });
    
    return result;
  }
}
