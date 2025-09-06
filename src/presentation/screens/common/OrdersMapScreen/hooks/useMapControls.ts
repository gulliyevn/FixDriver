import { useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { MapService } from '../../../../services/MapService';
import { OrdersMapState, OrdersMapActions, MapControlHandlers } from '../types/orders-map.types';
import { callEmergencyService, getCountryCodeByLocation } from '../../../../utils/emergencyNumbers';
import { useLanguage } from '../../../../context/LanguageContext';

export const useMapControls = (
  state: OrdersMapState,
  actions: OrdersMapActions
): MapControlHandlers & { mapRef: React.RefObject<any> } => {
  const mapRef = useRef<any>(null);
  const isZoomingRef = useRef(false);
  const { t } = useLanguage();

  const handleChevronPress = useCallback(() => {
    actions.setIsDriverModalVisible(true);
  }, [actions]);

  const handleDriverModalClose = useCallback(() => {
    actions.setIsDriverModalVisible(false);
  }, [actions]);

  const handleReportPress = useCallback(() => {
    actions.setIsReportModalVisible(true);
  }, [actions]);

  const handleReportSubmit = useCallback(() => {
    // Здесь можно добавить логику отправки репорта на сервер
    actions.setIsReportModalVisible(false);
    actions.setReportComment('');
    Alert.alert('Успех', 'Репорт отправлен');
  }, [state.reportComment, actions]);

  const handleReportCancel = useCallback(() => {
    actions.setIsReportModalVisible(false);
    actions.setReportComment('');
  }, [actions]);

  const handleSimpleDialogYes = useCallback(async () => {
    actions.setIsSimpleDialogVisible(false);
    
    try {
      // Получаем код страны (в реальном приложении здесь будет определение по геолокации)
      const countryCode = await getCountryCodeByLocation();
      
      // Совершаем звонок в экстренную службу
      await callEmergencyService(countryCode);
    } catch (error) {
      console.error('Ошибка при звонке в экстренную службу:', error);
      Alert.alert(
        t('common.error'),
        t('common.emergency.error')
      );
    }
  }, [actions]);

  const handleSimpleDialogNo = useCallback(() => {
    actions.setIsSimpleDialogVisible(false);
  }, [actions]);

  const handleLayersPress = useCallback(() => {
    const mapTypes: Array<'standard' | 'satellite' | 'hybrid'> = ['standard', 'satellite', 'hybrid'];
    const currentIndex = mapTypes.indexOf(state.mapType);
    const nextIndex = (currentIndex + 1) % mapTypes.length;
    actions.setMapType(mapTypes[nextIndex]);
  }, [state.mapType, actions]);

  const handleZoomIn = useCallback(() => {
    if (isZoomingRef.current) {
      return;
    }
    
    isZoomingRef.current = true;
    
    if (mapRef.current && mapRef.current.zoomIn) {
      mapRef.current.zoomIn();
    }
    
    setTimeout(() => {
      isZoomingRef.current = false;
    }, 650);
  }, [mapRef]);

  const handleZoomOut = useCallback(() => {
    if (isZoomingRef.current) {
      return;
    }
    
    isZoomingRef.current = true;
    
    if (mapRef.current && mapRef.current.zoomOut) {
      mapRef.current.zoomOut();
    }
    
    setTimeout(() => {
      isZoomingRef.current = false;
    }, 650);
  }, [mapRef]);

  const handleRefreshMap = useCallback(async () => {
    if (state.isRefreshing) return;
    
    actions.setIsRefreshing(true);
    
    try {
      const newLocation = await MapService.getCurrentLocationWithRetry(3);
      if (newLocation) {
        actions.setCurrentLocation(newLocation);
      }
      
      actions.setDriverVisibilityTrigger(state.driverVisibilityTrigger + 1);
      actions.setMapRefreshKey(state.mapRefreshKey + 1);
      
      if (state.isSettingsExpanded) {
        actions.setIsSettingsExpanded(false);
      }
      
    } catch (error) {
      console.error('Error refreshing map:', error);
    } finally {
      actions.setIsRefreshing(false);
    }
  }, [state.isRefreshing, state.isSettingsExpanded, actions]);

  const handleDriverVisibilityToggle = useCallback((timestamp: number) => {
    actions.setDriverVisibilityTrigger(timestamp);
  }, [actions]);

  const handleLocatePress = useCallback(async () => {
    try {
      const location = await MapService.getCurrentLocationWithRetry(3);
      if (location) {
        actions.setCurrentLocation(location);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Ошибка', 'Не удалось получить текущее местоположение');
    }
  }, [actions]);

  const handleClientLocationToggle = useCallback(async () => {
    try {
      if (!state.isClientLocationActive) {
        const location = await MapService.getCurrentLocationWithRetry(3);
        if (location) {
          actions.setIsClientLocationActive(true);
          actions.setCurrentLocation(location);
        }
      } else {
        actions.setIsClientLocationActive(false);
      }
    } catch (error) {
      console.error('Error toggling client location:', error);
      Alert.alert('Ошибка', 'Не удалось обновить локацию');
    }
  }, [state.isClientLocationActive, actions]);

  const handleSettingsPress = useCallback(() => {
    actions.setIsSettingsExpanded(!state.isSettingsExpanded);
  }, [state.isSettingsExpanded, actions]);

  return {
    handleChevronPress,
    handleDriverModalClose,
    handleReportPress,
    handleReportSubmit,
    handleReportCancel,
    handleSimpleDialogYes,
    handleSimpleDialogNo,
    handleLayersPress,
    handleZoomIn,
    handleZoomOut,
    handleSettingsPress,
    handleRefreshMap,
    handleDriverVisibilityToggle,
    handleLocatePress,
    handleClientLocationToggle,
    mapRef,
  };
};
