import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Pressable,
  Linking,
  Modal,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../../hooks/useI18n";
import { Driver } from "../../types/driver";
import { DriverTrip } from "../../services/DriverService";
import SwipeableDefault from "react-native-gesture-handler/Swipeable";

export type DriverListItemProps = {
  driver: Driver & {
    isFavorite?: boolean;
    isPaused?: boolean;
    schedule?: string;
    price?: string;
    distance?: string;
    time?: string;
    childName?: string;
    childAge?: number;
    childType?: string;
    trips?: DriverTrip[];
  };
  isDark: boolean;
  styles: {
    swipeActionsLeft: StyleProp<ViewStyle>;
    swipeActionsLeftColumn: StyleProp<ViewStyle>;
    swipeAction: StyleProp<ViewStyle>;
    pauseAction: StyleProp<ViewStyle>;
    favoriteAction: StyleProp<ViewStyle>;
    swipeActionInnerLeft: StyleProp<ViewStyle>;
    swipeActionsRight: StyleProp<ViewStyle>;
    deleteAction: StyleProp<ViewStyle>;
    swipeActionInnerRight: StyleProp<ViewStyle>;
    driverItem: StyleProp<ViewStyle>;
    driverItemPaused: StyleProp<ViewStyle>;
    pauseOverlay: StyleProp<ViewStyle>;
    pauseIconLarge: StyleProp<ViewStyle>;
    driverHeader: StyleProp<ViewStyle>;
    avatarContainer: StyleProp<ViewStyle>;
    avatar: StyleProp<ViewStyle>;
    onlineIndicator: StyleProp<ViewStyle>;
    driverMainInfo: StyleProp<ViewStyle>;
    nameRatingRow: StyleProp<ViewStyle>;
    nameContainer: StyleProp<ViewStyle>;
    driverName: StyleProp<TextStyle>;
    premiumIcon: StyleProp<ViewStyle>;
    favoriteIcon: StyleProp<ViewStyle>;
    pauseIcon: StyleProp<ViewStyle>;
    ratingText: StyleProp<TextStyle>;
    vehicleExpandRow: StyleProp<ViewStyle>;
    vehicleInfoContainer: StyleProp<ViewStyle>;
    childIcon: StyleProp<ViewStyle>;
    vehicleInfo: StyleProp<TextStyle>;
    driverInfoBar: StyleProp<ViewStyle>;
    scheduleInfo: StyleProp<ViewStyle>;
    scheduleText: StyleProp<TextStyle>;
    priceInfo: StyleProp<ViewStyle>;
    priceText: StyleProp<TextStyle>;
    distanceInfo: StyleProp<ViewStyle>;
    distanceText: StyleProp<TextStyle>;
    timeInfo: StyleProp<ViewStyle>;
    timeText: StyleProp<TextStyle>;
    expandableContent: StyleProp<ViewStyle>;
    tripsContainer: StyleProp<ViewStyle>;
    tripItem: StyleProp<ViewStyle>;
    tripDot: StyleProp<ViewStyle>;
    tripDotBlue: StyleProp<ViewStyle>;
    tripDotLocation: StyleProp<ViewStyle>;
    tripText: StyleProp<TextStyle>;
    tripTime: StyleProp<TextStyle>;
    bottomBorder: StyleProp<ViewStyle>;
    buttonsContainer: StyleProp<ViewStyle>;
    leftButton: StyleProp<ViewStyle>;
    buttonContent: StyleProp<ViewStyle>;
    leftButtonText: StyleProp<TextStyle>;
    rightButton: StyleProp<ViewStyle>;
    rightButtonContent: StyleProp<ViewStyle>;
    rightButtonText: StyleProp<TextStyle>;
    callSheetOverlay: StyleProp<ViewStyle>;
    callSheetBackdrop: StyleProp<ViewStyle>;
    callSheetContainer: StyleProp<ViewStyle>;
    callSheetClose: StyleProp<ViewStyle>;
    callSheetHandle: StyleProp<ViewStyle>;
    callSheetTitle: StyleProp<TextStyle>;
    callSheetOption: StyleProp<ViewStyle>;
    callSheetOptionText: StyleProp<TextStyle>;
  };
  actionWidth: number;
  SwipeableComponent: typeof SwipeableDefault;
  role?: "client" | "driver";
  swipeRefSetter?: (id: string, ref: unknown) => void;
  onSwipeableWillOpen?: (id: string, ref: unknown) => void;
  onSwipeableClose?: (id: string, ref: unknown) => void;
  onToggleFavorite: (driverId: string) => void;
  onDelete: (driverId: string) => void;
  onChat: (driver: Driver) => void;
  onTogglePause?: (driverId: string) => void;
};

const DriverListItem: React.FC<DriverListItemProps> = ({
  driver,
  isDark,
  styles,
  actionWidth,
  SwipeableComponent,
  swipeRefSetter,
  onSwipeableWillOpen,
  onSwipeableClose,
  onToggleFavorite,
  onDelete,
  onChat,
  onTogglePause,
  role = "client",
}) => {
  const { t } = useI18n();

  const [isExpanded, setIsExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const [isCallSheetOpen, setCallSheetOpen] = useState(false);
  const callAnim = useRef(new Animated.Value(0)).current;

  const toggleExpanded = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    Animated.timing(expandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, expandAnim]);

  const openCallSheet = useCallback(() => {
    setCallSheetOpen(true);
    Animated.timing(callAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [callAnim]);

  const closeCallSheet = useCallback(() => {
    Animated.timing(callAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
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
    // Сообщение реализовано в родителе ранее, здесь оставляем только закрытие
  }, [closeCallSheet]);

  const handlePausePress = useCallback(() => {
    if (onTogglePause) {
      onTogglePause(driver.id);
    }
  }, [onTogglePause, driver.id]);

  const driverTrips = useMemo<DriverTrip[]>(
    () => driver.trips ?? [],
    [driver.trips],
  );

  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [0, actionWidth],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    const opacity = dragX.interpolate({
      inputRange: [0, actionWidth * 0.6, actionWidth],
      outputRange: [0, 0.6, 1],
      extrapolate: "clamp",
    });
    return (
      <View style={[styles.swipeActionsLeft]}>
        <View style={styles.swipeActionsLeftColumn}>
          <Animated.View style={{ transform: [{ scale }], opacity }}>
            <TouchableOpacity
              style={[
                styles.swipeAction,
                styles.pauseAction,
                styles.swipeActionInnerLeft,
              ]}
              onPress={handlePausePress}
              accessibilityRole="button"
              accessibilityLabel={driver.isPaused ? "resume" : "pause"}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.85}
            >
              <Ionicons
                name={driver.isPaused ? "play" : "pause"}
                size={28}
                color="#fff"
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ scale }], opacity }}>
            <TouchableOpacity
              style={[
                styles.swipeAction,
                styles.favoriteAction,
                styles.swipeActionInnerLeft,
              ]}
              onPress={() => onToggleFavorite(driver.id)}
              accessibilityRole="button"
              accessibilityLabel="bookmark"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.85}
            >
              <Ionicons name="bookmark" size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-actionWidth, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    const opacity = dragX.interpolate({
      inputRange: [-actionWidth, -actionWidth * 0.6, 0],
      outputRange: [1, 0.6, 0],
      extrapolate: "clamp",
    });
    return (
      <View style={[styles.swipeActionsRight]}>
        <Animated.View style={{ transform: [{ scale }], opacity }}>
          <TouchableOpacity
            style={[
              styles.swipeAction,
              styles.deleteAction,
              styles.swipeActionInnerRight,
            ]}
            onPress={() => onDelete(driver.id)}
            accessibilityRole="button"
            accessibilityLabel="delete"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.85}
          >
            <Ionicons name="trash" size={28} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <>
      <SwipeableComponent
        ref={(ref: unknown) => swipeRefSetter?.(driver.id, ref)}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        leftThreshold={80}
        rightThreshold={80}
        friction={1.5}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableWillOpen={() => onSwipeableWillOpen?.(driver.id, null)}
        onSwipeableClose={() => onSwipeableClose?.(driver.id, null)}
      >
        <View
          style={[
            styles.driverItem,
            driver.isPaused && styles.driverItemPaused,
          ]}
        >
          {driver.isPaused && (
            <View style={styles.pauseOverlay}>
              <View style={styles.pauseIconLarge}>
                <Ionicons name="pause" size={32} color="#000" />
              </View>
            </View>
          )}
          <TouchableOpacity
            style={styles.driverHeader}
            onPress={toggleExpanded}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.driverMainInfo}>
              <View style={styles.nameRatingRow}>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.driverName}
                  >{`${driver.first_name} ${driver.last_name}`}</Text>
                  <Ionicons
                    name="star"
                    size={16}
                    color="#9CA3AF"
                    style={styles.premiumIcon}
                  />
                  {driver.isFavorite && (
                    <Ionicons
                      name="bookmark"
                      size={14}
                      color={isDark ? "#F9FAFB" : "#111827"}
                      style={styles.favoriteIcon}
                    />
                  )}
                  {driver.isPaused && (
                    <Ionicons
                      name="pause"
                      size={14}
                      color="#9CA3AF"
                      style={styles.pauseIcon}
                    />
                  )}
                </View>
                <Text style={styles.ratingText}>
                  {driver.rating.toFixed(1)}
                </Text>
              </View>
              <View style={styles.vehicleExpandRow}>
                <View style={styles.vehicleInfoContainer}>
                  {role === "driver" && (
                    <Ionicons
                      name="football"
                      size={16}
                      color="#9CA3AF"
                      style={styles.childIcon}
                    />
                  )}
                  <Text style={styles.vehicleInfo}>
                    {role === "driver"
                      ? `${driver.childName ?? ""} • ${driver.childAge ?? ""} лет`
                      : `${driver.vehicle_brand} ${driver.vehicle_model} • ${driver.vehicle_number}`}
                  </Text>
                </View>
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: expandAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "180deg"],
                        }),
                      },
                    ],
                  }}
                >
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                </Animated.View>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.driverInfoBar}>
            <View style={styles.scheduleInfo}>
              <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
              <Text style={styles.scheduleText}>{driver.schedule ?? ""}</Text>
            </View>
            <View style={styles.priceInfo}>
              <Ionicons
                name={role === "driver" ? "wallet" : "pricetag-outline"}
                size={16}
                color="#9CA3AF"
              />
              <Text style={styles.priceText}>{driver.price ?? ""}</Text>
            </View>
            <View style={styles.distanceInfo}>
              <Ionicons name="location" size={16} color="#9CA3AF" />
              <Text style={styles.distanceText}>{driver.distance ?? ""}</Text>
            </View>
            <View style={styles.timeInfo}>
              <Ionicons
                name={role === "driver" ? "time" : "football"}
                size={16}
                color="#9CA3AF"
              />
              <Text style={styles.timeText}>
                {role === "driver"
                  ? (driver.time ?? "")
                  : (driver.childType ?? "")}
              </Text>
            </View>
          </View>

          <Animated.View
            style={[
              styles.expandableContent,
              {
                maxHeight: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 300],
                }),
                opacity: expandAnim.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ]}
          >
            <View style={styles.tripsContainer}>
              {driverTrips.map((trip, index) => (
                <React.Fragment key={`trip-${driver.id}-${index}`}>
                  <View style={styles.tripItem}>
                    <View
                      style={[
                        styles.tripDot,
                        trip.dotStyle === "blue" && styles.tripDotBlue,
                        trip.dotStyle === "location" && styles.tripDotLocation,
                      ]}
                    />
                    <Text style={styles.tripText}>{trip.text}</Text>
                    <Text style={styles.tripTime}>{trip.time}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>

            <View style={styles.bottomBorder} />

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.leftButton}
                onPress={() => onChat(driver)}
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
                onPress={openCallSheet}
              >
                <View style={styles.rightButtonContent}>
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color={isDark ? "#F9FAFB" : "#111827"}
                  />
                  <Text style={styles.rightButtonText}>
                    {role === "driver"
                      ? t("driver.chat.call")
                      : t("client.driversScreen.actions.call")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SwipeableComponent>

      {/* Модалка как Modal для правильного позиционирования поверх всего экрана */}
      <Modal
        visible={isCallSheetOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeCallSheet}
      >
        <View style={styles.callSheetOverlay}>
          <Pressable
            style={styles.callSheetBackdrop}
            onPress={closeCallSheet}
          />
          <Animated.View
            style={[
              styles.callSheetContainer,
              {
                transform: [
                  {
                    translateY: callAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.callSheetClose}
              onPress={closeCallSheet}
              accessibilityLabel={t("common.close")}
            >
              <Ionicons
                name="close"
                size={22}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
            </TouchableOpacity>
            <View style={styles.callSheetHandle} />
            <Text style={styles.callSheetTitle}>
              {t("client.driversScreen.call.callTitle", {
                firstName: driver.first_name || "",
                lastName: driver.last_name || "",
              })}
            </Text>
            <TouchableOpacity
              style={styles.callSheetOption}
              onPress={handleInternetCall}
            >
              <Ionicons
                name="wifi"
                size={24}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
              <Text style={styles.callSheetOptionText}>
                {t("client.driversScreen.call.internetCall")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callSheetOption}
              onPress={handleNetworkCall}
            >
              <Ionicons
                name="call"
                size={24}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
              <Text style={styles.callSheetOptionText}>
                {t("client.driversScreen.call.networkCallWithNumber", {
                  phone: driver.phone_number || "",
                })}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(DriverListItem);
