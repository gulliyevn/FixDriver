import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './WeekDaysSelector.styles';

interface WeekDaysSelectorProps {
  colors: any;
  t: (key: string) => string;
  onSelectionChange?: (days: string[]) => void;
}

export const WeekDaysSelector: React.FC<WeekDaysSelectorProps> = ({ colors, t, onSelectionChange }) => {
  const weekDays = [
    { key: 'mon', label: t('common.mon') },
    { key: 'tue', label: t('common.tue') },
    { key: 'wed', label: t('common.wed') },
    { key: 'thu', label: t('common.thu') },
    { key: 'fri', label: t('common.fri') },
    { key: 'sat', label: t('common.sat') },
    { key: 'sun', label: t('common.sun') },
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const toggleDay = (key: string) => {
    setSelected(prev => {
      const next = prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key];
      onSelectionChange && onSelectionChange(next);
      return next;
    });
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }
    ]}>
      {weekDays.map((day) => {
        const isActive = selected.includes(day.key);
        return (
          <TouchableOpacity
            key={day.key}
            style={[
              styles.dayButton,
              {
                backgroundColor: isActive ? colors.primary : colors.background,
                borderColor: isActive ? colors.primary : colors.border,
              }
            ]}
            activeOpacity={0.8}
            onPress={() => toggleDay(day.key)}
          >
            <Text style={[
              styles.dayText, 
              { color: isActive ? '#FFFFFF' : colors.text }
            ]}>
              {day.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
