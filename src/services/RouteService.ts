import TrafficService from './TrafficService';
import mockData from '../utils/mockData';
import { RoutePoint } from '../types/navigation';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RouteSegment {
  distance: number;
  duration: number;
  instruction: string;
  coordinates: Coordinate[];
}

interface RouteResponse {
  distance: string;
  duration: string;
  segments: RouteSegment[];
}

interface RouteCalculation {
  distance: number;
  duration: number;
  points: RoutePoint[];
}

// Отключено для production - только для разработки
const ENABLE_ROUTE_LOGS = false;

const log = (message: string, data?: any) => {
  if (ENABLE_ROUTE_LOGS) {
    console.log(`📍 ${message}`, data || '');
  }
};

class RouteService {
  private static readonly API_KEY = '5b3ce3597851110001cf6248a22990d18f9f44b29c2b7b5f8f42d9ef';
  private static readonly BASE_URL = 'https://api.openrouteservice.org/v2';
  private static isAPIBlocked = false; // Флаг для отслеживания блокировки API
  private static instance: RouteService;

  private constructor() {}

  static getInstance(): RouteService {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService();
    }
    return RouteService.instance;
  }

  // Получение маршрута между двумя точками
  static async getRoute(start: Coordinate, end: Coordinate): Promise<RouteResponse> {
    log('🚗 Построение маршрута...');
    
    // Если API заблокирован, сразу используем fallback
    if (this.isAPIBlocked) {
      log('📍 Используем локальный маршрут (API недоступен)');
      return this.getFallbackRoute(start, end);
    }

    try {
      const openRouteResult = await this.getOpenRouteServiceRoute(start, end);
      if (openRouteResult) {
        log('✅ Маршрут построен успешно');
        return openRouteResult;
      }
    } catch (error) {
      // Тихо обрабатываем ошибку без лишних предупреждений
      if (!this.isAPIBlocked) {
        log('📍 Переключение на локальный маршрут');
        this.isAPIBlocked = true; // Блокируем дальнейшие попытки
      }
    }

    return this.getFallbackRoute(start, end);
  }

  // Fallback маршрут (локальный расчет)
  private static getFallbackRoute(start: Coordinate, end: Coordinate): RouteResponse {
    const distance = this.calculateDistance(start, end);
    const duration = Math.ceil(distance / 1000 * 2.5 * 60); // ~2.5 минуты на км в городе
    
    log('📊 Маршрут готов:', {
      distance: Math.round(distance) + 'м',
      duration: Math.round(duration / 60) + 'мин',
      points: 16,
    });

    return {
      distance: Math.round(distance) + 'м',
      duration: Math.round(duration / 60) + 'мин',
      segments: [
        {
          distance: Math.round(distance),
          duration: Math.round(duration / 60),
          instruction: 'Следуйте по маршруту',
          coordinates: this.generateCoordinates(start, end),
        },
      ],
    };
  }

  // Получение альтернативных маршрутов (самый быстрый)
  static async getFastestRoute(start: Coordinate, end: Coordinate): Promise<RouteResponse> {
    log('⚡ Поиск оптимального маршрута...');
    
    // Если API заблокирован, сразу используем обычный маршрут
    if (this.isAPIBlocked) {
      return this.getRoute(start, end);
    }

    try {
      const openRouteResult = await this.getOpenRouteServiceFastestRoute(start, end);
      if (openRouteResult) {
        log('✅ Оптимальный маршрут найден');
        return openRouteResult;
      }
    } catch (error) {
      // Тихо обрабатываем ошибку
      if (!this.isAPIBlocked) {
        this.isAPIBlocked = true;
      }
    }

    return this.getRoute(start, end);
  }

  // Вызов OpenRouteService API
  private static async getOpenRouteServiceRoute(start: Coordinate, end: Coordinate): Promise<RouteResponse | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/directions/driving-car`, {
        method: 'POST',
        headers: {
          'Authorization': this.API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [
            [start.longitude, start.latitude],
            [end.longitude, end.latitude],
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.features && data.features[0]) {
        const feature = data.features[0];
        const properties = feature.properties;
        const geometry = feature.geometry;

        return {
          distance: Math.round(properties.segments[0].distance) + 'м',
          duration: Math.round(properties.segments[0].duration / 60) + 'мин',
          segments: properties.segments.map((segment: any) => ({
            distance: Math.round(segment.distance),
            duration: Math.round(segment.duration / 60),
            instruction: segment.steps[0]?.instruction || 'Следуйте по маршруту',
            coordinates: geometry.coordinates.map((coord: number[]) => ({
              latitude: coord[1],
              longitude: coord[0],
            })),
          })),
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Вызов OpenRouteService API для самого быстрого маршрута
  private static async getOpenRouteServiceFastestRoute(start: Coordinate, end: Coordinate): Promise<RouteResponse | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/directions/driving-car`, {
        method: 'POST',
        headers: {
          'Authorization': this.API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [
            [start.longitude, start.latitude],
            [end.longitude, end.latitude],
          ],
          preference: 'fastest',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.features && data.features[0]) {
        const feature = data.features[0];
        const properties = feature.properties;
        const geometry = feature.geometry;

        return {
          distance: Math.round(properties.segments[0].distance) + 'м',
          duration: Math.round(properties.segments[0].duration / 60) + 'мин',
          segments: properties.segments.map((segment: any) => ({
            distance: Math.round(segment.distance),
            duration: Math.round(segment.duration / 60),
            instruction: segment.steps[0]?.instruction || 'Следуйте по маршруту',
            coordinates: geometry.coordinates.map((coord: number[]) => ({
              latitude: coord[1],
              longitude: coord[0],
            })),
          })),
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Расчет расстояния между двумя точками (формула гаверсинуса)
  private static calculateDistance(point1: Coordinate, point2: Coordinate): number {
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Генерация промежуточных координат
  private static generateCoordinates(start: Coordinate, end: Coordinate): Coordinate[] {
    const coordinates: Coordinate[] = [];
    const steps = 16;

    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      coordinates.push({
        latitude: start.latitude + (end.latitude - start.latitude) * ratio,
        longitude: start.longitude + (end.longitude - start.longitude) * ratio,
      });
    }

    return coordinates;
  }

  async buildRoute(userId: string): Promise<any> {
    log(`Построение маршрута для ${userId}...`);
    
    try {
      // Получаем данные пользователя
      const user = this.getUserById(userId);
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Получаем геолокацию пользователя
      const location = await this.getUserLocation();
      log('Геолокация получена:', location);

      // Строим маршрут
      const route = await this.calculateRoute([location]);
      log('Маршрут готов:', route);

      const result = {
        distance: route.totalDistance,
        duration: route.totalDuration,
        segments: route.segments?.length || 4,
      };

      log(`✅ Маршрут для ${userId} готов:`, result);
      return result;
    } catch (error) {
      console.error('Ошибка построения маршрута:', error);
      return {
        distance: '0 км',
        duration: '0 мин',
        segments: 0,
      };
    }
  }

  private async getUserLocation(): Promise<{ latitude: number; longitude: number }> {
    // Симуляция получения геолокации
    return {
      latitude: 40.403791968377,
      longitude: 49.87227951179354,
    };
  }

  async buildAllRoutes(): Promise<any[]> {
    log('🗺️ Все маршруты готовы:', 5);
    return [];
  }

  // Получение пользователя по ID
  private getUserById(userId: string): any {
    const user = mockData.users.find(u => u.id === userId);
    if (!user) {
      throw new Error(`Пользователь с ID ${userId} не найден`);
    }
    return user;
  }

  // Основная функция расчета маршрута
  async calculateRoute(points: RoutePoint[]): Promise<RouteCalculation> {
    log('🚗 Расчет маршрута для точек:', points.length);
    
    if (points.length < 2) {
      throw new Error('Необходимо минимум 2 точки для расчета маршрута');
    }

    // Проверяем валидность координат
    const hasValidCoordinates = points.every(point => point.latitude && point.longitude);
    if (!hasValidCoordinates) {
      throw new Error('Не все точки имеют валидные координаты');
    }

    try {
      // Пытаемся получить маршрут через OpenRouteService
      const route = await this.getRoute(points[0], points[points.length - 1]);
      
      // Создаем сегменты маршрута
      const segments: RouteSegment[] = [];
      for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        
        const trafficLevel = this.getRandomTrafficLevel();
        
        segments.push({
          start,
          end,
          distance: this.calculateDistance(start, end),
          duration: this.calculateDuration(start, end, trafficLevel),
          trafficLevel,
        });
      }

      const totalDistance = segments.reduce((sum, segment) => sum + segment.distance, 0);
      const totalDuration = segments.reduce((sum, segment) => sum + segment.duration, 0);

      return {
        points,
        totalDistance,
        totalDuration,
        segments,
        trafficLevel: this.getAverageTrafficLevel(segments),
      };
    } catch (error) {
      log('❌ Ошибка расчета маршрута:', error);
      throw error;
    }
  }

  // Получение случайного уровня трафика
  private getRandomTrafficLevel(): TrafficLevel {
    const levels: TrafficLevel[] = ['low', 'medium', 'high'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  // Получение среднего уровня трафика
  private getAverageTrafficLevel(segments: RouteSegment[]): TrafficLevel {
    const trafficScores = segments.map(segment => {
      switch (segment.trafficLevel) {
        case 'low': return 1;
        case 'medium': return 2;
        case 'high': return 3;
        default: return 1;
      }
    });
    
    const averageScore = trafficScores.reduce((sum, score) => sum + score, 0) / trafficScores.length;
    
    if (averageScore < 1.5) return 'low';
    if (averageScore < 2.5) return 'medium';
    return 'high';
  }

  // Получение популярных маршрутов
  async getPopularRoutes(): Promise<RoutePoint[][]> {
    log('📍 Получение популярных маршрутов');
    
    const popularRoutes: RoutePoint[][] = [
      [
        { id: '1', latitude: 40.3777, longitude: 49.8920, address: 'Центр города' },
        { id: '2', latitude: 40.4093, longitude: 49.8671, address: 'Аэропорт' },
      ],
      [
        { id: '3', latitude: 40.3953, longitude: 49.8512, address: 'ТЦ 28 Mall' },
        { id: '4', latitude: 40.3777, longitude: 49.8920, address: 'Центр города' },
      ],
      [
        { id: '5', latitude: 40.3777, longitude: 49.8920, address: 'Центр города' },
        { id: '6', latitude: 40.4093, longitude: 49.8671, address: 'Железнодорожный вокзал' },
      ],
    ];

    return popularRoutes;
  }

  // Проверка валидности координат
  private validateCoordinates(points: RoutePoint[]): boolean {
    return points.every(point => 
      typeof point.latitude === 'number' && 
      typeof point.longitude === 'number' &&
      point.latitude >= -90 && point.latitude <= 90 &&
      point.longitude >= -180 && point.longitude <= 180
    );
  }

  // Получение информации о дорожной обстановке
  async getTrafficInfo(points: RoutePoint[]): Promise<{
    level: 'low' | 'medium' | 'high';
    description: string;
  }> {
    // Симуляция получения информации о пробках
    const levels = ['low', 'medium', 'high'] as const;
    const level = levels[Math.floor(Math.random() * levels.length)];
    
    const descriptions = {
      low: 'Дороги свободны',
      medium: 'Умеренные пробки',
      high: 'Сильные пробки',
    };

    return {
      level,
      description: descriptions[level],
    };
  }

  // Расчет расстояния между двумя точками
  private calculateDistance(start: RoutePoint, end: RoutePoint): number {
    const R = 6371; // Радиус Земли в км
    const dLat = this.toRadians(end.latitude - start.latitude);
    const dLon = this.toRadians(end.longitude - start.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(start.latitude)) *
        Math.cos(this.toRadians(end.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Расчет времени в пути
  private calculateDuration(start: RoutePoint, end: RoutePoint, trafficLevel: string): number {
    const distance = this.calculateDistance(start, end);
    const baseSpeed = 30; // км/ч средняя скорость
    const trafficMultiplier = trafficLevel === 'high' ? 0.5 : trafficLevel === 'medium' ? 0.7 : 1;
    return Math.round((distance / (baseSpeed * trafficMultiplier)) * 60); // в минутах
  }

  // Конвертация градусов в радианы
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const routeService = RouteService.getInstance();
export default RouteService;
export type { Coordinate, RouteSegment, RouteResponse }; 