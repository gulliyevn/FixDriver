/**
 * 🌍 COUNTRY SERVICE
 * 
 * Mock country service for development and testing.
 * Easy to replace with gRPC implementation.
 */

// Types for CountryService
interface Country {
  code: string;
  name: string;
  emergencyNumber: string;
}

export default class CountryService {
  /**
   * Get all countries
   */
  async getAll(): Promise<Country[]> {
    return [
      { code: 'US', name: 'United States', emergencyNumber: '911' },
      { code: 'RU', name: 'Russia', emergencyNumber: '112' },
      { code: 'AZ', name: 'Azerbaijan', emergencyNumber: '112' },
      { code: 'GB', name: 'United Kingdom', emergencyNumber: '999' },
      { code: 'DE', name: 'Germany', emergencyNumber: '112' },
    ];
  }

  /**
   * Get country by code
   */
  async getByCode(code: string): Promise<Country | null> {
    const countries = await this.getAll();
    return countries.find(country => country.code === code) || null;
  }

  /**
   * Get emergency number for country
   */
  async getEmergencyNumber(countryCode: string): Promise<string | null> {
    const country = await this.getByCode(countryCode);
    return country?.emergencyNumber || null;
  }
}