import * as Linking from 'expo-linking';
import { EmergencyService, EmergencyContact, EmergencyServiceProvider, EmergencyServiceType } from '../types/emergency';

/**
 * Emergency services provider implementation
 * Provides accurate and verified emergency service information
 */
export class EmergencyNumbersHelper implements EmergencyServiceProvider {
  private readonly EMERGENCY_CONTACTS: Record<string, EmergencyContact> = {
    // Russia and CIS
    'RU': {
      countryCode: 'RU',
      services: [
        {
          code: 'general',
          name: 'Единая служба спасения',
          nameEn: 'Unified Emergency Service',
          number: '112',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'police',
          name: 'Полиция',
          nameEn: 'Police',
          number: '102',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: 'Пожарная служба',
          nameEn: 'Fire Service',
          number: '101',
          description: 'Fire emergency',
          available24h: true
        },
        {
          code: 'ambulance',
          name: 'Скорая помощь',
          nameEn: 'Ambulance',
          number: '103',
          description: 'Medical emergency',
          available24h: true
        }
      ],
      notes: '112 is the unified emergency number, individual services also available'
    },
    'KZ': {
      countryCode: 'KZ',
      services: [
        {
          code: 'general',
          name: 'Единая служба спасения',
          nameEn: 'Unified Emergency Service',
          number: '112',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'police',
          name: 'Полиция',
          nameEn: 'Police',
          number: '102',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: 'Пожарная служба',
          nameEn: 'Fire Service',
          number: '101',
          description: 'Fire emergency',
          available24h: true
        },
        {
          code: 'ambulance',
          name: 'Скорая помощь',
          nameEn: 'Ambulance',
          number: '103',
          description: 'Medical emergency',
          available24h: true
        }
      ]
    },
    'BY': {
      countryCode: 'BY',
      services: [
        {
          code: 'general',
          name: 'Единая служба спасения',
          nameEn: 'Unified Emergency Service',
          number: '112',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'police',
          name: 'Милиция',
          nameEn: 'Police',
          number: '102',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: 'Пожарная служба',
          nameEn: 'Fire Service',
          number: '101',
          description: 'Fire emergency',
          available24h: true
        },
        {
          code: 'ambulance',
          name: 'Скорая помощь',
          nameEn: 'Ambulance',
          number: '103',
          description: 'Medical emergency',
          available24h: true
        }
      ]
    },
    'UA': {
      countryCode: 'UA',
      services: [
        {
          code: 'general',
          name: 'Единая служба спасения',
          nameEn: 'Unified Emergency Service',
          number: '112',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'police',
          name: 'Поліція',
          nameEn: 'Police',
          number: '102',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: 'Пожежна служба',
          nameEn: 'Fire Service',
          number: '101',
          description: 'Fire emergency',
          available24h: true
        },
        {
          code: 'ambulance',
          name: 'Швидка допомога',
          nameEn: 'Ambulance',
          number: '103',
          description: 'Medical emergency',
          available24h: true
        }
      ]
    },

    // Europe
    'DE': {
      countryCode: 'DE',
      services: [
        {
          code: 'general',
          name: 'Notruf',
          nameEn: 'Emergency',
          number: '112',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'police',
          name: 'Polizei',
          nameEn: 'Police',
          number: '110',
          description: 'Police emergency',
          available24h: true
        }
      ]
    },
    'FR': {
      countryCode: 'FR',
      services: [
        {
          code: 'general',
          name: 'Numéro d\'urgence',
          nameEn: 'Emergency Number',
          number: '112',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'police',
          name: 'Police',
          nameEn: 'Police',
          number: '17',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: 'Pompiers',
          nameEn: 'Fire Service',
          number: '18',
          description: 'Fire emergency',
          available24h: true
        },
        {
          code: 'ambulance',
          name: 'SAMU',
          nameEn: 'Ambulance',
          number: '15',
          description: 'Medical emergency',
          available24h: true
        }
      ]
    },
    'GB': {
      countryCode: 'GB',
      services: [
        {
          code: 'general',
          name: 'Emergency Services',
          nameEn: 'Emergency Services',
          number: '999',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'general',
          name: 'Emergency Services',
          nameEn: 'Emergency Services',
          number: '112',
          description: 'Police, Fire, Ambulance (EU standard)',
          available24h: true
        }
      ]
    },
    'IT': {
      countryCode: 'IT',
      services: [
        {
          code: 'general',
          name: 'Numero unico di emergenza',
          nameEn: 'Unified Emergency Number',
          number: '112',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'police',
          name: 'Carabinieri',
          nameEn: 'Police',
          number: '113',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: 'Vigili del Fuoco',
          nameEn: 'Fire Service',
          number: '115',
          description: 'Fire emergency',
          available24h: true
        },
        {
          code: 'ambulance',
          name: 'Emergenza Sanitaria',
          nameEn: 'Medical Emergency',
          number: '118',
          description: 'Medical emergency',
          available24h: true
        }
      ]
    },
    'ES': {
      countryCode: 'ES',
      services: [
        {
          code: 'general',
          name: 'Número de emergencias',
          nameEn: 'Emergency Number',
          number: '112',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'police',
          name: 'Policía Nacional',
          nameEn: 'National Police',
          number: '091',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: 'Bomberos',
          nameEn: 'Fire Service',
          number: '080',
          description: 'Fire emergency',
          available24h: true
        },
        {
          code: 'ambulance',
          name: 'Emergencias Sanitarias',
          nameEn: 'Medical Emergency',
          number: '061',
          description: 'Medical emergency',
          available24h: true
        }
      ]
    },

    // North America
    'US': {
      countryCode: 'US',
      services: [
        {
          code: 'general',
          name: 'Emergency Services',
          nameEn: 'Emergency Services',
          number: '911',
          description: 'Police, Fire, Ambulance',
          available24h: true
        }
      ]
    },
    'CA': {
      countryCode: 'CA',
      services: [
        {
          code: 'general',
          name: 'Emergency Services',
          nameEn: 'Emergency Services',
          number: '911',
          description: 'Police, Fire, Ambulance',
          available24h: true
        }
      ]
    },
    'MX': {
      countryCode: 'MX',
      services: [
        {
          code: 'general',
          name: 'Servicios de Emergencia',
          nameEn: 'Emergency Services',
          number: '911',
          description: 'Police, Fire, Ambulance',
          available24h: true
        }
      ]
    },

    // Asia
    'CN': {
      countryCode: 'CN',
      services: [
        {
          code: 'police',
          name: '警察',
          nameEn: 'Police',
          number: '110',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: '消防',
          nameEn: 'Fire Service',
          number: '119',
          description: 'Fire emergency',
          available24h: true
        },
        {
          code: 'ambulance',
          name: '急救',
          nameEn: 'Ambulance',
          number: '120',
          description: 'Medical emergency',
          available24h: true
        }
      ]
    },
    'JP': {
      countryCode: 'JP',
      services: [
        {
          code: 'police',
          name: '警察',
          nameEn: 'Police',
          number: '110',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: '消防',
          nameEn: 'Fire Service',
          number: '119',
          description: 'Fire emergency',
          available24h: true
        }
      ]
    },
    'KR': {
      countryCode: 'KR',
      services: [
        {
          code: 'general',
          name: '긴급 서비스',
          nameEn: 'Emergency Services',
          number: '112',
          description: 'Police, Fire, Ambulance',
          available24h: true
        },
        {
          code: 'ambulance',
          name: '구급차',
          nameEn: 'Ambulance',
          number: '119',
          description: 'Medical emergency',
          available24h: true
        }
      ]
    },
    'IN': {
      countryCode: 'IN',
      services: [
        {
          code: 'police',
          name: 'Police',
          nameEn: 'Police',
          number: '100',
          description: 'Police emergency',
          available24h: true
        },
        {
          code: 'fire',
          name: 'Fire Service',
          nameEn: 'Fire Service',
          number: '101',
          description: 'Fire emergency',
          available24h: true
        },
        {
          code: 'ambulance',
          name: 'Ambulance',
          nameEn: 'Ambulance',
          number: '102',
          description: 'Medical emergency',
          available24h: true
        }
      ]
    },

    // Australia and Oceania
    'AU': {
      countryCode: 'AU',
      services: [
        {
          code: 'general',
          name: 'Emergency Services',
          nameEn: 'Emergency Services',
          number: '000',
          description: 'Police, Fire, Ambulance',
          available24h: true
        }
      ]
    },
    'NZ': {
      countryCode: 'NZ',
      services: [
        {
          code: 'general',
          name: 'Emergency Services',
          nameEn: 'Emergency Services',
          number: '111',
          description: 'Police, Fire, Ambulance',
          available24h: true
        }
      ]
    }
  };

  /**
   * Get emergency number for country and service type
   */
  getEmergencyNumber(countryCode: string, serviceType: string = 'general'): string {
    const contact = this.EMERGENCY_CONTACTS[countryCode.toUpperCase()];
    if (!contact) {
      return '112'; // Default European standard
    }

    const service = contact.services.find(s => s.code === serviceType);
    return service?.number || contact.services[0]?.number || '112';
  }

  /**
   * Get all emergency services for a country
   */
  getEmergencyServices(countryCode: string): EmergencyService[] {
    const contact = this.EMERGENCY_CONTACTS[countryCode.toUpperCase()];
    return contact?.services || [];
  }

  /**
   * Call emergency service
   */
  async callEmergencyService(countryCode: string, serviceType: string = 'general'): Promise<void> {
    try {
      const emergencyNumber = this.getEmergencyNumber(countryCode, serviceType);
      const phoneUrl = `tel:${emergencyNumber}`;
      
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        throw new Error('Cannot make phone call');
      }
    } catch (error) {
      console.error('Error calling emergency service:', error);
      throw error;
    }
  }

  /**
   * Get country code by device location
   */
  async getCountryCodeByLocation(): Promise<string> {
    try {
      // In a real app, you would use:
      // 1. expo-localization for device locale
      // 2. User's saved country from settings
      // 3. GPS coordinates (if internet available)
      
      // For now, return default - can be configured in app settings
      return 'RU'; // Default to Russia
    } catch (error) {
      console.error('Error getting device country:', error);
      return 'RU';
    }
  }

  /**
   * Validate emergency number format
   */
  validateEmergencyNumber(number: string): boolean {
    // Basic validation - emergency numbers are usually 2-4 digits
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length >= 2 && cleanNumber.length <= 5;
  }

  /**
   * Get emergency contact for country
   */
  getEmergencyContact(countryCode: string): EmergencyContact | null {
    return this.EMERGENCY_CONTACTS[countryCode.toUpperCase()] || null;
  }

  /**
   * Get all available country codes
   */
  getAvailableCountries(): string[] {
    return Object.keys(this.EMERGENCY_CONTACTS);
  }
}

// Default instance for backward compatibility
export const emergencyNumbers = new EmergencyNumbersHelper();

// Legacy function exports for smooth migration
export const getEmergencyNumber = (countryCode: string) => emergencyNumbers.getEmergencyNumber(countryCode);
export const callEmergencyService = (countryCode?: string) => emergencyNumbers.callEmergencyService(countryCode || 'RU');
export const getCountryCodeByLocation = () => emergencyNumbers.getCountryCodeByLocation();
