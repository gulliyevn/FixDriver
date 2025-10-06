import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./ScheduleContainer.styles";
import type { ColorPalette } from "../../../../constants/colors";

interface ScheduleContainerContentProps {
  fixedMode: boolean;
  weekdaysMode: boolean;
  activeDays?: string[];
  allowTimeSelection: boolean;
  colors: ColorPalette;
  t: (key: string) => string;
  calculatedTime: string;
  isCalculating: boolean;
  // Фиксированный режим
  fixedTime?: string;
  onFixedTimePress: () => void;
  // Будни/выходные
  weekdayTime?: string;
  weekendTime?: string;
  calculatedWeekdayTime?: string;
  calculatedWeekendTime?: string;
  onWeekdayPress: () => void;
  onWeekendPress: () => void;
  // Плавающий режим
  visibleDays: Array<{ key: string; label: string }>;
  dayTimes: Record<string, string>;
  localDayTimes: Record<string, string>;
  onDayPress: (dayKey: string) => void;
}

export const ScheduleContainerContent: React.FC<
  ScheduleContainerContentProps
> = ({
  fixedMode,
  weekdaysMode,
  activeDays,
  allowTimeSelection,
  colors,
  t,
  calculatedTime,
  isCalculating,
  fixedTime,
  onFixedTimePress,
  weekdayTime,
  weekendTime,
  calculatedWeekdayTime,
  calculatedWeekendTime,
  onWeekdayPress,
  onWeekendPress,
  visibleDays,
  dayTimes,
  localDayTimes,
  onDayPress,
}) => {


  if (fixedMode) {
    if (weekdaysMode) {
      // Будни/Выходные внутри контейнера
      if (!activeDays || activeDays.length === 0) {
        return (
          <View style={styles.weekDaysContainer}>
            <Text style={[styles.selectDaysText, { color: colors.text }]}>
              {t("common.selectTripDays")}
            </Text>
          </View>
        );
      }

      return (
        <View style={{ marginTop: 8, marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text style={[styles.dayText, { color: colors.text }]}>
              {t("common.weekdaysOnly")}
              {":"}
            </Text>
            <TouchableOpacity
              style={[
                styles.dayButton,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: allowTimeSelection ? 1 : 0.5,
                },
              ]}
              activeOpacity={0.8}
              onPress={onWeekdayPress}
            >
              <Text style={[styles.dayText, { color: colors.text }]}>
                {allowTimeSelection
                  ? weekdayTime || "--:--"
                  : isCalculating
                    ? "..."
                    : calculatedWeekdayTime || calculatedTime}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text style={[styles.dayText, { color: colors.text }]}>
              {t("common.weekend") || "Выходные"}
              {":"}
            </Text>
            <TouchableOpacity
              style={[
                styles.dayButton,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: allowTimeSelection ? 1 : 0.5,
                },
              ]}
              activeOpacity={0.8}
              onPress={onWeekendPress}
            >
              <Text style={[styles.dayText, { color: colors.text }]}>
                {allowTimeSelection
                  ? weekendTime || "--:--"
                  : isCalculating
                    ? "..."
                    : calculatedWeekendTime || calculatedTime}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      // Ежедневно: один таймпикер
      if (!activeDays || activeDays.length === 0) {
        return (
          <View style={styles.weekDaysContainer}>
            <Text style={[styles.selectDaysText, { color: colors.text }]}>
              {t("common.selectTripDays")}
            </Text>
          </View>
        );
      }

      return (
        <View style={styles.weekDaysContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.dayText, { color: colors.text }]}>
              {t("common.departureTime")}
              {":"}
            </Text>
            <TouchableOpacity
              style={[
                styles.dayButton,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: allowTimeSelection ? 1 : 0.5,
                },
              ]}
              onPress={onFixedTimePress}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayText, { color: colors.text }]}>
                {allowTimeSelection
                  ? fixedTime
                    ? fixedTime
                    : "--:--"
                  : isCalculating
                    ? "..."
                    : calculatedTime}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  } else {
    // Плавающий режим
    if (!activeDays || activeDays.length === 0) {
      return (
        <View style={styles.weekDaysContainer}>
          <Text style={[styles.selectDaysText, { color: colors.text }]}>
            {t("common.selectTripDays")}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.weekDaysContainer}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          {/* Левая подпись до тех пор, пока хватает места */}
          {activeDays ? (
            activeDays.length <= 4 ? (
              <Text
                style={[styles.dayText, { color: colors.text, marginRight: 8 }]}
              >
                {" "}
                {t("common.departureTime")}
                {":"}{" "}
              </Text>
            ) : activeDays.length === 5 ? (
              <Text
                style={[styles.dayText, { color: colors.text, marginRight: 8 }]}
              >
                {" "}
                {t("common.time")}
                {":"}{" "}
              </Text>
            ) : null
          ) : null}

          {/* Кнопки дней слева направо */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              marginLeft: -4,
            }}
          >
            {visibleDays.map((day) => {
              const selectedTime =
                (dayTimes && dayTimes[day.key]) || localDayTimes[day.key];
              return (
                <TouchableOpacity
                  key={day.key}
                  style={[
                    styles.dayButton,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      marginLeft: 1,
                    },
                  ]}
                  onPress={() => onDayPress(day.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayText, { color: colors.text }]}>
                    {allowTimeSelection
                      ? selectedTime
                        ? selectedTime
                        : day.label
                      : isCalculating
                        ? "..."
                        : calculatedTime}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
};
