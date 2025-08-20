import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { createEarningsScreenStyles } from '../../styles/screens/EarningsScreen.styles';
import EarningsHeader from '../EarningsHeader';
import levelsTranslations from '../../i18n/common/levels.json';
import { 
  LEVELS_CONFIG, 
  VIP_CONFIG, 
  getLevelConfig,
  getTranslatedLevelName
} from './types/levels.config';
import { useLevelProgress } from '../../context/LevelProgressContext';
import { useBalance } from '../../hooks/useBalance';

import { useEarningsState } from './hooks/useEarningsState';
import { useEarningsHandlers } from './hooks/useEarningsHandlers';
import { useEarningsData } from './hooks/useEarningsData';
import { useVIPTimeTracking } from './hooks/useVIPTimeTracking';
import EarningsStats from './components/EarningsStats';
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
    uiUpdateTrigger, // Добавляем триггер для обновления UI
  } = useEarningsState();

  // Состояние для принудительного обновления
  const [forceUpdate, setForceUpdate] = useState(0);
  // Тикер для обновления таймера (раз в секунду при открытой модалке)
  const [timerTick, setTimerTick] = useState(0);
  
  // Анимация для визуальной обратной связи
  const balanceAnim = useRef(new Animated.Value(1)).current;

  // Получаем данные о прогрессе водителя из контекста — единый источник истины
  const { driverLevel, incrementProgress, updateVIPLevel } = useLevelProgress();
  const { balance, earnings, addEarnings, loadBalance, loadEarnings, resetBalance } = useBalance();
  
  const { currentData } = useEarningsData(selectedPeriod, forceUpdate);
  
  // Синхронизируем earnings с UI
  React.useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [earnings]);

  // Обновляем VIP уровень на основе истории выполненных периодов
  // (перенесено ниже, после инициализации useVIPTimeTracking)

  // Получаем роль пользователя на верхнем уровне
  const { user } = useAuth();

  // Адаптивный цвет для круга
  const circleColor = isDark ? '#3B82F6' : '#083198';
  const textColor = isDark ? '#3B82F6' : '#083198';

  // Состояние для модалки уровня
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  // Получаем переводы для текущего языка
  const currentLanguage = useLanguage().language || 'ru';
  const levelTranslations = levelsTranslations[currentLanguage as keyof typeof levelsTranslations] || levelsTranslations.ru;
  
  // VIP система отслеживания времени
  const { 
    vipTimeData, 
    startOnlineTime, 
    stopOnlineTime, 
    getCurrentHoursOnline,
    resetVIPTimeData,
    registerRide,
    addManualOnlineHours,
    simulateDayChange,
    simulateMonthChange,
    getQualifiedDaysHistory,
  } = useVIPTimeTracking(driverLevel.isVIP);
  
  // Единый источник значений для VIP прогресс-бара и тестового контейнера
  const vipQualifiedDays = vipTimeData.qualifiedDaysThisMonth;
  const vipRidesToday = vipTimeData.ridesToday;
  const vipCurrentHours = getCurrentHoursOnline();
  const isCurrentlyOnline = vipTimeData.isCurrentlyOnline;

  // Обновляем VIP уровень на основе истории выполненных периодов
  React.useEffect(() => {
    if (driverLevel.isVIP && driverLevel.vipStartDate) {
      const qualifiedHistory = getQualifiedDaysHistory();
      updateVIPLevel(qualifiedHistory);
    }
  }, [driverLevel.isVIP, driverLevel.vipStartDate, getQualifiedDaysHistory, updateVIPLevel]);

  // Автообновление таймера в модалке раз в 1 секунду
  React.useEffect(() => {
    if (!statusModalVisible) return;
    const id = setInterval(() => setTimerTick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [statusModalVisible]);

  // Автообновление таймера на экране, когда онлайн
  React.useEffect(() => {
    if (!isOnline) return;
    const id = setInterval(() => setTimerTick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [isOnline]);

  // Принудительное обновление таймера при изменении статуса через DriverModal
  React.useEffect(() => {
    if (uiUpdateTrigger > 0) {
      setTimerTick(prev => prev + 1);
    }
  }, [uiUpdateTrigger]);

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
    // Если VIP статус, показываем "ВИП N" из driverLevel.vipLevel
    if (driverLevel.currentLevel >= 7) {
      const vipLabel = 'ВИП';
      const vipLevel = driverLevel.vipLevel || 1; // Получаем VIP уровень из состояния
      return `${vipLabel} ${vipLevel}`;
    }
    
    // Получаем конфигурацию текущего уровня
    const config = getLevelConfig(driverLevel.currentLevel, driverLevel.currentSubLevel);
    return getTranslatedLevelName(config.levelKey, config.subLevel, t);
  };

  // Функция для получения иконки уровня
  const getLevelIcon = () => {
    // Используем иконку из driverLevel для синхронизации
    return driverLevel.icon;
  };
  // Предпросмотр месячного бонуса для VIP: 20->50, 25->75, 26+->100 AFc
  const isQualifiedToday = driverLevel.isVIP && vipCurrentHours >= 10 && vipRidesToday >= 3;
  const displayQualifiedDays = driverLevel.isVIP
    ? vipQualifiedDays + (isQualifiedToday ? 1 : 0)
    : 0;
  // Месячный превью-бонус по правилам:
  // 0–19 → 0, 20–25 → +50, 26–29 → +75, 30 → +100
  const baseMonthlyPreview = driverLevel.isVIP
    ? (displayQualifiedDays < 20 ? 0
      : displayQualifiedDays <= 25 ? VIP_CONFIG.monthlyBonuses.days20
      : displayQualifiedDays <= 29 ? VIP_CONFIG.monthlyBonuses.days25
      : VIP_CONFIG.monthlyBonuses.days30)
    : 0;

  // Квартальный превью-бонус добавляем в ТЕКУЩЕМ периоде, когда в нём уже >=20 дней
  let quarterlyPreview = 0;
  if (driverLevel.isVIP) {
    const history = getQualifiedDaysHistory?.() || [];
    // Считаем подряд идущие успешные периоды с конца истории
    let trailingQualified = 0;
    for (let i = history.length - 1; i >= 0; i -= 1) {
      if (history[i] >= VIP_CONFIG.minDaysPerMonth) trailingQualified += 1;
      else break;
    }

    const qualifiesCurrent = displayQualifiedDays >= VIP_CONFIG.minDaysPerMonth;
    const effectiveConsecutive = trailingQualified + (qualifiesCurrent ? 1 : 0);

    if (qualifiesCurrent) {
      if (effectiveConsecutive === 3) quarterlyPreview = VIP_CONFIG.quarterlyBonuses.months3;
      else if (effectiveConsecutive === 6) quarterlyPreview = VIP_CONFIG.quarterlyBonuses.months6;
      else if (effectiveConsecutive === 12) quarterlyPreview = VIP_CONFIG.quarterlyBonuses.months12;
    }
  }

  const vipMonthlyPreviewBonus = baseMonthlyPreview + quarterlyPreview;




  // Функция для генерации контента модалки на основе новой конфигурации
  const generateLevelModalContent = () => {
    let content = '';
    
    // Добавляем информацию о каждом уровне
    for (let level = 1; level <= 6; level++) {
      const levelConfigs = [
        LEVELS_CONFIG[`${level}.1`],
        LEVELS_CONFIG[`${level}.2`],
        LEVELS_CONFIG[`${level}.3`]
      ];
      
      if (levelConfigs[0]) {
        const levelName = getTranslatedLevelName(levelConfigs[0].levelKey, 1, t).split(' ')[0]; // Берем только название уровня без номера
        const icon = levelConfigs[0].icon;
        
        // Вычисляем диапазон поездок для уровня согласно MD файлу
        let startRides = 0;
        let endRides = 0;
        
        if (level === 1) {
          startRides = 0;
          endRides = 120;
        } else if (level === 2) {
          startRides = 121;
          endRides = 360;
        } else if (level === 3) {
          startRides = 361;
          endRides = 810;
        } else if (level === 4) {
          startRides = 811;
          endRides = 1560;
        } else if (level === 5) {
          startRides = 1561;
          endRides = 2700;
        } else if (level === 6) {
          startRides = 2701;
          endRides = 4320;
        }
        
        content += `${icon} ${levelName} (${startRides}-${endRides} поездок)\n`;
        
        // Добавляем подуровни с правильными диапазонами
        levelConfigs.forEach((config, index) => {
          let subLevelStart = 0;
          let subLevelEnd = 0;
          
          if (level === 1) {
            if (index === 0) { subLevelStart = 0; subLevelEnd = 30; }
            else if (index === 1) { subLevelStart = 31; subLevelEnd = 70; }
            else if (index === 2) { subLevelStart = 71; subLevelEnd = 120; }
          } else if (level === 2) {
            if (index === 0) { subLevelStart = 121; subLevelEnd = 180; }
            else if (index === 1) { subLevelStart = 181; subLevelEnd = 260; }
            else if (index === 2) { subLevelStart = 261; subLevelEnd = 360; }
          } else if (level === 3) {
            if (index === 0) { subLevelStart = 361; subLevelEnd = 480; }
            else if (index === 1) { subLevelStart = 481; subLevelEnd = 630; }
            else if (index === 2) { subLevelStart = 631; subLevelEnd = 810; }
          } else if (level === 4) {
            if (index === 0) { subLevelStart = 811; subLevelEnd = 1020; }
            else if (index === 1) { subLevelStart = 1021; subLevelEnd = 1270; }
            else if (index === 2) { subLevelStart = 1271; subLevelEnd = 1560; }
          } else if (level === 5) {
            if (index === 0) { subLevelStart = 1561; subLevelEnd = 1890; }
            else if (index === 1) { subLevelStart = 1891; subLevelEnd = 2270; }
            else if (index === 2) { subLevelStart = 2271; subLevelEnd = 2700; }
          } else if (level === 6) {
            if (index === 0) { subLevelStart = 2701; subLevelEnd = 3180; }
            else if (index === 1) { subLevelStart = 3181; subLevelEnd = 3720; }
            else if (index === 2) { subLevelStart = 3721; subLevelEnd = 4320; }
          }
          
          content += `• ${getTranslatedLevelName(config.levelKey, config.subLevel, t)} (${subLevelStart}-${subLevelEnd}) +${config.bonus} AFc\n`;
        });
        
        content += '\n';
      }
    }
    
    // Добавляем VIP систему с переводами
    const vipTranslations = levelTranslations.vip;
    content += `${VIP_CONFIG.icon} ${vipTranslations.title} (${vipTranslations.subtitle})\n\n`;
    content += `${vipTranslations.monthlyTitle}\n`;
    content += `• 20 ${vipTranslations.daysOnline} +${VIP_CONFIG.monthlyBonuses.days20} AFc\n`;
    content += `• 25 ${vipTranslations.daysOnline} +${VIP_CONFIG.monthlyBonuses.days25} AFc\n`;
    content += `• 30 ${vipTranslations.daysOnline} +${VIP_CONFIG.monthlyBonuses.days30} AFc\n\n`;
    content += `${vipTranslations.quarterlyTitle}\n`;
    content += `• 3 ${vipTranslations.monthsInRow} +${VIP_CONFIG.quarterlyBonuses.months3} AFc\n`;
    content += `• 6 ${vipTranslations.monthsInRow} +${VIP_CONFIG.quarterlyBonuses.months6} AFc\n`;
    content += `• 12 ${vipTranslations.monthsInRow} +${VIP_CONFIG.quarterlyBonuses.months12} AFc\n\n`;
    content += vipTranslations.additionalNote;
    
    return content;
  };

  const handleLevelPress = () => {
    setLevelModalVisible(true);
  };

  // Обработчик для сброса баланса
  // Кнопки сброса удалены

  // Тестовая кнопка удалена



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
        <Animated.View style={{ transform: [{ scale: balanceAnim }] }}>
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
                  {driverLevel.isVIP ? (
                    <Text style={[styles.earningsReward, { color: '#10B981' }]}>+{vipMonthlyPreviewBonus} AFc</Text>
                  ) : (
                    <Text style={styles.earningsReward}>+{parseInt(driverLevel.nextReward)} AFc</Text>
                  )}
                </View>
                <Text style={{ fontSize: 10, color: textColor, marginTop: 4, fontWeight: '600', marginLeft: 14 }}>{getLevelDisplayName()}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
          <EarningsProgressLine 
            isDark={isDark}
            vipQualifiedDays={vipQualifiedDays}
            vipRidesToday={vipRidesToday}
            vipCurrentHours={vipCurrentHours}
          />
          
          {/* Тестовая кнопка удалена */}
        </TouchableOpacity>
        </Animated.View>
        
        {/* VIP Test Container removed */}
        
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
            {/* Таймер текущих часов онлайн за сегодня (локально 00:00-23:59) */}
            <View style={styles.modalTimerContainer}>
              <Text style={styles.modalTimerText}>
                {(() => {
                  // timerTick используется для принудительного пересчета каждую секунду
                  void timerTick;
                  const totalSeconds = Math.max(0, Math.floor(vipCurrentHours * 3600));
                  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
                  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
                  const ss = String(totalSeconds % 60).padStart(2, '0');
                  return `${hh}:${mm}:${ss}`;
                })()}
              </Text>
            </View>
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
                {generateLevelModalContent().split(/(\+\d+ AFc|Ежеквартальными и Ежемесячными бонусами считаются дни.*|Quarterly and Monthly bonuses count days.*|Rüblük və Aylıq bonuslar üçün günlər.*|المكافآت الفصلية والشهرية تحتسب الأيام.*|Vierteljährliche und Monatliche Boni zählen Tage.*|Las bonificaciones trimestrales y mensuales cuentan días.*|Les bonus trimestriels et mensuels comptabilisent.*|Üç aylık ve Aylık bonuslar.*)/u).map((part, index) => {
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
                  // Проверяем, содержит ли часть текст про правила бонусов (для любого языка)
                  if (part.includes('Ежеквартальными и Ежемесячными бонусами') || 
                      part.includes('Quarterly and Monthly bonuses') ||
                      part.includes('Rüblük və Aylıq bonuslar') ||
                      part.includes('المكافآت الفصلية والشهرية') ||
                      part.includes('Vierteljährliche und Monatliche') ||
                      part.includes('Las bonificaciones trimestrales') ||
                      part.includes('Les bonus trimestriels') ||
                      part.includes('Üç aylık ve Aylık bonuslar')) {
                    return (
                      <Text key={index} style={{ fontWeight: 'bold', fontSize: 14 }}>
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
