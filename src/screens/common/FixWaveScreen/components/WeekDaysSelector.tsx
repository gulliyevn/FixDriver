import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./WeekDaysSelector.styles";
import type { ColorPalette } from "../../../../constants/colors";

interface WeekDaysSelectorProps {
  colors: ColorPalette;
  t: (key: string) => string;
  selectedDays?: string[];
  onSelectionChange?: (days: string[]) => void;
}

export const WeekDaysSelector: React.FC<WeekDaysSelectorProps> = ({
  colors,
  t,
  selectedDays = [],
  onSelectionChange,
}) => {
  const weekDays = [
    { key: "mon", label: t("common.mon") },
    { key: "tue", label: t("common.tue") },
    { key: "wed", label: t("common.wed") },
    { key: "thu", label: t("common.thu") },
    { key: "fri", label: t("common.fri") },
    { key: "sat", label: t("common.sat") },
    { key: "sun", label: t("common.sun") },
  ];

  const toggleDay = (key: string) => {
    const next = selectedDays.includes(key)
      ? selectedDays.filter((d) => d !== key)
      : [...selectedDays, key];
    console.log("📅 WeekDaysSelector - Переключение дня:", {
      key,
      selectedDays,
      next,
      isWeekday: ["mon", "tue", "wed", "thu", "fri"].includes(key),
      isWeekend: ["sat", "sun"].includes(key),
    });
    onSelectionChange && onSelectionChange(next);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {weekDays.map((day) => {
        const isActive = selectedDays.includes(day.key);
        return (
          <TouchableOpacity
            key={day.key}
            style={[
              styles.dayButton,
              {
                backgroundColor: isActive ? colors.primary : colors.background,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => toggleDay(day.key)}
          >
            <Text
              style={[
                styles.dayText,
                { color: isActive ? "#FFFFFF" : colors.text },
              ]}
            >
              {day.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
