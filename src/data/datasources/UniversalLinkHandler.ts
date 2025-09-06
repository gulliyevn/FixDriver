import { Linking } from 'react-native';
import type { ShareRoutePoint } from './ShareRouteService';
import { UNIVERSAL_LINK_CONSTANTS } from '../../shared/constants';

export interface RouteParams {
  o: string; // origin: "lat,lon"
  d: string; // destination: "lat,lon" 
  w?: string; // waypoints: "lat1,lon1|lat2,lon2"
  t?: string; // travel mode: "driving", "walking", etc.
}

export interface IUniversalLinkHandler {
  parseRouteUrl(url: string): ShareRoutePoint[] | null;
  isFixDriveRouteUrl(url: string): boolean;
  handleIncomingUrl(url: string): void;
  syncWithBackend(): Promise<boolean>;
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

export const UniversalLinkHandler: IUniversalLinkHandler = {
  /**
   * Parse route URL and return points
   * Example: https://fixdrive.app/route?o=55.75,37.61&d=55.80,37.50&w=55.76,37.62|55.77,37.60&t=driving
   */
  parseRouteUrl(url: string): ShareRoutePoint[] | null {
    try {
      const urlObj = new URL(url);
      if (!urlObj.pathname.includes(UNIVERSAL_LINK_CONSTANTS.ROUTE_PATH)) return null;

      const params = new URLSearchParams(urlObj.search);
      const origin = params.get(UNIVERSAL_LINK_CONSTANTS.PARAMS.ORIGIN);
      const destination = params.get(UNIVERSAL_LINK_CONSTANTS.PARAMS.DESTINATION);
      const waypoints = params.get(UNIVERSAL_LINK_CONSTANTS.PARAMS.WAYPOINTS);
      const travelMode = params.get(UNIVERSAL_LINK_CONSTANTS.PARAMS.TRAVEL_MODE) || UNIVERSAL_LINK_CONSTANTS.DEFAULT_TRAVEL_MODE;

      if (!origin || !destination) return null;

      const originCoord = parseCoordinate(origin);
      const destCoord = parseCoordinate(destination);
      
      if (!originCoord || !destCoord) return null;

      const points: ShareRoutePoint[] = [
        {
          id: UNIVERSAL_LINK_CONSTANTS.POINT_IDS.START,
          type: 'start',
          coordinate: originCoord,
        },
      ];

      // Add intermediate points
      if (waypoints) {
        const waypointCoords = parseWaypoints(waypoints);
        waypointCoords.forEach((coord, index) => {
          points.push({
            id: `${UNIVERSAL_LINK_CONSTANTS.POINT_IDS.WAYPOINT_PREFIX}${index + 1}`,
            type: 'waypoint',
            coordinate: coord,
          });
        });
      }

      // Add end point
      points.push({
        id: UNIVERSAL_LINK_CONSTANTS.POINT_IDS.END,
        type: 'end',
        coordinate: destCoord,
      });

      return points;
    } catch {
      return null;
    }
  },

  /**
   * Check if URL is a FixDrive route link
   */
  isFixDriveRouteUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return UNIVERSAL_LINK_CONSTANTS.VALID_HOSTNAMES.some(hostname => 
        urlObj.hostname.includes(hostname)
      );
    } catch {
      return false;
    }
  },

  /**
   * Handle incoming URL
   * TODO: In production integrate with app navigation
   */
  handleIncomingUrl(url: string): void {
    if (!this.isFixDriveRouteUrl(url)) return;

    const points = this.parseRouteUrl(url);
    if (!points) return;

    // TODO: In production open map screen with route
    // navigation.navigate('OrdersMapScreen', { routePoints: points });
    console.log('Received route:', points);
  },

  /**
   * Sync with backend via gRPC
   */
  async syncWithBackend(): Promise<boolean> {
    // TODO: Implement gRPC call to sync universal link data with backend
    try {
      console.log('Syncing universal link data with backend...');
      // Mock implementation - replace with actual gRPC call
      return true;
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      return false;
    }
  },
};

export default UniversalLinkHandler;
