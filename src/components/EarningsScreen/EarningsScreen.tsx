import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { createEarningsScreenStyles } from '../../styles/screens/EarningsScreen.styles';
import EarningsHeader from '../EarningsHeader';
import levelsTranslations from '../../i18n/common/levels.json';
import { useLevelProgress } from '../../context/LevelProgressContext';
import { useBalance } from '../../hooks/useBalance';

import { useEarningsState } from './hooks/useEarningsState';
import { useEarningsHandlers } from './hooks/useEarningsHandlers';
import { useEarningsData } from './hooks/useEarningsData';
import { useVIPTimeTracking } from './hooks/useVIPTimeTracking';
import EarningsStats from './components/EarningsStats';
import EarningsLevel from './components/EarningsLevel';
import EarningsEmptyContainer from './components/EarningsEmptyContainer';
import EarningsProgressLine from './components/EarningsProgressLine';

const EarningsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const styles = createEarningsScreenStyles(isDark);

  // Хуки для состояния, обработчиков и данных
  const {
    selectedPeriod,
    setSelectedPeriod,
    filterExpanded,
    setFilterExpanded,
    isOnline,
    setIsOnline,
    statusModalVisible,
    setStatusModalVisible,
    filterExpandAnim,
  } = useEarningsState();

  const { currentData } = useEarningsData(selectedPeriod);

  // Адаптивный цвет для круга
  const circleColor = isDark ? '#3B82F6' : '#083198';
  const textColor = isDark ? '#3B82F6' : '#083198';

  // Состояние для модалки уровня
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  // Получаем переводы для текущего языка
  const currentLanguage = useLanguage().language || 'ru';
  const levelTranslations = levelsTranslations[currentLanguage as keyof typeof levelsTranslations] || levelsTranslations.ru;

  // Получаем данные о прогрессе водителя
  const { driverLevel } = useLevelProgress();
  const { balance } = useBalance() as any;
  
  // VIP система отслеживания времени
  const { 
    vipTimeData, 
    startOnlineTime, 
    stopOnlineTime, 
    getCurrentHoursOnline,
    resetVIPTimeData 
  } = useVIPTimeTracking(driverLevel.isVIP);

  const {
    toggleFilter,
    handlePeriodSelect,
    handleStatusChange,
    confirmStatusChange,
    handleBalancePress,
  } = useEarningsHandlers(
    filterExpanded,
    setFilterExpanded,
    filterExpandAnim,
    setSelectedPeriod,
    setStatusModalVisible,
    isOnline,
    setIsOnline,
    startOnlineTime,
    stopOnlineTime
  );
  


  // Функция для получения названия уровня на текущем языке
  const getLevelDisplayName = () => {
    // Если VIP статус, показываем только "VIP"
    if (driverLevel.currentLevel >= 7) {
      return levelTranslations.levelNames.vip;
    }
    
    const levelKeys = ['starter', 'determined', 'reliable', 'champion', 'superstar', 'emperor'];
    const levelKey = levelKeys[driverLevel.currentLevel - 1] || 'starter';
    const levelName = levelTranslations.levelNames[levelKey as keyof typeof levelTranslations.levelNames];
    return `${levelName} ${driverLevel.currentSubLevel}`;
  };

  // Функция для получения иконки уровня
  const getLevelIcon = () => {
    // Используем иконку из driverLevel для синхронизации
    return driverLevel.icon;
  };



  const handleLevelPress = () => {
    setLevelModalVisible(true);
  };



  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaTop}>
        <EarningsHeader
          styles={styles}
          isDark={isDark}
          filterExpandAnim={filterExpandAnim}
          onToggleFilter={toggleFilter}
          selectedPeriod={selectedPeriod}
          onPeriodSelect={handlePeriodSelect}
          isOnline={isOnline}
          onStatusChange={handleStatusChange}
        />
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.earningsCard} onPress={handleBalancePress}>
          <View style={styles.earningsHeader}>
            <View style={styles.earningsLeft}>
              <TouchableOpacity style={{ alignItems: 'center', marginRight: 12 }} onPress={handleLevelPress}>
                <View style={{ 
                  backgroundColor: circleColor,
                  borderRadius: 25,
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 32 }}>{getLevelIcon()}</Text>
                </View>
              </TouchableOpacity>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.earningsAmount}>{currentData.total}</Text>
                  <Text style={styles.earningsReward}>+{parseInt(driverLevel.nextReward)} AFc</Text>
                </View>
                <Text style={{ fontSize: 10, color: textColor, marginTop: 4, fontWeight: '600', marginLeft: 14 }}>{getLevelDisplayName()}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
          <EarningsProgressLine isDark={isDark} />
        </TouchableOpacity>
        <EarningsStats period={selectedPeriod} isDark={isDark} />
        <EarningsEmptyContainer isDark={isDark} />
      </ScrollView>

      {/* Модалка изменения статуса */}
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('driver.status.changeStatus')}</Text>
            <Text style={styles.modalMessage}>
              {t('driver.status.changeStatusMessage')}{'\n'}
              <Text style={styles.modalStatusText}>
                {isOnline ? t('driver.status.offline') : t('driver.status.online')}?
              </Text>
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel} 
                onPress={() => setStatusModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>{t('driver.status.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonConfirm} 
                onPress={confirmStatusChange}
              >
                <Text style={styles.modalButtonConfirmText}>{t('driver.status.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка уровня водителя */}
      <Modal
        visible={levelModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLevelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%', width: '90%', minHeight: 500 }]}>
            <Text style={[styles.modalTitle, { textAlign: 'left' }]}>{levelTranslations.title}</Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'left', marginBottom: 15 }}>
              {levelTranslations.description}
            </Text>
            <ScrollView style={{ flex: 1, marginVertical: 10 }}>
              <Text style={[styles.modalMessage, { textAlign: 'left' }]}>
                {levelTranslations.content.split(/(\+\d+ AFc)/).map((part, index) => {
                  if (part.match(/^\+\d+ AFc$/)) {
                    return (
                      <Text key={index} style={{ fontWeight: 'bold', color: '#10B981' }}>
                        {part}
                      </Text>
                    );
                  }
                  if (part.includes('*Ежеквартальные бонусы')) {
                    return (
                      <Text key={index} style={{ fontStyle: 'italic', color: '#6B7280', fontSize: 12 }}>
                        {part}
                      </Text>
                    );
                  }
                  return part;
                })}
              </Text>
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel} 
                onPress={() => setLevelModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default EarningsScreen;
