export interface DriverModalProps {
  isVisible: boolean;
  onClose: () => void;
  onOverlayClose: () => void;
  role?: 'client' | 'driver';
  onChat?: (driver: any) => void;
}

export interface DriverModalState {
  isDriverExpanded: boolean;
  buttonColorState: number; // 0: primary, 1: cyan, 2: green, 3: stopped
  showDialog1: boolean;
  showDialog2: boolean;
  showDialog3: boolean;
  showLongPressDialog: boolean;
  showStopDialog: boolean;
  showEndDialog: boolean;
  showContinueDialog: boolean;
  showRatingDialog: boolean;
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
}

export interface DriverModalActions {
  setIsDriverExpanded: (expanded: boolean) => void;
  setButtonColorState: (state: number) => void;
  setShowDialog1: (show: boolean) => void;
  setShowDialog2: (show: boolean) => void;
  setShowDialog3: (show: boolean) => void;
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
  resetButtonState: () => Promise<void>;
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
  handleEndTripOk: () => void;
  handleRatingSubmit: (rating: number, comment: string) => void;
  handleRatingCancel: () => void;
  handleContinueOk: () => void;
  handleButtonClick: () => void;
  formatTime: (seconds: number) => string;
}

export interface SliderConfig {
  SLIDER_BUTTON_SIZE: number;
  SLIDER_PADDING: number;
  maxSlideDistance: number;
  completeThreshold: number;
}
