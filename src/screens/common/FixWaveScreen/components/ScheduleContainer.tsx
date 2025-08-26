import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ScheduleContainer.styles';

interface ScheduleContainerProps {
  fromAddress: string;
  borderColor: string;
  colors: any;
  t: (key: string) => string;
  isLast: boolean;
}

export const ScheduleContainer: React.FC<ScheduleContainerProps> = ({ 
  fromAddress, 
  borderColor, 
  colors, 
  t, 
  isLast 
}) => {
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
        borderColor: borderColor,
        marginBottom: isLast ? 20 : 10,
      }
    ]}>
      {/* Адрес отправления */}
      <Text style={[
        styles.addressText,
        { color: colors.text }
      ]}>
        {fromAddress || 'Адрес не выбран'}
      </Text>
      
      {/* Верхняя линия */}
      <View style={[
        styles.divider,
        { backgroundColor: colors.border }
      ]} />
      
      {/* Дни недели между линиями */}
      <View style={styles.weekDaysContainer}>
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
      
      {/* Нижняя линия */}
      <View style={[
        styles.bottomDivider,
        { backgroundColor: colors.border }
      ]} />
    </View>
  );
};
