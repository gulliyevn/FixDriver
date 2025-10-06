import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  createTimePickerModalStyles,
  platformSpecificStyles,
} from "./TimePickerModal.styles";
import type { ColorPalette } from "../../../../constants/colors";

interface DateTimePickerModalProps {
  visible: boolean;
  title: string;
  value: Date | null;
  onCancel: () => void;
  onConfirm: (date: Date) => void;
  colors: ColorPalette;
  t: (key: string) => string;
  isDark?: boolean;
}

export const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({
  visible,
  title,
  value,
  onCancel,
  onConfirm,
  colors,
  t,
  isDark = false,
}) => {
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  useEffect(() => {
    if (value) setTempDate(value);
  }, [value]);

  const styles = useMemo(() => {
    const baseStyles = createTimePickerModalStyles(isDark, colors.primary);
    const platformStyles =
      platformSpecificStyles[
        Platform.OS as keyof typeof platformSpecificStyles
      ];
    return {
      ...baseStyles,
      modalContainer: [
        baseStyles.modalContainer,
        platformStyles?.modalContainer,
      ],
      pickerContainer: [
        baseStyles.pickerContainer,
        platformStyles?.pickerContainer,
      ],
    };
  }, [isDark, colors.primary]);

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
          <Text style={styles.modalTitle}>{title}</Text>

          {/* Unified picker: iOS single datetime spinner; Android shows date (день/месяц/год) and time (час/минута) одновременно */}
          {Platform.OS === "ios" ? (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                is24Hour
                display="spinner"
                onChange={(_e, d) => d && setTempDate(d)}
                textColor={isDark ? "#FFFFFF" : "#000000"}
              />
            </View>
          ) : (
            <>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={(_e, d) =>
                    d &&
                    setTempDate((prev) => {
                      const next = new Date(prev);
                      next.setFullYear(
                        d.getFullYear(),
                        d.getMonth(),
                        d.getDate(),
                      );
                      return next;
                    })
                  }
                />
              </View>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempDate}
                  mode="time"
                  is24Hour
                  display="spinner"
                  onChange={(_e, d) =>
                    d &&
                    setTempDate((prev) => {
                      const next = new Date(prev);
                      next.setHours(d.getHours(), d.getMinutes(), 0, 0);
                      return next;
                    })
                  }
                />
              </View>
            </>
          )}

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
              onPress={() => onConfirm(tempDate)}
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

export default DateTimePickerModal;
