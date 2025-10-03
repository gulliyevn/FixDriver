import { StyleSheet } from "react-native";

export const LanguageButtonStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  flag: {
    marginRight: 8,
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  icon: {
    marginLeft: 4,
  },
  animatedContainer: {
    // Стиль для Animated.View
  },
  // Размеры кнопки
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  // Размеры текста
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
  // Размеры флага
  flagSmall: {
    fontSize: 16,
  },
  flagMedium: {
    fontSize: 18,
  },
  flagLarge: {
    fontSize: 20,
  },
});
