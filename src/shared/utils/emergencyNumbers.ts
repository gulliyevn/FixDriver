/**
 * Deprecated: use shared/constants/emergencyNumbers.ts
 * This file provides backward-compatible wrappers around EmergencyNumbersHelper.
 */
import { emergencyNumbers } from '../constants/emergencyNumbers';

export const getEmergencyNumber = (countryCode: string): string =>
  emergencyNumbers.getEmergencyNumber(countryCode);

export const callEmergencyService = async (countryCode?: string): Promise<void> =>
  emergencyNumbers.callEmergencyService(countryCode || 'RU');

export const getCountryCodeByLocation = async (): Promise<string> =>
  emergencyNumbers.getCountryCodeByLocation();
