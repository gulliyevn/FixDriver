import { useState, useEffect, useCallback, useRef } from 'react';
import { DriverModalState, DriverModalActions } from '../types/driver-modal.types';
import { usePersistentButtonState } from '../../../hooks/usePersistentButtonState';

export const useDriverModalState = (driverId: string): [DriverModalState, DriverModalActions] => {
  const { buttonState, updateButtonState, resetButtonState, isLoaded } = usePersistentButtonState(driverId);
  const isInitialized = useRef(false);
  
  const [isDriverExpanded, setIsDriverExpanded] = useState(false);
  const [buttonColorState, setButtonColorState] = useState(0);
  const [showDialog1, setShowDialog1] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  const [showDialog3, setShowDialog3] = useState(false);
  const [showDialogEmpty, setShowDialogEmpty] = useState(false);
  const [showDialogCancel, setShowDialogCancel] = useState(false);
  const [showLongPressDialog, setShowLongPressDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [emergencyActionsUsed, setEmergencyActionsUsed] = useState(false);
  const [emergencyActionType, setEmergencyActionType] = useState<'stop' | 'end' | null>(null);
  const [isEmergencyButtonActive, setIsEmergencyButtonActive] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [slideProgress, setSlideProgress] = useState(0);
  const [showSwapIcon, setShowSwapIcon] = useState(false);
  const [iconOpacity, setIconOpacity] = useState(1);
  const [isCallSheetOpen, setCallSheetOpen] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [isButtonsSwapped, setIsButtonsSwapped] = useState(false);

  // Синхронизация с персистентным состоянием при загрузке
  useEffect(() => {
    if (isLoaded && !isInitialized.current) {
      setButtonColorState(buttonState.buttonColorState);
      setIsPaused(buttonState.isPaused);
      setEmergencyActionsUsed(buttonState.emergencyActionsUsed);
      setEmergencyActionType(buttonState.emergencyActionType);
      setPauseStartTime(buttonState.pauseStartTime);
      isInitialized.current = true;
    }
  }, [isLoaded, buttonState]);

  // Сохранение состояния в AsyncStorage при изменении
  useEffect(() => {
    if (isLoaded && isInitialized.current) {
      updateButtonState({
        buttonColorState,
        isPaused,
        emergencyActionsUsed,
        emergencyActionType,
        pauseStartTime,
      });
    }
  }, [buttonColorState, isPaused, emergencyActionsUsed, emergencyActionType, pauseStartTime, isLoaded]);

  // Асинхронная активация кнопки экстренных действий
  useEffect(() => {
    if (buttonColorState === 4 && !isPaused) {
      setIsEmergencyButtonActive(true);
    } else {
      setIsEmergencyButtonActive(false);
    }
  }, [buttonColorState, isPaused]);

  const state: DriverModalState = {
    isDriverExpanded,
    buttonColorState,
    showDialog1,
    showDialog2,
    showDialog3,
    showDialogEmpty,
    showDialogCancel,
    showLongPressDialog,
    showStopDialog,
    showEndDialog,
    showContinueDialog,
    showRatingDialog,
    isPaused,
    emergencyActionsUsed,
    emergencyActionType,
    isEmergencyButtonActive,
    pauseStartTime,
    slideProgress,
    showSwapIcon,
    iconOpacity,
    isCallSheetOpen,
    sliderWidth,
    isButtonsSwapped,
  };

  const actions: DriverModalActions = {
    setIsDriverExpanded,
    setButtonColorState,
    setShowDialog1,
    setShowDialog2,
    setShowDialog3,
    setShowDialogEmpty,
    setShowDialogCancel,
    setShowLongPressDialog,
    setShowStopDialog,
    setShowEndDialog,
    setShowContinueDialog,
    setShowRatingDialog,
    setIsPaused,
    setEmergencyActionsUsed,
    setEmergencyActionType,
    setIsEmergencyButtonActive,
    setPauseStartTime,
    setSlideProgress,
    setShowSwapIcon,
    setIconOpacity,
    setCallSheetOpen,
    setSliderWidth,
    setIsButtonsSwapped,
    resetButtonState,
  };

  return [state, actions];
};
