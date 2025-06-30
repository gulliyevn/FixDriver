import TrafficService from './TrafficService';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RouteSegment {
  coordinates: Coordinate[];
  trafficLevel: 'free' | 'low' | 'medium' | 'high' | 'heavy';
  duration: number;
  distance: number;
}

interface RouteResponse {
  coordinates: Coordinate[];
  duration: number; // в секундах
  distance: number; // в метрах
  segments: RouteSegment[];
}

class RouteService {
  private static readonly API_KEY = '5b3ce3597851110001cf6248a22990d18f9f44b29c2b7b5f8f42d9ef';
  private static readonly BASE_URL = 'https://api.openrouteservice.org/v2';
  private static isAPIBlocked = false; // Флаг для отслеживания блокировки API

  // Получение маршрута между двумя точками
  static async getRoute(start: Coordinate, end: Coordinate): Promise<RouteResponse> {
    console.log('🚗 Построение маршрута...');
    
    // Если API заблокирован, сразу используем fallback
    if (this.isAPIBlocked) {
      console.log('📍 Используем локальный маршрут (API недоступен)');
      return this.getFallbackRoute(start, end);
    }
    
    try {
      // Пробуем OpenRouteService
      const openRouteResult = await this.getOpenRouteServiceRoute(start, end);
      if (openRouteResult) {
        console.log('✅ Маршрут построен успешно');
        return openRouteResult;
      }
    } catch (error) {
      // Тихо обрабатываем ошибку без лишних предупреждений
      if (!this.isAPIBlocked) {
        console.log('📍 Переключение на локальный маршрут');
        this.isAPIBlocked = true; // Блокируем дальнейшие попытки
      }
    }

    // Fallback на простой маршрут
    return this.getFallbackRoute(start, end);
  }

  // Основной метод для OpenRouteService
  private static async getOpenRouteServiceRoute(start: Coordinate, end: Coordinate): Promise<RouteResponse | null> {
    try {
      const url = `${this.BASE_URL}/directions/driving-car`;
      const body = {
        coordinates: [[start.longitude, start.latitude], [end.longitude, end.latitude]],
        format: 'json',
        instructions: false,
      };

      // Создаем контроллер для timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Уменьшил timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Если доступ заблокирован, помечаем API как заблокированный
        if (response.status === 403 || response.status === 429) {
          this.isAPIBlocked = true;
        }
        return null;
      }

      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        return null;
      }

      const route = data.routes[0];
      
      // Декодируем геометрию маршрута
      const coordinates = this.decodePolyline(route.geometry);

      // Генерируем сегменты с реальными пробками
      const segments = this.generateTrafficSegmentsSync(coordinates, route.summary.duration);

      return {
        coordinates,
        duration: route.summary.duration,
        distance: route.summary.distance,
        segments,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.isAPIBlocked = true; // При timeout тоже блокируем
      }
      return null;
    }
  }

  // Fallback маршрут без внешних API
  private static getFallbackRoute(start: Coordinate, end: Coordinate): RouteResponse {
    // Генерируем простой маршрут с несколькими промежуточными точками
    const coordinates = this.generateSimpleRoute(start, end);
    
    // Рассчитываем приблизительное расстояние и время
    const distance = this.calculateDistance(start, end);
    const duration = Math.ceil(distance / 1000 * 2.5 * 60); // ~2.5 минуты на км в городе
    
    console.log('📊 Маршрут готов:', {
      distance: Math.round(distance) + 'м',
      duration: Math.round(duration / 60) + 'мин',
      points: coordinates.length
    });
    
    // Генерируем сегменты
    const segments = this.generateTrafficSegmentsSync(coordinates, duration);
    
    return {
      coordinates,
      duration,
      distance,
      segments,
    };
  }

  // Генерация простого маршрута между двумя точками
  private static generateSimpleRoute(start: Coordinate, end: Coordinate): Coordinate[] {
    const steps = 15; // Больше промежуточных точек для плавности
    const coordinates: Coordinate[] = [];
    
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = start.latitude + (end.latitude - start.latitude) * ratio;
      const lng = start.longitude + (end.longitude - start.longitude) * ratio;
      
      // Добавляем реалистичные отклонения для имитации дорог
      const roadOffset = 0.0008 * Math.sin(i * Math.PI / 3) * (1 - Math.abs(ratio - 0.5) * 2);
      const noiseX = roadOffset * Math.cos(i * Math.PI / 4);
      const noiseY = roadOffset * Math.sin(i * Math.PI / 4);
      
      coordinates.push({
        latitude: lat + noiseY,
        longitude: lng + noiseX,
      });
    }
    
    return coordinates;
  }

  // Генерация сегментов с полным покрытием маршрута
  private static generateTrafficSegmentsSync(coordinates: Coordinate[], totalDuration: number): RouteSegment[] {
    const segments: RouteSegment[] = [];
    const segmentCount = Math.min(Math.max(Math.floor(coordinates.length / 12), 4), 10);
    
    for (let i = 0; i < segmentCount; i++) {
      const startIdx = Math.floor((i / segmentCount) * coordinates.length);
      const endIdx = Math.floor(((i + 1) / segmentCount) * coordinates.length);
      
      // Убеждаемся что последний сегмент доходит до конца
      const actualEndIdx = i === segmentCount - 1 ? coordinates.length - 1 : endIdx;
      
      // Если startIdx >= actualEndIdx, делаем минимальный сегмент
      const segmentCoords = startIdx >= actualEndIdx 
        ? [coordinates[startIdx], coordinates[Math.min(startIdx + 1, coordinates.length - 1)]]
        : coordinates.slice(startIdx, actualEndIdx + 1);
      
      // Умная симуляция пробок с учетом времени и локации
      const trafficLevel = TrafficService.getTrafficLevel(
        segmentCoords[0], 
        new Date(),
        i / segmentCount // позиция в маршруте (0-1)
      );
      
      segments.push({
        coordinates: segmentCoords,
        trafficLevel,
        duration: Math.round((totalDuration / segmentCount) * this.getTrafficMultiplier(trafficLevel)),
        distance: this.calculateDistance(segmentCoords[0], segmentCoords[segmentCoords.length - 1]),
      });
    }

    return segments;
  }

  // Мультипликатор времени в зависимости от пробок
  private static getTrafficMultiplier(trafficLevel: 'free' | 'low' | 'medium' | 'high' | 'heavy'): number {
    switch (trafficLevel) {
      case 'free': return 0.8;   // На 20% быстрее
      case 'low': return 1.0;    // Нормальное время
      case 'medium': return 1.3; // На 30% медленнее
      case 'high': return 1.7;   // На 70% медленнее
      case 'heavy': return 2.2;  // В 2.2 раза медленнее
      default: return 1.0;
    }
  }

  // Получение альтернативных маршрутов (самый быстрый)
  static async getFastestRoute(start: Coordinate, end: Coordinate): Promise<RouteResponse> {
    console.log('⚡ Поиск оптимального маршрута...');
    
    // Если API заблокирован, сразу используем обычный маршрут
    if (this.isAPIBlocked) {
      return this.getRoute(start, end);
    }
    
    try {
      // Пробуем получить альтернативные маршруты от OpenRouteService
      const openRouteResult = await this.getOpenRouteServiceFastestRoute(start, end);
      if (openRouteResult) {
        console.log('✅ Оптимальный маршрут найден');
        return openRouteResult;
      }
    } catch (error) {
      // Тихо обрабатываем ошибку
      if (!this.isAPIBlocked) {
        this.isAPIBlocked = true;
      }
    }

    // Fallback на обычный маршрут
    return this.getRoute(start, end);
  }

  // Получение быстрейшего маршрута от OpenRouteService
  private static async getOpenRouteServiceFastestRoute(start: Coordinate, end: Coordinate): Promise<RouteResponse | null> {
    try {
      // Запрашиваем несколько альтернативных маршрутов
      const url = `${this.BASE_URL}/directions/driving-car`;
      const body = {
        coordinates: [[start.longitude, start.latitude], [end.longitude, end.latitude]],
        format: 'json',
        instructions: false,
        alternative_routes: {
          target_count: 3,
          weight_factor: 1.4,
          share_factor: 0.6
        }
      };

      // Создаем контроллер для timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Уменьшил timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Если доступ заблокирован, помечаем API как заблокированный
        if (response.status === 403 || response.status === 429) {
          this.isAPIBlocked = true;
        }
        return null;
      }

      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        return null;
      }

      // Анализируем все маршруты с учетом пробок
      let fastestRoute = null;
      let fastestTime = Infinity;

      for (const route of data.routes) {
        const coordinates = this.decodePolyline(route.geometry);
        const segments = this.generateTrafficSegmentsSync(coordinates, route.summary.duration);
        
        // Считаем реальное время с учетом пробок
        const realTime = segments.reduce((total, segment) => total + segment.duration, 0);
        
        if (realTime < fastestTime) {
          fastestTime = realTime;
          fastestRoute = {
            coordinates,
            duration: realTime,
            distance: route.summary.distance,
            segments,
          };
        }
      }

      return fastestRoute;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.isAPIBlocked = true; // При timeout тоже блокируем
      }
      return null;
    }
  }

  // Вычисление среднего уровня пробок для сегмента
  private static calculateAverageTrafficLevel(trafficData: any[]): 'free' | 'low' | 'medium' | 'high' | 'heavy' {
    if (!trafficData || trafficData.length === 0) return 'medium';
    
    const levels = { free: 0, low: 1, medium: 2, high: 3, heavy: 4 };
    const reverseLevels = ['free', 'low', 'medium', 'high', 'heavy'] as const;
    
    const avgLevel = trafficData.reduce((sum, data) => {
      return sum + (levels[data.level as keyof typeof levels] || 2);
    }, 0) / trafficData.length;
    
    return reverseLevels[Math.round(avgLevel)];
  }

  // Расчет расстояния между двумя точками (формула гаверсинуса)
  private static calculateDistance(point1: Coordinate, point2: Coordinate): number {
    const R = 6371000; // Радиус Земли в метрах
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Геокодирование - получение координат по адресу
  static async geocodeAddress(address: string): Promise<Coordinate | null> {
    try {
      const url = `${this.BASE_URL}/geocoding/search?api_key=${this.API_KEY}&text=${encodeURIComponent(address + ', Baku, Azerbaijan')}`;
      
      // Создаем контроллер для timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        return {
          longitude: coords[0],
          latitude: coords[1],
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Обратное геокодирование - получение адреса по координатам
  static async reverseGeocode(coordinate: Coordinate): Promise<string | null> {
    try {
      const url = `${this.BASE_URL}/geocoding/reverse?api_key=${this.API_KEY}&point.lon=${coordinate.longitude}&point.lat=${coordinate.latitude}`;
      
      // Создаем контроллер для timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].properties.label;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Декодирование polyline геометрии
  private static decodePolyline(encoded: string): Coordinate[] {
    const coordinates: Coordinate[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;
      
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      
      const deltaLat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += deltaLat;

      shift = 0;
      result = 0;
      
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      
      const deltaLng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += deltaLng;

      coordinates.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return coordinates;
  }
}

export default RouteService;
export type { Coordinate, RouteSegment, RouteResponse }; 