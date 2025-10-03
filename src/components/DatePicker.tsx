import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import {
  DatePickerStyles as styles,
  getDatePickerColors,
} from "../styles/components/DatePicker.styles";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  inline?: boolean; // Для встраивания в строку как другие поля
  readOnly?: boolean; // Режим только для чтения (без иконки календаря и возможности редактирования)
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Выберите дату",
  label,
  disabled = false,
  inline = false,
  readOnly = false,
}) => {
  const { isDark } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date(),
  );
  const dynamicStyles = getDatePickerColors(isDark);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Для Android закрываем пикер только при нажатии "OK"
    if (Platform.OS === "android" && event.type === "set") {
      setShowPicker(false);
    }

    // Для iOS inline режима не закрываем автоматически - только по кнопке "Готово"

    if (selectedDate) {
      setCurrentDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD format
      onChange(formattedDate);
    }
  };

  const showDatePicker = () => {
    if (!disabled && !readOnly) {
      setShowPicker(true);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return placeholder;

    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Если режим только для чтения, показываем только текст
  if (readOnly) {
    return (
      <View
        style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}
      >
        <Text
          style={[
            inline ? styles.readOnlyText : styles.pickerText,
            dynamicStyles.pickerText,
          ]}
        >
          {formatDisplayDate(value)}
        </Text>
      </View>
    );
  }

  // Если в режиме редактирования (inline), показываем только кнопку без дополнительного текста
  if (inline) {
    return (
      <View style={{ alignSelf: "flex-start", width: "auto" }}>
        <TouchableOpacity
          onPress={showDatePicker}
          disabled={disabled}
          style={[
            styles.inlinePickerButton,
            { opacity: disabled ? 0.6 : 1, width: "auto" },
          ]}
        >
          <Text
            style={[
              styles.inlinePickerText,
              value
                ? dynamicStyles.pickerText
                : dynamicStyles.pickerTextPlaceholder,
            ]}
          >
            {formatDisplayDate(value)}
          </Text>
        </TouchableOpacity>

        {showPicker &&
          (Platform.OS === "ios" ? (
            <Modal transparent={true} animationType="fade" visible={showPicker}>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, dynamicStyles.modalContent]}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity
                      onPress={() => {
                        // Отменяем изменения, возвращаем исходную дату и закрываем пикер
                        setCurrentDate(value ? new Date(value) : new Date());
                        setShowPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalButtonText,
                          dynamicStyles.modalButtonText,
                        ]}
                      >
                        Отмена
                      </Text>
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                      Выберите дату
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        // Сохраняем текущую выбранную дату и закрываем пикер
                        const formattedDate = currentDate
                          .toISOString()
                          .split("T")[0];
                        onChange(formattedDate);
                        setShowPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalButtonText,
                          dynamicStyles.modalButtonText,
                        ]}
                      >
                        Готово
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={currentDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    textColor={dynamicStyles.modalTitle.color}
                    style={{ width: "100%", marginLeft: -10 }}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={currentDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          ))}
      </View>
    );
  }

  return (
    <View>
      {label && !inline && !readOnly && (
        <Text style={[styles.label, dynamicStyles.label]}>{label}</Text>
      )}

      <TouchableOpacity
        onPress={showDatePicker}
        disabled={disabled}
        style={[
          inline ? styles.inlinePickerButton : styles.pickerButton,
          dynamicStyles.pickerButton,
          { opacity: disabled ? 0.6 : 1 },
        ]}
      >
        <Text
          style={[
            inline ? styles.inlinePickerText : styles.pickerText,
            value
              ? dynamicStyles.pickerText
              : dynamicStyles.pickerTextPlaceholder,
          ]}
        >
          {formatDisplayDate(value)}
        </Text>
        {!inline && (
          <Ionicons
            name="calendar-outline"
            size={20}
            color={dynamicStyles.pickerIcon.color}
          />
        )}
      </TouchableOpacity>

      {showPicker &&
        (Platform.OS === "ios" && !inline ? (
          <Modal transparent={true} animationType="fade" visible={showPicker}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, dynamicStyles.modalContent]}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text
                      style={[
                        styles.modalButtonText,
                        dynamicStyles.modalButtonText,
                      ]}
                    >
                      Отмена
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                    Выберите дату
                  </Text>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text
                      style={[
                        styles.modalButtonText,
                        dynamicStyles.modalButtonText,
                      ]}
                    >
                      Готово
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={currentDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  textColor={dynamicStyles.modalTitle.color}
                  style={{ width: "100%", marginLeft: -10 }}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={currentDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        ))}
    </View>
  );
};

export default DatePicker;
