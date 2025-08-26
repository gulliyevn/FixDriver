import { RoutePoint } from '../components/MapView/types/map.types';

export interface DistanceCalculationResult {
  distanceMeters: number;
  durationMinutes: number;
  trafficLevel: 'low' | 'medium' | 'high';
  estimatedTime: string; // формат "HH:MM"
}

export class DistanceCalculationService {
  private static readonly API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  /**
   * Рассчитать расстояние и время между двумя точками
   */
  static async calculateRouteSegment(
    from: RoutePoint,
    to: RoutePoint,
    departureTime?: Date
  ): Promise<DistanceCalculationResult> {
    if (!this.API_KEY) {
      // Fallback на примерные расчеты если нет API ключа
      return this.calculateFallback(from, to);
    }

    try {
      const origin = `${from.coordinate.latitude},${from.coordinate.longitude}`;
      const destination = `${to.coordinate.latitude},${to.coordinate.longitude}`;
      
      let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&traffic_model=best_guess&key=${this.API_KEY}`;
      
      // Добавляем время отправления если указано
      if (departureTime) {
        const departureTimeSec = Math.floor(departureTime.getTime() / 1000);
        url += `&departure_time=${departureTimeSec}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.routes?.length) {
        throw new Error(`Google Maps API error: ${data.status}`);
      }

      const route = data.routes[0];
      const leg = route.legs[0];
      
      const distanceMeters = leg.distance.value;
      const durationMinutes = Math.ceil((leg.duration_in_traffic?.value || leg.duration.value) / 60);
      
      // Определяем уровень трафика
      const trafficLevel = this.determineTrafficLevel(leg.duration_in_traffic?.value, leg.duration.value);
      
      // Рассчитываем примерное время прибытия
      const estimatedTime = this.calculateEstimatedTime(departureTime, durationMinutes);

      return {
        distanceMeters,
        durationMinutes,
        trafficLevel,
        estimatedTime,
      };
    } catch (error) {
      console.error('Distance calculation error:', error);
      // Fallback на примерные расчеты при ошибке
      return this.calculateFallback(from, to);
    }
  }

  /**
   * Рассчитать расстояние и время для всего маршрута
   */
  static async calculateFullRoute(
    points: RoutePoint[],
    departureTime?: Date
  ): Promise<DistanceCalculationResult[]> {
    if (points.length < 2) {
      return [];
    }

    const results: DistanceCalculationResult[] = [];
    
    for (let i = 0; i < points.length - 1; i++) {
      const from = points[i];
      const to = points[i + 1];
      
      // Для промежуточных точек используем текущее время + накопленное время
      let segmentDepartureTime = departureTime;
      if (segmentDepartureTime && i > 0) {
        const accumulatedMinutes = results.reduce((sum, result) => sum + result.durationMinutes, 0);
        segmentDepartureTime = new Date(segmentDepartureTime.getTime() + accumulatedMinutes * 60 * 1000);
      }
      
      const result = await this.calculateRouteSegment(from, to, segmentDepartureTime);
      results.push(result);
    }

    return results;
  }

  /**
   * Fallback расчеты без API
   */
  private static calculateFallback(from: RoutePoint, to: RoutePoint): DistanceCalculationResult {
    // Простой расчет расстояния по формуле гаверсинуса
    const lat1 = from.coordinate.latitude * Math.PI / 180;
    const lat2 = to.coordinate.latitude * Math.PI / 180;
    const deltaLat = (to.coordinate.latitude - from.coordinate.latitude) * Math.PI / 180;
    const deltaLon = (to.coordinate.longitude - from.coordinate.longitude) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceMeters = 6371000 * c; // Радиус Земли в метрах

    // Примерное время в пути (50 км/ч в среднем)
    const durationMinutes = Math.ceil(distanceMeters / 1000 / 50 * 60);
    
    // Добавляем случайность для имитации трафика
    const trafficVariation = 0.8 + Math.random() * 0.4; // ±20%
    const finalDurationMinutes = Math.ceil(durationMinutes * trafficVariation);

    return {
      distanceMeters: Math.round(distanceMeters),
      durationMinutes: finalDurationMinutes,
      trafficLevel: 'medium',
      estimatedTime: this.calculateEstimatedTime(new Date(), finalDurationMinutes),
    };
  }

  /**
   * Определить уровень трафика
   */
  private static determineTrafficLevel(
    durationInTraffic?: number,
    duration?: number
  ): 'low' | 'medium' | 'high' {
    if (!durationInTraffic || !duration) {
      return 'medium';
    }

    const ratio = durationInTraffic / duration;
    
    if (ratio < 1.2) return 'low';
    if (ratio < 1.5) return 'medium';
    return 'high';
  }

  /**
   * Рассчитать примерное время прибытия
   */
  private static calculateEstimatedTime(departureTime: Date | undefined, durationMinutes: number): string {
    const now = departureTime || new Date();
    const arrivalTime = new Date(now.getTime() + durationMinutes * 60 * 1000);
    
    const hours = arrivalTime.getHours().toString().padStart(2, '0');
    const minutes = arrivalTime.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  /**
   * Форматировать расстояние для отображения
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}м`;
    }
    return `${(meters / 1000).toFixed(1)}км`;
  }

  /**
   * Форматировать время для отображения
   */
  static formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}мин`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}ч ${remainingMinutes}мин` : `${hours}ч`;
  }
}
