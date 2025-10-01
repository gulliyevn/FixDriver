import { useRef, useCallback } from 'react';
import { Animated, Linking } from 'react-native';

import { DriverModalActions } from '../types/driver-modal.types';
import { DriverDetails } from '../../../hooks/driver/useDriverDetails';

export const useCallSheet = (actions: DriverModalActions, driver: DriverDetails['driver']) => {
  const callAnim = useRef(new Animated.Value(0)).current;

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
      Linking.openURL(`tel:${driver.phone}`);
    } finally {
      closeCallSheet();
    }
  }, [closeCallSheet, driver.phone]);

  const handleInternetCall = useCallback(() => {
    closeCallSheet();
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
