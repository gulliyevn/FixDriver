export interface MapLocation {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  id: string;
  coordinate: MapLocation;
  title: string;
  description?: string;
  type?: 'driver' | 'client' | 'destination' | 'start' | 'waypoint' | 'end';
  label?: string;
  colorHex?: string;
  onPress?: (marker: MapMarker) => void;
}

export interface RoutePoint {
  id: string;
  coordinate: MapLocation;
  type: 'start' | 'waypoint' | 'end';
  plannedArrivalAtMs?: number;
}

export interface MapViewComponentProps {
  initialLocation?: MapLocation;
  onLocationSelect?: (location: MapLocation) => void;
  showNearbyDrivers?: boolean;
  onDriverVisibilityToggle?: (timestamp: number) => void;
  role?: 'client' | 'driver';
  clientLocationActive?: boolean;
  isDriverModalVisible?: boolean;
  onDriverModalClose?: () => void;
  mapType?: 'standard' | 'satellite' | 'hybrid';
  markers?: MapMarker[];
  routePoints?: RoutePoint[];
  showTrafficMock?: boolean;
}

export interface MapRef {
  getCamera: () => Promise<any>;
  animateCamera: (camera: any) => void;
  animateToRegion: (region: any, duration?: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
