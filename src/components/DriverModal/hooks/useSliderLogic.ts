import { useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { DriverModalState, DriverModalActions, SliderConfig } from '../types/driver-modal.types';

export const useSliderLogic = (
  state: DriverModalState,
  actions: DriverModalActions
) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const handleSwipeAnim = useRef(new Animated.Value(0)).current;
  const driverExpandAnim = useRef(new Animated.Value(0)).current;

  const SLIDER_BUTTON_SIZE = 60;
  const SLIDER_PADDING = 4;
  const maxSlideDistance = Math.max(0, state.sliderWidth - SLIDER_BUTTON_SIZE - SLIDER_PADDING * 2);
  const completeThreshold = maxSlideDistance * 0.95;

  const sliderConfig: SliderConfig = {
    SLIDER_BUTTON_SIZE,
    SLIDER_PADDING,
    maxSlideDistance,
    completeThreshold,
  };

  // Слушатель для отслеживания прогресса свайпа
  useEffect(() => {
    const listener = slideAnim.addListener(({ value }) => {
      actions.setSlideProgress(value);
    });
    return () => slideAnim.removeListener(listener);
  }, [slideAnim, actions]);

  const resetSlider = useCallback(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [slideAnim]);

  const completeSwipe = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -maxSlideDistance,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.delay(100),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      })
    ]).start();

    if (state.buttonColorState === 0) {
      actions.setShowDialog1(true);
    } else if (state.buttonColorState === 1) {
      // Если кнопка изменена (красная), показать диалог отмены
      if (state.isButtonsSwapped) {
        actions.setShowDialogCancel(true);
      } else {
        actions.setShowDialog2(true);
      }
    } else if (state.buttonColorState === 2) {
      // Если кнопка изменена (красная), показать диалог отмены
      if (state.isButtonsSwapped) {
        actions.setShowDialogCancel(true);
      } else {
        actions.setShowDialogEmpty(true);
      }
    } else if (state.buttonColorState === 3) {
      actions.setShowDialog3(true);
    } else if (state.buttonColorState === 4) {
      if (state.isPaused) {
        actions.setShowContinueDialog(true);
      } else {
        actions.setShowLongPressDialog(true);
      }
    }
  }, [slideAnim, maxSlideDistance, state.buttonColorState, state.isPaused, state.isButtonsSwapped, actions]);

  const onHandlerStateChange = useCallback((event: any) => {
    const { state: gestureState, translationX } = event.nativeEvent;
    
    if (gestureState === State.END || gestureState === State.CANCELLED || gestureState === State.FAILED) {
      const slideDistance = Math.abs(translationX);
      
      if (slideDistance >= completeThreshold && translationX < 0) {
        completeSwipe();
      } else {
        resetSlider();
      }
    }
  }, [completeThreshold, completeSwipe, resetSlider]);

  const onHandleStateChange = useCallback((event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY } = event.nativeEvent;
      
      // Если свайп меньше 5px - считаем это кликом
      if (Math.abs(translationY) < 5) {
        // Клик - переключаем состояние
        actions.setIsDriverExpanded(!state.isDriverExpanded);
      } else if (translationY < -20 && !state.isDriverExpanded) {
        // Свайп вверх - раскрываем
        actions.setIsDriverExpanded(true);
      } else if (translationY > 20 && state.isDriverExpanded) {
        // Свайп вниз - сворачиваем
        actions.setIsDriverExpanded(false);
      }
      
      Animated.spring(handleSwipeAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [state.isDriverExpanded, actions, handleSwipeAnim]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: slideAnim } }],
    { useNativeDriver: false }
  );

  const onHandleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: handleSwipeAnim } }],
    { useNativeDriver: false }
  );

  return {
    slideAnim,
    handleSwipeAnim,
    driverExpandAnim,
    sliderConfig,
    onGestureEvent,
    onHandlerStateChange,
    onHandleGestureEvent,
    onHandleStateChange,
  };
};
