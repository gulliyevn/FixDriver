/**
 * 🔌 MOCK SERVICES MANAGER
 * 
 * Centralized access to all mock services. Easy to replace with gRPC later.
 */

import MockData from './MockData';
import { User, Driver, Order, Location, AuthResult, DriverStatus, OrderStatus, FlexibleScheduleData, CustomizedScheduleData, AllScheduleData, ProfileFormData, PackageType, PackageVisuals, AppLanguage, DateFormat, AuthErrorCode, NetworkErrorCode, ValidationErrorCode, Country, EmergencyService, CarBrand, CarModel } from './types';

export default class MockServices {
  // 🔐 AUTHENTICATION SERVICE
  static auth = {
    async login(email: string, password: string): Promise<AuthResult> {
      // Mock login - in real app this would be gRPC call
      // Note: In real app, password would be validated via gRPC
      // For now, we'll use a simple mock validation
      const user = MockData.users.find(u => u.email === email);
      
      if (user) {
        // Mock password validation - in real app this would be gRPC call
        if (password === 'password123') { // Mock password for testing
          return {
            success: true,
            user,
            token: `mock_token_${user.id}_${Date.now()}`,
          };
        }
      }
      
      throw new Error('Invalid credentials');
    },

    async register(userData: any): Promise<AuthResult> {
      // Mock registration - in real app this would be gRPC call
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        role: userData.role,
        avatar: '',
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profiles: {},
      };

      // In real app, this would be saved to database via gRPC
      console.log('🆕 Mock user registered:', newUser);

      return {
        success: true,
        user: newUser,
        token: `mock_token_${newUser.id}_${Date.now()}`,
      };
    },

    async logout(): Promise<void> {
      // Mock logout - in real app this would clear gRPC session
      console.log('🚪 Mock user logged out');
    },
  };

  // 👥 USER SERVICE
  static users = {
    async getById(id: string): Promise<User | null> {
      return MockData.getUserById(id) || null;
    },

    async getCurrent(): Promise<User | null> {
      return MockData.getCurrentUser();
    },

    async update(id: string, updates: Partial<User>): Promise<User> {
      const user = MockData.getUserById(id);
      if (!user) throw new Error('User not found');
      
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      console.log('✏️ Mock user updated:', updatedUser);
      
      return updatedUser;
    },

    async delete(id: string): Promise<void> {
      console.log('🗑️ Mock user deleted:', id);
    },
  };

  // 🚗 DRIVER SERVICE
  static drivers = {
    async getById(id: string): Promise<Driver | null> {
      return MockData.getDriverById(id) || null;
    },

    async getNearby(location: Location, radius: number = 5000): Promise<Driver[]> {
      return MockData.getNearbyDrivers(location, radius);
    },

    async updateStatus(id: string, status: DriverStatus): Promise<Driver> {
      const driver = MockData.getDriverById(id);
      if (!driver) throw new Error('Driver not found');
      
      const updatedDriver = { ...driver, status, updatedAt: new Date().toISOString() };
      console.log('🚦 Mock driver status updated:', updatedDriver);
      
      return updatedDriver;
    },

    async getEarnings(id: string, period: string): Promise<number> {
      // Mock earnings calculation - in real app this would be gRPC call
      return Math.random() * 1000;
    },
  };

  // 📦 ORDER SERVICE
  static orders = {
    async getById(id: string): Promise<Order | null> {
      return MockData.getOrderById(id) || null;
    },

    async getByUserId(userId: string): Promise<Order[]> {
      return MockData.getOrdersByUserId(userId);
    },

    async create(orderData: Partial<Order>): Promise<Order> {
      const newOrder: Order = {
        id: `order_${Date.now()}`,
        userId: orderData.userId!,
        driverId: orderData.driverId || '',
        pickupLocation: orderData.pickupLocation!,
        dropoffLocation: orderData.dropoffLocation!,
        status: 'pending',
        price: orderData.price || {
          amount: 0,
          currency: 'USD',
          formatted: '$0.00'
        },
        distance: orderData.distance || 0,
        duration: orderData.duration || 0,
        paymentMethod: orderData.paymentMethod || 'card',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('📦 Mock order created:', newOrder);
      return newOrder;
    },

    async updateStatus(id: string, status: OrderStatus): Promise<Order> {
      const order = MockData.getOrderById(id);
      if (!order) throw new Error('Order not found');
      
      const updatedOrder = { ...order, status, updatedAt: new Date().toISOString() };
      console.log('📊 Mock order status updated:', updatedOrder);
      
      return updatedOrder;
    },
  };

  // 🗺️ MAP SERVICE
  static map = {
    async getCurrentLocation(): Promise<Location> {
      // Mock current location - in real app this would be gRPC call
      return {
        id: 'current_location',
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'New York, NY',
        city: 'New York',
        country: 'USA',
      };
    },

    async geocodeAddress(address: string): Promise<Location> {
      // Mock geocoding - in real app this would be gRPC call
      return {
        id: `geocoded_${Date.now()}`,
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
        address,
        city: 'New York',
        country: 'USA',
      };
    },

    async buildRoute(from: Location, to: Location): Promise<Location[]> {
      // Mock route building - in real app this would be gRPC call
      return [from, to];
    },

    async calculateDistance(from: Location, to: Location): Promise<number> {
      // Mock distance calculation - in real app this would be gRPC call
      const latDiff = from.latitude - to.latitude;
      const lngDiff = from.longitude - to.longitude;
      return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000;
    },
  };

  // 📅 SCHEDULE SERVICE
  static schedule = {
    async getFlexibleSchedule(): Promise<FlexibleScheduleData | null> {
      // Mock flexible schedule - in real app this would be gRPC call
      return MockData.getFlexibleSchedule();
    },

    async getCustomizedSchedule(): Promise<CustomizedScheduleData | null> {
      // Mock customized schedule - in real app this would be gRPC call
      return MockData.getCustomizedSchedule();
    },

    async getAllScheduleData(): Promise<AllScheduleData> {
      const flexibleSchedule = await this.getFlexibleSchedule();
      const customizedSchedule = await this.getCustomizedSchedule();
      
      return {
        flexibleSchedule,
        customizedSchedule,
        timestamp: new Date().toISOString()
      };
    },

    async clearScheduleData(): Promise<void> {
      // Mock clear schedule - in real app this would be gRPC call
      MockData.clearScheduleData();
      console.log('🧹 Mock schedule data cleared');
    },
  };

  // 👤 PROFILE SERVICE
  static profile = {
    async getProfile(userId: string): Promise<any> {
      // Mock profile retrieval - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      
      // Return user with extended profile data
      return {
        ...user,
        children: user.role === 'client' ? (user as any).children || [] : undefined,
        paymentMethods: user.role === 'client' ? (user as any).paymentMethods || [] : undefined,
        licenseNumber: user.role === 'driver' ? (user as any).licenseNumber || '' : undefined,
        vehicleNumber: user.role === 'driver' ? (user as any).vehicleNumber || '' : undefined,
        licenseExpiry: user.role === 'driver' ? (user as any).licenseExpiry || '' : undefined,
      };
    },

    async updateProfile(userId: string, updates: any): Promise<any> {
      // Mock profile update - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      // Update user data
      Object.assign(user, updates);
      (user as any).updatedAt = new Date().toISOString();

      return this.getProfile(userId);
    },

    async addChild(userId: string, childData: any): Promise<any> {
      // Mock child addition - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user || user.role !== 'client') throw new Error('User not found or not a client');

      const newChild = {
        id: `child_${Date.now()}`,
        ...childData,
      };

      const children = (user as any).children || [];
      (user as any).children = [...children, newChild];

      return newChild;
    },

    async removeChild(userId: string, childId: string): Promise<void> {
      // Mock child removal - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user || user.role !== 'client') throw new Error('User not found or not a client');

      const children = (user as any).children || [];
      (user as any).children = children.filter((child: any) => child.id !== childId);
    },

    async addPaymentMethod(userId: string, paymentData: any): Promise<any> {
      // Mock payment method addition - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user || user.role !== 'client') throw new Error('User not found or not a client');

      const newPaymentMethod = {
        id: `payment_${Date.now()}`,
        ...paymentData,
      };

      const paymentMethods = (user as any).paymentMethods || [];
      (user as any).paymentMethods = [...paymentMethods, newPaymentMethod];

      return newPaymentMethod;
    },

    async removePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
      // Mock payment method removal - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user || user.role !== 'client') throw new Error('User not found or not a client');

      const paymentMethods = (user as any).paymentMethods || [];
      (user as any).paymentMethods = paymentMethods.filter((payment: any) => payment.id !== paymentMethodId);
    },

    async getDefaultDate(): Promise<string> {
      // Mock default date - in real app this would come from gRPC
      return '2000-11-06';
    },

    async calculateAge(birthDate: string): Promise<number> {
      // Mock age calculation - in real app this would be gRPC call
      const today = new Date();
      const birth = new Date(birthDate);
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    },

    async hasChanges(formData: ProfileFormData, originalData: ProfileFormData): Promise<boolean> {
      // Mock change detection - in real app this would be gRPC call
      return (
        formData.firstName !== originalData.firstName ||
        formData.lastName !== originalData.lastName ||
        formData.phone !== originalData.phone ||
        formData.email !== originalData.email ||
        formData.birthDate !== originalData.birthDate
      );
    },

    async switchRole(targetRole: 'client' | 'driver'): Promise<boolean> {
      // Mock role switching - in real app this would be gRPC call
      console.log(`🔄 Mock role switched to ${targetRole}`);
      return true;
    },
  };

  // 📦 PACKAGE SERVICE
  static packages = {
    async getPackageIcon(type: string): Promise<string> {
      // Mock package icon - in real app this would come from gRPC
      const baseType = type.replace(/_month$|_year$/, '');
      const icons: Record<string, string> = {
        'free': 'leaf',
        'plus': 'shield',
        'premium': 'heart',
        'premiumPlus': 'diamond',
        'single': '🎫',
        'weekly': '📅',
        'monthly': '📆',
        'yearly': '📊'
      };
      return icons[baseType] || icons['free'];
    },

    async getPackageColor(type: string): Promise<string> {
      // Mock package color - in real app this would come from gRPC
      const baseType = type.replace(/_month$|_year$/, '');
      const colors: Record<string, string> = {
        'free': '#10B981',
        'plus': '#3B82F6',
        'premium': '#8B5CF6',
        'premiumPlus': '#F59E0B',
        'single': '#FF6B6B',
        'weekly': '#4ECDC4',
        'monthly': '#45B7D1',
        'yearly': '#96CEB4'
      };
      return colors[baseType] || colors['free'];
    },

    async getPackageLabel(type: string): Promise<string> {
      // Mock package label - in real app this would come from gRPC
      const baseType = type.replace(/_month$|_year$/, '');
      const labels: Record<string, string> = {
        'free': 'БЕСПЛАТНО',
        'plus': 'ПЛЮС',
        'premium': 'ПРЕМИУМ',
        'premiumPlus': 'ПРЕМИУМ+',
        'single': 'ОДИН',
        'weekly': 'НЕДЕЛЯ',
        'monthly': 'МЕСЯЦ',
        'yearly': 'ГОД'
      };
      return labels[baseType] || labels['free'];
    },

    async getPackageVisuals(type: string): Promise<PackageVisuals> {
      // Mock package visuals - in real app this would come from gRPC
      const icon = await this.getPackageIcon(type);
      const color = await this.getPackageColor(type);
      const label = await this.getPackageLabel(type);
      const decoration = 'leaf'; // Default decoration
      const isPremium = ['free', 'plus', 'premium', 'premiumPlus'].includes(type.replace(/_month$|_year$/, ''));
      
      return { icon, color, label, decoration, isPremium };
    },

    async formatPackagePrice(price: number): Promise<string> {
      // Mock price formatting - in real app this would come from gRPC
      if (price === 0) return 'Бесплатно';
      return `${Number(price || 0).toFixed(2)} AFc`;
    },
  };

  // 🔤 FORMATTING SERVICE
  static formatting = {
    async formatTime(date: Date | string, language: AppLanguage = AppLanguage.RUSSIAN): Promise<string> {
      // Mock time formatting - in real app this would come from gRPC
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const localeMap: Record<string, string> = {
        'ru': 'ru-RU', 'en': 'en-US', 'az': 'az-AZ', 'de': 'de-DE',
        'es': 'es-ES', 'fr': 'fr-FR', 'tr': 'tr-TR', 'ar': 'ar-SA'
      };
      const locale = localeMap[language] || 'en-US';
      
      return dateObj.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },

    async formatDate(date: Date | string): Promise<string> {
      // Mock date formatting - in real app this would come from gRPC
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },

    async formatCurrency(amount: number, currency: string = 'USD'): Promise<string> {
      // Mock currency formatting - in real app this would come from gRPC
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(amount);
    },

    async formatPhone(phone: string): Promise<string> {
      // Mock phone formatting - in real app this would come from gRPC
      const cleaned = phone.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
      
      if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
      }
      
      return phone;
    },

    async formatDistance(meters: number): Promise<string> {
      // Mock distance formatting - in real app this would come from gRPC
      if (meters < 1000) {
        return `${Math.round(meters)}m`;
      }
      return `${(meters / 1000).toFixed(1)}km`;
    },

    async formatDuration(minutes: number): Promise<string> {
      // Mock duration formatting - in real app this would come from gRPC
      if (minutes < 60) {
        return `${minutes}min`;
      }
      
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    },

          async formatBalance(balance: number): Promise<string> {
        // Mock balance formatting - in real app this would come from gRPC
        return Number(balance || 0).toFixed(2);
      },
    };

  // 🚨 ERROR HANDLING SERVICE
  static errors = {
    async createError(code: string, message: string, details?: string, retryable?: boolean, action?: string): Promise<any> {
      // Mock error creation - in real app this would come from gRPC
      return {
        code,
        message,
        details,
        retryable,
        action,
      };
    },

    async handleAPIError(error: unknown): Promise<any> {
      // Mock API error handling - in real app this would come from gRPC
      console.log('🚨 Mock API error handled:', error);
      return {
        code: 'MOCK_API_ERROR',
        message: 'Mock API error handled',
        retryable: true,
      };
    },

    async handleAuthError(error: unknown): Promise<any> {
      // Mock auth error handling - in real app this would come from gRPC
      console.log('🔐 Mock auth error handled:', error);
      return {
        code: 'MOCK_AUTH_ERROR',
        message: 'Mock auth error handled',
        retryable: false,
      };
    },

    async handleValidationError(field: string, error: string): Promise<any> {
      // Mock validation error handling - in real app this would come from gRPC
      console.log('✅ Mock validation error handled:', { field, error });
      return {
        code: 'MOCK_VALIDATION_ERROR',
        message: `Error in field "${field}"`,
        details: error,
        retryable: false,
      };
    },

    async getUserFriendlyMessage(errorCode: string): Promise<string> {
      // Mock user-friendly message - in real app this would come from gRPC
      const messages: Record<string, string> = {
        [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
        [NetworkErrorCode.NO_INTERNET]: 'No internet connection',
        [ValidationErrorCode.INVALID_EMAIL]: 'Invalid email',
      };
      return messages[errorCode] || 'Unknown error';
    },
  };

  // 🔄 REFRESH ALL SERVICES
  static refresh(): void {
    MockData.refresh();
    console.log('🔄 All mock services refreshed');
  }

        // 🌍 COUNTRY SERVICE
      static countries = {
        async getAllCountries(): Promise<Country[]> {
          await new Promise(resolve => setTimeout(resolve, 100));
          return MockData.getCountries();
        },
        async getCountryByCode(code: string): Promise<Country | null> {
          await new Promise(resolve => setTimeout(resolve, 50));
          const countries = MockData.getCountries();
          return countries.find(c => c.code === code) || null;
        },
        async getEmergencyNumber(countryCode: string): Promise<string> {
          await new Promise(resolve => setTimeout(resolve, 30));
          const country = MockData.getCountries().find(c => c.code === countryCode);
          return country?.emergencyNumber || '112';
        }
      };

      // 🚨 EMERGENCY SERVICE
      static emergency = {
        async getEmergencyServices(countryCode: string): Promise<EmergencyService[]> {
          await new Promise(resolve => setTimeout(resolve, 100));
          return MockData.getEmergencyServices();
        },
        async getEmergencyNumber(countryCode: string): Promise<string> {
          await new Promise(resolve => setTimeout(resolve, 50));
          const country = MockData.getCountries().find(c => c.code === countryCode);
          return country?.emergencyNumber || '112';
        }
      };

      // 🚗 DRIVER DATA SERVICE
      static driverData = {
        async getCarBrands(): Promise<CarBrand[]> {
          await new Promise(resolve => setTimeout(resolve, 100));
          return MockData.getCarBrands();
        },
        async getCarModelsByBrand(brand: string): Promise<CarModel[]> {
          await new Promise(resolve => setTimeout(resolve, 80));
          return MockData.getCarModels().filter(m => m.brand === brand);
        },
        async getExperienceOptions(): Promise<any[]> {
          await new Promise(resolve => setTimeout(resolve, 50));
          return [
            { label: 'До 1 года', value: '0-1' },
            { label: '1 год', value: '1' },
            { label: '2 года', value: '2' },
            { label: '5 лет', value: '5' },
            { label: '10 лет', value: '10' },
            { label: '20+ лет', value: '20+' }
          ];
        }
      };

      // 🚗 DRIVER MODAL SERVICE
      static driver = {
        getSampleDriverId(): string {
          return 'driver_001';
        },
        getSampleClientId(): string {
          return 'client_001';
        },
        getDriverInfo(driverId: string): any {
          return {
            childName: 'Анна',
            childAge: 8,
            schedule: 'Ежедневно 8:00',
            price: '500 ₽',
            distance: '2.5 км',
            time: '15 мин',
            childType: 'Школьник'
          };
        },
        getDriverTrips(driverId: string): any[] {
          return [
            { id: '1', date: '2024-01-15', time: '08:00', status: 'completed' },
            { id: '2', date: '2024-01-14', time: '08:00', status: 'completed' },
            { id: '3', date: '2024-01-13', time: '08:00', status: 'completed' }
          ];
        },
        getClientName(clientId: string): string {
          return 'Мария Иванова';
        }
      };

      // 🚗 DRIVER STATUS SERVICE
      static driverStatus = {
        async updateStatus(driverId: string, status: string): Promise<void> {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log(`Driver ${driverId} status updated to: ${status}`);
        },
        async getStatus(driverId: string): Promise<string> {
          await new Promise(resolve => setTimeout(resolve, 50));
          return 'online';
        },
        async setOnlineStatus(driverId: string, isOnline: boolean): Promise<void> {
          await new Promise(resolve => setTimeout(resolve, 80));
          console.log(`Driver ${driverId} online status: ${isOnline}`);
        },
        async setOnline(isOnline: boolean): Promise<void> {
          await new Promise(resolve => setTimeout(resolve, 80));
          console.log(`Driver online status: ${isOnline}`);
        }
      };

      // 💰 BILLING SERVICE
      static billing = {
        async processPayment(paymentData: any): Promise<any> {
          await new Promise(resolve => setTimeout(resolve, 200));
          return { success: true, transactionId: `tx_${Date.now()}` };
        },
        async getBillingHistory(userId: string): Promise<any[]> {
          await new Promise(resolve => setTimeout(resolve, 150));
          return [
            { id: '1', amount: 500, date: '2024-01-15', status: 'completed' },
            { id: '2', amount: 300, date: '2024-01-14', status: 'completed' }
          ];
        },
        async calculateFare(tripData: any): Promise<number> {
          await new Promise(resolve => setTimeout(resolve, 100));
          return 500; // Mock fare calculation
        },
        async startEmergency(): Promise<void> {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('Emergency billing started');
        },
        async stopEmergency(): Promise<void> {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('Emergency billing stopped');
        },
        async startWaiting(): Promise<void> {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('Waiting billing started');
        },
        async stopWaiting(): Promise<void> {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('Waiting billing stopped');
        }
      };

      // 👤 USER MANAGEMENT SERVICE
      static userManagement = {
        async getUserById(id: string): Promise<User | null> {
          await new Promise(resolve => setTimeout(resolve, 100));
          return MockData.getUsers().find(u => u.id === id) || null;
        },
        async getUserByEmail(email: string): Promise<User | null> {
          await new Promise(resolve => setTimeout(resolve, 80));
          return MockData.getUsers().find(u => u.email === email) || null;
        },
        async getUsersByRole(role: string): Promise<User[]> {
          await new Promise(resolve => setTimeout(resolve, 120));
          return MockData.getUsers().filter(u => u.role === role);
        },
        async getOnlineDrivers(): Promise<User[]> {
          await new Promise(resolve => setTimeout(resolve, 60));
          return MockData.getUsers().filter(u => u.profiles.driver?.isOnline);
        },
        async searchUsers(query: string): Promise<User[]> {
          await new Promise(resolve => setTimeout(resolve, 150));
          const users = MockData.getUsers();
          return users.filter(u => 
            u.firstName.toLowerCase().includes(query.toLowerCase()) ||
            u.lastName.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
          );
        }
      };

  // 🌐 I18N SERVICE
  static i18n = {
    async getCurrentLanguage(): Promise<'en' | 'ru' | 'az'> {
      // Mock language retrieval - in real app this would be gRPC call
      return 'en'; // Default to English
    },

    async setLanguage(language: 'en' | 'ru' | 'az'): Promise<void> {
      // Mock language setting - in real app this would be gRPC call
      console.log(`Language changed to: ${language}`);
    },

    translate(key: string, params?: Record<string, string | number>, language: 'en' | 'ru' | 'az' = 'en'): string {
      // Mock translation - in real app this would use i18n library
      // For now, return the key as fallback
      if (params) {
        let translation = key;
        Object.entries(params).forEach(([paramKey, value]) => {
          translation = translation.replace(`{{${paramKey}}}`, String(value));
        });
        return translation;
      }
      return key;
    },

    async getAvailableLanguages(): Promise<Array<{ code: string; name: string; nativeName: string; flag: string }>> {
      // Mock available languages - in real app this would be gRPC call
      return [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
        { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿' },
      ];
    },
  };

  // 💰 BALANCE SERVICE
  static balance = {
    async getBalance(userId: string): Promise<number> {
      // Mock balance retrieval - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      return user ? (user as any).balance || 0 : 0;
    },

    async getEarnings(userId: string): Promise<number> {
      // Mock earnings retrieval - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      return user ? (user as any).earnings || 0 : 0;
    },

    async getTransactions(userId: string): Promise<any[]> {
      // Mock transactions retrieval - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      return user ? (user as any).transactions || [] : [];
    },

    async addEarnings(userId: string, amount: number): Promise<{ newBalance: number; newEarnings: number; transactions: any[] }> {
      // Mock earnings addition - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      const currentBalance = (user as any).balance || 0;
      const currentEarnings = (user as any).earnings || 0;
      const currentTransactions = (user as any).transactions || [];

      const newBalance = currentBalance + amount;
      const newEarnings = currentEarnings + amount;

      const newTransaction = {
        id: `tx_${Date.now()}`,
        type: 'payment',
        amount: amount,
        description: `Earnings ${amount} AFc`,
        date: new Date().toISOString(),
      };

      const updatedTransactions = [newTransaction, ...currentTransactions];

      // Update mock data
      (user as any).balance = newBalance;
      (user as any).earnings = newEarnings;
      (user as any).transactions = updatedTransactions;

      return { newBalance, newEarnings, transactions: updatedTransactions };
    },

    async topUpBalance(userId: string, amount: number): Promise<{ newBalance: number; transactions: any[] }> {
      // Mock balance top-up - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      const currentBalance = (user as any).balance || 0;
      const currentTransactions = (user as any).transactions || [];

      const newBalance = currentBalance + amount;

      const newTransaction = {
        id: `tx_${Date.now()}`,
        type: 'topup',
        amount: amount,
        description: `Top-up ${amount} AFc`,
        date: new Date().toISOString(),
      };

      const updatedTransactions = [newTransaction, ...currentTransactions];

      // Update mock data
      (user as any).balance = newBalance;
      (user as any).transactions = updatedTransactions;

      return { newBalance, transactions: updatedTransactions };
    },

    async withdrawBalance(userId: string, amount: number): Promise<{ success: boolean; newBalance?: number; transactions?: any[] }> {
      // Mock balance withdrawal - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      const currentBalance = (user as any).balance || 0;
      const currentTransactions = (user as any).transactions || [];

      if (currentBalance < amount) {
        return { success: false };
      }

      const newBalance = currentBalance - amount;

      const newTransaction = {
        id: `tx_${Date.now()}`,
        type: 'withdrawal',
        amount: -amount,
        description: `Withdrawal ${amount} AFc`,
        date: new Date().toISOString(),
      };

      const updatedTransactions = [newTransaction, ...currentTransactions];

      // Update mock data
      (user as any).balance = newBalance;
      (user as any).transactions = updatedTransactions;

      return { success: true, newBalance, transactions: updatedTransactions };
    },

    async resetBalance(userId: string): Promise<void> {
      // Mock balance reset - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      (user as any).balance = 0;
      (user as any).earnings = 0;
      (user as any).transactions = [];
    },

    async resetEarnings(userId: string): Promise<void> {
      // Mock earnings reset - in real app this would be gRPC call
      const user = MockData.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      (user as any).earnings = 0;
    },
  };

      // 📊 GET SERVICE STATS
      static getStats() {
        return {
          data: MockData.getStats(),
          services: {
            auth: 'Mock Authentication Service',
            users: 'Mock User Service',
            drivers: 'Mock Driver Service',
            orders: 'Mock Order Service',
            map: 'Mock Map Service',
            schedule: 'Mock Schedule Service',
            profile: 'Mock Profile Service',
            packages: 'Mock Package Service',
            formatting: 'Mock Formatting Service',
            errors: 'Mock Error Handling Service',
            countries: 'Mock Country Service',
            emergency: 'Mock Emergency Service',
            driverData: 'Mock Driver Data Service',
            userManagement: 'Mock User Management Service',
            balance: 'Mock Balance Service',
            i18n: 'Mock Internationalization Service',
          },
        };
      }
}
