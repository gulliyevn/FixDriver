import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, Modal, Vibration, Platform, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';
import { createDriverModalStyles } from '../styles/components/DriverModal.styles';
import DriverTripDialogs from './driver/DriverTripDialogs';
import DriverModalHeader from './driver/DriverModalHeader';
import DriverInfoBar from './driver/DriverInfoBar';
import DriverTrips from './driver/DriverTrips';
import { mockDrivers } from '../mocks';
import { 
  getClientName as getClientNameMock,
  getDriverInfo as getDriverInfoMock,
  getDriverTrips as getDriverTripsMock,
  getSampleClientId,
  getSampleDriverId,
} from '../mocks/driverModalMock';

interface DriverModalProps {
  isVisible: boolean;
  onClose: () => void;
  onOverlayClose: () => void;
  role?: 'client' | 'driver';
  onChat?: (driver: any) => void; // Добавляем проп для чата
}

const DriverModal: React.FC<DriverModalProps> = ({
  isVisible,
  onClose,
  onOverlayClose,
  role = 'client',
  onChat,
}) => {
  const { isDark } = useTheme();
  const styles = createDriverModalStyles(isDark, role);
  
  const [isDriverExpanded, setIsDriverExpanded] = useState(false);
  const [buttonColorState, setButtonColorState] = useState(0); // 0: primary, 1: yellow, 2: green, 3: stopped
  const [showDialog1, setShowDialog1] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  const [showDialog3, setShowDialog3] = useState(false);
  const [showLongPressDialog, setShowLongPressDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // для отслеживания паузы
  const [emergencyActionsUsed, setEmergencyActionsUsed] = useState(false); // были ли использованы экстренные действия
  const [emergencyActionType, setEmergencyActionType] = useState<'stop' | 'end' | null>(null); // тип экстренного действия
  const [isEmergencyButtonActive, setIsEmergencyButtonActive] = useState(false); // активна ли кнопка экстренных действий
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null); // время начала паузы
  const [slideProgress, setSlideProgress] = useState(0); // для отслеживания прогресса свайпа
  const [showSwapIcon, setShowSwapIcon] = useState(false); // для показа иконки замены
  const [iconOpacity, setIconOpacity] = useState(1); // для анимации смены иконок
  
  // Состояние для модалки звонка
  const [isCallSheetOpen, setCallSheetOpen] = useState(false);
  const callAnim = useRef(new Animated.Value(0)).current;
  
  const driverExpandAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Слайдер параметры
  const [sliderWidth, setSliderWidth] = useState(0);
  const SLIDER_BUTTON_SIZE = 60;
  const SLIDER_PADDING = 4;

  // Централизованные моки
  const driverId = getSampleDriverId();
  const driver = mockDrivers.find((d) => d.id === driverId) ?? mockDrivers[0];
  const clientId = getSampleClientId();
  const driverInfo = getDriverInfoMock(driver?.id ?? 'driver_1');
  const driverTrips = getDriverTripsMock(driver?.id ?? 'driver_1');

  // Функции для модалки звонка
  const openCallSheet = useCallback(() => {
    setCallSheetOpen(true);
    Animated.timing(callAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [callAnim]);

  const closeCallSheet = useCallback(() => {
    Animated.timing(callAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setCallSheetOpen(false));
  }, [callAnim]);

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

  const handleChatPress = useCallback(() => {
    if (onChat) {
      onChat(driver);
    }
  }, [onChat, driver]);

  const handleDriverExpand = useCallback(() => {
    const toValue = isDriverExpanded ? 0 : 1;
    setIsDriverExpanded(!isDriverExpanded);
    
    Animated.timing(driverExpandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDriverExpanded, driverExpandAnim]);

  // Асинхронная активация кнопки экстренных действий
  useEffect(() => {
    if (buttonColorState === 3 && !isPaused) {
      // Активируем кнопку экстренных действий через 2 секунды
      const timer = setTimeout(() => {
        setIsEmergencyButtonActive(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setIsEmergencyButtonActive(false);
    }
  }, [buttonColorState, isPaused]);

  const handleLongPress = useCallback(() => {
    // Долгое нажатие работает только в зеленом состоянии
    if (buttonColorState === 2) {
      setShowLongPressDialog(true);
    }
  }, [buttonColorState]);

  const handleStopPress = useCallback(() => {
    setShowLongPressDialog(false);
    setShowStopDialog(true); // открываем диалог подтверждения остановки
  }, []);

  const handleEndPress = useCallback(() => {
    setShowLongPressDialog(false);
    setShowEndDialog(true); // открываем диалог подтверждения завершения
  }, []);

  // Функция форматирования времени
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const handleStopOkPress = useCallback(() => {
    setShowStopDialog(false);
    setIsPaused(true); // включаем паузу
    setPauseStartTime(0); // начинаем с 00:00
    setEmergencyActionsUsed(true); // отмечаем, что экстренные действия использованы
    setEmergencyActionType('stop'); // тип действия - остановка
    // buttonColorState остается 3 (серый)
  }, []);

  const handleEndOkPress = useCallback(() => {
    setShowEndDialog(false);
    setEmergencyActionsUsed(true); // отмечаем, что экстренные действия использованы
    setEmergencyActionType('end'); // тип действия - завершение
    setShowRatingDialog(true); // Показываем диалог рейтинга сразу после экстренного завершения
  }, []);

  // Обработчики для каждого диалога отдельно
  const handleStartOk = useCallback(() => {
    setShowDialog1(false);
    setButtonColorState(1); // Синий -> Желтый
  }, []);

  const handleWaitingOk = useCallback(() => {
    setShowDialog2(false);
    setButtonColorState(2); // Желтый -> Зеленый
    
    // Запускаем таймер иконки замены с плавной анимацией
    setTimeout(() => {
      // Плавно скрываем стрелку
      setIconOpacity(0);
      setTimeout(() => {
        setShowSwapIcon(true); // меняем иконку
        setIconOpacity(1); // плавно показываем замену
      }, 150);
    }, 2000);
    
    setTimeout(() => {
      // Плавно скрываем замену
      setIconOpacity(0);
      setTimeout(() => {
        setShowSwapIcon(false); // возвращаем стрелку
        setIconOpacity(1); // плавно показываем стрелку
      }, 150);
    }, 5000);
  }, []);

  const handleEndTripOk = useCallback(() => {
    setShowDialog3(false);
    setShowRatingDialog(true); // Показываем диалог рейтинга
  }, []);

  const handleRatingSubmit = useCallback((rating: number, comment: string) => {
    setShowRatingDialog(false);
    setButtonColorState(0); // Возвращаем к дефолтному состоянию
    setShowSwapIcon(false); // сбрасываем иконку замены
    setIconOpacity(1); // сбрасываем анимацию
    setIsPaused(false); // сбрасываем паузу
    setPauseStartTime(null); // сбрасываем таймер
    // Здесь можно добавить логику отправки рейтинга на сервер
    console.log('Rating submitted:', { rating, comment });
  }, []);

  const handleRatingCancel = useCallback(() => {
    setShowRatingDialog(false);
    setButtonColorState(0); // Возвращаем к дефолтному состоянию
    setShowSwapIcon(false); // сбрасываем иконку замены
    setIconOpacity(1); // сбрасываем анимацию
    setIsPaused(false); // сбрасываем паузу
    setPauseStartTime(null); // сбрасываем таймер
  }, []);

  // Обработчик диалога продолжения (из паузы)
  const handleContinueOk = useCallback(() => {
    setShowContinueDialog(false);
    setIsPaused(false); // сбрасываем паузу
    setPauseStartTime(null); // сбрасываем таймер
    setButtonColorState(2); // возвращаем в зеленое состояние
  }, []);

  // Обработчик клика на кнопку (зеленый ⇄ серый)
  const handleButtonClick = useCallback(() => {
    if (buttonColorState === 2) { // зеленое состояние
      setButtonColorState(3); // переход в серое
      setIsPaused(false); // сбрасываем паузу при переходе в серое
      setPauseStartTime(null); // сбрасываем таймер
      setShowSwapIcon(false); // сбрасываем иконку замены
      setIconOpacity(1); // сбрасываем анимацию
    } else if (buttonColorState === 3 && isEmergencyButtonActive) { // серое состояние и кнопка активна
      setButtonColorState(2); // возврат в зеленое
      setIsPaused(false); // сбрасываем паузу при возврате в зеленое
      setPauseStartTime(null); // сбрасываем таймер
      setShowSwapIcon(false); // сбрасываем иконку замены
      setIconOpacity(1); // сбрасываем анимацию
    }
  }, [buttonColorState, isEmergencyButtonActive]);

  // Слайдер логика
  const maxSlideDistance = Math.max(0, sliderWidth - SLIDER_BUTTON_SIZE - SLIDER_PADDING * 2);
  const completeThreshold = maxSlideDistance * 0.95; // почти до самого конца

  // Слушатель для отслеживания прогресса свайпа
  React.useEffect(() => {
    const listener = slideAnim.addListener(({ value }) => {
      setSlideProgress(value);
    });
    return () => slideAnim.removeListener(listener);
  }, [slideAnim]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: slideAnim } }],
    { useNativeDriver: false }
  );

  const resetSlider = useCallback(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [slideAnim]);

  const completeSwipe = useCallback(() => {
    // Сильное тактильное биение
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Анимация завершения
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

    // Показываем диалог в зависимости от состояния (цвет меняется только после подтверждения)
    if (buttonColorState === 0) {
      // Синий -> Желтый: диалог начала поездки
      setShowDialog1(true);
    } else if (buttonColorState === 1) {
      // Желтый -> Зеленый: диалог ожидания
      setShowDialog2(true);
    } else if (buttonColorState === 2) {
      // Зеленый -> Синий: диалог завершения поездки
      setShowDialog3(true);
    } else if (buttonColorState === 3) {
      // Серый: экстренный диалог или диалог продолжения при паузе
      if (isPaused) {
        setShowContinueDialog(true); // диалог продолжения при паузе
      } else {
        setShowLongPressDialog(true); // экстренный диалог
      }
    }
  }, [slideAnim, maxSlideDistance, buttonColorState, isPaused]);

  const onHandlerStateChange = useCallback((event) => {
    const { state, translationX } = event.nativeEvent;
    
    if (state === State.END || state === State.CANCELLED || state === State.FAILED) {
      const slideDistance = Math.abs(translationX);
      
      if (slideDistance >= completeThreshold && translationX < 0) { // только налево
        completeSwipe();
      } else {
        resetSlider();
      }
    }
  }, [completeThreshold, completeSwipe, resetSlider]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onOverlayClose}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          {/* Контент водителя */}
          <View style={styles.driverItem}>
            <View style={styles.driverHeader}>
              <View style={styles.driverHeaderContainer}>
                {/* Слайдер-контейнер как фон */}
                {role === 'driver' && (
                  <View 
                    style={styles.sliderBackgroundContainer}
                    onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                  >
                    <PanGestureHandler
                      onGestureEvent={onGestureEvent}
                      onHandlerStateChange={onHandlerStateChange}
                      shouldCancelWhenOutside={false}
                      activeOffsetX={[-10, 10]}
                      failOffsetY={[-5, 5]}
                    >
                      <Animated.View
                        style={[
                          styles.sliderButton,
                          buttonColorState === 1 && { backgroundColor: '#FCD34D' },
                          buttonColorState === 2 && { backgroundColor: '#10B981' },
                          buttonColorState === 3 && { backgroundColor: '#6B7280' },
                          {
                            transform: [
                              {
                                translateX: slideAnim.interpolate({
                                  inputRange: [-maxSlideDistance, 0, maxSlideDistance],
                                  outputRange: [-maxSlideDistance, 0, 0],
                                  extrapolate: 'clamp',
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <TouchableOpacity
                          onPress={handleButtonClick}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            opacity: (buttonColorState === 2 || (buttonColorState === 3 && isEmergencyButtonActive)) ? 1 : 0.3 // активна в зеленом и сером только после активации
                          }}
                          disabled={!(buttonColorState === 2 || (buttonColorState === 3 && isEmergencyButtonActive))} // активна в зеленом и сером только после активации
                        >
                          <Animated.View style={{ opacity: iconOpacity }}>
                            <Ionicons 
                              name={
                                buttonColorState === 3 
                                  ? (isPaused ? "pause" : "shield")
                                  : (showSwapIcon && buttonColorState === 2 ? "swap-horizontal" : "chevron-back")
                              } 
                              size={24} 
                              color="#FFFFFF" 
                            />
                          </Animated.View>
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>
                  </View>
                )}
                
                {/* Аватар и тексты поверх слайдера */}
                                  <DriverModalHeader
                    styles={styles}
                    role={role}
                    driver={driver}
                    childName={driverInfo.childName}
                    childAge={driverInfo.childAge}
                    slideProgress={slideProgress}
                    isPaused={isPaused}
                    pauseStartTime={pauseStartTime}
                    formatTime={formatTime}
                  />
              </View>
            </View>

            <DriverInfoBar
              role={role}
              schedule={driverInfo.schedule}
              price={driverInfo.price}
              distance={driverInfo.distance}
              timeOrChildType={role === 'driver' ? driverInfo.time : driverInfo.childType}
              onPress={handleDriverExpand}
              vehicleBrand={driver?.vehicle_brand}
              vehicleModel={driver?.vehicle_model}
              vehicleNumber={driver?.vehicle_number}
            />

            <Animated.View
              style={[
                styles.expandableContent,
                {
                  maxHeight: driverExpandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 300] }),
                  opacity: driverExpandAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0, 1] }),
                },
              ]}
            >
              <DriverTrips styles={styles} driverId={driver?.id} trips={driverTrips} />

              <View style={styles.bottomBorder} />

              <View style={styles.buttonsContainer}>
                 <TouchableOpacity style={styles.leftButton} onPress={handleChatPress}>
                  <View style={styles.buttonContent}>
                    <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
                     <Text style={styles.leftButtonText}>{t('client.driversScreen.actions.chat')}</Text>
                  </View>
                </TouchableOpacity>

                 <TouchableOpacity style={styles.rightButton} onPress={openCallSheet}>
                  <View style={styles.rightButtonContent}>
                    <Ionicons name="call-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
                     <Text style={styles.rightButtonText}>{t('client.driversScreen.actions.call')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
      
      <DriverTripDialogs
        styles={styles}
        clientName={getClientNameMock(clientId)}
        showStart={showDialog1}
        onStartCancel={() => setShowDialog1(false)}
        onStartOk={handleStartOk}
        showWaiting={showDialog2}
        onWaitingCancel={() => setShowDialog2(false)}
        onWaitingOk={handleWaitingOk}
        showEnd={showDialog3}
        onEndCancel={() => setShowDialog3(false)}
        onEndOk={handleEndTripOk}
        showEmergency={showLongPressDialog}
        onEmergencyStop={handleStopPress}
        onEmergencyEnd={handleEndPress}
        onEmergencyClose={() => setShowLongPressDialog(false)}
        showStop={showStopDialog}
        onStopCancel={() => setShowStopDialog(false)}
        onStopOk={handleStopOkPress}
        showForceEnd={showEndDialog}
        onForceEndCancel={() => setShowEndDialog(false)}
        onForceEndOk={handleEndOkPress}
        showContinue={showContinueDialog}
        onContinueCancel={() => setShowContinueDialog(false)}
        onContinueOk={handleContinueOk}
        showRating={showRatingDialog}
        onRatingCancel={handleRatingCancel}
        onRatingSubmit={handleRatingSubmit}
        emergencyActionsUsed={emergencyActionsUsed}
        emergencyActionType={emergencyActionType}
      />
      
      {/* Модалка звонка */}
      <Modal
        visible={isCallSheetOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeCallSheet}
      >
        <View style={styles.callSheetOverlay}>
          <Pressable style={styles.callSheetBackdrop} onPress={closeCallSheet} />
          <Animated.View
            style={[
              styles.callSheetContainer,
              {
                transform: [
                  {
                    translateY: callAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity style={styles.callSheetClose} onPress={closeCallSheet} accessibilityLabel={t('common.close')}>
              <Ionicons name="close" size={22} color={isDark ? '#F9FAFB' : '#111827'} />
            </TouchableOpacity>
            <View style={styles.callSheetHandle} />
            <Text style={styles.callSheetTitle}>
              {t('client.driversScreen.call.callTitle', { firstName: driver.first_name, lastName: driver.last_name })}
            </Text>
            <TouchableOpacity style={styles.callSheetOption} onPress={handleInternetCall}>
              <Ionicons name="wifi" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
              <Text style={styles.callSheetOptionText}>{t('client.driversScreen.call.internetCall')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callSheetOption} onPress={handleNetworkCall}>
              <Ionicons name="call" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
              <Text style={styles.callSheetOptionText}>
                {t('client.driversScreen.call.networkCallWithNumber', { phone: driver.phone_number })}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </Modal>
  );
};

export default DriverModal;
