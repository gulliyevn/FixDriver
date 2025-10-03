import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { getCurrentColors } from "../constants/colors";

interface ReturnTripCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

const ReturnTripCheckbox: React.FC<ReturnTripCheckboxProps> = ({
  checked,
  onCheckedChange,
  label = "Туда-обратно",
}) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);

  return (
    <TouchableOpacity
      onPress={() => onCheckedChange(!checked)}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? colors.primary : "transparent",
            borderColor: checked ? colors.primary : colors.border,
          },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text
        style={[
          styles.label,
          { color: colors.text, opacity: isDark ? 0.9 : 1 },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
  },
});

export default ReturnTripCheckbox;
