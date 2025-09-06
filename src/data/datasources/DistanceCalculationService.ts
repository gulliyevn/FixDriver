import { RoutePoint } from '../../presentation/components/MapView/types/map.types';
import { DISTANCE_CONSTANTS } from '../../shared/constants/adaptiveConstants';

export interface IDistanceCalculationService {
  calculateRouteSegment(from: RoutePoint, to: RoutePoint, departureTime?: Date): Promise<DistanceCalculationResult>;
  calculateFullRoute(points: RoutePoint[], departureTime?: Date): Promise<DistanceCalculationResult[]>;
  formatDistance(meters: number): string;
  formatDuration(minutes: number): string;
  syncWithBackend(): Promise<boolean>;
}

export interface DistanceCalculationResult {
  distanceMeters: number;
  durationMinutes: number;
  trafficLevel: 'low' | 'medium' | 'high';
  estimatedTime: string; // format "HH:MM"
}

export class DistanceCalculationService {
  
  /**
   * Calculate distance and time between two points
   */
  static async calculateRouteSegment(
    from: RoutePoint,
    to: RoutePoint,
    departureTime?: Date
  ): Promise<DistanceCalculationResult> {
    try {
      console.log('🗺️ Using OSRM for route calculation');
      
      // Using OSRM API (free, no key required)
      const coordinates = `${from.coordinate.longitude},${from.coordinate.latitude};${to.coordinate.longitude},${to.coordinate.latitude}`;
      const url = `${DISTANCE_CONSTANTS.APIS.OSRM}/${coordinates}?overview=false&steps=false`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`OpenRouteService error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.routes || !data.routes[0]) {
        throw new Error('No route found');
      }

      const route = data.routes[0];
      const distanceMeters = route.distance;
      const durationSeconds = route.duration;
      const durationMinutes = Math.ceil(durationSeconds / 60);
      
      console.log('📊 OSRM result:', {
        distanceKm: (distanceMeters / 1000).toFixed(2),
        durationMinutes,
        durationSeconds
      });

      // Calculate estimated arrival time
      const estimatedTime = this.calculateEstimatedTime(departureTime, durationMinutes);

      return {
        distanceMeters,
        durationMinutes,
        trafficLevel: 'medium', // OpenRouteService doesn't provide traffic data
        estimatedTime,
      };
          } catch (error) {
        console.error('OSRM error:', error);
        console.log('⚠️ Using fallback calculation');
        // Fallback to approximate calculations on error
        return this.calculateFallback(from, to);
      }
  }

  /**
   * Calculate distance and time for entire route
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
      
      // For intermediate points use current time + accumulated time
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
   * Fallback calculations without API
   */
  private static calculateFallback(from: RoutePoint, to: RoutePoint): DistanceCalculationResult {
    // Simple distance calculation using haversine formula
    const lat1 = from.coordinate.latitude * Math.PI / 180;
    const lat2 = to.coordinate.latitude * Math.PI / 180;
    const deltaLat = (to.coordinate.latitude - from.coordinate.latitude) * Math.PI / 180;
    const deltaLon = (to.coordinate.longitude - from.coordinate.longitude) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceMeters = DISTANCE_CONSTANTS.CALCULATION.EARTH_RADIUS_METERS * c;

    // More realistic travel time for city
    // Consider that real road distance is greater than direct distance
    const roadDistanceMultiplier = DISTANCE_CONSTANTS.CALCULATION.ROAD_DISTANCE_MULTIPLIER;
    const averageSpeedKmh = DISTANCE_CONSTANTS.CALCULATION.AVERAGE_SPEED_KMH;
    
    const roadDistanceKm = (distanceMeters / 1000) * roadDistanceMultiplier;
    const durationMinutes = Math.ceil(roadDistanceKm / averageSpeedKmh * 60);
    
    // Add randomness to simulate traffic and traffic lights
    const trafficVariation = DISTANCE_CONSTANTS.CALCULATION.TRAFFIC_VARIATION_MIN + Math.random() * (DISTANCE_CONSTANTS.CALCULATION.TRAFFIC_VARIATION_MAX - DISTANCE_CONSTANTS.CALCULATION.TRAFFIC_VARIATION_MIN);
    const finalDurationMinutes = Math.ceil(durationMinutes * trafficVariation);

    console.log('🚗 Fallback calculation:', {
      directDistanceKm: (distanceMeters / 1000).toFixed(2),
      roadDistanceKm: roadDistanceKm.toFixed(2),
      averageSpeedKmh,
      baseDurationMinutes: durationMinutes,
      finalDurationMinutes,
      trafficVariation: trafficVariation.toFixed(2),
      formula: `${roadDistanceKm.toFixed(2)} km ÷ ${averageSpeedKmh} km/h × 60 = ${durationMinutes} min`,
    });

    return {
      distanceMeters: Math.round(distanceMeters * roadDistanceMultiplier),
      durationMinutes: finalDurationMinutes,
      trafficLevel: 'medium',
      estimatedTime: this.calculateEstimatedTime(new Date(), finalDurationMinutes),
    };
  }

  /**
   * Determine traffic level
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
   * Calculate estimated arrival time
   */
  private static calculateEstimatedTime(departureTime: Date | undefined, durationMinutes: number): string {
    const now = departureTime || new Date();
    const arrivalTime = new Date(now.getTime() + durationMinutes * 60 * 1000);
    
    const hours = arrivalTime.getHours().toString().padStart(2, '0');
    const minutes = arrivalTime.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  /**
   * Format distance for display
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}м`;
    }
    return `${(meters / 1000).toFixed(1)}км`;
  }

  /**
   * Format duration for display
   */
  static formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}мин`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}ч ${remainingMinutes}мин` : `${hours}ч`;
  }

  /**
   * Sync distance calculation data with backend via gRPC
   * TODO: Implement real gRPC call
   */
  static async syncWithBackend(): Promise<boolean> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Distance calculation data synced with backend');
      return true;
    } catch (error) {
      console.error('Failed to sync distance calculation data:', error);
      return false;
    }
  }
}
