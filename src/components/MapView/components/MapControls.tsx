import React from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { createMapViewStyles } from "../../../styles/components/MapView.styles";

interface MapControlsProps {
  buttonAnimations: Animated.Value[];
  onRefresh: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  buttonAnimations,
  onRefresh,
  onZoomIn,
  onZoomOut,
}) => {
  const { isDark } = useTheme();
  const styles = createMapViewStyles(isDark);

  const buttonIcons = [
    "refresh-outline",
    "location-sharp",
    "locate-outline",
    "layers-outline",
    "add-outline",
    "remove-outline",
  ] as const;

  const buttonActions = [
    onRefresh, // refresh-outline
    () => {}, // location-sharp
    () => {}, // locate-outline
    () => {}, // layers-outline
    onZoomIn, // add-outline
    onZoomOut, // remove-outline
  ];

  return (
    <View style={styles.additionalButtonsContainer}>
      {buttonAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={{
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={styles.additionalButton}
            onPress={buttonActions[index]}
          >
            <Ionicons
              name={buttonIcons[index]}
              size={20}
              color={isDark ? "#F9FAFB" : "#111827"}
            />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

export default MapControls;
