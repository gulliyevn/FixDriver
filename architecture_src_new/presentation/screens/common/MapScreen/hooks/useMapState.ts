import { useState, useEffect } from 'react';
import { MapState, MapActions, MapLocation } from '../types/map.types';

// Моковый сервис для получения локации (потом заменим на реальный)
const getCurrentLocation = async (): Promise<MapLocation | undefined> => {
  // Имитируем получение текущей локации
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        latitude: 55.7558, // Москва
        longitude: 37.6176,
        address: 'Москва, Россия',
        timestamp: Date.now(),
      });
    }, 1000);
  });
};

export const useMapState = (): [MapState, MapActions] => {
  const [currentLocation, setCurrentLocation] = useState<MapLocation | undefined>(undefined);
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
  const [markers, setMarkers] = useState<any[]>([]);
  const [routePoints, setRoutePoints] = useState<any[]>([]);

  // Инициализация текущей локации
  useEffect(() => {
    let isMounted = true;
    
    const initLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (isMounted) {
          setCurrentLocation(location);
        }
      } catch (error) {
        console.error('Failed to get current location:', error);
      }
    };

    initLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const state: MapState = {
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
    markers,
    routePoints,
  };

  const actions: MapActions = {
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
    setMarkers,
    setRoutePoints,
  };

  return [state, actions];
};
