/**
 * Emergency domain types
 */

export interface EmergencyService {
  code: string;
  name: string;
  nameEn: string;
  number: string;
  description: string;
  available24h: boolean;
}

export interface EmergencyContact {
  countryCode: string;
  services: EmergencyService[];
  notes?: string;
}

export interface EmergencyServiceProvider {
  getEmergencyNumber(countryCode: string, serviceType?: string): string;
  getEmergencyServices(countryCode: string): EmergencyService[];
  callEmergencyService(countryCode: string, serviceType?: string): Promise<void>;
  getCountryCodeByLocation(): Promise<string>;
  validateEmergencyNumber(number: string): boolean;
}

export enum EmergencyServiceType {
  POLICE = 'police',
  FIRE = 'fire',
  AMBULANCE = 'ambulance',
  GENERAL = 'general',
  COAST_GUARD = 'coast_guard',
  MOUNTAIN_RESCUE = 'mountain_rescue'
}
