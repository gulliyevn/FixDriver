import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { getCurrentColors } from '../../../../constants/colors';
import { TimeScheduleData } from '../types/fix-wave.types';
import { fixwaveOrderService } from '../../../../services/fixwaveOrderService';
import { styles } from './TimeSchedulePage.styles';
import { SwitchToggle } from './SwitchToggle';
import { WeekDaysSelector } from './WeekDaysSelector';
import { ScheduleContainer } from './ScheduleContainer';

interface TimeSchedulePageProps {
  onNext: (data: TimeScheduleData) => void;
  onBack: () => void;
  initialData?: TimeScheduleData;
}

const TimeSchedulePage: React.FC<TimeSchedulePageProps> = ({ onNext, onBack, initialData }) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const { t } = useLanguage();
  
  const [timeScheduleData, setTimeScheduleData] = useState<TimeScheduleData>(
    initialData || {
      date: new Date(),
      time: '',
      isRecurring: false,
      notes: '',
    }
  );
  const [fromAddress, setFromAddress] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [stopAddresses, setStopAddresses] = useState<string[]>([]);
  const [switchStates, setSwitchStates] = useState({
    // switch1 — направление: false = туда, true = туда-обратно
    switch1: false,
    switch2: false,
    switch3: false,
  });

  // Режимы
  const isSmooth = useMemo(() => switchStates.switch2 === true, [switchStates]);
  const isDailyMode = useMemo(() => !isSmooth && switchStates.switch3 === false, [isSmooth, switchStates]);
  const isWeekdaysMode = useMemo(() => !isSmooth && switchStates.switch3 === true, [isSmooth, switchStates]);

  // Состояние для фикс времени по контейнерам (индекс -> HH:MM)
  const [fixedTimes, setFixedTimes] = useState<Record<number, string>>({});
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [weekdayTimes, setWeekdayTimes] = useState<Record<number, string>>({});
  const [weekendTimes, setWeekendTimes] = useState<Record<number, string>>({});

  // Загружаем данные из сессии при инициализации и при изменении initialData
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const sessionData = await fixwaveOrderService.loadSessionData();
        console.log('TimeSchedulePage - Session data loaded:', sessionData);
        
        if (sessionData?.timeScheduleData) {
          setTimeScheduleData(sessionData.timeScheduleData);
        }
        
        if (sessionData?.addressData?.addresses) {
          console.log('TimeSchedulePage - Addresses found:', sessionData.addressData.addresses);
          const fromAddr = sessionData.addressData.addresses.find(addr => addr.type === 'from');
          const toAddr = sessionData.addressData.addresses.find(addr => addr.type === 'to');
          const stops = sessionData.addressData.addresses.filter(addr => addr.type === 'stop');
          console.log('TimeSchedulePage - From address found:', fromAddr);
          if (fromAddr) {
            setFromAddress(fromAddr.address);
            console.log('TimeSchedulePage - Setting fromAddress:', fromAddr.address);
          }
          if (toAddr) {
            setToAddress(toAddr.address);
          }
          if (stops && stops.length) {
            setStopAddresses(stops.map(s => s.address).slice(0, 2));
          }
        } else {
          console.log('TimeSchedulePage - No addressData or addresses found');
        }
      } catch (error) {
        console.error('Error loading session data:', error);
      }
    };
    loadSessionData();
  }, [initialData]);

  // Сохраняем в сессию при изменении данных
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
    if (!timeScheduleData.time) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите время');
      return;
    }

    // Сохраняем в сессию перед переходом
    await saveToSession(timeScheduleData);
    
    onNext(timeScheduleData);
  };

  const toggleSwitch = (switchKey: 'switch1' | 'switch2' | 'switch3') => {
    setSwitchStates(prev => ({
      ...prev,
      [switchKey]: !prev[switchKey]
    }));
  };

  // Динамически формируем список контейнеров по правилам
  // зелёный (from), синий (to), жёлтый (обратно), серые (stops)
  const containers = useMemo(() => {
    const result: Array<{ color: string; address: string }>
      = [];

    const GREEN = '#4CAF50';
    const BLUE = '#1565C0';
    const YELLOW = '#FFF59D';
    const GREY = '#9E9E9E';

    // Если переданы from и to — порядок: зелёный -> серые (1,2) -> синий
    if (fromAddress && toAddress) {
      result.push({ color: GREEN, address: fromAddress });
      if (stopAddresses.length >= 1) {
        result.push({ color: GREY, address: stopAddresses[0] });
      }
      if (stopAddresses.length >= 2) {
        result.push({ color: GREY, address: stopAddresses[1] });
      }
      result.push({ color: BLUE, address: toAddress });
    } else {
      // Если нет одной из точек, просто добавляем то, что есть
      if (fromAddress) result.push({ color: GREEN, address: fromAddress });
      if (stopAddresses.length >= 1) result.push({ color: GREY, address: stopAddresses[0] });
      if (stopAddresses.length >= 2) result.push({ color: GREY, address: stopAddresses[1] });
      if (toAddress) result.push({ color: BLUE, address: toAddress });
    }

    // Если включён туда-обратно — показываем жёлтый в конце
    if (switchStates.switch1) {
      result.push({ color: YELLOW, address: fromAddress || toAddress || '' });
    }

    return result;
  }, [fromAddress, toAddress, stopAddresses, switchStates.switch1]);

  return (
    <View style={styles.container}>
      {/* Переключатели */}
      <View style={styles.switchesContainer}>
        <SwitchToggle
          isActive={switchStates.switch1}
          onToggle={() => toggleSwitch('switch1')}
          colors={colors}
        />
        <SwitchToggle
          isActive={switchStates.switch2}
          onToggle={() => toggleSwitch('switch2')}
          colors={colors}
        />
        <View style={{ opacity: isSmooth ? 0.5 : 1 }} pointerEvents={isSmooth ? 'none' : 'auto'}>
          <SwitchToggle
            isActive={switchStates.switch3}
            onToggle={() => toggleSwitch('switch3')}
            colors={colors}
          />
        </View>
      </View>

      {/* Тексты под переключателями */}
      <View style={styles.switchLabelsContainer}>
        <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>
          {switchStates.switch1 ? t('common.thereAndBack') : t('common.there')}
        </Text>
        <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>
          {switchStates.switch2 ? t('common.smooth') : t('common.normal')}
        </Text>
        <Text style={[
          styles.switchLabel,
          { color: isSmooth ? colors.textSecondary : colors.textSecondary }
        ]}> 
          {switchStates.switch3 ? t('common.weekdays') : t('common.fixed')}
        </Text>
      </View>

      {/* Верхний выбор дней: всегда видим */}
      <WeekDaysSelector 
        colors={colors} 
        t={t}
        onSelectionChange={setSelectedDays}
      />

      {/* Контейнеры расписания (динамически по правилам) */}
      {containers.map((item, index) => (
        <ScheduleContainer
          key={`${item.color}_${index}`}
          fromAddress={item.address}
          borderColor={item.color}
          colors={colors}
          t={t}
          isLast={index === containers.length - 1}
          // Для фикс-режима показываем один таймпикер без дней
          fixedMode={!isSmooth}
          fixedTime={fixedTimes[index]}
          onFixedTimeChange={(time) => setFixedTimes(prev => ({ ...prev, [index]: time }))}
          // Будни/Выходные (только при fixedMode)
          weekdaysMode={isWeekdaysMode}
          weekdayTime={weekdayTimes[index]}
          weekendTime={weekendTimes[index]}
          onWeekdayTimeChange={(time) => setWeekdayTimes(prev => ({ ...prev, [index]: time }))}
          onWeekendTimeChange={(time) => setWeekendTimes(prev => ({ ...prev, [index]: time }))}
          // Дни берём из верхнего селектора для всех режимов
          showDays={isSmooth}
          dayTimes={{}}
          onDayTimeChange={() => {}}
          activeDays={selectedDays}
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
