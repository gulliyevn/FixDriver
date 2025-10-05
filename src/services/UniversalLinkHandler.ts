// Unused imports removed

export interface RouteParams {
  o: string; // origin: "lat,lon"
  d: string; // destination: "lat,lon"
  w?: string; // waypoints: "lat1,lon1|lat2,lon2"
  t?: string; // travel mode: "driving", "walking", etc.
}

// parseCoordinate helper removed as unused

// Unused function removed

export const UniversalLinkHandler = {
  handleIncomingUrl(url: string): void {
    // navigation.navigate('OrdersMapScreen', { routePoints: points });
  },
};

export default UniversalLinkHandler;
