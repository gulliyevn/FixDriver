import { useCallback } from "react";

import {
  DriverModalState,
  DriverModalActions,
} from "../types/driver-modal.types";
import { DriverDetails } from "../../../hooks/driver/useDriverDetails";

export const useDriverModalHandlers = (
  state: DriverModalState,
  actions: DriverModalActions,
  onChat: ((driverId: string) => void) | undefined,
  driverInfo: DriverDetails["driver"],
) => {
  const handleButtonClick = useCallback(() => {
    if (state.buttonColorState === 3) {
      actions.setShowDialog3(true);
    } else if (state.buttonColorState === 4) {
      actions.setShowLongPressDialog(true);
    }
  }, [state.buttonColorState, actions]);

  const handleSmallButtonClick = useCallback(() => {
    if (state.buttonColorState === 1) {
      actions.setShowDialog1(true);
    } else if (state.buttonColorState === 2) {
      actions.setShowDialog2(true);
    }
  }, [state.buttonColorState, actions]);

  const handleChatPress = useCallback(() => {
    onChat?.(driverInfo.id);
  }, [onChat, driverInfo.id]);

  const handleStartOk = useCallback(() => {
    actions.setShowDialog1(false);
    actions.setButtonColorState(2);
  }, [actions]);

  const handleWaitingOk = useCallback(() => {
    actions.setShowDialog2(false);
    actions.setButtonColorState(3);
  }, [actions]);

  const handleEmptyOk = useCallback(() => {
    actions.setShowDialogEmpty(false);
  }, [actions]);

  const handleCancelOk = useCallback(() => {
    actions.setShowDialogCancel(false);
    actions.setButtonColorState(0);
  }, [actions]);

  const handleStopPress = useCallback(() => {
    actions.setShowLongPressDialog(false);
    actions.setEmergencyActionType("stop");
    actions.setEmergencyActionsUsed(true);
  }, [actions]);

  const handleEndPress = useCallback(() => {
    actions.setShowLongPressDialog(false);
    actions.setEmergencyActionType("end");
    actions.setEmergencyActionsUsed(true);
  }, [actions]);

  const handleStopOkPress = useCallback(() => {
    actions.setShowStopDialog(false);
  }, [actions]);

  const handleEndOkPress = useCallback(() => {
    actions.setShowEndDialog(false);
  }, [actions]);

  const handleContinueOk = useCallback(() => {
    actions.setShowContinueDialog(false);
  }, [actions]);

  const handleGoOnlineConfirm = useCallback(() => {
    actions.setShowGoOnlineConfirm(false);
    actions.setIsOnline(true);
  }, [actions]);

  const formatTime = useCallback((timestamp: number | null) => {
    if (!timestamp) return "00:00";
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const handleRatingCancel = useCallback(() => {
    actions.setShowRatingDialog(false);
  }, [actions]);

  const handleRatingSubmit = useCallback(
    () => {
      actions.setShowRatingDialog(false);
    },
    [actions],
  );

  const handleEndTripOk = useCallback(() => {
    actions.setShowDialog3(false);
    actions.setShowRatingDialog(true);
  }, [actions]);

  return {
    handleButtonClick,
    handleSmallButtonClick,
    handleChatPress,
    handleStartOk,
    handleWaitingOk,
    handleEmptyOk,
    handleCancelOk,
    handleStopPress,
    handleEndPress,
    handleStopOkPress,
    handleEndOkPress,
    handleContinueOk,
    handleGoOnlineConfirm,
    formatTime,
    handleRatingCancel,
    handleRatingSubmit,
    handleEndTripOk,
  };
};
