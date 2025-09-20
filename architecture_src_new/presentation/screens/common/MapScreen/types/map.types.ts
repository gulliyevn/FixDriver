import { Location } from '../../../../../shared/types/user';

export interface MapMarker {
  id: string;
  coordinate: Location;
  title: string;
  description?: string;
  type?: 'driver' | 'client' | 'destination' | 'start' | 'waypoint' | 'end';
  label?: string;
  colorHex?: string;
  onPress?: (marker: MapMarker) => void;
}

export interface RoutePoint {
  id: string;
  coordinate: Location;
  type: 'start' | 'waypoint' | 'end';
  plannedArrivalAtMs?: number;
}

export interface MapViewComponentProps {
  initialLocation?: Location;
  onLocationSelect?: (location: Location) => void;
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

export interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: number;
}

export interface MapState {
  currentLocation?: MapLocation;
  isExpanded: boolean;
  driverVisibilityTrigger: number;
  mapRefreshKey: number;
  isRefreshing: boolean;
  isClientLocationActive: boolean;
  isDriverModalVisible: boolean;
  isReportModalVisible: boolean;
  reportComment: string;
  isSimpleDialogVisible: boolean;
  mapType: 'standard' | 'satellite' | 'hybrid';
  isSettingsExpanded: boolean;
  markers: any[];
  routePoints: any[];
}

export interface MapActions {
  setCurrentLocation: (location: MapLocation | undefined) => void;
  setIsExpanded: (expanded: boolean) => void;
  setDriverVisibilityTrigger: (trigger: number) => void;
  setMapRefreshKey: (key: number) => void;
  setIsRefreshing: (refreshing: boolean) => void;
  setIsClientLocationActive: (active: boolean) => void;
  setIsDriverModalVisible: (visible: boolean) => void;
  setIsReportModalVisible: (visible: boolean) => void;
  setReportComment: (comment: string) => void;
  setIsSimpleDialogVisible: (visible: boolean) => void;
  setMapType: (type: 'standard' | 'satellite' | 'hybrid') => void;
  setIsSettingsExpanded: (expanded: boolean) => void;
  setMarkers: (markers: any[]) => void;
  setRoutePoints: (points: any[]) => void;
}
