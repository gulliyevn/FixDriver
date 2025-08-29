import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getCurrentColors } from '../constants/colors';
import { StyleSheet } from 'react-native';

interface TimePickerProps {
  value?: string; // формат "HH:mm"
  onChange: (time: string) => void;
  placeholder?: string;
  indicatorColor?: string;
  title?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Выберите время',
  indicatorColor,
  title
}) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const [showPicker, setShowPicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date;
    }
    return new Date();
  });

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    // На Android закрываем только при нажатии "ОК"
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedTime) {
        setShowPicker(false);
        setCurrentTime(selectedTime);
        const hours = selectedTime.getHours().toString().padStart(2, '0');
        const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
        onChange(`${hours}:${minutes}`);
      }
    } 
    // На iOS обновляем время без закрытия модалки
    else if (selectedTime) {
      setCurrentTime(selectedTime);
    }
  };

  const formatDisplayTime = (timeString?: string) => {
    if (!timeString) return title || placeholder;
    return timeString;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          styles.button,
          {
            backgroundColor: isDark ? colors.surface : colors.background,
            borderColor: colors.border,
            borderWidth: 1
          }
        ]}
      >
        <View style={styles.buttonContent}>
          {indicatorColor && (
            <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />
          )}
          <Text style={[
            styles.timeText,
            { color: value ? colors.text : colors.textSecondary }
          ]}>
            {formatDisplayTime(value)}
          </Text>
        </View>
        <Ionicons 
          name="time-outline" 
          size={20} 
          color={colors.text} 
        />
      </TouchableOpacity>

      {showPicker && (
        Platform.OS === 'ios' ? (
          <Modal
            transparent={true}
            animationType="fade"
            visible={showPicker}
            onRequestClose={() => {}}
          >
            <View style={styles.modalOverlay} onTouchEnd={(e) => e.stopPropagation()}>
              <View style={[
                styles.modalContent,
                { backgroundColor: isDark ? colors.surface : colors.background }
              ]}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={[styles.modalButtonText, { color: colors.primary }]}>
                      Отмена
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Выберите время
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setShowPicker(false);
                    const hours = currentTime.getHours().toString().padStart(2, '0');
                    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
                    onChange(`${hours}:${minutes}`);
                  }}>
                    <Text style={[styles.modalButtonText, { color: colors.primary }]}>
                      Готово
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={currentTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  textColor={colors.text}
                  style={{ width: '100%', alignSelf: 'center' }}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={currentTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  timeText: {
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'auto',
  },
  modalContent: {
    borderRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    width: '90%',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonText: {
    fontSize: 16,
  },
});

export default TimePicker;