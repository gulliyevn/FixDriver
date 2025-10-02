import React, { useMemo, useState } from 'react';
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
import { createScheduleContainers, getDepartureTime, canSelectTime, getDayNumber } from '../utils/scheduleUtils';

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
  
  // Определяем режим выходных по выбранному дню
  const isWeekendMode = useMemo(() => {
    if (state.selectedDays.length > 0) {
      const selectedDay = state.selectedDays[0];
      const weekends = ['sat', 'sun'];
      return weekends.includes(selectedDay);
    }
    return false;
  }, [state.selectedDays]);
  
  // Состояние для активного поля ввода времени
  const [activeTimeField, setActiveTimeField] = useState<'weekday' | 'weekend' | undefined>(undefined);
  
  // Логируем режимы
  console.log('🔍 TimeSchedulePage - Режимы:', {
    isSmooth,
    isWeekdaysMode,
    isWeekendMode,
    switchStates: state.switchStates,
    selectedDays: state.selectedDays
  });
  
  // Создание контейнеров
  const containers = useMemo(() => 
    createScheduleContainers(state.addresses, state.coordinates, state.switchStates),
    [state.addresses, state.coordinates, state.switchStates]
  );
  
  // Обработчики
  const toggleSwitch = (switchKey: keyof typeof state.switchStates) => {
    // Сбрасываем все данные при переключении режимов
    state.resetAllData();
    
    // Обновляем состояние переключателя
    const newSwitchStates = {
      ...state.switchStates,
      [switchKey]: !state.switchStates[switchKey]
    };
    state.forceSetSwitchStates(newSwitchStates);
    
  };
  
  const saveToSession = async (data: TimeScheduleData) => {
    try {
      const sessionData = {
        currentPage: 'timeSchedule',
        timeScheduleData: data,
      };
      await fixwaveOrderService.saveSessionData(sessionData);
    } catch (error) {
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
        selectedDays={state.selectedDays}
        onSelectionChange={state.setSelectedDays}
      />

      {/* Контейнеры расписания */}
      {containers.map((container, index) => {
        const allowTimeSelection = canSelectTime(container.color);
        const departureTime = getDepartureTime(index, state.times, container.color, isSmooth, isWeekdaysMode, isWeekendMode, activeTimeField);
        
        // Рассчитываем отдельные времена для будней и выходных
        const weekdayDepartureTime = getDepartureTime(index, state.times, container.color, isSmooth, isWeekdaysMode, false, 'weekday');
        const weekendDepartureTime = getDepartureTime(index, state.times, container.color, isSmooth, isWeekdaysMode, true, 'weekend');
        
        // Конвертируем Date в строку времени
        const formatTimeFromDate = (date: Date | undefined): string => {
          if (!date) return '';
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        };
        
        const calculatedWeekdayTime = formatTimeFromDate(weekdayDepartureTime);
        const calculatedWeekendTime = formatTimeFromDate(weekendDepartureTime);
        
        console.log(`🏗️ Контейнер ${index} (${container.color}):`, {
          allowTimeSelection,
          departureTime: departureTime?.toISOString(),
          fromCoordinate: container.fromCoordinate,
          toCoordinate: container.toCoordinate,
          address: container.address,
          isSmooth,
          isWeekdaysMode,
          shouldCalculateTime: !allowTimeSelection,
          shouldShowCalculatedTime: !allowTimeSelection,
        });
        
        return (
          <ScheduleContainer
            key={`${container.color}-${index}`}
            fromAddress={container.address}
            borderColor={container.color}
            colors={colors}
            t={t}
            isLast={index === containers.length - 1}
            fixedMode={!isSmooth}
            fixedTime={state.times.fixed[index]}
            onFixedTimeChange={(time) => {
              console.log(`📅 Изменение фиксированного времени для контейнера ${index}:`, {
                time,
                isSmooth,
                isWeekdaysMode,
                currentTimes: state.times
              });
              state.forceSetTimes({
                ...state.times,
                fixed: { ...state.times.fixed, [index]: time }
              });
            }}
            weekdaysMode={isWeekdaysMode}
            weekdayTime={state.times.weekday[index]}
            weekendTime={state.times.weekend[index]}
            onWeekdayTimeChange={(time) => {
              console.log(`📅 Изменение времени будней для контейнера ${index}:`, {
                time,
                isSmooth,
                isWeekdaysMode,
                currentTimes: state.times
              });
              state.forceSetTimes({
                ...state.times,
                weekday: { ...state.times.weekday, [index]: time }
              });
              
              // Устанавливаем активное поле как будни
              setActiveTimeField('weekday');
            }}
            onWeekendTimeChange={(time) => {
              console.log(`📅 Изменение времени выходных для контейнера ${index}:`, {
                time,
                isSmooth,
                isWeekdaysMode,
                currentTimes: state.times
              });
              state.forceSetTimes({
                ...state.times,
                weekend: { ...state.times.weekend, [index]: time }
              });
              
              // Устанавливаем активное поле как выходные
              setActiveTimeField('weekend');
            }}
            showDays={isSmooth}
            dayTimes={{}}
            calculatedWeekdayTime={calculatedWeekdayTime}
            calculatedWeekendTime={calculatedWeekendTime}
            onDayTimeChange={(dayKey, time) => {
              console.log(`📅 Изменение времени дня ${dayKey} для контейнера ${index}:`, {
                time,
                isSmooth,
                isWeekdaysMode,
                currentTimes: state.times,
              });
              
              // Сохраняем время для конкретного дня в плавном режиме
              if (isSmooth) {
                const timeKey = isWeekdaysMode ? 'weekday' : 'weekend';
                const dayNumber = getDayNumber(dayKey);
                
                const newTimes = {
                  ...state.times,
                  [timeKey]: {
                    ...state.times[timeKey],
                    [dayNumber]: time
                  }
                };
                
                state.forceSetTimes(newTimes);
                
              }
              
              // Логируем для режима "Будни/Выходные" (переключатель 3)
              if (!isSmooth && state.switchStates.switch3) {
                console.log(`📅 Будни/Выходные режим - Изменение времени для контейнера ${index}:`, {
                  time,
                  isWeekdaysMode,
                  currentTimes: state.times,
                  switchStates: state.switchStates
                });
              }
            }}
            activeDays={state.selectedDays}
            allowTimeSelection={allowTimeSelection}
            fromCoordinate={container.fromCoordinate}
            toCoordinate={container.toCoordinate}
            departureTime={departureTime}
            shouldCalculateTime={!allowTimeSelection}
            shouldShowCalculatedTime={!allowTimeSelection}
            isDark={isDark}
          />
        );
      })}

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
