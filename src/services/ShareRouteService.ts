import { Platform, Linking, ActionSheetIOS, Alert } from 'react-native';

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

export const ShareRouteService = {
  hasSufficientRoute(points: ShareRoutePoint[] | undefined | null): boolean {
    if (!points || points.length < 2) return false;
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
      const clientOrder = [
        { key: 'google', title: 'Google Maps', url: urls.googleApp },
        { key: 'yandexMaps', title: 'Yandex Maps', url: urls.yandexMaps },
        { key: 'waze', title: 'Waze', url: urls.waze },
        { key: 'yandexNavi', title: 'Yandex Navigator', url: urls.yandexNavi },
      ];
      const driverOrder = [
        { key: 'yandexNavi', title: 'Yandex Navigator', url: urls.yandexNavi },
        { key: 'yandexMaps', title: 'Yandex Maps', url: urls.yandexMaps },
        { key: 'google', title: 'Google Maps', url: urls.googleApp },
        { key: 'waze', title: 'Waze', url: urls.waze },
      ];
      const candidates = role === 'driver' ? driverOrder : clientOrder;

      const availability = await Promise.all(candidates.map(c => checkInstalled(c.url)));
      availability.forEach((isAvailable, idx) => {
        if (isAvailable) options.push(candidates[idx]);
      });

      // Если ничего нет — веб Google
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
          title: 'Открыть маршрут в',
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

    // Android: проверяем доступность в порядке роли
    const order = role === 'driver'
      ? [urls.yandexNavi, urls.yandexMaps, urls.googleApp, urls.waze]
      : [urls.googleApp, urls.yandexMaps, urls.waze, urls.yandexNavi];

    for (const appUrl of order) {
      const available = await checkInstalled(appUrl);
      if (available) {
        await Linking.openURL(appUrl);
        return;
      }
    }

    // Fallback: системный выбор
    try {
      await Linking.openURL(urls.androidGeoChooser);
    } catch {
      await Linking.openURL(urls.googleWeb);
    }
  },
};

export default ShareRouteService;


