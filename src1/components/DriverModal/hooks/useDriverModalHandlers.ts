import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { DriverModalState, DriverModalActions, DriverModalHandlers } from '../types/driver-modal.types';
import { mockDrivers } from '../../../mocks/data/users';
import { getSampleDriverId } from '../../../mocks/driverModalMock';
import { useLevelProgress } from '../../../context/LevelProgressContext';
import { useBalance } from '../../../hooks/useBalance';
import { useVIPTimeTracking } from '../../EarningsScreen/hooks/useVIPTimeTracking';
import DriverStatusService from '../../../services/DriverStatusService';
import BillingService from '../../../services/BillingService';

export const useDriverModalHandlers = (
  state: DriverModalState,
  actions: DriverModalActions,
  onChat?: (driver: any) => void
): DriverModalHandlers => {
  const driverId = getSampleDriverId();
  const driver = mockDrivers.find((d) => d.id === driverId) ?? mockDrivers[0];
  const { driverLevel, incrementProgress } = useLevelProgress();
  const { addEarnings } = useBalance();
  const { registerRide, startOnlineTime } = useVIPTimeTracking(!!driverLevel?.isVIP);

  // Мок-расчет тарифа. Заменить при подключении бэкенда
  const computeTripFare = useCallback((): number => {
    return 5.13; // AFc
  }, []);

  const completeTripAccounting = useCallback(async () => {
    // 1) Увеличиваем прогресс уровней
    const result = await incrementProgress();

    // 2) Начисляем бонус за завершенный подуровень (если был ап)
    if (result && result.hasLevelUp && typeof (result as any).bonusAmount === 'number') {
      await addEarnings((result as any).bonusAmount);
    }

    // 3) Начисляем стоимость поездки (мок)
    const fare = computeTripFare();
    if (fare > 0) {
      await addEarnings(fare);
    }

    // 4) Регистрируем поездку для VIP-учета (3 поездки/день)
    await registerRide();
  }, [incrementProgress, addEarnings, computeTripFare, registerRide]);

  const handleChatPress = useCallback(() => {
    if (onChat) {
      onChat(driver);
    }
  }, [onChat, driver]);

  const handleDriverExpand = useCallback(() => {
    const toValue = state.isDriverExpanded ? 0 : 1;
    actions.setIsDriverExpanded(!state.isDriverExpanded);
  }, [state.isDriverExpanded, actions]);

  const handleLongPress = useCallback(() => {
    if (state.buttonColorState === 3) {
      actions.setShowLongPressDialog(true);
    }
  }, [state.buttonColorState, actions]);

  const handleStopPress = useCallback(() => {
    actions.setShowLongPressDialog(false);
    actions.setShowStopDialog(true);
  }, [actions]);

  const handleEndPress = useCallback(() => {
    actions.setShowLongPressDialog(false);
    actions.setShowEndDialog(true);
  }, [actions]);

  const handleStopOkPress = useCallback(() => {
    actions.setShowStopDialog(false);
    actions.setIsPaused(true);
    actions.setPauseStartTime(0);
    actions.setEmergencyActionsUsed(true);
    actions.setEmergencyActionType('stop');
    // Биллинг: экстренная остановка оплачивается с первой секунды
    BillingService.startEmergency().catch(() => {});
  }, [actions]);

  const handleEndOkPress = useCallback(async () => {
    actions.setShowEndDialog(false);
    actions.setEmergencyActionsUsed(true);
    actions.setEmergencyActionType('end');
    actions.setShowRatingDialog(true);
    // Комплексное начисление (уровень, бонус, тариф, VIP-ride)
    await completeTripAccounting();
  }, [actions, completeTripAccounting]);

  const handleStartOk = useCallback(async () => {
    actions.setShowDialog1(false);
    if (!state.isOnline) {
      try {
        await AsyncStorage.setItem('@driver_online_status', 'true');
      } catch {}
      actions.setIsOnline(true);
      startOnlineTime?.();
      DriverStatusService.setOnline(true);
      actions.setButtonColorState(1);
      // Показать информирующий диалог без действий
      actions.setShowGoOnlineConfirm(true);
      
      // Принудительно обновляем UI через небольшую задержку
      setTimeout(() => {
        DriverStatusService.setOnline(true);
      }, 100);
    } else {
      actions.setButtonColorState(1);
    }
  }, [actions, state.isOnline, startOnlineTime]);

  const handleGoOnlineConfirm = useCallback(async () => {
    // Просто закрыть информационный диалог
    actions.setShowGoOnlineConfirm(false);
  }, [actions]);

  const handleWaitingOk = useCallback(() => {
    actions.setShowDialog2(false);
    actions.setButtonColorState(2);
    // Запускаем таймер поездки при переходе с желтого на циан
    actions.setIsTripTimerActive(true);
    actions.setTripStartTime(0);
    // Биллинг: ожидание бесплатно первые 5 минут, далее 0.01 AFc/сек
    BillingService.startWaiting().catch(() => {});
    
    setTimeout(() => {
      actions.setIconOpacity(0);
      setTimeout(() => {
        actions.setShowSwapIcon(true);
        actions.setIconOpacity(1);
      }, 150);
    }, 2000);
    
    setTimeout(() => {
      actions.setIconOpacity(0);
      setTimeout(() => {
        actions.setShowSwapIcon(false);
        actions.setIconOpacity(1);
      }, 150);
    }, 5000);
  }, [actions]);

  const handleEmptyOk = useCallback(() => {
    actions.setShowDialogEmpty(false);
    actions.setButtonColorState(3);
    // Останавливаем таймер поездки при переходе с циана на зеленый
    actions.setIsTripTimerActive(false);
    actions.setTripStartTime(null);
    // Биллинг: закрыть ожидание и записать чек
    BillingService.stopWaiting().catch(() => {});
  }, [actions]);

  const handleCancelOk = useCallback(() => {
    actions.setShowDialogCancel(false);
    actions.setButtonColorState(0); // Возврат к начальному состоянию
    actions.setIsButtonsSwapped(false);
  }, [actions]);

  const handleEndTripOk = useCallback(async () => {
    actions.setShowDialog3(false);
    actions.setEmergencyActionsUsed(false); // Обычное завершение - комментарий необязательный
    actions.setShowRatingDialog(true);
    // Комплексное начисление (уровень, бонус, тариф, VIP-ride)
    await completeTripAccounting();
  }, [actions, completeTripAccounting]);

  const handleRatingSubmit = useCallback((rating: number, comment: string) => {
    actions.setShowRatingDialog(false);
    actions.setButtonColorState(0);
    actions.setShowSwapIcon(false);
    actions.setIconOpacity(1);
    actions.setIsPaused(false);
    actions.setPauseStartTime(null);
    console.log('Rating submitted:', { rating, comment });
  }, [actions]);

  const handleRatingCancel = useCallback(() => {
    actions.setShowRatingDialog(false);
    actions.setButtonColorState(0);
    actions.setShowSwapIcon(false);
    actions.setIconOpacity(1);
    actions.setIsPaused(false);
    actions.setPauseStartTime(null);
  }, [actions]);

  const handleContinueOk = useCallback(() => {
    actions.setShowContinueDialog(false);
    actions.setIsPaused(false);
    actions.setPauseStartTime(null);
    actions.setButtonColorState(3);
    // Биллинг: остановить экстренную остановку и записать чек
    BillingService.stopEmergency().catch(() => {});
  }, [actions]);

  const handleButtonClick = useCallback(() => {
    if (state.buttonColorState === 0) {
      // Статус 0 - офлайн, при клике включаем онлайн
      if (!state.isOnline) {
        AsyncStorage.setItem('@driver_online_status', 'true').catch(() => {});
        actions.setIsOnline(true);
        startOnlineTime?.();
        DriverStatusService.setOnline(true);
        actions.setButtonColorState(1);
        actions.setShowGoOnlineConfirm(true);
        
        // Принудительно обновляем UI через небольшую задержку
        setTimeout(() => {
          DriverStatusService.setOnline(true);
        }, 100);
      }
    } else if (state.buttonColorState === 1 || state.buttonColorState === 2) {
      // Обычный клик - обмен кнопок местами
      actions.setIsButtonsSwapped(!state.isButtonsSwapped);
    } else if (state.buttonColorState === 3) {
      // Переключение между состояниями 3 и 4
      actions.setButtonColorState(4);
      actions.setIsPaused(false);
      actions.setPauseStartTime(null);
      actions.setShowSwapIcon(false);
      actions.setIconOpacity(1);
    } else if (state.buttonColorState === 4) {
      // Переключение между состояниями 4 и 3
      actions.setButtonColorState(3);
      actions.setIsPaused(false);
      actions.setPauseStartTime(null);
      actions.setShowSwapIcon(false);
      actions.setIconOpacity(1);
    }
  }, [state.buttonColorState, state.isButtonsSwapped, state.isOnline, actions, startOnlineTime]);

  const handleSmallButtonClick = useCallback(() => {
    // Маленькая кнопка просто меняет цвета
    actions.setIsButtonsSwapped(!state.isButtonsSwapped);
  }, [state.isButtonsSwapped, actions]);

  // Обработчики звонков (простейшая версия без анимации; совместимо с интерфейсом)
  const openCallSheet = useCallback(() => {
    actions.setCallSheetOpen(true);
  }, [actions]);

  const closeCallSheet = useCallback(() => {
    actions.setCallSheetOpen(false);
  }, [actions]);

  const handleNetworkCall = useCallback(() => {
    try {
      if ((driver as any)?.phone_number) {
        Linking.openURL(`tel:${(driver as any).phone_number}`);
      }
    } finally {
      closeCallSheet();
    }
  }, [driver, closeCallSheet]);

  const handleInternetCall = useCallback(() => {
    closeCallSheet();
    // Зарезервировано для логики интернет‑звонка
  }, [closeCallSheet]);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }, []);

  return {
    openCallSheet,
    closeCallSheet,
    handleNetworkCall,
    handleInternetCall,
    handleChatPress,
    handleDriverExpand,
    handleLongPress,
    handleStopPress,
    handleEndPress,
    handleStopOkPress,
    handleEndOkPress,
    handleStartOk,
    handleWaitingOk,
    handleEmptyOk,
    handleCancelOk,
    handleEndTripOk,
    handleRatingSubmit,
    handleRatingCancel,
    handleContinueOk,
    handleButtonClick,
    handleSmallButtonClick,
    formatTime,
    handleGoOnlineConfirm,
  };
};
