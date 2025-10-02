import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getCurrentColors } from '../../../constants/colors';
import ProgressBar from './components/ProgressBar';
import ScheduleTypeSelector from './components/ScheduleTypeSelector';
import FixDriveAddressPage from './components/FixDriveAddressPage';
import FixDriveConfirm from './components/FixDriveConfirm';
import { FixDrivePage, AddressData } from './types/fix-drive.types';

interface FixDriveScreenProps {
  isChild?: boolean;
}

const FixDriveScreen: React.FC<FixDriveScreenProps> = ({ isChild = false }) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getCurrentColors(isDark), [isDark]);
  const { t } = useLanguage();

  const [currentPage, setCurrentPage] = useState<FixDrivePage>('timeSchedule');
  const [selectedScheduleType, setSelectedScheduleType] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [returnTime, setReturnTime] = useState<string>('');
  const [returnTripTime, setReturnTripTime] = useState<string>('');
  const [returnWeekdaysTime, setReturnWeekdaysTime] = useState<string>('');
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  // Проверяем готовность данных для отображения кнопки сохранения
  const isScheduleReadyToSave = () => {

    // Базовые проверки
    if (!selectedScheduleType || selectedDays.length === 0) {
      return false;
    }

    // Строгие проверки в зависимости от типа расписания
    switch (selectedScheduleType) {
      case 'oneWay': {
        // Нужно: время туда
        const oneWayReady = !!selectedTime;
        return oneWayReady;
      }

      case 'thereAndBack': {
        // Нужно: время туда И время обратно (всегда)
        const thereAndBackReady = !!selectedTime && !!returnTime;
        return thereAndBackReady;
      }

      case 'weekdays':
        // Нужно: selectedTime + (returnWeekdaysTime если включена обратная поездка)
        if (!selectedTime) {
          return false;
        }
        // Если пользователь включил обратную поездку - нужно время обратно
        if (isReturnTrip && !returnWeekdaysTime) {
          return false;
        }
        return true;

      case 'flexible':
        // Нужно: selectedTime + (returnTime если включена обратная поездка)
        if (!selectedTime) {
          return false;
        }
        // Если пользователь включил обратную поездку - нужно время обратно
        if (isReturnTrip && !returnTime) {
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  // Проверяем есть ли видимый чекбокс "Туда-обратно"
  const hasVisibleCheckbox = () => {
    // Чекбокс появляется когда есть время и это flexible/thereAndBack режимы
    if (!selectedTime) return false;
    
    // В flexible режиме чекбокс появляется когда выбрано время
    if (selectedScheduleType === 'flexible') return true;
    
    // В thereAndBack режиме всегда есть поля для обратного времени
    if (selectedScheduleType === 'thereAndBack') return true;
    
    // В weekdays режиме может быть чекбокс
    if (selectedScheduleType === 'weekdays') return true;
    
    return false;
  };

  // Нужен ли дополнительный отступ снизу
  const needsBottomPadding = () => {
    const hasButton = isScheduleReadyToSave();
    const hasCheckbox = hasVisibleCheckbox();
    
    
    // Если нет кнопки "Сохранить" И нет чекбокса = нужен отступ
    return !hasButton && !hasCheckbox;
  };

  const handleProgressStepPress = (page: FixDrivePage) => {
    setCurrentPage(page);
  };

  const handleScheduleTypeSelect = (type: string) => {
    setSelectedScheduleType(type);
  };

  const handleAddressPageNext = (data: AddressData) => {
    setAddressData(data);
    setCurrentPage('confirmation');
  };

  // Универсальная валидация расписания
  const validateSchedule = () => {

    // Проверяем базовые поля
    if (!selectedScheduleType) {
      Alert.alert('Ошибка', 'Выберите тип расписания');
      return false;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Ошибка', 'Выберите дни недели');
      return false;
    }

    // Валидация в зависимости от типа расписания
    switch (selectedScheduleType) {
      case 'oneWay':
        if (!selectedTime) {
          Alert.alert('Ошибка', 'Выберите время отправления');
          return false;
        }
        break;

      case 'thereAndBack':
        if (!selectedTime) {
          Alert.alert('Ошибка', 'Выберите время "туда"');
          return false;
        }
        if (!returnTime) {
          Alert.alert('Ошибка', 'Выберите время "обратно"');
          return false;
        }
        break;

      case 'weekdays':
        if (!selectedTime) {
          Alert.alert('Ошибка', 'Выберите время для будней');
          return false;
        }
        if (isReturnTrip && !returnWeekdaysTime) {
          Alert.alert('Ошибка', 'Выберите время обратно для будней');
          return false;
        }
        break;

      case 'flexible':
        if (!selectedTime) {
          Alert.alert('Ошибка', 'Выберите базовое время');
          return false;
        }
        if (isReturnTrip && !returnTime) {
          Alert.alert('Ошибка', 'Выберите время обратно');
          return false;
        }
        break;

      default:
        Alert.alert('Ошибка', 'Неизвестный тип расписания');
        return false;
    }

    return true;
  };

  // Универсальное сохранение расписания
  const saveScheduleToStorage = async () => {
    try {
      
      const scheduleData = {
        scheduleType: selectedScheduleType,
        selectedDays,
        selectedTime,
        returnTime,
        returnTripTime,
        returnWeekdaysTime,
        isReturnTrip,
        timestamp: new Date().toISOString(),
      };


      await AsyncStorage.setItem('universalSchedule', JSON.stringify(scheduleData));
      
      return true;
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить расписание');
      return false;
    }
  };

  const handleSaveAndNext = async () => {
    
    if (currentPage === 'timeSchedule') {
      // Валидируем расписание
      if (!validateSchedule()) {
        return;
      }

      // Сохраняем расписание
      const saved = await saveScheduleToStorage();
      if (!saved) {
        return;
      }

      // Переходим к следующей странице
      setCurrentPage('addresses');
      
    } else if (currentPage === 'addresses') {
      setCurrentPage('confirmation');
    }
  };

  const renderContent = () => {
    // Для страницы confirmation используем другую структуру
    if (currentPage === 'confirmation') {
      return (
        <View style={{ flex: 1 }}>
          {/* Прогресс-бар */}
          <View style={{ 
            paddingHorizontal: 20,
            paddingTop: 20
          }}>
            <ProgressBar 
              currentPage={currentPage} 
              onStepPress={handleProgressStepPress}
            />
          </View>
          
          {/* Компонент подтверждения */}
          <FixDriveConfirm 
            scheduleData={{
              scheduleType: selectedScheduleType,
              selectedDays,
              selectedTime,
              returnTime,
              returnTripTime,
              returnWeekdaysTime,
              isReturnTrip,
            }}
            addressData={addressData}
          />
        </View>
      );
    }

    // Для остальных страниц используем ScrollView
    return (
      <ScrollView 
        style={{ 
          flex: 1, 
          padding: 20
        }} 
        contentContainerStyle={{
          paddingBottom: needsBottomPadding() ? 80 : 20
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Прогресс-бар */}
        <View style={{ 
          paddingHorizontal: 0,
          paddingTop: 0
        }}>
          <ProgressBar 
            currentPage={currentPage} 
            onStepPress={handleProgressStepPress}
          />
        </View>
        
        {/* Контейнеры страниц */}
        <View style={{ marginTop: 16 }}>
          {currentPage === 'addresses' && (
            <FixDriveAddressPage 
              onNext={handleAddressPageNext}
              initialData={addressData}
            />
          )}
          
          {currentPage === 'timeSchedule' && (
            <View style={{ padding: 0 }}>
              <ScheduleTypeSelector 
                onSelect={handleScheduleTypeSelect}
                selectedType={selectedScheduleType}
                selectedDays={selectedDays}
                onDaysChange={setSelectedDays}
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
                returnTime={returnTime}
                onReturnTimeChange={setReturnTime}
                returnTripTime={returnTripTime}
                onReturnTripTimeChange={setReturnTripTime}
                returnWeekdaysTime={returnWeekdaysTime}
                onReturnWeekdaysTimeChange={setReturnWeekdaysTime}
                isReturnTrip={isReturnTrip}
                onReturnTripChange={setIsReturnTrip}
              />
              
              {/* Кнопка Сохранить - показывается только когда все поля заполнены */}
              {isScheduleReadyToSave() && (
                <TouchableOpacity 
                  style={{ 
                    backgroundColor: colors.primary,
                    paddingVertical: 12,
                    marginHorizontal: 20,
                    marginTop: 24,
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
              )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      {isChild ? (
        renderContent()
      ) : (
        <View style={{ 
          flex: 1, 
          backgroundColor: currentPage === 'confirmation' ? 'transparent' : colors.background 
        }}>
          <SafeAreaView style={{ flex: 1 }}>
            {renderContent()}
          </SafeAreaView>
        </View>
      )}
    </>
  );
};

export default FixDriveScreen;