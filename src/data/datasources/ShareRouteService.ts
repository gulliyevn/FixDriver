import { Platform, Linking, ActionSheetIOS, Alert } from 'react-native';
import { SHARE_ROUTE_CONSTANTS } from '../../shared/constants';

export interface ShareRoutePoint {
  id: string;
  coordinate: { latitude: number; longitude: number };
  type: 'start' | 'waypoint' | 'end';
}

const formatCoord = (p: ShareRoutePoint | { latitude: number; longitude: number }) => {
  const lat = 'coordinate' in p ? p.coordinate.latitude : p.latitude;
  const lon = 'coordinate' in p ? p.coordinate.longitude : p.longitude;
  return `${lat},${lon}`;
};

const buildUrls = (points: ShareRoutePoint[]) => {
  const origin = formatCoord(points[0]);
  const destination = formatCoord(points[points.length - 1]);
  const waypoints = points.slice(1, -1).map(formatCoord).join('|');

  const urls = {
    googleApp: `comgooglemaps://?saddr=${origin}&daddr=${destination}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}&directionsmode=driving`,
    googleWeb: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}&travelmode=driving`,
    yandexMaps: `yandexmaps://maps.yandex.ru/?rtext=${encodeURIComponent(points.map(formatCoord).join('~'))}&rtt=auto`,
    yandexNavi: (() => {
      // Яндекс Навигатор поддерживает только from/to
      return `yandexnavi://build_route_on_map?lat_from=${points[0].coordinate.latitude}&lon_from=${points[0].coordinate.longitude}&lat_to=${points[points.length - 1].coordinate.latitude}&lon_to=${points[points.length - 1].coordinate.longitude}`;
    })(),
    waze: `waze://?ll=${destination}&navigate=yes`,
    androidGeoChooser: `geo:${destination}?q=${destination}`,
  } as const;

  return urls;
};

const checkInstalled = async (url: string) => {
  try {
    return await Linking.canOpenURL(url);
  } catch {
    return false;
  }
};

export interface IShareRouteService {
  hasSufficientRoute(points: ShareRoutePoint[] | undefined | null): boolean;
  open(points: ShareRoutePoint[], role: 'client' | 'driver'): Promise<void>;
  syncWithBackend(): Promise<boolean>;
}

export const ShareRouteService: IShareRouteService = {
  hasSufficientRoute(points: ShareRoutePoint[] | undefined | null): boolean {
    if (!points || points.length < SHARE_ROUTE_CONSTANTS.MIN_POINTS) return false;
    const allValid = points.every(p => typeof p?.coordinate?.latitude === 'number' && typeof p?.coordinate?.longitude === 'number');
    return allValid;
  },

  async open(points: ShareRoutePoint[], role: 'client' | 'driver' = 'client'): Promise<void> {
    if (!this.hasSufficientRoute(points)) {
      return;
    }

    const urls = buildUrls(points);

    if (Platform.OS === 'ios') {
      const options: Array<{ key: string; title: string; url: string }> = [];
      const clientOrder = SHARE_ROUTE_CONSTANTS.IOS.CLIENT_ORDER;
      const driverOrder = SHARE_ROUTE_CONSTANTS.IOS.DRIVER_ORDER;
      const candidates = role === 'driver' ? driverOrder : clientOrder;

      const availability = await Promise.all(candidates.map(c => checkInstalled(c.url)));
      availability.forEach((isAvailable, idx) => {
        if (isAvailable) options.push(candidates[idx]);
      });

      // If nothing available - web Google
      if (options.length === 0) {
        await Linking.openURL(urls.googleWeb);
        return;
      }

      if (options.length === 1) {
        await Linking.openURL(options[0].url);
        return;
      }

      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...options.map(o => o.title), 'Cancel'],
          cancelButtonIndex: options.length,
          title: SHARE_ROUTE_CONSTANTS.IOS.ACTION_SHEET_TITLE,
        },
        async (buttonIndex) => {
          if (buttonIndex === options.length) return;
          const chosen = options[buttonIndex];
          if (!chosen) return;
          try {
            await Linking.openURL(chosen.url);
          } catch {}
        }
      );
      return;
    }

    // Android: check availability in role order
    const order = role === 'driver'
      ? SHARE_ROUTE_CONSTANTS.ANDROID.DRIVER_ORDER.map(key => urls[key])
      : SHARE_ROUTE_CONSTANTS.ANDROID.CLIENT_ORDER.map(key => urls[key]);

    for (const appUrl of order) {
      const available = await checkInstalled(appUrl);
      if (available) {
        await Linking.openURL(appUrl);
        return;
      }
    }

    // Fallback: system chooser
    try {
      await Linking.openURL(urls.androidGeoChooser);
    } catch {
      await Linking.openURL(urls.googleWeb);
    }
  },

  // Sync with backend via gRPC
  async syncWithBackend(): Promise<boolean> {
    // TODO: Implement gRPC call to sync route sharing data with backend
    try {
      console.log('Syncing route sharing data with backend...');
      // Mock implementation - replace with actual gRPC call
      return true;
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      return false;
    }
  },
};

export default ShareRouteService;


