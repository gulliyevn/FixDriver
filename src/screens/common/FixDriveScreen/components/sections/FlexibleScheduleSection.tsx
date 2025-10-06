import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TimePicker from "../../../../../components/TimePicker";
import ReturnTripCheckbox from "../../../../../components/ReturnTripCheckbox";
import { styles } from "./FlexibleScheduleSection.styles";
import { TIME_PICKER_COLORS } from "../constants";
import type { ColorPalette } from "../../../../../constants/colors";
import { CustomizationModal } from "../CustomizationModal";
import { useCustomizedDays } from "../hooks/useCustomizedDays";

interface Props {
  t: (key: string) => string;
  colors: ColorPalette;
  weekDays: { key: string; label: string }[];
  selectedDays: string[];
  selectedTime?: string;
  onTimeChange?: (time: string) => void;
  returnTime?: string;
  onReturnTimeChange?: (time: string) => void;
  isReturnTrip: boolean;
  onReturnTripChange?: (v: boolean) => void;
}

export const FlexibleScheduleSection: React.FC<Props> = ({
  t,
  colors,
  weekDays,
  selectedDays,
  selectedTime,
  onTimeChange,
  returnTime,
  onReturnTimeChange,
  isReturnTrip,
  onReturnTripChange,
}) => {
  const customization = useCustomizedDays();
  const customizedKeys = Object.keys(customization.customizedDays);
  const [mainValidationError] = useState<string | null>(null);

  // Функция для сортировки дней по порядку недели
  const sortDaysByWeekOrder = (days: string[]) => {
    const weekOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    return days.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
  };

  // Проверяем, есть ли еще дни для настройки (исключаем первый день, который уже показан сверху)
  const remainingDaysToCustomize = selectedDays
    .slice(1)
    .filter((day) => !customizedKeys.includes(day));
  const hasMoreDaysToCustomize = remainingDaysToCustomize.length > 0;


  // Функция для получения цвета дня
  const getDayColor = (dayKey: string) => {
    const colorMap: Record<string, string> = {
      mon: TIME_PICKER_COLORS.MONDAY,
      tue: TIME_PICKER_COLORS.TUESDAY,
      wed: TIME_PICKER_COLORS.WEDNESDAY,
      thu: TIME_PICKER_COLORS.THURSDAY,
      fri: TIME_PICKER_COLORS.FRIDAY,
      sat: TIME_PICKER_COLORS.SATURDAY,
      sun: TIME_PICKER_COLORS.SUNDAY,
    };
    return colorMap[dayKey] || TIME_PICKER_COLORS.THERE;
  };


  return (
    <View>
      <View style={styles.rowBetween}>
        <View style={styles.flex1}>
          <TimePicker
            value={selectedTime}
            onChange={onTimeChange || (() => {})}
            onClear={() => onTimeChange?.("")}
            placeholder={t("common.selectTime")}
            indicatorColor={getDayColor(
              sortDaysByWeekOrder([...selectedDays])[0],
            )}
            dayLabel={
              weekDays.find(
                (d) => d.key === sortDaysByWeekOrder([...selectedDays])[0],
              )?.label || ""
            }
          />
        </View>
        {hasMoreDaysToCustomize && customizedKeys.length === 0 && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={customization.openModal}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {sortDaysByWeekOrder(
        customizedKeys.filter((dayKey) => selectedDays.includes(dayKey)),
      ).map((dayKey, index, filteredKeys) => {
        const day = weekDays.find((d) => d.key === dayKey);
        if (!day) return null;
        const isLast = index === filteredKeys.length - 1;
        return (
          <View key={dayKey} style={[styles.rowBetween, styles.spacerTop16]}>
            <View style={styles.flex1}>
              <TimePicker
                value={customization.customizedDays[dayKey]?.there || ""}
                onChange={(time) =>
                  customization.setCustomizedDays({
                    ...customization.customizedDays,
                    [dayKey]: {
                      ...customization.customizedDays[dayKey],
                      there: time,
                      back: customization.customizedDays[dayKey]?.back || "",
                    },
                  })
                }
                placeholder={t("common.selectTime")}
                indicatorColor={getDayColor(dayKey)}
                dayLabel={day.label}
              />
            </View>
            {hasMoreDaysToCustomize && isLast && (
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={customization.openModal}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      {(selectedTime || customizedKeys.length > 0) && (
        <View style={[styles.spacerTop16, styles.spacerBottom16]}>
          <ReturnTripCheckbox
            checked={isReturnTrip}
            onCheckedChange={(v) => onReturnTripChange?.(v)}
            label={t("common.roundTrip")}
          />
        </View>
      )}

      {isReturnTrip && (selectedTime || customizedKeys.length > 0) && (
        <>
          <View style={styles.rowBetween}>
            <View style={styles.flex1}>
              <TimePicker
                value={returnTime}
                onChange={onReturnTimeChange || (() => {})}
                onClear={() => onReturnTimeChange?.("")}
                placeholder={t("common.selectTime")}
                indicatorColor={getDayColor(
                  sortDaysByWeekOrder([...selectedDays])[0],
                )}
                dayLabel={
                  weekDays.find(
                    (d) => d.key === sortDaysByWeekOrder([...selectedDays])[0],
                  )?.label || ""
                }
              />
            </View>
            {hasMoreDaysToCustomize && customizedKeys.length === 0 && (
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={customization.openModal}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          {sortDaysByWeekOrder(
            customizedKeys.filter((dayKey) => selectedDays.includes(dayKey)),
          ).map((dayKey, index, filteredKeys) => {
            const day = weekDays.find((d) => d.key === dayKey);
            if (!day) return null;
            const isLast = index === filteredKeys.length - 1;
            return (
              <View
                key={`return-${dayKey}`}
                style={[styles.rowBetween, styles.spacerTop16]}
              >
                <View style={styles.flex1}>
                  <TimePicker
                    value={customization.customizedDays[dayKey]?.back || ""}
                    onChange={(time) =>
                      customization.setCustomizedDays({
                        ...customization.customizedDays,
                        [dayKey]: {
                          ...customization.customizedDays[dayKey],
                          there:
                            customization.customizedDays[dayKey]?.there || "",
                          back: time,
                        },
                      })
                    }
                    placeholder={t("common.selectTime")}
                    indicatorColor={getDayColor(dayKey)}
                    dayLabel={day.label}
                  />
                </View>
                {hasMoreDaysToCustomize && isLast && (
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={customization.openModal}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </>
      )}

      {/* Ошибка валидации */}
      {mainValidationError && (
        <View
          style={{
            backgroundColor: "#FFE6E6",
            padding: 12,
            borderRadius: 8,
            marginTop: 16,
            borderWidth: 1,
            borderColor: "#FF6B6B",
          }}
        >
          <Text style={{ color: "#D32F2F", fontSize: 14, textAlign: "center" }}>
            {mainValidationError}
          </Text>
        </View>
      )}

      <CustomizationModal
        visible={customization.showCustomizationModal}
        onClose={customization.closeModal}
        onSave={customization.saveModal}
        colors={colors}
        t={t}
        weekDays={weekDays}
        selectedDays={selectedDays}
        selectedCustomDays={customization.selectedCustomDays}
        onSelectedCustomDaysChange={customization.setSelectedCustomDays}
        tempCustomizedDays={customization.tempCustomizedDays}
        onTempCustomizedDaysChange={customization.setTempCustomizedDays}
        isReturnTrip={isReturnTrip}
        validationError={customization.validationError}
      />
    </View>
  );
};
