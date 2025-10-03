import { useRef, useCallback, useState } from "react";
import { Animated } from "react-native";
import { OrdersMapActions } from "../types/orders-map.types";

export const useMapSettings = (actions: OrdersMapActions) => {
  const settingsRotateAnim = useRef(new Animated.Value(0)).current;
  const settingsPanelAnim = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSettingsPress = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    actions.setIsSettingsExpanded(!isExpanded);

    Animated.parallel([
      Animated.timing(settingsRotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(settingsPanelAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded, actions]);

  const settingsRotate = settingsRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const settingsPanelWidth = settingsPanelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  const settingsPanelOpacity = settingsPanelAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const headerTitleOpacity = settingsPanelAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.3, 0],
  });

  return {
    handleSettingsPress,
    settingsRotate,
    settingsPanelWidth,
    settingsPanelOpacity,
    headerTitleOpacity,
  };
};
