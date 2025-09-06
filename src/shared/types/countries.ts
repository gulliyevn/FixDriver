export interface Country {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
  dialCode: string;
  format: string;
  emergencyNumber: string;
  currency: string;
  timezone: string;
}

export interface CountryService {
  getAllCountries(): Country[];
  getCountryByCode(code: string): Country | null;
  getCountryByDialCode(dialCode: string): Country | null;
  searchCountries(query: string): Country[];
  getEmergencyNumber(countryCode: string): string;
  getCountriesByRegion(region: string): Country[];
}

export enum Region {
  EUROPE = 'Europe',
  ASIA = 'Asia',
  AFRICA = 'Africa',
  NORTH_AMERICA = 'North America',
  SOUTH_AMERICA = 'South America',
  OCEANIA = 'Oceania',
  MIDDLE_EAST = 'Middle East'
}
