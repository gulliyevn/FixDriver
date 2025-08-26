import React, { useState, useEffect } from 'react';
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
  const [switchStates, setSwitchStates] = useState({
    switch1: false,
    switch2: false,
    switch3: false,
  });

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
          console.log('TimeSchedulePage - From address found:', fromAddr);
          if (fromAddr) {
            setFromAddress(fromAddr.address);
            console.log('TimeSchedulePage - Setting fromAddress:', fromAddr.address);
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

  const containerColors = [
    '#4CAF50', // зеленый
    '#9E9E9E', // серый
    '#9E9E9E', // серый
    '#1565C0', // темно-синий
    '#FFF59D', // светло-желтый
  ];

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
        <SwitchToggle
          isActive={switchStates.switch3}
          onToggle={() => toggleSwitch('switch3')}
          colors={colors}
        />
      </View>

      {/* Тексты под переключателями */}
      <View style={styles.switchLabelsContainer}>
        <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>
          {switchStates.switch1 ? t('common.thereAndBack') : t('common.there')}
        </Text>
        <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>
          {switchStates.switch2 ? t('common.smooth') : t('common.normal')}
        </Text>
        <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>
          {switchStates.switch3 ? t('common.weekdays') : t('common.fixed')}
        </Text>
      </View>

      {/* Контейнер под кнопками */}
      <WeekDaysSelector colors={colors} t={t} />

      {/* Контейнеры расписания */}
      {containerColors.map((color, index) => (
        <ScheduleContainer
          key={index}
          fromAddress={fromAddress}
          borderColor={color}
          colors={colors}
          t={t}
          isLast={index === containerColors.length - 1}
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
