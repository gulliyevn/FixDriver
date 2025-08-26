import React, { useMemo, useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Animated, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getCurrentColors } from '../../../constants/colors';
import { createFixWaveScreenStyles } from './styles';
import { useFixWaveNavigation } from './hooks/useFixWaveNavigation';
import { useSessionCleanup } from '../../../hooks/useSessionCleanup';
import ProgressBar from './components/ProgressBar';
import AddressPage from './components/AddressPage';
import TimeSchedulePage from './components/TimeSchedulePage';
import { AddressData, TimeScheduleData, FixWavePage } from './types/fix-wave.types';

const FixWaveScreen: React.FC = () => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getCurrentColors(isDark), [isDark]);
  const styles = useMemo(() => createFixWaveScreenStyles(isDark), [isDark]);
  const { t } = useLanguage();

  // Состояние для переключения кнопки
  const [isButtonLeft, setIsButtonLeft] = useState(true);
  const buttonPosition = useRef(new Animated.Value(0)).current;
  
  // Хук для навигации между страницами
  const { currentPage, progress, sessionData, nextPage, previousPage, goToPage } = useFixWaveNavigation();
  
  // Хук для автоматической очистки сессии
  const { forceClearSession } = useSessionCleanup();
  
  // Состояния для данных
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [timeScheduleData, setTimeScheduleData] = useState<TimeScheduleData | null>(null);

  // Обновляем данные при изменении sessionData
  useEffect(() => {
    if (sessionData?.addressData) {
      setAddressData(sessionData.addressData);
    }
    if (sessionData?.timeScheduleData) {
      setTimeScheduleData(sessionData.timeScheduleData);
    }
  }, [sessionData]);

  // Обработчик переключения кнопки с анимацией
  const toggleButtonPosition = () => {
    const toValue = isButtonLeft ? 1 : 0;
    
    Animated.timing(buttonPosition, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsButtonLeft(!isButtonLeft);
  };

  // Обработчик клика по кнопке (переключает контент)
  const handleButtonPress = () => {
    toggleButtonPosition();
  };

  // Обработчик клика по контейнеру (только переключает)
  const handleContainerPress = () => {
    toggleButtonPosition();
  };

  // Обработчики навигации между страницами
  const handleAddressPageNext = (data: AddressData) => {
    setAddressData(data);
    nextPage({ addressData: data });
  };

  const handleTimeScheduleNext = (data: TimeScheduleData) => {
    setTimeScheduleData(data);
    nextPage({ timeScheduleData: data });
  };

  const handleTimeScheduleBack = () => {
    previousPage();
  };

  const handleProgressStepPress = (page: FixWavePage) => {
    // Переходим к выбранной странице
    goToPage(page);
  };

  const handleInfoPress = () => {
    Alert.alert(
      t('common.info'),
      t('common.scheduleInfo'),
      [{ text: t('common.ok') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Хедер скопированный из ChatListScreen */}
      <View style={styles.header}>
        {/* Пустой контейнер слева для центрирования */}
        <View style={styles.headerLeft} />
        
        {/* Контейнер по центру */}
        <View style={styles.headerContainer}>
          {/* Анимированная кнопка */}
          <Animated.View 
            style={[
              styles.headerButton,
              {
                left: buttonPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 96], // 4px от левого края или 96px от левого края (200-100-4)
                }),
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.buttonInner}
              onPress={handleButtonPress}
            >
              <Text style={styles.buttonText}>
                {isButtonLeft ? 'FixDrive' : 'FixWave'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* TouchableOpacity для клика по контейнеру */}
          <TouchableOpacity 
            style={styles.containerTouchable}
            onPress={handleContainerPress}
            activeOpacity={1}
          />
        </View>
        
        {/* Пустой контейнер справа для центрирования */}
        <View style={styles.headerRight}>
          {/* Иконка информации в правом углу - только на странице расписания */}
          {currentPage === 'timeSchedule' && (
            <View style={{ alignItems: 'flex-end', paddingRight: 0 }}>
              <TouchableOpacity onPress={handleInfoPress}>
                <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        
        {/* Прогресс-бар - показываем только на левой странице */}
        {isButtonLeft && (
          <>
            <ProgressBar 
              currentPage={currentPage} 
              onStepPress={handleProgressStepPress}
            />
            
            {/* Контейнеры страниц */}
            <View style={{ marginTop: 10 }}>
              {currentPage === 'addresses' && (
                <AddressPage 
                  onNext={handleAddressPageNext}
                  initialData={addressData}
                />
              )}
              
              {currentPage === 'timeSchedule' && (
                <TimeSchedulePage 
                  onNext={handleTimeScheduleNext}
                  onBack={handleTimeScheduleBack}
                  initialData={timeScheduleData}
                />
              )}
              
              {currentPage === 'confirmation' && (
                <View style={{ padding: 20 }}>
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: '600', 
                    color: colors.text,
                    textAlign: 'center'
                  }}>
                    Подтверждение заказа
                  </Text>
                  <Text style={{ 
                    fontSize: 16, 
                    color: colors.textSecondary,
                    marginTop: 10,
                    textAlign: 'center'
                  }}>
                    Здесь будет страница подтверждения
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default FixWaveScreen;
