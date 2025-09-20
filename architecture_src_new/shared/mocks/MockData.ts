/**
 * 🎯 MOCK DATA MANAGER
 * 
 * Centralized access to all mock data. Easy to replace with gRPC calls later.
 */

import { User, Driver, Order, Vehicle, Location, FlexibleScheduleData, CustomizedScheduleData, Country, EmergencyService, CarBrand, CarModel, UserRole, ClientProfile, DriverProfile, AdminProfile, Child, PaymentMethod, VehicleInfo, DocumentInfo } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export default class MockData {
  // 👥 USERS - Dynamic array that can be modified
  private static _users: User[] | null = null;

  static get users(): User[] {
    if (!this._users) {
      this._users = [...require('./data/users').default];
    }
    return this._users;
  }

  static getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  static addUser(user: User): void {
    if (!this._users) {
      this._users = [...require('./data/users').default];
    }
    this._users.push(user);
    console.log('👤 User added to MockData:', user.id);
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      console.log('🔍 MockData.getCurrentUser() called');
      
      // Try to get from AsyncStorage first (for "remember me" functionality)
      const currentUserData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      console.log('📱 AsyncStorage data:', currentUserData ? 'found' : 'not found');
      
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        console.log('👤 Parsed user from AsyncStorage:', {
          id: user?.id,
          name: user?.name,
          surname: user?.surname,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName
        });
        
        // Verify user still exists in mock data
        const existingUser = this.users.find(u => u.id === user.id);
        if (existingUser) {
          console.log('✅ User found in mock data:', existingUser.id);
          return existingUser;
        } else {
          console.log('❌ User not found in mock data, adding to MockData');
          // Add user from AsyncStorage to MockData.users
          this.addUser(user);
          return user;
        }
      }
      
      // Fallback to first user if no stored user (for development)
      const fallbackUser = this.users[0] || null;
      console.log('🔄 Using fallback user:', fallbackUser?.id || 'none');
      return fallbackUser;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  }

  static async setCurrentUser(user: User | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  // 🚗 DRIVERS
  static get drivers(): Driver[] {
    return require('./data/drivers').default;
  }

  static getDriverById(id: string): Driver | undefined {
    return this.drivers.find(driver => driver.id === id);
  }

  static getNearbyDrivers(location: Location, radius: number = 5000): Driver[] {
    // Mock implementation - in real app this would be gRPC call
    return this.drivers.filter(driver => {
      const distance = this.calculateDistance(location, driver.currentLocation);
      return distance <= radius;
    });
  }

  // 📦 ORDERS
  static get orders(): Order[] {
    return require('./data/orders').default;
  }

  static getOrderById(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  static getOrdersByUserId(userId: string): Order[] {
    return this.orders.filter(order => 
      order.userId === userId || order.driverId === userId
    );
  }

  // 🚙 VEHICLES
  static get vehicles(): Vehicle[] {
    return require('./data/vehicles').default;
  }

  static getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find(vehicle => vehicle.id === id);
  }

  // 📍 LOCATIONS
  static get locations(): Location[] {
    return require('./data/locations').default;
  }

  static getLocationById(id: string): Location | undefined {
    return this.locations.find(location => location.id === id);
  }

  // 🧮 UTILITY METHODS
  private static calculateDistance(loc1: Location, loc2: Location): number {
    // Simple distance calculation (Haversine formula would be better)
    const latDiff = loc1.latitude - loc2.latitude;
    const lngDiff = loc1.longitude - loc2.longitude;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000; // Rough meters
  }

  // 🔄 REFRESH DATA (for testing)
  static refresh(): void {
    // In real app, this would trigger gRPC refresh
    console.log('🔄 Mock data refreshed');
  }

  // 📅 SCHEDULE DATA
  static getFlexibleSchedule(): FlexibleScheduleData | null {
    // Mock flexible schedule data - in real app this would come from gRPC
    return {
      selectedDays: ['monday', 'wednesday', 'friday'],
      selectedTime: '09:00',
      returnTime: '18:00',
      isReturnTrip: true,
      customizedDays: {
        monday: { there: '08:30', back: '17:30' },
        wednesday: { there: '09:00', back: '18:00' },
        friday: { there: '08:00', back: '16:00' }
      },
      timestamp: new Date().toISOString()
    };
  }

  static getCustomizedSchedule(): CustomizedScheduleData | null {
    // Mock customized schedule data - in real app this would come from gRPC
    return {
      monday: { there: '08:30', back: '17:30' },
      wednesday: { there: '09:00', back: '18:00' },
      friday: { there: '08:00', back: '16:00' }
    };
  }

  static clearScheduleData(): void {
    // Mock clear schedule - in real app this would clear gRPC data
    console.log('🧹 Mock schedule data cleared');
  }

  // 🌍 COUNTRY DATA
  static getCountries(): Country[] {
    return [
      {
        code: 'RU',
        name: 'Россия',
        nameEn: 'Russia',
        flag: '🇷🇺',
        dialCode: '+7',
        format: '(###) ###-##-##',
        emergencyNumber: '112',
        currency: 'RUB',
        timezone: 'Europe/Moscow'
      },
      {
        code: 'KZ',
        name: 'Казахстан',
        nameEn: 'Kazakhstan',
        flag: '🇰🇿',
        dialCode: '+7',
        format: '(###) ###-##-##',
        emergencyNumber: '112',
        currency: 'KZT',
        timezone: 'Asia/Almaty'
      },
      {
        code: 'US',
        name: 'США',
        nameEn: 'United States',
        flag: '🇺🇸',
        dialCode: '+1',
        format: '(###) ###-####',
        emergencyNumber: '911',
        currency: 'USD',
        timezone: 'America/New_York'
      }
    ];
  }

  // 🚨 EMERGENCY DATA
  static getEmergencyServices(): EmergencyService[] {
    return [
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
      }
    ];
  }

  // 🚗 DRIVER DATA
  static getCarBrands(): CarBrand[] {
    return [
      {
        label: 'Mercedes-Benz',
        value: 'Mercedes',
        country: 'Germany',
        category: 'Luxury' as any,
        popularModels: ['E-Class', 'S-Class', 'C-Class']
      },
      {
        label: 'BMW',
        value: 'BMW',
        country: 'Germany',
        category: 'Luxury' as any,
        popularModels: ['5 Series', '7 Series', '3 Series']
      },
      {
        label: 'Toyota',
        value: 'Toyota',
        country: 'Japan',
        category: 'Sedan' as any,
        popularModels: ['Camry', 'Corolla', 'Avalon']
      }
    ];
  }

  static getCarModels(): CarModel[] {
    return [
      {
        label: 'E-Class',
        value: 'E-Class',
        brand: 'Mercedes',
        yearFrom: 2016,
        category: 'Luxury' as any,
        tariff: 'Premium' as any,
        features: ['Luxury sedan', 'Advanced safety'],
        priceRange: 'High' as any
      },
      {
        label: 'Camry',
        value: 'Camry',
        brand: 'Toyota',
        yearFrom: 2018,
        category: 'Sedan' as any,
        tariff: 'Plus' as any,
        features: ['Reliable sedan', 'Comfortable ride'],
        priceRange: 'Medium' as any
      }
    ];
  }

  // 👤 USER DATA
  static getUsers(): User[] {
    return [
      {
        id: 'user_1',
        email: 'ivan@example.com',
        firstName: 'Иван',
        lastName: 'Петров',
        phone: '+7 (999) 123-45-67',
        role: 'client' as UserRole,
        avatar: 'https://example.com/avatar1.jpg',
        isVerified: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        profiles: {
          client: {
            balance: 5000,
            rating: 4.8,
            totalTrips: 25,
            children: [
              {
                id: 'child_1',
                name: 'Мария',
                age: 8,
                school: 'Школа №123',
                address: 'ул. Ленина, 10',
                parentId: 'user_1',
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
              }
            ],
            paymentMethods: [
              {
                id: 'pm_1',
                type: 'card',
                last4: '1234',
                brand: 'visa',
                isDefault: true,
                isActive: true,
                expiryMonth: 12,
                expiryYear: 2026,
                cardholderName: 'Иван Петров',
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
              }
            ],
            preferences: {
              language: 'ru',
              notifications: {
                email: true,
                push: true,
                sms: false
              },
              accessibility: {
                wheelchairAccess: false,
                childSeat: true,
                petFriendly: false
              }
            },
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-20T15:30:00Z'
          }
        }
      },
      {
        id: 'user_2',
        email: 'alex@example.com',
        firstName: 'Алексей',
        lastName: 'Сидоров',
        phone: '+7 (999) 987-65-43',
        role: 'driver' as UserRole,
        avatar: 'https://example.com/avatar2.jpg',
        isVerified: true,
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-20T16:00:00Z',
        profiles: {
          driver: {
            licenseNumber: '77AA123456',
            vehicleInfo: {
              id: 'vehicle_1',
              make: 'Mercedes',
              model: 'E-Class',
              year: 2019,
              color: 'Черный',
              licensePlate: 'А123БВ77',
              vin: 'WDDWF4JB0FR123456',
              fuelType: 'gasoline',
              transmission: 'automatic',
              seats: 4,
              features: ['Leather seats', 'Navigation', 'Bluetooth'],
              photos: ['https://example.com/vehicle1.jpg'],
              documents: {
                registration: {
                  id: 'doc_1',
                  type: 'Vehicle Registration',
                  number: '77AA123456',
                  issuedBy: 'ГИБДД Москвы',
                  issuedDate: '2019-03-15',
                  expiryDate: '2029-03-15',
                  isVerified: true,
                  verificationDate: '2019-03-20',
                  documentUrl: 'https://example.com/reg.pdf'
                },
                insurance: {
                  id: 'doc_2',
                  type: 'Insurance',
                  number: 'INS123456',
                  issuedBy: 'Росгосстрах',
                  issuedDate: '2024-01-01',
                  expiryDate: '2025-01-01',
                  isVerified: true,
                  verificationDate: '2024-01-05',
                  documentUrl: 'https://example.com/insurance.pdf'
                }
              },
              maintenance: {
                lastService: '2024-01-15',
                nextService: '2024-07-15',
                mileage: 45000
              }
            },
            rating: 4.9,
            totalTrips: 150,
            isOnline: true,
            currentLocation: {
              latitude: 55.7558,
              longitude: 37.6176,
              address: 'Красная площадь, Москва'
            },
            experience: {
              years: 5,
              totalDistance: 75000,
              completedTrips: 150
            },
            earnings: {
              total: 150000,
              thisMonth: 25000,
              thisWeek: 8000,
              averagePerTrip: 1000
            },
            schedule: {
              workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
              workingHours: {
                start: '08:00',
                end: '20:00'
              },
              isFlexible: true
            },
            documents: {
              license: {
                id: 'doc_3',
                type: 'Driver License',
                number: '77AA123456',
                issuedBy: 'ГИБДД Москвы',
                issuedDate: '2015-06-20',
                expiryDate: '2025-06-20',
                isVerified: true,
                verificationDate: '2015-06-25',
                documentUrl: 'https://example.com/license.pdf'
              }
            },
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-20T16:00:00Z'
          }
        }
      }
    ];
  }

  // 📊 STATISTICS
  static getStats() {
    return {
      totalUsers: this.users.length,
      totalDrivers: this.drivers.length,
      totalOrders: this.orders.length,
      totalVehicles: this.vehicles.length,
      totalLocations: this.locations.length,
      hasScheduleData: !!(this.getFlexibleSchedule() || this.getCustomizedSchedule()),
      totalCountries: this.getCountries().length,
      totalEmergencyServices: this.getEmergencyServices().length,
      totalCarBrands: this.getCarBrands().length,
      totalCarModels: this.getCarModels().length,
      totalNewUsers: this.getUsers().length,
      totalVerifiedUsers: this.getUsers().filter(u => u.isVerified).length,
      totalOnlineDrivers: this.getUsers().filter(u => u.profiles.driver?.isOnline).length,
    };
  }
}
