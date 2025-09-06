import { Share } from 'react-native';
import type { ShareRoutePoint } from './ShareRouteService';
import { SHARE_CONSTANTS } from '../../shared/constants/adaptiveConstants';

export interface IClientTripShareService {
  share(points: ShareRoutePoint[]): Promise<void>;
  syncWithBackend(): Promise<boolean>;
}

const formatCoord = (p: ShareRoutePoint | { latitude: number; longitude: number }) => {
  const lat = 'coordinate' in p ? p.coordinate.latitude : p.latitude;
  const lon = 'coordinate' in p ? p.coordinate.longitude : p.longitude;
  return `${lat},${lon}`;
};

// TODO: Replace with real domain in production

const buildFixDriveUrl = (points: ShareRoutePoint[]) => {
  const origin = formatCoord(points[0]);
  const destination = formatCoord(points[points.length - 1]);
  const waypoints = points.slice(1, -1).map(formatCoord).join('|');

  const params = new URLSearchParams({
    o: origin,
    d: destination,
    ...(waypoints && { w: waypoints }),
    t: 'driving', // travel mode
  });

  return `${SHARE_CONSTANTS.DOMAINS.FIXDRIVE}/route?${params.toString()}`;
};

// Fallback to Google Maps if app is not installed
const buildGoogleWebUrl = (points: ShareRoutePoint[]) => {
  const origin = formatCoord(points[0]);
  const destination = formatCoord(points[points.length - 1]);
  const waypoints = points.slice(1, -1).map(formatCoord).join('|');

  return `${SHARE_CONSTANTS.DOMAINS.GOOGLE_MAPS}/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}&travelmode=driving`;
};

const hasSufficientRoute = (points: ShareRoutePoint[] | undefined | null): points is ShareRoutePoint[] => {
  if (!points || points.length < 2) return false;
  return points.every(p => typeof p?.coordinate?.latitude === 'number' && typeof p?.coordinate?.longitude === 'number');
};

const ClientTripShareService: IClientTripShareService = {
  async share(points: ShareRoutePoint[]): Promise<void> {
    if (!hasSufficientRoute(points)) {
      return;
    }

    const fixDriveUrl = buildFixDriveUrl(points);
    const fallbackUrl = buildGoogleWebUrl(points);

    // TODO: Add app installation check in production
    // const isAppInstalled = await checkAppInstalled();
    // const shareUrl = isAppInstalled ? fixDriveUrl : fallbackUrl;
    const shareUrl = fixDriveUrl; // For now use FixDrive URL

    try {
      await Share.share({
        url: shareUrl,
        message: `${SHARE_CONSTANTS.MESSAGES.ROUTE}: ${shareUrl}`,
        title: SHARE_CONSTANTS.MESSAGES.SHARE_ROUTE,
      });
    } catch {
      // noop
    }
  },

  /**
   * Sync share data with backend via gRPC
   * TODO: Implement real gRPC call
   */
  async syncWithBackend(): Promise<boolean> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Share data synced with backend');
      return true;
    } catch (error) {
      console.error('Failed to sync share data:', error);
      return false;
    }
  },
};

export default ClientTripShareService;


