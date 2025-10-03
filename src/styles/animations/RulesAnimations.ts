import { Animated } from "react-native";

export const createSlideAnimation = (slideAnim: Animated.Value) => {
  return {
    transform: [
      {
        translateX: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
      },
    ],
    opacity: slideAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
    }),
  };
};

export const slideAnimationConfig = {
  open: {
    toValue: 1,
    useNativeDriver: true,
    tension: 100,
    friction: 8,
  },
  close: {
    toValue: 0,
    useNativeDriver: true,
    tension: 100,
    friction: 8,
  },
};
