import { Linking } from 'react-native';
import type { ShareRoutePoint } from './ShareRouteService';

export interface RouteParams {
  o: string; // origin: "lat,lon"
  d: string; // destination: "lat,lon" 
  w?: string; // waypoints: "lat1,lon1|lat2,lon2"
  t?: string; // travel mode: "driving", "walking", etc.
}

const parseCoordinate = (coordStr: string): { latitude: number; longitude: number } | null => {
  const [lat, lon] = coordStr.split(',').map(Number);
  if (isNaN(lat) || isNaN(lon)) return null;
  return { latitude: lat, longitude: lon };
};

const parseWaypoints = (waypointsStr: string): Array<{ latitude: number; longitude: number }> => {
  return waypointsStr
    .split('|')
    .map(parseCoordinate)
    .filter((coord): coord is { latitude: number; longitude: number } => coord !== null);
};

export const UniversalLinkHandler = {
  /**
   * Парсит URL маршрута и возвращает точки
   * Пример: https://fixdrive.app/route?o=55.75,37.61&d=55.80,37.50&w=55.76,37.62|55.77,37.60&t=driving
   */
  parseRouteUrl(url: string): ShareRoutePoint[] | null {
    try {
      const urlObj = new URL(url);
      if (!urlObj.pathname.includes('/route')) return null;

      const params = new URLSearchParams(urlObj.search);
      const origin = params.get('o');
      const destination = params.get('d');
      const waypoints = params.get('w');
      const travelMode = params.get('t') || 'driving';

      if (!origin || !destination) return null;

      const originCoord = parseCoordinate(origin);
      const destCoord = parseCoordinate(destination);
      
      if (!originCoord || !destCoord) return null;

      const points: ShareRoutePoint[] = [
        {
          id: 'start',
          type: 'start',
          coordinate: originCoord,
        },
      ];

      // Добавляем промежуточные точки
      if (waypoints) {
        const waypointCoords = parseWaypoints(waypoints);
        waypointCoords.forEach((coord, index) => {
          points.push({
            id: `wp${index + 1}`,
            type: 'waypoint',
            coordinate: coord,
          });
        });
      }

      // Добавляем конечную точку
      points.push({
        id: 'end',
        type: 'end',
        coordinate: destCoord,
      });

      return points;
    } catch {
      return null;
    }
  },

  /**
   * Проверяет, является ли URL ссылкой на маршрут FixDrive
   */
  isFixDriveRouteUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('fixdrive') || urlObj.hostname.includes('example.com');
    } catch {
      return false;
    }
  },

  /**
   * Обрабатывает входящую ссылку
   * TODO: В продакшене интегрировать с навигацией приложения
   */
  handleIncomingUrl(url: string): void {
    if (!this.isFixDriveRouteUrl(url)) return;

    const points = this.parseRouteUrl(url);
    if (!points) return;

    // TODO: В продакшене открыть экран карты с маршрутом
    // navigation.navigate('OrdersMapScreen', { routePoints: points });
  },
};

export default UniversalLinkHandler;
