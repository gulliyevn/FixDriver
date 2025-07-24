import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { DatePickerStyles as styles, getDatePickerColors } from '../styles/components/DatePicker.styles';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  inline?: boolean; // Для встраивания в строку как другие поля
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Выберите дату',
  label,
  disabled = false,
  inline = false,
}) => {
  const { isDark } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const dynamicStyles = getDatePickerColors(isDark);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Закрываем пикер для Android и для inline режима на iOS
    if (Platform.OS === 'android' || (Platform.OS === 'ios' && inline)) {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      setCurrentDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      onChange(formattedDate);
    }
  };

  const showDatePicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return placeholder;
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };



  return (
    <View>
      {label && !inline && (
        <Text style={[styles.label, dynamicStyles.label]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={showDatePicker}
        disabled={disabled}
        style={[
          inline ? styles.inlinePickerButton : styles.pickerButton, 
          dynamicStyles.pickerButton,
          { opacity: disabled ? 0.6 : 1 }
        ]}
      >
        {inline && (
          <Ionicons 
            name="calendar-outline" 
            size={20} 
            color={dynamicStyles.pickerIcon.color}
            testID="calendar-icon"
          />
        )}
        <Text style={[
          inline ? styles.inlinePickerText : styles.pickerText, 
          value ? dynamicStyles.pickerText : dynamicStyles.pickerTextPlaceholder
        ]}>
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

      {showPicker && (
        Platform.OS === 'ios' && !inline ? (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showPicker}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, dynamicStyles.modalContent]}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={[styles.modalButtonText, dynamicStyles.modalButtonText]}>
                      Отмена
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                    Выберите дату
                  </Text>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={[styles.modalButtonText, dynamicStyles.modalButtonText]}>
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
                  style={[styles.datePickerContainer, dynamicStyles.datePickerContainer]}
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
        )
      )}
    </View>
  );
};

export default DatePicker; 