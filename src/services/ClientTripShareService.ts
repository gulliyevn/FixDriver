import { Share } from "react-native";
import type { ShareRoutePoint } from "./ShareRouteService";

const formatCoord = (
  p: ShareRoutePoint | { latitude: number; longitude: number },
) => {
  const lat = "coordinate" in p ? p.coordinate.latitude : p.latitude;
  const lon = "coordinate" in p ? p.coordinate.longitude : p.longitude;
  return `${lat},${lon}`;
};

// const FIXDRIVE_DOMAIN = 'https://fixdrive.app';
const FIXDRIVE_DOMAIN = "https://example.com"; // Временный домен для разработки

const buildFixDriveUrl = (points: ShareRoutePoint[]) => {
  const origin = formatCoord(points[0]);
  const destination = formatCoord(points[points.length - 1]);
  const waypoints = points.slice(1, -1).map(formatCoord).join("|");

  const params = new URLSearchParams({
    o: origin,
    d: destination,
    ...(waypoints && { w: waypoints }),
    t: "driving", // travel mode
  });

  return `${FIXDRIVE_DOMAIN}/route?${params.toString()}`;
};

// Fallback на Google Maps если приложение не установлено
const buildGoogleWebUrl = (points: ShareRoutePoint[]) => {
  const origin = formatCoord(points[0]);
  const destination = formatCoord(points[points.length - 1]);
  const waypoints = points.slice(1, -1).map(formatCoord).join("|");

  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ""}&travelmode=driving`;
};

const hasSufficientRoute = (
  points: ShareRoutePoint[] | undefined | null,
): points is ShareRoutePoint[] => {
  if (!points || points.length < 2) return false;
  return points.every(
    (p) =>
      typeof p?.coordinate?.latitude === "number" &&
      typeof p?.coordinate?.longitude === "number",
  );
};

const ClientTripShareService = {
  async share(points: ShareRoutePoint[]): Promise<void> {
    if (!hasSufficientRoute(points)) {
      return;
    }

    const fixDriveUrl = buildFixDriveUrl(points);
    const fallbackUrl = buildGoogleWebUrl(points);

    // const isAppInstalled = await checkAppInstalled();
    // const shareUrl = isAppInstalled ? fixDriveUrl : fallbackUrl;
    const shareUrl = fixDriveUrl; // Пока используем FixDrive URL

    try {
      await Share.share({
        url: shareUrl,
        message: `Маршрут: ${shareUrl}`,
        title: "Поделиться маршрутом",
      });
    } catch {
      // noop
    }
  },
};

export default ClientTripShareService;
