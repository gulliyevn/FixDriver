import { Location } from '../../../../../../shared/types/common';

export interface OrdersMapState {
  currentLocation?: Location;
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
  setCurrentLocation: (location: Location | undefined) => void;
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
