import { useState, useEffect } from 'react';
import { MapService } from '../../../../../data/datasources/grpc/MapService';
import { Location } from '../../../../../shared/types/common';
import { OrdersMapState, OrdersMapActions } from '../types/orders-map.types';

export const useOrdersMapState = (): [OrdersMapState, OrdersMapActions] => {
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  const [driverVisibilityTrigger, setDriverVisibilityTrigger] = useState(0);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClientLocationActive, setIsClientLocationActive] = useState(false);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportComment, setReportComment] = useState('');
  const [isSimpleDialogVisible, setIsSimpleDialogVisible] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  // Инициализация текущей локации
  useEffect(() => {
    let isMounted = true;
    MapService.getCurrentLocationWithRetry(3).then((loc) => {
      if (isMounted) setCurrentLocation(loc);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const state: OrdersMapState = {
    currentLocation,
    isExpanded,
    driverVisibilityTrigger,
    mapRefreshKey,
    isRefreshing,
    isClientLocationActive,
    isDriverModalVisible,
    isReportModalVisible,
    reportComment,
    isSimpleDialogVisible,
    mapType,
    isSettingsExpanded,
  };

  const actions: OrdersMapActions = {
    setCurrentLocation,
    setIsExpanded,
    setDriverVisibilityTrigger,
    setMapRefreshKey,
    setIsRefreshing,
    setIsClientLocationActive,
    setIsDriverModalVisible,
    setIsReportModalVisible,
    setReportComment,
    setIsSimpleDialogVisible,
    setMapType,
    setIsSettingsExpanded,
  };

  return [state, actions];
};
