import { useRef, useEffect, useCallback } from 'react';
import { Animated, Alert } from 'react-native';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { usePackage } from '../../../../context/PackageContext';

/**
 * Hook for Auto Renew Switch animation and logic
 * 
 * Manages animated switch for auto-renewal toggle
 */

export const useAutoRenewSwitch = () => {
  const { t } = useI18n();
  const { subscription, toggleAutoRenew } = usePackage();
  
  // Animation value
  const switchAnimation = useRef(new Animated.Value(0)).current;

  // Initialize animation on load
  useEffect(() => {
    if (subscription?.autoRenew) {
      switchAnimation.setValue(1);
    }
  }, [subscription?.autoRenew, switchAnimation]);

  // Animate switch
  const animateSwitch = useCallback((toValue: number) => {
    Animated.timing(switchAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [switchAnimation]);

  // Handle switch toggle
  const handleSwitchToggle = useCallback(async () => {
    if (!subscription) return;

    // If enabling auto-renewal - enable immediately with animation
    if (!subscription.autoRenew) {
      const newValue = 1;
      animateSwitch(newValue);
      await toggleAutoRenew();
    } else {
      // If disabling - first animation, then dialog
      const newValue = 0;
      animateSwitch(newValue);
      
      Alert.alert(
        t('premium.subscription.disableAutoRenewTitle'),
        t('premium.subscription.disableAutoRenewMessage'),
        [
          {
            text: t('premium.subscription.cancelButton'),
            style: 'cancel',
            onPress: async () => {
              // If cancelled - revert animation back
              const revertValue = 1;
              animateSwitch(revertValue);
            }
          },
          {
            text: t('premium.subscription.disableButton'),
            style: 'destructive',
            onPress: async () => {
              // Confirmed disabling - save state
              await toggleAutoRenew();
            }
          }
        ]
      );
    }
  }, [subscription, animateSwitch, toggleAutoRenew, t]);

  // Check if switch should be visible
  const isSwitchVisible = subscription && subscription.isActive && subscription.packageType !== 'free';

  return {
    switchAnimation,
    isSwitchVisible,
    handleSwitchToggle,
  };
};
