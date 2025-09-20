import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../core/context/ThemeContext';
import { useLanguage } from '../../../../../../core/context/LanguageContext';
import { getCurrentColors } from '../../../../../../shared/constants/colors';
import { WeekDaysSelector } from './WeekDaysSelector';

interface ScheduleType {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

interface ScheduleTypeSelectorProps {
  onSelect: (type: string) => void;
  selectedType?: string;
  selectedDays?: string[];
  onDaysChange?: (days: string[]) => void;
  selectedTime?: string;
  onTimeChange?: (time: string) => void;
  returnTime?: string;
  onReturnTimeChange?: (time: string) => void;
  returnTripTime?: string;
  onReturnTripTimeChange?: (time: string) => void;
  returnWeekdaysTime?: string;
  onReturnWeekdaysTimeChange?: (time: string) => void;
  isReturnTrip?: boolean;
  onReturnTripChange?: (isReturnTrip: boolean) => void;
}

const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({ 
  onSelect, 
  selectedType,
  selectedDays = [],
  onDaysChange,
  selectedTime,
  onTimeChange,
  returnTime,
  onReturnTimeChange,
  returnTripTime,
  onReturnTripTimeChange,
  returnWeekdaysTime,
  onReturnWeekdaysTimeChange,
  isReturnTrip,
  onReturnTripChange
}) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const { t } = useLanguage();

  const scheduleTypes: ScheduleType[] = [
    {
      id: 'oneWay',
      icon: 'arrow-forward',
      titleKey: 'common.oneWay',
      descriptionKey: 'common.schedule.types.oneWayDesc'
    },
    {
      id: 'weekdays',
      icon: 'briefcase',
      titleKey: 'common.weekdays',
      descriptionKey: 'common.schedule.types.weekdaysDesc'
    },
    {
      id: 'thereAndBack',
      icon: 'swap-horizontal',
      titleKey: 'common.roundTrip',
      descriptionKey: 'common.schedule.types.thereAndBackDesc'
    },
    {
      id: 'flexible',
      icon: 'settings',
      titleKey: 'common.schedule.types.flexible',
      descriptionKey: 'common.schedule.types.flexibleDesc'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        {t('common.schedule.selectType')}
      </Text>
      <View style={styles.grid}>
        {scheduleTypes.map((type) => {
          const isSelected = selectedType === type.id;
          
          return (
            <TouchableOpacity
              key={type.id}
                            style={[
                styles.card,
                {
                  backgroundColor: isSelected ? colors.primary : isDark ? colors.surface : colors.background,
                }
              ]}
              onPress={() => onSelect(type.id)}
            >
              <View style={[
                styles.iconContainer,
                {
                  backgroundColor: isSelected 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : isDark 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)'
                }
              ]}>
                <Ionicons 
                  name={type.icon as any} 
                  size={24} 
                  color={isSelected ? '#FFFFFF' : isDark ? colors.text : colors.primary} 
                />
              </View>
              
              <Text style={[
                styles.cardTitle,
                { color: isSelected ? '#FFFFFF' : colors.text }
              ]}>
                {t(type.titleKey)}
              </Text>
              
              <Text style={[
                styles.cardDescription,
                { 
                  color: isSelected ? '#FFFFFF' : colors.textSecondary,
                  opacity: isDark ? 0.7 : 0.85
                }
              ]}>
                {t(type.descriptionKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Выбор дней недели - показываем только после выбора типа */}
      {selectedType && (
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.stepTitle, { color: colors.text }]}>
            {t('common.selectTripDays')}
          </Text>
          <WeekDaysSelector 
            colors={colors}
            isDark={isDark}
            t={t}
            selectedDays={selectedDays}
            onSelectionChange={onDaysChange}
            selectedTime={selectedTime}
            onTimeChange={onTimeChange}
            returnTime={returnTime}
            onReturnTimeChange={onReturnTimeChange}
            returnTripTime={returnTripTime}
            onReturnTripTimeChange={onReturnTripTimeChange}
            returnWeekdaysTime={returnWeekdaysTime}
            onReturnWeekdaysTimeChange={onReturnWeekdaysTimeChange}
            isReturnTrip={isReturnTrip}
            onReturnTripChange={onReturnTripChange}
            scheduleType={selectedType}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 13,
    textAlign: 'left',
    lineHeight: 18,
    opacity: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginLeft: 4,
    textAlign: 'left',
  },
});

export default ScheduleTypeSelector;
