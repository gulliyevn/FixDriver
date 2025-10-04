import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, TouchableOpacity, Animated, Text, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PanGestureHandler } from "react-native-gesture-handler";

import { useTheme } from "../../context/ThemeContext";
import { t } from "../../i18n";
import { createDriverModalStyles } from "../../styles/components/DriverModal";
import DriverTripDialogs from "../driver/DriverTripDialogs";
import DriverModalHeader from "../driver/DriverModalHeader";
import DriverInfoBar from "../driver/DriverInfoBar";
import DriverTrips from "../driver/DriverTrips";
import { DriverModalProps } from "./types/driver-modal.types";
import { useDriverModalState } from "./hooks/useDriverModalState";
import { useDriverModalHandlers } from "./hooks/useDriverModalHandlers";
import { useCallSheet } from "./hooks/useCallSheet";
import { useSliderLogic } from "./hooks/useSliderLogic";
import DriverCallSheet from "./components/DriverCallSheet";
import { useDriverDetails } from "../../hooks/driver/useDriverDetails";

const DriverModal: React.FC<DriverModalProps> = ({
  isVisible,
  onClose,
  onOverlayClose,
  role = "client",
  onChat,
  driverId,
}) => {
  const { isDark } = useTheme();
  const styles = createDriverModalStyles(isDark, role);
  const { driverInfo, clientInfo, trips } = useDriverDetails(driverId);
  const [state, actions] = useDriverModalState(driverId);
  const handlers = useDriverModalHandlers(state, actions, onChat, driverInfo);
  const callSheet = useCallSheet(actions, driverInfo);
  const slider = useSliderLogic(state, actions);

  useEffect(() => {
    if (!isVisible) return;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@driver_online_status");
        actions.setIsOnline(saved === "true");
      } catch (error) {
        console.warn('Failed to load driver online status:', error);
      }
    })();
  }, [isVisible, actions]);

  useEffect(() => {
    Animated.spring(slider.driverExpandAnim, {
      toValue: state.isDriverExpanded ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [state.isDriverExpanded, slider.driverExpandAnim]);

  if (!driverId) {
    return null;
  }

  if (!driverInfo) {
    return null;
  }

  const driverExpandHeight = slider.driverExpandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const driverExpandOpacity = slider.driverExpandAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const getMainButtonColor = () => {
    if (state.buttonColorState === 1)
      return state.isButtonsSwapped ? "#DC2626" : "#EAB308";
    if (state.buttonColorState === 2)
      return state.isButtonsSwapped ? "#DC2626" : "#06B6D4";
    if (state.buttonColorState === 3) return "#10B981";
    if (state.buttonColorState === 4) return "#6B7280";
    return undefined;
  };

  const getMainButtonIcon = () => {
    if (state.buttonColorState === 1)
      return state.isButtonsSwapped ? "close" : "chevron-back";
    if (state.buttonColorState === 2)
      return state.isButtonsSwapped ? "close" : "chevron-back";
    if (state.buttonColorState === 3) return "chevron-back";
    if (state.buttonColorState === 4)
      return state.isPaused ? "pause" : "shield";
    return "chevron-back";
  };

  const getSmallButtonColor = () => {
    if (state.buttonColorState === 1)
      return state.isButtonsSwapped ? "#EAB308" : "#DC2626";
    if (state.buttonColorState === 2)
      return state.isButtonsSwapped ? "#06B6D4" : "#DC2626";
    return "#DC2626";
  };

  const getSmallButtonIcon = () => {
    if (state.buttonColorState === 1 || state.buttonColorState === 2)
      return state.isButtonsSwapped ? "chevron-back" : "close";
    return "close";
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onOverlayClose}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.driverItem}>
            <PanGestureHandler
              onGestureEvent={slider.onHandleGestureEvent}
              onHandlerStateChange={slider.onHandleStateChange}
              shouldCancelWhenOutside={false}
              activeOffsetY={[-10, 10]}
              failOffsetX={[-10, 10]}
            >
              <Animated.View
                style={[
                  styles.sliderHandleContainer,
                  {
                    transform: [
                      {
                        translateY: slider.handleSwipeAnim.interpolate({
                          inputRange: [-100, 0, 100],
                          outputRange: [-10, 0, 10],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    actions.setIsDriverExpanded(!state.isDriverExpanded)
                  }
                  style={{ width: "100%", height: "100%" }}
                  activeOpacity={0.7}
                >
                  <View style={styles.sliderHandle} />
                </TouchableOpacity>
              </Animated.View>
            </PanGestureHandler>

            <View style={styles.driverHeader}>
              <View style={styles.driverHeaderContainer}>
                {role === "driver" && (
                  <View
                    style={styles.sliderBackgroundContainer}
                    onLayout={(e) =>
                      actions.setSliderWidth(e.nativeEvent.layout.width)
                    }
                  >
                    <PanGestureHandler
                      onGestureEvent={slider.onGestureEvent}
                      onHandlerStateChange={slider.onHandlerStateChange}
                      shouldCancelWhenOutside={false}
                      activeOffsetX={[-10, 10]}
                      failOffsetY={[-5, 5]}
                    >
                      <Animated.View
                        style={[
                          styles.sliderButton,
                          getMainButtonColor() && {
                            backgroundColor: getMainButtonColor(),
                          },
                          {
                            transform: [
                              {
                                translateX: slider.slideAnim.interpolate({
                                  inputRange: [
                                    -slider.sliderConfig.maxSlideDistance,
                                    0,
                                    slider.sliderConfig.maxSlideDistance,
                                  ],
                                  outputRange: [
                                    -slider.sliderConfig.maxSlideDistance,
                                    0,
                                    0,
                                  ],
                                  extrapolate: "clamp",
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <TouchableOpacity
                          onPress={handlers.handleButtonClick}
                          style={{
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 1,
                          }}
                          disabled={
                            !(
                              state.buttonColorState === 3 ||
                              (state.buttonColorState === 4 &&
                                state.isEmergencyButtonActive)
                            )
                          }
                        >
                          <Animated.View style={{ opacity: state.iconOpacity }}>
                            <Ionicons
                              name={getMainButtonIcon()}
                              size={24}
                              color="#FFFFFF"
                            />
                          </Animated.View>
                        </TouchableOpacity>
                      </Animated.View>
                    </PanGestureHandler>
                  </View>
                )}

                {role === "driver" &&
                  (state.buttonColorState === 3 ||
                    state.buttonColorState === 4) && (
                    <TouchableOpacity
                      style={[
                        styles.smallCircle,
                        state.buttonColorState === 3
                          ? { backgroundColor: "#6B7280" }
                          : { backgroundColor: "#10B981" },
                      ]}
                      onPress={handlers.handleButtonClick}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <Ionicons
                          name={
                            state.buttonColorState === 3
                              ? "shield"
                              : "chevron-back"
                          }
                          size={16}
                          color="#FFFFFF"
                        />
                      </View>
                    </TouchableOpacity>
                  )}

                {role === "driver" &&
                  (state.buttonColorState === 1 ||
                    state.buttonColorState === 2) && (
                    <TouchableOpacity
                      style={[
                        styles.smallCircle,
                        { backgroundColor: getSmallButtonColor() },
                      ]}
                      onPress={handlers.handleSmallButtonClick}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <Ionicons
                          name={getSmallButtonIcon()}
                          size={16}
                          color="#FFFFFF"
                        />
                      </View>
                    </TouchableOpacity>
                  )}

                <DriverModalHeader
                  styles={styles}
                  role={role}
                  driver={driverInfo}
                  childName={clientInfo?.childName}
                  childAge={clientInfo?.childAge?.toString()}
                  slideProgress={state.slideProgress}
                  isPaused={state.isPaused}
                  pauseStartTime={state.pauseStartTime}
                  formatTime={handlers.formatTime}
                  buttonColorState={state.buttonColorState}
                  isTripTimerActive={state.isTripTimerActive}
                  tripStartTime={state.tripStartTime}
                />
              </View>
            </View>

            <DriverInfoBar
              role={role}
              schedule={driverInfo.schedule ?? ""}
              price={driverInfo.price ?? ""}
              distance={driverInfo.distance ?? ""}
              timeOrChildType={
                role === "driver"
                  ? (driverInfo.time ?? "")
                  : (clientInfo?.childType ?? "")
              }
            />

            <Animated.View
              style={[
                styles.expandableContent,
                { maxHeight: driverExpandHeight, opacity: driverExpandOpacity },
              ]}
            >
              <DriverTrips styles={styles} driverId={driverId} trips={trips} />

              <View style={styles.bottomBorder} />

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.leftButton}
                  onPress={handlers.handleChatPress}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.leftButtonText}>
                      {t("client.driversScreen.actions.chat")}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rightButton}
                  onPress={callSheet.openCallSheet}
                >
                  <View style={styles.rightButtonContent}>
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color={isDark ? "#F9FAFB" : "#111827"}
                    />
                    <Text style={styles.rightButtonText}>
                      {t("client.driversScreen.actions.call")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>

      <DriverTripDialogs
        styles={styles}
        clientName={clientInfo?.name ?? ""}
        showStart={state.showDialog1}
        onStartCancel={() => actions.setShowDialog1(false)}
        onStartOk={handlers.handleStartOk}
        showWaiting={state.showDialog2}
        onWaitingCancel={() => actions.setShowDialog2(false)}
        onWaitingOk={handlers.handleWaitingOk}
        showEmpty={state.showDialogEmpty}
        onEmptyCancel={() => actions.setShowDialogEmpty(false)}
        onEmptyOk={handlers.handleEmptyOk}
        showCancel={state.showDialogCancel}
        onCancelCancel={() => actions.setShowDialogCancel(false)}
        onCancelOk={handlers.handleCancelOk}
        showEnd={state.showDialog3}
        onEndCancel={() => actions.setShowDialog3(false)}
        onEndOk={handlers.handleEndTripOk}
        showEmergency={state.showLongPressDialog}
        onEmergencyStop={handlers.handleStopPress}
        onEmergencyEnd={handlers.handleEndPress}
        onEmergencyClose={() => actions.setShowLongPressDialog(false)}
        showStop={state.showStopDialog}
        onStopCancel={() => actions.setShowStopDialog(false)}
        onStopOk={handlers.handleStopOkPress}
        showForceEnd={state.showEndDialog}
        onForceEndCancel={() => actions.setShowEndDialog(false)}
        onForceEndOk={handlers.handleEndOkPress}
        showContinue={state.showContinueDialog}
        onContinueCancel={() => actions.setShowContinueDialog(false)}
        onContinueOk={handlers.handleContinueOk}
        showRating={state.showRatingDialog}
        onRatingCancel={handlers.handleRatingCancel}
        onRatingSubmit={handlers.handleRatingSubmit}
        emergencyActionsUsed={state.emergencyActionsUsed}
        emergencyActionType={state.emergencyActionType}
      />

      <DriverCallSheet
        isVisible={state.isCallSheetOpen}
        isDark={isDark}
        role={role}
        callAnim={callSheet.callAnim}
        driver={driverInfo}
        onClose={callSheet.closeCallSheet}
        onNetworkCall={callSheet.handleNetworkCall}
        onInternetCall={callSheet.handleInternetCall}
      />

      <Modal
        visible={state.showGoOnlineConfirm}
        transparent
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.dialogOverlay}
          activeOpacity={1}
          onPress={() => actions.setShowGoOnlineConfirm(false)}
        >
          <TouchableOpacity
            style={styles.onlineDialogContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.dialogTitle}>
              {t("driver.status.goOnlineMessage")}
            </Text>
            <View style={styles.onlineDialogButtonsContainer}>
              <TouchableOpacity
                style={styles.dialogOkButton}
                onPress={handlers.handleGoOnlineConfirm}
              >
                <Text style={styles.dialogOkButtonText}>
                  {t("driver.tripDialogs.buttons.okAction")}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
};

export default DriverModal;
