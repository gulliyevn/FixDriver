import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TimePicker from '../../../../components/TimePicker';
import { TIME_PICKER_COLORS } from './constants';

interface CustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (isReturnTrip: boolean) => Promise<boolean>;
  colors: any;
  t: (key: string) => string;
  weekDays: { key: string; label: string }[];
  selectedDays: string[];
  selectedCustomDays: string[];
  onSelectedCustomDaysChange: (days: string[]) => void;
  tempCustomizedDays: {[key: string]: {there: string, back: string}};
  onTempCustomizedDaysChange: (days: {[key: string]: {there: string, back: string}}) => void;
  isReturnTrip: boolean;
  validationError?: { message: string; field: string } | null;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  visible,
  onClose,
  onSave,
  colors,
  t,
  weekDays,
  selectedDays,
  selectedCustomDays,
  onSelectedCustomDaysChange,
  tempCustomizedDays,
  onTempCustomizedDaysChange,
  isReturnTrip,
  validationError
}) => {
  // Функция для получения цвета дня
  const getDayColor = (dayKey: string) => {
    const colorMap: Record<string, string> = {
      'mon': TIME_PICKER_COLORS.MONDAY,
      'tue': TIME_PICKER_COLORS.TUESDAY,
      'wed': TIME_PICKER_COLORS.WEDNESDAY,
      'thu': TIME_PICKER_COLORS.THURSDAY,
      'fri': TIME_PICKER_COLORS.FRIDAY,
      'sat': TIME_PICKER_COLORS.SATURDAY,
      'sun': TIME_PICKER_COLORS.SUNDAY,
    };
    return colorMap[dayKey] || TIME_PICKER_COLORS.THERE;
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: colors.background,
          borderRadius: 16,
          padding: 20,
          width: '100%',
          maxHeight: '80%',
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              {t('common.customizeSchedule')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
            {t('common.selectDaysToCustomize')}
          </Text>
          
          {/* Выбор дней для кастомизации */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
            {weekDays.map((day) => {
              // Показываем только выбранные дни, кроме первого и уже настроенных
              if (!selectedDays.includes(day.key) || day.key === selectedDays[0] || tempCustomizedDays[day.key]) return null;
              const isSelected = selectedCustomDays.includes(day.key);
              return (
                <TouchableOpacity
                  key={day.key}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    margin: 4,
                    borderRadius: 20,
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                  onPress={() => {
                    if (isSelected) {
                      onSelectedCustomDaysChange(selectedCustomDays.filter(d => d !== day.key));
                    } else {
                      onSelectedCustomDaysChange([...selectedCustomDays, day.key]);
                    }
                  }}
                >
                  <Text style={{
                    color: isSelected ? '#FFFFFF' : colors.text,
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {/* Таймпикеры для выбранных дней */}
          {selectedCustomDays.map((dayKey) => {
            const day = weekDays.find(d => d.key === dayKey);
            if (!day) return null;
            
            return (
              <View key={dayKey} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                  {day.label}
                </Text>
                <TimePicker
                  value={tempCustomizedDays[dayKey]?.there || ''}
                  onChange={(time) => {
                    onTempCustomizedDaysChange({
                      ...tempCustomizedDays,
                      [dayKey]: {
                        ...tempCustomizedDays[dayKey],
                        there: time,
                        back: tempCustomizedDays[dayKey]?.back || ''
                      }
                    });
                  }}
                  placeholder={t('common.selectTime')}
                  indicatorColor={getDayColor(dayKey)}
                  dayLabel={day.label}
                />
                {isReturnTrip && (
                  <View style={{ marginTop: 12 }}>
                    <TimePicker
                      value={tempCustomizedDays[dayKey]?.back || ''}
                      onChange={(time) => {
                        onTempCustomizedDaysChange({
                          ...tempCustomizedDays,
                          [dayKey]: {
                            ...tempCustomizedDays[dayKey],
                            there: tempCustomizedDays[dayKey]?.there || '',
                            back: time
                          }
                        });
                      }}
                      placeholder={t('common.selectTime')}
                      indicatorColor={getDayColor(dayKey)}
                      dayLabel={day.label}
                    />
                  </View>
                )}
              </View>
            );
          })}
          
          {validationError && (
            <View style={{
              backgroundColor: '#FFE6E6',
              padding: 12,
              borderRadius: 8,
              marginTop: 16,
              borderWidth: 1,
              borderColor: '#FF6B6B',
            }}>
              <Text style={{ color: '#D32F2F', fontSize: 14, textAlign: 'center' }}>
                {validationError.message}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 20,
            }}
            onPress={() => onSave(isReturnTrip)}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
              {t('common.done')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
