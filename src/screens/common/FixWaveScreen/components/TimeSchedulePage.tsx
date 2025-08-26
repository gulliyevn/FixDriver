import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { getCurrentColors } from '../../../../constants/colors';
import { TimeScheduleData } from '../types/fix-wave.types';
import { fixwaveOrderService } from '../../../../services/fixwaveOrderService';
import { createTimeSchedulePageStyles } from './TimeSchedulePage.styles';
import { SwitchToggle } from './SwitchToggle';
import { WeekDaysSelector } from './WeekDaysSelector';
import { ScheduleContainer } from './ScheduleContainer';
import { useScheduleState } from '../hooks/useScheduleState';
import { useSessionData } from '../hooks/useSessionData';
import { createScheduleContainers, getDepartureTime, canSelectTime } from '../utils/scheduleUtils';

interface TimeSchedulePageProps {
  onNext: (data: TimeScheduleData) => void;
  onBack: () => void;
  initialData?: TimeScheduleData;
}

const TimeSchedulePage: React.FC<TimeSchedulePageProps> = ({ onNext, onBack, initialData }) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const { t } = useLanguage();
  
  // Стили
  const styles = useMemo(() => createTimeSchedulePageStyles(isDark), [isDark]);
  
  // Управление состоянием
  const state = useScheduleState(initialData);
  
  // Загрузка данных из сессии
  useSessionData(state, initialData);
  
  // Вычисляемые значения
  const isSmooth = useMemo(() => state.switchStates.switch2 === true, [state.switchStates.switch2]);
  const isWeekdaysMode = useMemo(() => !isSmooth && state.switchStates.switch3 === true, [isSmooth, state.switchStates.switch3]);
  
  // Создание контейнеров
  const containers = useMemo(() => 
    createScheduleContainers(state.addresses, state.coordinates, state.switchStates),
    [state.addresses, state.coordinates, state.switchStates]
  );
  
  // Обработчики
  const toggleSwitch = (switchKey: keyof typeof state.switchStates) => {
    state.setSwitchStates(prev => ({
      ...prev,
      [switchKey]: !prev[switchKey]
    }));
  };
  
  const saveToSession = async (data: TimeScheduleData) => {
    try {
      const sessionData = {
        currentPage: 'timeSchedule',
        timeScheduleData: data,
      };
      await fixwaveOrderService.saveSessionData(sessionData);
    } catch (error) {
      console.error('Error saving to session:', error);
    }
  };
  
  const handleSaveAndNext = async () => {
    // Проверяем, что выбрано хотя бы одно время
    const hasAnyTime = Object.values(state.times.fixed).some(time => time) || 
                      Object.values(state.times.weekday).some(time => time) || 
                      Object.values(state.times.weekend).some(time => time);
    
    if (!hasAnyTime) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите время');
      return;
    }

    // Собираем все данные для сохранения
    const dataToSave: TimeScheduleData = {
      ...state.timeScheduleData,
      fixedTimes: state.times.fixed,
      weekdayTimes: state.times.weekday,
      weekendTimes: state.times.weekend,
      selectedDays: state.selectedDays,
      switchStates: state.switchStates
    };

    await saveToSession(dataToSave);
    onNext(dataToSave);
  };

  return (
    <View style={styles.container}>
      {/* Переключатели */}
      <View style={styles.switchesContainer}>
        <SwitchToggle
          isActive={state.switchStates.switch1}
          onToggle={() => toggleSwitch('switch1')}
          colors={colors}
        />
        <SwitchToggle
          isActive={state.switchStates.switch2}
          onToggle={() => toggleSwitch('switch2')}
          colors={colors}
        />
        <View style={isSmooth ? styles.switchToggleDisabled : undefined} pointerEvents={isSmooth ? 'none' : 'auto'}>
          <SwitchToggle
            isActive={state.switchStates.switch3}
            onToggle={() => toggleSwitch('switch3')}
            colors={colors}
          />
        </View>
      </View>

      {/* Тексты под переключателями */}
      <View style={styles.switchLabelsContainer}>
        <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>
          {state.switchStates.switch1 ? t('common.thereAndBack') : t('common.there')}
        </Text>
        <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>
          {state.switchStates.switch2 ? t('common.smooth') : t('common.normal')}
        </Text>
        <Text style={[styles.switchLabel, { color: colors.textSecondary, opacity: isSmooth ? 0.5 : 1, width: 120, textAlign: 'center' }]}> 
          {state.switchStates.switch3 ? t('common.weekdays') : t('common.fixed')}
        </Text>
      </View>

      {/* Выбор дней */}
      <WeekDaysSelector 
        colors={colors} 
        t={t}
        onSelectionChange={state.setSelectedDays}
      />

      {/* Контейнеры расписания */}
      {containers.map((container) => (
        <ScheduleContainer
          key={`${container.color}_${container.index}`}
          fromAddress={container.address}
          borderColor={container.color}
          colors={colors}
          t={t}
          isLast={container.index === containers.length - 1}
          fixedMode={!isSmooth}
          fixedTime={state.times.fixed[container.index]}
          onFixedTimeChange={(time) => 
            state.setTimes(prev => ({ ...prev, fixed: { ...prev.fixed, [container.index]: time } }))
          }
          weekdaysMode={isWeekdaysMode}
          weekdayTime={state.times.weekday[container.index]}
          weekendTime={state.times.weekend[container.index]}
          onWeekdayTimeChange={(time) => 
            state.setTimes(prev => ({ ...prev, weekday: { ...prev.weekday, [container.index]: time } }))
          }
          onWeekendTimeChange={(time) => 
            state.setTimes(prev => ({ ...prev, weekend: { ...prev.weekend, [container.index]: time } }))
          }
          showDays={isSmooth}
          dayTimes={{}}
          onDayTimeChange={() => {}}
          activeDays={state.selectedDays}
          allowTimeSelection={canSelectTime(container.color)}
          fromCoordinate={container.fromCoordinate}
          toCoordinate={container.toCoordinate}
          departureTime={getDepartureTime(container.index, state.times)}
        />
      ))}

      {/* Кнопка Сохранить */}
      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSaveAndNext}
      >
        <Text style={styles.saveButtonText}>
          {t('common.save')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TimeSchedulePage;
