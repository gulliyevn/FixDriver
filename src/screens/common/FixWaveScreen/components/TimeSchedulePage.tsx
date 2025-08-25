import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { getCurrentColors } from '../../../../constants/colors';
import { TimeScheduleData } from '../types/fix-wave.types';
import { fixwaveOrderService } from '../../../../services/fixwaveOrderService';

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

  // Загружаем данные из сессии при инициализации и при изменении initialData
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const sessionData = await fixwaveOrderService.loadSessionData();
        if (sessionData?.timeScheduleData) {
          setTimeScheduleData(sessionData.timeScheduleData);
        }
      } catch (error) {
        console.error('Error loading session data:', error);
      }
    };
    loadSessionData();
  }, [initialData]); // Добавляем зависимость от initialData

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

  return (
    <View style={{ marginTop: 10, padding: 20 }}>
      <Text style={{ 
        fontSize: 18, 
        fontWeight: '600', 
        color: colors.text,
        marginBottom: 20,
        textAlign: 'center'
      }}>
        Планирование времени
      </Text>

      <Text style={{ 
        fontSize: 16, 
        color: colors.textSecondary,
        marginBottom: 30,
        textAlign: 'center'
      }}>
        Здесь будет форма выбора даты и времени
      </Text>

      {/* Кнопка Сохранить */}
      <TouchableOpacity 
        style={{ 
          backgroundColor: colors.primary,
          paddingVertical: 12,
          marginHorizontal: 20,
          marginTop: 8,
          marginBottom: 20,
          borderRadius: 8,
        }}
        onPress={handleSaveAndNext}
      >
        <Text style={{ 
          color: '#FFFFFF', 
          fontSize: 16, 
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {t('common.save')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TimeSchedulePage;
