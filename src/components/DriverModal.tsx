import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
}

const DriverModal: React.FC<DriverModalProps> = ({
  isVisible,
  onClose,
  onOverlayClose,
  role = 'client',
}) => {
  const { isDark } = useTheme();
  const styles = createDriverModalStyles(isDark);
  
  const [isDriverExpanded, setIsDriverExpanded] = useState(false);
  const [buttonColorState, setButtonColorState] = useState(0); // 0: primary, 1: yellow, 2: green, 3: stopped
  const [showDialog1, setShowDialog1] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  const [showDialog3, setShowDialog3] = useState(false);
  const [showLongPressDialog, setShowLongPressDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const driverExpandAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Централизованные моки
  const driverId = getSampleDriverId();
  const driver = mockDrivers.find((d) => d.id === driverId) ?? mockDrivers[0];
  const clientId = getSampleClientId();
  const driverInfo = getDriverInfoMock(driver?.id ?? 'driver_1');
  const driverTrips = getDriverTripsMock(driver?.id ?? 'driver_1');

  const handleDriverExpand = useCallback(() => {
    const toValue = isDriverExpanded ? 0 : 1;
    setIsDriverExpanded(!isDriverExpanded);
    
    Animated.timing(driverExpandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDriverExpanded, driverExpandAnim]);



  const handleLongPress = useCallback(() => {
    // Долгое нажатие работает только в зеленом состоянии
    if (buttonColorState === 2) {
      setShowLongPressDialog(true);
    }
  }, [buttonColorState]);

  const handleStopPress = useCallback(() => {
    setShowLongPressDialog(false);
    setShowStopDialog(true);
  }, []);

  const handleEndPress = useCallback(() => {
    setShowLongPressDialog(false);
    setShowEndDialog(true);
  }, []);

  const handleStopOkPress = useCallback(() => {
    setShowStopDialog(false);
    setButtonColorState(3); // Переводим в остановленное состояние
  }, []);

  const handleEndOkPress = useCallback(() => {
    setShowEndDialog(false);
    setButtonColorState(0); // Возвращаем к дефолтному состоянию
  }, []);

  const handleOkPress = useCallback(() => {
    // Меняем цвет только при нажатии OK
    let newState;
    if (buttonColorState === 3) {
      // Если в сером состоянии, переходим к зеленому (продолжить)
      newState = 2;
    } else if (buttonColorState === 2) {
      // Если в зеленом состоянии, переходим к синему (завершение)
      newState = 0;
    } else {
      // Обычный цикл для синего и желтого
      newState = (buttonColorState + 1) % 4;
    }
    setButtonColorState(newState);
    
    // Закрываем все диалоги
    setShowDialog1(false);
    setShowDialog2(false);
    setShowDialog3(false);
    setShowContinueDialog(false);
  }, [buttonColorState]);

  // Слайд-жест временно отключен, оставляем анимацию возврата
  // при необходимости можно восстановить PanGestureHandler

  const handleButtonPress = useCallback(() => {
    // Простое тестирование - меняем состояние при нажатии
    setButtonColorState((buttonColorState + 1) % 4);
  }, [buttonColorState]);

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
                  <View style={styles.sliderBackgroundContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.sliderButton,
                        buttonColorState === 1 && { backgroundColor: '#FCD34D' },
                        buttonColorState === 2 && { backgroundColor: '#10B981' },
                        buttonColorState === 3 && { backgroundColor: '#6B7280' },
                        {
                          transform: [{ translateX: slideAnim }]
                        }
                      ]}
                      onPress={handleButtonPress}
                      activeOpacity={1}
                    >
                      <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Аватар и тексты поверх слайдера */}
                <DriverModalHeader
                  styles={styles}
                  role={role}
                  driver={driver}
                  childName={driverInfo.childName}
                  childAge={driverInfo.childAge}
                />
              </View>
            </View>

            <DriverInfoBar
              styles={styles}
              role={role}
              schedule={driverInfo.schedule}
              price={driverInfo.price}
              distance={driverInfo.distance}
              timeOrChildType={role === 'driver' ? driverInfo.time : driverInfo.childType}
              onPress={handleDriverExpand}
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
                 <TouchableOpacity style={styles.leftButton}>
                  <View style={styles.buttonContent}>
                    <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
                     <Text style={styles.leftButtonText}>{t('client.driversScreen.actions.chat')}</Text>
                  </View>
                </TouchableOpacity>

                 <TouchableOpacity style={styles.rightButton}>
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
        onStartOk={handleOkPress}
        showWaiting={showDialog2}
        onWaitingCancel={() => setShowDialog2(false)}
        onWaitingOk={handleOkPress}
        showEnd={showDialog3}
        onEndCancel={() => setShowDialog3(false)}
        onEndOk={handleOkPress}
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
        onContinueOk={handleOkPress}
      />
    </Modal>
  );
};

export default DriverModal;
