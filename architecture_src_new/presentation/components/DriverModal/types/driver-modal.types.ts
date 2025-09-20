export interface DriverModalProps {
  isVisible: boolean;
  onClose: () => void;
  onOverlayClose: () => void;
  role?: 'client' | 'driver';
  onChat?: (driver: any) => void;
  isModal?: boolean; // Новый проп для режима карточки
}

export interface DriverModalState {
  isDriverExpanded: boolean;
  buttonColorState: number; // 0: primary, 1: yellow (ожидание клиента), 2: cyan (поездка началась), 3: green (поездка окончилась), 4: stopped (остановлено/экстренное)
  isOnline: boolean;
  showDialog1: boolean;
  showDialog2: boolean;
  showDialog3: boolean;
  showDialogEmpty: boolean;
  showDialogCancel: boolean;
  showLongPressDialog: boolean;
  showStopDialog: boolean;
  showEndDialog: boolean;
  showContinueDialog: boolean;
  showRatingDialog: boolean;
  showGoOnlineConfirm: boolean;
  isPaused: boolean;
  emergencyActionsUsed: boolean;
  emergencyActionType: 'stop' | 'end' | null;
  isEmergencyButtonActive: boolean;
  pauseStartTime: number | null;
  slideProgress: number;
  showSwapIcon: boolean;
  iconOpacity: number;
  isCallSheetOpen: boolean;
  sliderWidth: number;
  isButtonsSwapped: boolean;
  // Новые состояния для таймера в статусе 2 (циан)
  isTripTimerActive: boolean;
  tripStartTime: number | null;
}

export interface DriverModalActions {
  setIsDriverExpanded: (expanded: boolean) => void;
  setButtonColorState: (state: number) => void;
  setIsOnline: (online: boolean) => void;
  setShowGoOnlineConfirm: (show: boolean) => void;
  setShowDialog1: (show: boolean) => void;
  setShowDialog2: (show: boolean) => void;
  setShowDialog3: (show: boolean) => void;
  setShowDialogEmpty: (show: boolean) => void;
  setShowDialogCancel: (show: boolean) => void;
  setShowLongPressDialog: (show: boolean) => void;
  setShowStopDialog: (show: boolean) => void;
  setShowEndDialog: (show: boolean) => void;
  setShowContinueDialog: (show: boolean) => void;
  setShowRatingDialog: (show: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setEmergencyActionsUsed: (used: boolean) => void;
  setEmergencyActionType: (type: 'stop' | 'end' | null) => void;
  setIsEmergencyButtonActive: (active: boolean) => void;
  setPauseStartTime: (time: number | null) => void;
  setSlideProgress: (progress: number) => void;
  setShowSwapIcon: (show: boolean) => void;
  setIconOpacity: (opacity: number) => void;
  setCallSheetOpen: (open: boolean) => void;
  setSliderWidth: (width: number) => void;
  setIsButtonsSwapped: (swapped: boolean) => void;
  resetButtonState: () => Promise<void>;
  // Новые действия для таймера в статусе 2 (циан)
  setIsTripTimerActive: (active: boolean) => void;
  setTripStartTime: (time: number | null) => void;
}

export interface DriverModalHandlers {
  openCallSheet: () => void;
  closeCallSheet: () => void;
  handleNetworkCall: () => void;
  handleInternetCall: () => void;
  handleChatPress: () => void;
  handleDriverExpand: () => void;
  handleLongPress: () => void;
  handleStopPress: () => void;
  handleEndPress: () => void;
  handleStopOkPress: () => void;
  handleEndOkPress: () => void;
  handleStartOk: () => void;
  handleWaitingOk: () => void;
  handleEmptyOk: () => void;
  handleCancelOk: () => void;
  handleEndTripOk: () => void;
  handleRatingSubmit: (rating: number, comment: string) => void;
  handleRatingCancel: () => void;
  handleContinueOk: () => void;
  handleButtonClick: () => void;
  handleSmallButtonClick: () => void;
  formatTime: (seconds: number) => string;
  handleGoOnlineConfirm: () => void;
}

export interface SliderConfig {
  SLIDER_BUTTON_SIZE: number;
  SLIDER_PADDING: number;
  maxSlideDistance: number;
  completeThreshold: number;
}
