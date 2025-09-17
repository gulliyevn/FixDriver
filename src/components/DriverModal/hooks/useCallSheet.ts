import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { Linking } from 'react-native';
import { DriverModalActions } from '../types/driver-modal.types';
import { mockDrivers } from '../../../mocks/data/users';
import { getSampleDriverId } from '../../../mocks/driverModalMock';

export const useCallSheet = (actions: DriverModalActions) => {
  const callAnim = useRef(new Animated.Value(0)).current;
  const driverId = getSampleDriverId();
  const driver = mockDrivers.find((d) => d.id === driverId) ?? mockDrivers[0];

  const openCallSheet = useCallback(() => {
    actions.setCallSheetOpen(true);
    Animated.timing(callAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [callAnim, actions]);

  const closeCallSheet = useCallback(() => {
    Animated.timing(callAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => actions.setCallSheetOpen(false));
  }, [callAnim, actions]);

  const handleNetworkCall = useCallback(() => {
    try {
      Linking.openURL(`tel:${driver.phone_number}`);
    } finally {
      closeCallSheet();
    }
  }, [closeCallSheet, driver.phone_number]);

  const handleInternetCall = useCallback(() => {
    closeCallSheet();
    // Здесь можно добавить логику для интернет-звонка
  }, [closeCallSheet]);

  return {
    callAnim,
    driver,
    openCallSheet,
    closeCallSheet,
    handleNetworkCall,
    handleInternetCall,
  };
};
