// Типы для MapScreen

export interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: number;
}

export interface RoutePoint {
  id: string;
  type: 'start' | 'waypoint' | 'end';
  coordinate: MapLocation;
  plannedArrivalAtMs?: number;
}

export interface MapMarker {
  id: string;
  coordinate: MapLocation;
  title: string;
  description: string;
  type: 'driver' | 'order' | 'client' | 'route';
  label?: string;
  metadata?: Record<string, any>;
}

export interface MapState {
  currentLocation: MapLocation | undefined;
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
  markers: MapMarker[];
  routePoints: RoutePoint[];
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
  setMarkers: (markers: MapMarker[]) => void;
  setRoutePoints: (points: RoutePoint[]) => void;
}

export interface MapControlHandlers {
  handleChevronPress: () => void;
  handleDriverModalClose: () => void;
  handleReportPress: () => void;
  handleReportSubmit: () => void;
  handleReportCancel: () => void;
  handleSimpleDialogYes: () => void;
  handleSimpleDialogNo: () => void;
  handleLayersPress: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleSettingsPress: () => void;
  handleRefreshMap: () => Promise<void>;
  handleDriverVisibilityToggle: (timestamp: number) => void;
  handleLocatePress: () => Promise<void>;
  handleClientLocationToggle: () => Promise<void>;
  handleSharePress: () => void;
  handleSimpleDialogOpen: () => void;
}

export interface MapViewProps {
  initialLocation?: MapLocation;
  markers?: MapMarker[];
  routePoints?: RoutePoint[];
  role?: 'client' | 'driver';
  clientLocationActive?: boolean;
  isDriverModalVisible?: boolean;
  onDriverModalClose?: () => void;
  mapType?: 'standard' | 'satellite' | 'hybrid';
  onDriverVisibilityToggle?: (timestamp: number) => void;
}

export interface MapControlsProps {
  isDark: boolean;
  isSettingsExpanded: boolean;
  isRefreshing: boolean;
  isClientLocationActive: boolean;
  settingsRotate: any; // Animated.AnimatedInterpolation<string | number>
  settingsPanelWidth: any; // Animated.AnimatedInterpolation<string | number>
  settingsPanelOpacity: any; // Animated.AnimatedInterpolation<string | number>
  onSettingsPress: () => void;
  onRefreshMap: () => void;
  onClientLocationToggle: () => void;
  onReportPress: () => void;
  onLocatePress: () => void;
  onLayersPress: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSimpleDialogOpen: () => void;
  onChevronPress: () => void;
  onSharePress: () => void;
  canShare?: boolean;
}
