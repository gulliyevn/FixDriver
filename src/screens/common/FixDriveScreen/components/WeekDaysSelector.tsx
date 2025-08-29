import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { styles } from './WeekDaysSelector.styles';
import { ANIMATION_CONFIG } from './constants';
import { WeekdaysSection } from './sections/WeekdaysSection';
import { FlexibleScheduleSection } from './sections/FlexibleScheduleSection';
import TimePicker from '../../../../components/TimePicker';
import { TIME_PICKER_COLORS } from './constants';

interface WeekDaysSelectorProps {
  colors: Record<string, any>;
  isDark: boolean;
  t: (key: string) => string;
  selectedDays?: string[];
  onSelectionChange?: (days: string[]) => void;
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
  scheduleType?: string;
}

export const WeekDaysSelector: React.FC<WeekDaysSelectorProps> = ({
  colors,
  isDark,
  t,
  selectedDays = [],
  onSelectionChange,
  selectedTime,
  onTimeChange,
  returnTime,
  onReturnTimeChange,
  returnTripTime,
  onReturnTripTimeChange,
  returnWeekdaysTime,
  onReturnWeekdaysTimeChange,
  isReturnTrip = false,
  onReturnTripChange,
  scheduleType
}) => {
  const [animations] = useState(() => Array(7).fill(0).map(() => new Animated.Value(1)));

  const animatePress = (index: number) => {
    Animated.sequence([
      Animated.timing(animations[index], { toValue: ANIMATION_CONFIG.SCALE, duration: ANIMATION_CONFIG.DURATION, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(animations[index], { toValue: 1, duration: ANIMATION_CONFIG.DURATION, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]).start();
  };

  const weekDays = [
    { key: 'mon', label: t('common.mon') },
    { key: 'tue', label: t('common.tue') },
    { key: 'wed', label: t('common.wed') },
    { key: 'thu', label: t('common.thu') },
    { key: 'fri', label: t('common.fri') },
    { key: 'sat', label: t('common.sat') },
    { key: 'sun', label: t('common.sun') },
  ];

  const toggleDay = (key: string, index: number) => {
    animatePress(index);
    const next = selectedDays.includes(key) ? selectedDays.filter(d => d !== key) : [...selectedDays, key];
    onSelectionChange && onSelectionChange(next);
  };

  const renderSection = () => {
    switch (scheduleType) {
      case 'weekdays':
        return (
          <WeekdaysSection
            t={t}
            selectedDays={selectedDays}
            selectedTime={selectedTime}
            onTimeChange={onTimeChange}
            returnTime={returnTime}
            onReturnTimeChange={onReturnTimeChange}
            isReturnTrip={!!isReturnTrip}
            onReturnTripChange={onReturnTripChange}
            returnTripTime={returnTripTime}
            onReturnTripTimeChange={onReturnTripTimeChange}
            returnWeekdaysTime={returnWeekdaysTime}
            onReturnWeekdaysTimeChange={onReturnWeekdaysTimeChange}
          />
        );
      case 'flexible':
        return selectedDays.length >= 2 ? (
          <FlexibleScheduleSection
            t={t}
            colors={colors}
            weekDays={weekDays}
            selectedDays={selectedDays}
            selectedTime={selectedTime}
            onTimeChange={onTimeChange}
            returnTime={returnTime}
            onReturnTimeChange={onReturnTimeChange}
            isReturnTrip={!!isReturnTrip}
            onReturnTripChange={onReturnTripChange}
          />
        ) : null;
      case 'oneWay':
        return (
          <TimePicker
            value={selectedTime}
            onChange={time => onTimeChange?.(time)}
            placeholder={t('common.selectTime')}
            indicatorColor={TIME_PICKER_COLORS.THERE}
            title={t('common.there')}
          />
        );
      case 'thereAndBack':
        return (
          <>
            <TimePicker
              value={selectedTime}
              onChange={time => onTimeChange?.(time)}
              placeholder={t('common.selectTime')}
              indicatorColor={TIME_PICKER_COLORS.THERE}
              title={t('common.there')}
            />
            {selectedTime && (
              <View style={{ marginTop: 16 }}>
                <TimePicker
                  value={returnTime}
                  onChange={time => onReturnTimeChange?.(time)}
                  placeholder={t('common.selectTime')}
                  indicatorColor={TIME_PICKER_COLORS.BACK}
                  title={t('common.return')}
                />
              </View>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {weekDays.map((day, index) => {
          const isActive = selectedDays.includes(day.key);
          return (
            <Animated.View key={day.key} style={{ transform: [{ scale: animations[index] }] }}>
              <TouchableOpacity
                style={[styles.dayButton, { 
                  backgroundColor: isActive ? colors.primary : isDark ? colors.surface : colors.background
                }]}
                activeOpacity={0.8}
                onPress={() => toggleDay(day.key, index)}
              >
                <Text style={[styles.dayText, { color: isActive ? '#FFFFFF' : isDark ? colors.text : colors.primary, opacity: isActive ? 1 : isDark ? 0.8 : 1 }]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {selectedDays.length > 0 && (
        <View style={{ marginTop: 8 }}>
          {renderSection()}
        </View>
      )}
    </View>
  );
};