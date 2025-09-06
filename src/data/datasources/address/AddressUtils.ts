import { Address } from '../../../shared/mocks/residenceMock';
import { AddressComponents } from './AddressTypes';

export class AddressUtils {
  /**
   * Format address for display
   */
  static formatAddress(address: Address): string {
    const parts: string[] = [];
    
    if (address.title) {
      parts.push(address.title);
    }
    
    if (address.address) {
      parts.push(address.address);
    }
    
    // Note: description field removed from Address type
    
    return parts.join(' - ');
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Parse address components from address string
   */
  static parseAddressComponents(address: string): AddressComponents {
    const components: AddressComponents = {};
    
    // Basic parsing - can be enhanced with more sophisticated logic
    const parts = address.split(',').map(part => part.trim());
    
    if (parts.length >= 1) {
      components.street = parts[0];
    }
    
    if (parts.length >= 2) {
      components.city = parts[1];
    }
    
    if (parts.length >= 3) {
      components.country = parts[2];
    }
    
    // Try to extract house number from street
    if (components.street) {
      const houseMatch = components.street.match(/(\d+)/);
      if (houseMatch) {
        components.house = houseMatch[1];
      }
    }
    
    return components;
  }

  /**
   * Convert degrees to radians
   */
  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Check if two addresses are similar
   */
  static areAddressesSimilar(address1: string, address2: string, threshold: number = 0.8): boolean {
    const similarity = this.calculateStringSimilarity(address1.toLowerCase(), address2.toLowerCase());
    return similarity >= threshold;
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Normalize address string
   */
  static normalizeAddress(address: string): string {
    return address
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-.,]/g, '')
      .toLowerCase();
  }

  /**
   * Extract coordinates from address string if present
   */
  static extractCoordinatesFromAddress(address: string): { lat: number; lng: number } | null {
    const coordMatch = address.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    
    return null;
  }
}
