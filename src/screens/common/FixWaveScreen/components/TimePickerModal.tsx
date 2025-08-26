import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createTimePickerModalStyles, platformSpecificStyles } from './TimePickerModal.styles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TimePickerModalProps {
  visible: boolean;
  title: string;
  value: Date;
  onChange: (date: Date) => void;
  onCancel: () => void;
  onConfirm: () => void;
  colors: any;
  t: (key: string) => string;
  isDark?: boolean;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  title,
  value,
  onChange,
  onCancel,
  onConfirm,
  colors,
  t,
  isDark = false,
}) => {
  // Создаем адаптивные стили
  const styles = useMemo(() => {
    const baseStyles = createTimePickerModalStyles(isDark, colors.primary);
    const platformStyles = platformSpecificStyles[Platform.OS as keyof typeof platformSpecificStyles];
    
    // Определяем размер экрана для адаптивности
    const isSmallScreen = screenWidth < 375;
    const isLargeScreen = screenWidth > 768;
    
    return {
      ...baseStyles,
      modalContainer: [
        baseStyles.modalContainer,
        platformStyles?.modalContainer,
        isSmallScreen ? baseStyles.smallScreen : null,
        isLargeScreen ? baseStyles.largeScreen : null,
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
          {/* Заголовок */}
          <Text style={styles.modalTitle}>
            {title}
          </Text>
          
          {/* Контейнер для DateTimePicker */}
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={value}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_e, d) => d && onChange(d)}
              style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
              textColor={isDark ? '#FFFFFF' : '#000000'}
              accentColor={colors.primary}
            />
          </View>
          
          {/* Кнопки */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>
                {t('common.cancel') || 'Отмена'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>
                {t('common.done') || 'Готово'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
