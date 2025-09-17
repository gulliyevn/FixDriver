import { MapLocation } from '../../../../services/MapService';

export interface OrdersMapState {
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
}

export interface OrdersMapActions {
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
}
