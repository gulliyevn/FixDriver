import apiClient, { APIResponse } from './APIClient';
import {
  Driver,
  DriverRegistrationData,
  DriverRegistrationResponse,
  DriverUpdateData,
  DriverDocumentUpdateData,
  DriverStats,
  DriverLocation,
  DriverFilters,
  DriverSort,
  DriverStatus,
} from '../types/driver';
import { ENV_CONFIG } from '../config/environment';

export interface DriverListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  favoritesOnly?: boolean;
  onlineOnly?: boolean;
}

export interface DriverListDto {
  items: Driver[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DriverTrip {
  text: string;
  time: string;
  dotStyle: 'default' | 'blue' | 'location';
}

export interface DriverProfileResponse extends Driver {
  schedule?: string;
  price?: string;
  distance?: string;
  time?: string;
  client?: {
    name: string;
    childName: string;
    childAge: number;
    childType: string;
  };
}

class DriverService {
  private static BASE_URL = ENV_CONFIG.API.BASE_URL;

  // Пагинированный список водителей
  static async getDriversPaged(params: DriverListParams): Promise<APIResponse<DriverListDto>> {
    return apiClient.get<DriverListDto>('/drivers', params as Record<string, unknown>);
  }

  // Регистрация водителя
  static async registerDriver(data: DriverRegistrationData): Promise<DriverRegistrationResponse> {
    try {
      // Валидация обязательных полей
      const requiredFields = ['email', 'password', 'license_number', 'license_expiry_date', 'vehicle_number'];
      for (const field of requiredFields) {
        if (!data[field as keyof DriverRegistrationData]) {
          throw new Error(`Поле ${field} обязательно для заполнения`);
        }
      }

      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Некорректный email адрес');
      }

      // Валидация даты истечения прав
      const expiryDate = new Date(data.license_expiry_date);
      const today = new Date();
      if (expiryDate <= today) {
        throw new Error('Срок действия водительских прав истек');
      }

      // Валидация года выпуска автомобиля
      if (data.vehicle_year) {
        const currentYear = new Date().getFullYear();
        if (data.vehicle_year < 1900 || data.vehicle_year > currentYear + 1) {
          throw new Error('Некорректный год выпуска автомобиля');
        }
      }

      const response = await fetch(`${this.BASE_URL}/drivers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка при регистрации');
      }

      return result;
    } catch (error) {
      console.error('Driver registration error:', error);
      
      // В режиме разработки возвращаем мок данные
      if (__DEV__) {
        return this.mockDriverRegistration(data);
      }
      
      throw error;
    }
  }

  // Мок данные для разработки
  private static async mockDriverRegistration(data: DriverRegistrationData): Promise<DriverRegistrationResponse> {
    // Симулируем задержку сети
    return new Promise((resolve) => {
      setTimeout(() => {


        const mockDriver: Driver = {
          id: `driver_${Date.now()}`,
          email: data.email,
          phone_number: data.phone_number,
          first_name: data.first_name,
          last_name: data.last_name,
          license_number: data.license_number,
          license_expiry_date: data.license_expiry_date,
          vehicle_brand: data.vehicle_brand, // Добавлено отдельное поле
          vehicle_model: data.vehicle_model,
          vehicle_number: data.vehicle_number,
          vehicle_year: data.vehicle_year,
          status: DriverStatus.PENDING,
          rating: 0.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isAvailable: false,
        };

        resolve({
          success: true,
          message: 'Регистрация прошла успешно! Ваша заявка на рассмотрении.',
          driver: mockDriver,
          token: 'mock_jwt_token_' + Date.now(),
        });
      }, 1500);
    });
  }

  // Получить профиль водителя
  static async getDriverProfile(driverId: string): Promise<DriverProfileResponse> {
    try {
      const response = await apiClient.get<DriverProfileResponse>(`/drivers/${driverId}`);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load driver profile');
      }

      return response.data;
    } catch (error) {
      if (__DEV__) {
        return this.mockGetDriverProfile(driverId);
      }
      throw error;
    }
  }

  // Обновить профиль водителя
  static async updateDriverProfile(driverId: string, data: DriverUpdateData): Promise<Driver> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/${driverId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении профиля');
      }

      return await response.json();
    } catch (error) {
      if (__DEV__) {
        return this.mockUpdateDriverProfile(driverId, data);
      }
      throw error;
    }
  }

  // Обновить документы водителя
  static async updateDriverDocuments(driverId: string, data: DriverDocumentUpdateData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/${driverId}/documents`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении документов');
      }

      return await response.json();
    } catch (error) {
      if (__DEV__) {
        return {
          success: true,
          message: 'Документы отправлены на проверку администратору',
        };
      }
      throw error;
    }
  }

  // Получить статистику водителя
  static async getDriverStats(driverId: string): Promise<DriverStats> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/${driverId}/stats`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении статистики');
      }

      return await response.json();
    } catch (error) {
      if (__DEV__) {
        return this.mockGetDriverStats();
      }
      throw error;
    }
  }

  // Обновить местоположение водителя
  static async updateDriverLocation(location: Omit<DriverLocation, 'driver_id'>): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении местоположения');
      }
    } catch (error) {
      if (__DEV__) {

        return;
      }
      throw error;
    }
  }

  // Получить список водителей (для админа или клиентского поиска)
  static async getDrivers(filters?: DriverFilters, sort?: DriverSort): Promise<Driver[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      if (sort) {
        params.append('sort_field', sort.field);
        params.append('sort_order', sort.order);
      }

      const response = await fetch(`${this.BASE_URL}/drivers?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении списка водителей');
      }

      return await response.json();
    } catch (error) {
      if (__DEV__) {
        return this.mockGetDrivers();
      }
      throw error;
    }
  }

  // Изменить статус доступности
  static async toggleAvailability(isAvailable: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ is_available: isAvailable }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при изменении статуса');
      }
    } catch (error) {
      if (__DEV__) {

        return;
      }
      throw error;
    }
  }

  static async getDriverTrips(driverId: string): Promise<DriverTrip[]> {
    try {
      const response = await apiClient.get<{ items: DriverTrip[] }>(`/drivers/${driverId}/trips`);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load driver trips');
      }
      return response.data.items;
    } catch (error) {
      if (__DEV__) {
        return this.mockGetDriverTrips(driverId);
      }
      throw error;
    }
  }

  // Утилиты
  private static getToken(): string | null {
    // Здесь должна быть логика получения токена из AsyncStorage
    return 'mock_token';
  }

  // Мок методы для разработки
  private static mockGetDriverProfile(driverId: string): DriverProfileResponse {
    return {
      id: driverId,
      email: 'driver@example.com',
      phone_number: '+7 900 000-00-00',
      first_name: 'Иван',
      last_name: 'Иванов',
      license_number: 'AB1234567',
      license_expiry_date: '2030-01-01',
      vehicle_number: 'A001AA777',
      status: DriverStatus.ACTIVE,
      rating: 4.9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      schedule: '08:00 — 18:00',
      price: '₽1500',
      distance: '5 км',
      time: '30 мин',
      client: {
        name: 'Анна Петрова',
        childName: 'Маша',
        childAge: 8,
        childType: 'VIP',
      },
    };
  }

  private static mockUpdateDriverProfile(driverId: string, data: DriverUpdateData): Driver {
    return {
      ...this.mockGetDriverProfile(driverId),
      ...data,
      updated_at: new Date().toISOString(),
    };
  }

  private static mockGetDriverStats(): DriverStats {
    return {
      total_trips: 245,
      completed_trips: 238,
      cancelled_trips: 7,
      total_earnings: 2450.75,
      average_rating: 4.8,
      total_ratings: 185,
      online_hours_today: 8.5,
      online_hours_week: 42.3,
      online_hours_month: 168.7,
    };
  }

  private static mockGetDrivers(): Driver[] {
    return [
      this.mockGetDriverProfile('driver1'),
      this.mockGetDriverProfile('driver2'),
      this.mockGetDriverProfile('driver3'),
    ];
  }

  private static mockGetDriverTrips(driverId: string): DriverTrip[] {
    return [
      { text: 'Школа', time: '08:30', dotStyle: 'location' },
      { text: 'Музыкальная школа', time: '15:00', dotStyle: 'blue' },
      { text: 'Дом', time: '18:00', dotStyle: 'default' },
    ];
  }
}

export default DriverService;
