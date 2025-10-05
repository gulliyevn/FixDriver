import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { styles } from "./ScheduleContainer.styles";
import { useScheduleContainer } from "../hooks/useScheduleContainer";
import { TimePickerModal } from "./TimePickerModal";
import { ScheduleContainerContent } from "./ScheduleContainerContent";

interface ScheduleContainerProps {
  fromAddress: string;
  borderColor: string;
  colors: any;
  t: (key: string) => string;
  isLast: boolean;
  dayTimes?: Record<string, string>;
  onDayTimeChange?: (dayKey: string, time: string) => void;
  activeDays?: string[];
  fixedMode?: boolean;
  fixedTime?: string;
  onFixedTimeChange?: (time: string) => void;
  weekdaysMode?: boolean;
  weekdayTime?: string;
  weekendTime?: string;
  onWeekdayTimeChange?: (time: string) => void;
  onWeekendTimeChange?: (time: string) => void;
  showDays?: boolean;
  allowTimeSelection?: boolean;
  fromCoordinate?: { latitude: number; longitude: number };
  toCoordinate?: { latitude: number; longitude: number };
  departureTime?: Date;
  isDark?: boolean;
  shouldCalculateTime?: boolean;
  shouldShowCalculatedTime?: boolean;
  calculatedWeekdayTime?: string;
  calculatedWeekendTime?: string;
}

export const ScheduleContainer: React.FC<ScheduleContainerProps> = ({
  fromAddress,
  borderColor,
  colors,
  t,
  isLast,
  dayTimes = {},
  onDayTimeChange,
  activeDays,
  fixedMode = false,
  fixedTime,
  onFixedTimeChange,
  weekdaysMode = false,
  weekdayTime,
  weekendTime,
  onWeekdayTimeChange,
  onWeekendTimeChange,
  allowTimeSelection = true,
  fromCoordinate,
  toCoordinate,
  departureTime,
  isDark,
  shouldCalculateTime = false,
  calculatedWeekdayTime,
  calculatedWeekendTime,
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

  const visibleDays = useMemo(() => {
    if (activeDays && activeDays.length > 0) {
      const set = new Set(activeDays);
      return weekDays.filter((d) => set.has(d.key));
    }
    return weekDays;
  }, [activeDays]);

  // Хук для управления состоянием
  const {
    pickerState,
    setPickerState,
    dayTempDate,
    setDayTempDate,
    localDayTimes,
    setLocalDayTimes,
    fixedPickerVisible,
    setFixedPickerVisible,
    fixedTempDate,
    setFixedTempDate,
    weekdayPickerVisible,
    setWeekdayPickerVisible,
    weekdayTempDate,
    setWeekdayTempDate,
    weekendPickerVisible,
    setWeekendPickerVisible,
    weekendTempDate,
    setWeekendTempDate,
    calculatedTime,
    isCalculating,
  } = useScheduleContainer(
    allowTimeSelection,
    fromCoordinate,
    toCoordinate,
    departureTime,
    shouldCalculateTime,
  );

  // Обработчики для плавающего режима
  const openPickerForDay = (dayKey: string) => {
    setPickerState({ dayKey, date: new Date(), isVisible: true });
    setDayTempDate(new Date());
  };

  const handleDayModalCancel = () => {
    setPickerState((prev) => ({ ...prev, isVisible: false, dayKey: null }));
  };

  const handleDayModalConfirm = () => {
    if (!pickerState.dayKey) return;
    const hh = String(dayTempDate.getHours()).padStart(2, "0");
    const mm = String(dayTempDate.getMinutes()).padStart(2, "0");
    const formatted = `${hh}:${mm}`;
    onDayTimeChange && onDayTimeChange(pickerState.dayKey, formatted);
    setLocalDayTimes((prev) => ({
      ...prev,
      [pickerState.dayKey as string]: formatted,
    }));
    setPickerState((prev) => ({ ...prev, isVisible: false, dayKey: null }));
  };

  // Обработчики для фиксированного режима
  const handleFixedTimePress = () => {
    if (!allowTimeSelection) return;
    setFixedTempDate(new Date());
    setFixedPickerVisible(true);
  };

  const handleFixedModalCancel = () => {
    setFixedPickerVisible(false);
  };

  const handleFixedModalConfirm = () => {
    const hh = String(fixedTempDate.getHours()).padStart(2, "0");
    const mm = String(fixedTempDate.getMinutes()).padStart(2, "0");
    const formatted = `${hh}:${mm}`;
    onFixedTimeChange && onFixedTimeChange(formatted);
    setFixedPickerVisible(false);
  };

  // Обработчики для будни/выходные
  const handleWeekdayPress = () => {
    if (!allowTimeSelection) return;
    setWeekdayPickerVisible(true);
  };

  const handleWeekendPress = () => {
    if (!allowTimeSelection) return;
    setWeekendPickerVisible(true);
  };

  const handleWeekdayConfirm = () => {
    const hh = String(weekdayTempDate.getHours()).padStart(2, "0");
    const mm = String(weekdayTempDate.getMinutes()).padStart(2, "0");
    onWeekdayTimeChange && onWeekdayTimeChange(`${hh}:${mm}`);
    setWeekdayPickerVisible(false);
  };

  const handleWeekendConfirm = () => {
    const hh = String(weekendTempDate.getHours()).padStart(2, "0");
    const mm = String(weekendTempDate.getMinutes()).padStart(2, "0");
    onWeekendTimeChange && onWeekendTimeChange(`${hh}:${mm}`);
    setWeekendPickerVisible(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: borderColor,
          marginBottom: isLast ? 20 : 10,
          height:
            fixedMode && weekdaysMode && activeDays && activeDays.length > 0
              ? 176
              : undefined,
        },
      ]}
    >
      {/* Адрес отправления */}
      <Text style={[styles.addressText, { color: colors.text }]}>
        {fromAddress || "Адрес не выбран"}
      </Text>

      {/* Верхняя линия */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Содержимое контейнера */}
      <ScheduleContainerContent
        fixedMode={fixedMode}
        weekdaysMode={weekdaysMode}
        activeDays={activeDays}
        allowTimeSelection={allowTimeSelection}
        colors={colors}
        t={t}
        calculatedTime={calculatedTime}
        isCalculating={isCalculating}
        fixedTime={fixedTime}
        onFixedTimePress={handleFixedTimePress}
        weekdayTime={weekdayTime}
        weekendTime={weekendTime}
        calculatedWeekdayTime={calculatedWeekdayTime}
        calculatedWeekendTime={calculatedWeekendTime}
        onWeekdayPress={handleWeekdayPress}
        onWeekendPress={handleWeekendPress}
        visibleDays={visibleDays}
        dayTimes={dayTimes}
        localDayTimes={localDayTimes}
        onDayPress={openPickerForDay}
      />

      {/* Нижняя линия */}
      <View
        style={[styles.bottomDivider, { backgroundColor: colors.border }]}
      />

      {/* Модальные окна */}
      <TimePickerModal
        visible={pickerState.isVisible}
        title={t("common.selectTime") || "Выберите время"}
        value={dayTempDate}
        onChange={setDayTempDate}
        onCancel={handleDayModalCancel}
        onConfirm={handleDayModalConfirm}
        colors={colors}
        t={t}
        isDark={isDark}
      />

      <TimePickerModal
        visible={fixedPickerVisible}
        title={t("common.departureTime")}
        value={fixedTempDate}
        onChange={setFixedTempDate}
        onCancel={handleFixedModalCancel}
        onConfirm={handleFixedModalConfirm}
        colors={colors}
        t={t}
        isDark={isDark}
      />

      <TimePickerModal
        visible={weekdayPickerVisible}
        title={t("common.weekdaysOnly")}
        value={weekdayTempDate}
        onChange={setWeekdayTempDate}
        onCancel={() => setWeekdayPickerVisible(false)}
        onConfirm={handleWeekdayConfirm}
        colors={colors}
        t={t}
        isDark={isDark}
      />

      <TimePickerModal
        visible={weekendPickerVisible}
        title={t("common.weekend") || "Выходные"}
        value={weekendTempDate}
        onChange={setWeekendTempDate}
        onCancel={() => setWeekendPickerVisible(false)}
        onConfirm={handleWeekendConfirm}
        colors={colors}
        t={t}
        isDark={isDark}
      />
    </View>
  );
};
