import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './WeekDaysSelector.styles';

interface WeekDaysSelectorProps {
  colors: any;
  t: (key: string) => string;
}

export const WeekDaysSelector: React.FC<WeekDaysSelectorProps> = ({ colors, t }) => {
  const weekDays = [
    { key: 'mon', label: t('common.mon') },
    { key: 'tue', label: t('common.tue') },
    { key: 'wed', label: t('common.wed') },
    { key: 'thu', label: t('common.thu') },
    { key: 'fri', label: t('common.fri') },
    { key: 'sat', label: t('common.sat') },
    { key: 'sun', label: t('common.sun') },
  ];

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }
    ]}>
      {weekDays.map((day) => (
        <View
          key={day.key}
          style={[
            styles.dayButton,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            }
          ]}
        >
          <Text style={[styles.dayText, { color: colors.text }]}>{day.label}</Text>
        </View>
      ))}
    </View>
  );
};
