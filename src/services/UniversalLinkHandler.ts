import { Linking } from "react-native";
import type { ShareRoutePoint } from "./ShareRouteService";

export interface RouteParams {
  o: string; // origin: "lat,lon"
  d: string; // destination: "lat,lon"
  w?: string; // waypoints: "lat1,lon1|lat2,lon2"
  t?: string; // travel mode: "driving", "walking", etc.
}

const parseCoordinate = (
  coordStr: string,
): { latitude: number; longitude: number } | null => {
  const [lat, lon] = coordStr.split(",").map(Number);
  if (isNaN(lat) || isNaN(lon)) return null;
  return { latitude: lat, longitude: lon };
};

const parseWaypoints = (
  waypointsStr: string,
): Array<{ latitude: number; longitude: number }> => {
  return waypointsStr
    .split("|")
    .map(parseCoordinate)
    .filter(
      (coord): coord is { latitude: number; longitude: number } =>
        coord !== null,
    );
};

export const UniversalLinkHandler = {
  handleIncomingUrl(url: string): void {
    if (!this.isFixDriveRouteUrl(url)) return;

    const points = this.parseRouteUrl(url);
    if (!points) return;

    // navigation.navigate('OrdersMapScreen', { routePoints: points });
  },
};

export default UniversalLinkHandler;
