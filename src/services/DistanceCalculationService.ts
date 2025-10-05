import { RoutePoint } from "../components/MapView/types/map.types";

export interface DistanceCalculationResult {
  distanceMeters?: number;
  durationMinutes?: number;
  trafficLevel?: "low" | "medium" | "high";
  estimatedTime?: string; // формат "HH:MM"
  distance?: number;
  duration?: number;
  error?: string;
}

export class DistanceCalculationService {
  private static readonly OSRM_API_URL =
    "https://router.project-osrm.org/route/v1/driving";

  /**
   * Рассчитать расстояние и время между двумя точками
   */
  static async calculateRouteSegment(
    from: RoutePoint,
    to: RoutePoint,
    departureTime?: Date,
  ): Promise<DistanceCalculationResult> {
    try {
      // Используем OSRM API (бесплатный, без ключа)
      const coordinates = `${from.coordinate.longitude},${from.coordinate.latitude};${to.coordinate.longitude},${to.coordinate.latitude}`;
      const url = `${this.OSRM_API_URL}/${coordinates}?overview=false&steps=false`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(`OpenRouteService error: ${response.status}`);
        return {
          distance: 0,
          duration: 0,
          error: `OpenRouteService error: ${response.status}`,
        };
      }

      const data = await response.json();

      if (!data.routes || !data.routes[0]) {
        console.error("No route found");
        return {
          distance: 0,
          duration: 0,
          error: "No route found",
        };
      }

      const route = data.routes[0];
      const distanceMeters = route.distance;
      const durationSeconds = route.duration;
      const durationMinutes = Math.ceil(durationSeconds / 60);

      console.log("📊 OSRM результат:", {
        distanceKm: (distanceMeters / 1000).toFixed(2),
        durationMinutes,
        durationSeconds,
      });

      // Рассчитываем примерное время прибытия
      const estimatedTime = this.calculateEstimatedTime(
        departureTime,
        durationMinutes,
      );

      return {
        distanceMeters,
        durationMinutes,
        trafficLevel: "medium", // OpenRouteService не предоставляет данные о пробках
        estimatedTime,
      };
    } catch (error) {
      // Fallback на примерные расчеты при ошибке
      return this.calculateFallback(from, to);
    }
  }

  /**
   * Рассчитать расстояние и время для всего маршрута
   */
  static async calculateFullRoute(
    points: RoutePoint[],
    departureTime?: Date,
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
        const accumulatedMinutes = results.reduce(
          (sum, result) => sum + (result.durationMinutes || 0),
          0,
        );
        segmentDepartureTime = new Date(
          segmentDepartureTime.getTime() + accumulatedMinutes * 60 * 1000,
        );
      }

      const result = await this.calculateRouteSegment(
        from,
        to,
        segmentDepartureTime,
      );
      results.push(result);
    }

    return results;
  }

  /**
   * Fallback расчеты без API
   */
  private static calculateFallback(
    from: RoutePoint,
    to: RoutePoint,
  ): DistanceCalculationResult {
    // Простой расчет расстояния по формуле гаверсинуса
    const lat1 = (from.coordinate.latitude * Math.PI) / 180;
    const lat2 = (to.coordinate.latitude * Math.PI) / 180;
    const deltaLat =
      ((to.coordinate.latitude - from.coordinate.latitude) * Math.PI) / 180;
    const deltaLon =
      ((to.coordinate.longitude - from.coordinate.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceMeters = 6371000 * c; // Радиус Земли в метрах

    // Более реалистичное время в пути для города
    // Учитываем, что реальное расстояние по дорогам больше прямого
    const roadDistanceMultiplier = 1.3; // +30% к прямому расстоянию
    const averageSpeedKmh = 25; // Средняя скорость в городе 25 км/ч

    const roadDistanceKm = (distanceMeters / 1000) * roadDistanceMultiplier;
    const durationMinutes = Math.ceil((roadDistanceKm / averageSpeedKmh) * 60);

    // Добавляем случайность для имитации трафика и светофоров
    const trafficVariation = 0.9 + Math.random() * 0.4; // +10% до +50%
    const finalDurationMinutes = Math.ceil(durationMinutes * trafficVariation);

    console.log("🚗 Fallback расчет:", {
      directDistanceKm: (distanceMeters / 1000).toFixed(2),
      roadDistanceKm: roadDistanceKm.toFixed(2),
      averageSpeedKmh,
      baseDurationMinutes: durationMinutes,
      finalDurationMinutes,
      trafficVariation: trafficVariation.toFixed(2),
      formula: `${roadDistanceKm.toFixed(2)} км ÷ ${averageSpeedKmh} км/ч × 60 = ${durationMinutes} мин`,
    });

    return {
      distanceMeters: Math.round(distanceMeters * roadDistanceMultiplier),
      durationMinutes: finalDurationMinutes,
      trafficLevel: "medium",
      estimatedTime: this.calculateEstimatedTime(
        new Date(),
        finalDurationMinutes,
      ),
    };
  }

  /**
   * Определить уровень трафика
   */
  private static determineTrafficLevel(
    durationInTraffic?: number,
    duration?: number,
  ): "low" | "medium" | "high" {
    if (!durationInTraffic || !duration) {
      return "medium";
    }

    const ratio = durationInTraffic / duration;

    if (ratio < 1.2) return "low";
    if (ratio < 1.5) return "medium";
    return "high";
  }

  /**
   * Рассчитать примерное время прибытия
   */
  private static calculateEstimatedTime(
    departureTime: Date | undefined,
    durationMinutes: number,
  ): string {
    const now = departureTime || new Date();
    const arrivalTime = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const hours = arrivalTime.getHours().toString().padStart(2, "0");
    const minutes = arrivalTime.getMinutes().toString().padStart(2, "0");

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
    return remainingMinutes > 0
      ? `${hours}ч ${remainingMinutes}мин`
      : `${hours}ч`;
  }
}
