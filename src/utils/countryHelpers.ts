import { Linking } from "react-native";
import { COUNTRIES_FULL } from "./countries";
import type { Country } from "../types/countries";

/**
 * Get country by ISO code
 */
export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES_FULL.find(
    (c) => c.code.toUpperCase() === code.toUpperCase(),
  );
};

/**
 * Get emergency number for a country
 */
export const getEmergencyNumber = (countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  return country?.emergencyNumber || "112"; // 112 - European standard default
};

/**
 * Call emergency service for a specific country
 */
export const callEmergencyService = async (
  countryCode?: string,
): Promise<void> => {
  try {
    const code = countryCode || "RU"; // Default to Russia
    const emergencyNumber = getEmergencyNumber(code);
    const phoneUrl = `tel:${emergencyNumber}`;

    const canOpen = await Linking.canOpenURL(phoneUrl);
    if (canOpen) {
      await Linking.openURL(phoneUrl);
    } else {
      console.error("Cannot make emergency call");
      return;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Get countries by continent
 */
export const getCountriesByContinent = (continent: string): Country[] => {
  return COUNTRIES_FULL.filter((c) => c.continent === continent);
};

/**
 * Get country by phone number
 */
export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return COUNTRIES_FULL.find((c) => c.dialCode === dialCode);
};

/**
 * Format phone number according to country format
 */
export const formatPhoneNumber = (
  phone: string,
  countryCode: string,
): string => {
  const country = getCountryByCode(countryCode);
  if (!country) return phone;

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Apply format mask
  let formatted = "";
  let digitIndex = 0;

  for (const char of country.format) {
    if (char === "#") {
      if (digitIndex < digits.length) {
        formatted += digits[digitIndex];
        digitIndex++;
      }
    } else {
      formatted += char;
    }
  }

  return formatted;
};

/**
 * Get all available continents
 */
export const getContinents = (): string[] => {
  const continents = new Set<string>();
  COUNTRIES_FULL.forEach((c) => {
    if (c.continent) continents.add(c.continent);
  });
  return Array.from(continents).sort();
};
