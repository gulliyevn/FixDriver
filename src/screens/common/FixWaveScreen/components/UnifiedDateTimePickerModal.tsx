import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import {
  createTimePickerModalStyles,
  platformSpecificStyles,
} from "./TimePickerModal.styles";

interface UnifiedDateTimePickerModalProps {
  visible: boolean;
  title: string;
  value: Date | null;
  onCancel: () => void;
  onConfirm: (date: Date) => void;
  colors: any;
  t: (key: string) => string;
  isDark?: boolean;
}

const pad = (num: number, size = 2) => String(num).padStart(size, "0");

const getDaysInMonth = (year: number, monthIndex0: number) => {
  return new Date(year, monthIndex0 + 1, 0).getDate();
};

export const UnifiedDateTimePickerModal: React.FC<
  UnifiedDateTimePickerModalProps
> = ({
  visible,
  title,
  value,
  onCancel,
  onConfirm,
  colors,
  t,
  isDark = false,
}) => {
  const initial = value ?? new Date();
  const [day, setDay] = useState<number>(initial.getDate());
  const [month, setMonth] = useState<number>(initial.getMonth() + 1); // 1-12
  const [year, setYear] = useState<number>(initial.getFullYear());
  const [hour, setHour] = useState<number>(initial.getHours());
  const [minute, setMinute] = useState<number>(initial.getMinutes());

  useEffect(() => {
    if (!visible) return;
    const d = value ?? new Date();
    setDay(d.getDate());
    setMonth(d.getMonth() + 1);
    setYear(d.getFullYear());
    setHour(d.getHours());
    setMinute(d.getMinutes());
  }, [visible, value]);

  const styles = useMemo(() => {
    const base = createTimePickerModalStyles(isDark, colors.primary);
    const platform =
      platformSpecificStyles[
        Platform.OS as keyof typeof platformSpecificStyles
      ];
    return {
      ...base,
      modalContainer: [base.modalContainer, platform?.modalContainer],
      pickerContainer: [base.pickerContainer, platform?.pickerContainer],
    };
  }, [isDark, colors.primary]);

  const screenWidth = Dimensions.get("window").width;
  const isSmall = screenWidth < 360;
  const labelColor = isDark ? "#FFFFFF" : "#003366";
  const itemColor = isDark ? "#F3F4F6" : "#0A0A0A";
  const labelFont = isSmall ? 12 : 13;
  const pickerItemStyle = Platform.select({
    ios: { color: itemColor, fontSize: isSmall ? 20 : 22, fontWeight: "600" },
    android: undefined,
  });
  const highlightHeight = isSmall ? 40 : 44;
  const itemHeight = isSmall ? 36 : 40;

  const WheelColumn: React.FC<{
    data: number[];
    value: number;
    onChange: (v: number) => void;
  }> = ({ data, value, onChange }) => {
    // iOS: нативный барабан для идеального UX
    if (Platform.OS === "ios") {
      return (
        <Picker
          selectedValue={value}
          onValueChange={(v) => onChange(Number(v))}
          dropdownIconColor={itemColor}
          itemStyle={pickerItemStyle as any}
        >
          {data.map((n) => (
            <Picker.Item key={n} label={pad(n)} value={n} color={itemColor} />
          ))}
        </Picker>
      );
    }

    // Android/веб: унифицированное колесо на базе FlatList
    const initialIndex = Math.max(
      0,
      data.findIndex((v) => v === value),
    );
    let listRef: FlatList<number> | null = null;

    const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / itemHeight);
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      const selected = data[clamped];
      if (selected !== undefined) onChange(selected);
      listRef?.scrollToOffset({
        offset: clamped * itemHeight,
        animated: false,
      });
    };

    const topBottomPadding =
      (highlightHeight - itemHeight) / 2 + itemHeight * 2;

    return (
      <FlatList
        ref={(r) => {
          listRef = r;
        }}
        data={data}
        keyExtractor={(n) => String(n)}
        initialScrollIndex={initialIndex === -1 ? 0 : initialIndex}
        getItemLayout={(_d, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumEnd}
        contentContainerStyle={{
          paddingTop: topBottomPadding,
          paddingBottom: topBottomPadding,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              height: itemHeight,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: itemColor,
                fontSize: isSmall ? 18 : 20,
                fontWeight: "600",
              }}
            >
              {pad(item)}
            </Text>
          </View>
        )}
      />
    );
  };

  const years = useMemo(() => {
    const nowYear = new Date().getFullYear();
    const arr: number[] = [];
    for (let y = nowYear; y <= nowYear + 3; y++) arr.push(y);
    return arr;
  }, []);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => {
    const max = getDaysInMonth(year, month - 1);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [year, month]);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  // Clamp day if month/year changed and current day is out of range
  useEffect(() => {
    const max = getDaysInMonth(year, month - 1);
    if (day > max) setDay(max);
  }, [year, month, day]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, { color: labelColor }]}>
            {title}
          </Text>

          <View style={{ position: "relative" }}>
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: highlightHeight,
                backgroundColor: isDark
                  ? "rgba(156,163,175,0.10)"
                  : "rgba(8,49,152,0.08)",
                transform: [{ translateY: -highlightHeight / 2 }],
                borderRadius: 10,
                zIndex: 0,
              }}
            />

            <LinearGradient
              pointerEvents="none"
              colors={[
                isDark ? colors.surface : colors.background,
                isDark ? "rgba(31,41,55,0.0)" : "rgba(255,255,255,0.0)",
              ]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 24,
                zIndex: 0,
              }}
            />
            <LinearGradient
              pointerEvents="none"
              colors={[
                isDark ? "rgba(31,41,55,0.0)" : "rgba(255,255,255,0.0)",
                isDark ? colors.surface : colors.background,
              ]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 24,
                zIndex: 0,
              }}
            />

            <View
              style={[
                styles.pickerContainer,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: isDark ? colors.surface : colors.background,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingVertical: 8,
                  zIndex: 1,
                },
              ]}
            >
              <View style={{ flex: 1, marginHorizontal: 4 }}>
                <Text
                  style={[
                    styles.modalTitle,
                    { fontSize: labelFont, marginBottom: 4, color: labelColor },
                  ]}
                >
                  DD
                </Text>
                <WheelColumn data={days} value={day} onChange={setDay} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 4 }}>
                <Text
                  style={[
                    styles.modalTitle,
                    { fontSize: labelFont, marginBottom: 4, color: labelColor },
                  ]}
                >
                  MM
                </Text>
                <WheelColumn data={months} value={month} onChange={setMonth} />
              </View>
              <View style={{ flex: 1.2, marginHorizontal: 4 }}>
                <Text
                  style={[
                    styles.modalTitle,
                    { fontSize: labelFont, marginBottom: 4, color: labelColor },
                  ]}
                >
                  YY
                </Text>
                <WheelColumn data={years} value={year} onChange={setYear} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 4 }}>
                <Text
                  style={[
                    styles.modalTitle,
                    { fontSize: labelFont, marginBottom: 4, color: labelColor },
                  ]}
                >
                  HH
                </Text>
                <WheelColumn data={hours} value={hour} onChange={setHour} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 4 }}>
                <Text
                  style={[
                    styles.modalTitle,
                    { fontSize: labelFont, marginBottom: 4, color: labelColor },
                  ]}
                >
                  MM
                </Text>
                <WheelColumn
                  data={minutes}
                  value={minute}
                  onChange={setMinute}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>
                {t("common.cancel") || "Отмена"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                const result = new Date(
                  year,
                  month - 1,
                  day,
                  hour,
                  minute,
                  0,
                  0,
                );
                onConfirm(result);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>
                {t("common.done") || "Готово"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UnifiedDateTimePickerModal;
