import React, { useState, useRef } from 'react';
import { SafeAreaView, View, ScrollView, Animated, Text } from 'react-native';

// Core Contexts
import { useTheme } from '../../../../core/context/ThemeContext';
import { useLanguage } from '../../../../core/context/LanguageContext';
import { useAuth } from '../../../../core/context/AuthContext';
import { useLevelProgress } from '../../../../core/context/LevelProgressContext';

// Shared Hooks
import { useBalance } from '../../../../shared/hooks/useBalance';
import { useI18n } from '../../../../shared/i18n';

// Local Styles
import { createEarningsScreenStyles } from './styles/EarningsScreen.styles';

// Shared Components
import { EarningsHeader } from '../../../../presentation/components';
import { DayEndModal } from '../../../../presentation/components';

// Local Components
import EarningsStats from './components/EarningsStats';
import TopDrivers from './components/TopDrivers';
import EarningsCard from './components/EarningsCard';
import StatusModal from './components/StatusModal';
import LevelModal from './components/LevelModal';

// Local Hooks
import { useEarningsState } from './hooks/useEarningsState';
import { useEarningsHandlers } from './hooks/useEarningsHandlers';
import { useEarningsData } from './hooks/useEarningsData';
import { useVIPTimeTracking } from './hooks/useVIPTimeTracking';

// Local Utils
import { getLevelDisplayName, getLevelIcon, calculateVIPBonus } from './utils/levelUtils';
import { EARNINGS_CONSTANTS } from './constants/earningsConstants';

// Local Types and Config
import levelsTranslations from '../../../../shared/i18n/common/levels.json';

const EarningsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const styles = createEarningsScreenStyles(isDark);

  // Animation for visual feedback
  const balanceAnim = useRef(new Animated.Value(EARNINGS_CONSTANTS.BALANCE_ANIMATION_SCALE)).current;

  // State for modals
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  
  // State for forced updates and timers
  const [forceUpdate, setForceUpdate] = useState(0);
  const [timerTick, setTimerTick] = useState(0);

  // Get driver level and progress data
  const { driverLevel, incrementProgress, updateVIPLevel } = useLevelProgress();
  const { balance, earnings, addEarnings, resetBalance } = useBalance();

  // Get earnings screen state and handlers
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
    uiUpdateTrigger,
  } = useEarningsState();

  // Get earnings data
  const { quickStats, periodStats, isLoading } = useEarningsData(selectedPeriod);
  
  // Sync earnings with UI
  React.useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [earnings]);

  // VIP Time Tracking System
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
    dayEndModalVisible,
    handleDayEndConfirm,
    handleDayEndCancel,
    forceDayCheck,
  } = useVIPTimeTracking(driverLevel.isVIP);

  // Get earnings handlers
  const {
    handlePeriodChange,
    handleStatusToggle,
    handleFilterToggle,
    handleStatusModalToggle,
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

  // VIP Data for progress bar and calculations
  const vipQualifiedDays = vipTimeData.qualifiedDaysThisMonth;
  const vipRidesToday = vipTimeData.ridesToday;
  const vipCurrentHours = getCurrentHoursOnline();
  const isCurrentlyOnline = vipTimeData.isCurrentlyOnline;

  // Adaptive colors
  const circleColor = isDark ? EARNINGS_CONSTANTS.LEVEL_COLORS.DARK : EARNINGS_CONSTANTS.LEVEL_COLORS.LIGHT;
  const textColor = isDark ? EARNINGS_CONSTANTS.LEVEL_COLORS.DARK : EARNINGS_CONSTANTS.LEVEL_COLORS.LIGHT;

  // Get current language translations
  const currentLanguage = useLanguage().language || 'ru';
  const levelTranslations = levelsTranslations;

  // Calculate VIP bonus
  const vipBonusData = calculateVIPBonus(
    driverLevel,
    vipQualifiedDays,
    vipRidesToday,
    vipCurrentHours,
    getQualifiedDaysHistory
  );

  // Update VIP level based on qualified periods history
  React.useEffect(() => {
    if (driverLevel.isVIP && driverLevel.vipStartDate) {
      const qualifiedHistory = getQualifiedDaysHistory();
      updateVIPLevel(qualifiedHistory);
    }
  }, [driverLevel.isVIP, driverLevel.vipStartDate, getQualifiedDaysHistory, updateVIPLevel]);

  // Auto-update timer in modal every second
  React.useEffect(() => {
    if (!statusModalVisible) return;
    const id = setInterval(() => setTimerTick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [statusModalVisible]);

  // Auto-update timer on screen when online
  React.useEffect(() => {
    if (!isOnline) return;
    const id = setInterval(() => setTimerTick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [isOnline]);

  // Force timer update when status changes via DriverModal
  React.useEffect(() => {
    if (uiUpdateTrigger > 0) {
      setTimerTick(prev => prev + 1);
    }
  }, [uiUpdateTrigger]);

  // Force timer update when VIP data changes
  React.useEffect(() => {
    if (isCurrentlyOnline) {
      setTimerTick(prev => prev + 1);
    }
  }, [vipTimeData.isCurrentlyOnline, vipTimeData.lastOnlineTime]);

  // Force timer update when online status changes
  React.useEffect(() => {
    if (isOnline) {
      setTimerTick(prev => prev + 1);
    }
  }, [isOnline]);

  // Modal handlers
  const handleLevelPress = () => {
    setLevelModalVisible(true);
  };

  const handleBalancePress = () => {
    // TODO: Implement balance press logic
  };

  const handleStatusChange = () => {
    setStatusModalVisible(true);
  };

  const confirmStatusChange = () => {
    handleStatusToggle();
    setStatusModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <EarningsHeader
          filterExpandAnim={filterExpandAnim}
          onToggleFilter={handleFilterToggle}
          selectedPeriod={selectedPeriod}
          onPeriodSelect={handlePeriodChange}
          isOnline={isOnline}
          onStatusChange={handleStatusChange}
        />
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ transform: [{ scale: balanceAnim }] }}>
          <EarningsCard
            styles={styles}
            isDark={isDark}
            currentData={quickStats}
            driverLevel={driverLevel}
            vipMonthlyPreviewBonus={vipBonusData.totalBonus}
            vipQualifiedDays={vipQualifiedDays}
            vipRidesToday={vipRidesToday}
            vipCurrentHours={vipCurrentHours}
            circleColor={circleColor}
            textColor={textColor}
            getLevelDisplayName={() => getLevelDisplayName(driverLevel, t)}
            getLevelIcon={() => getLevelIcon(driverLevel)}
            onLevelPress={handleLevelPress}
            onBalancePress={handleBalancePress}
          />
        </Animated.View>
        
        <EarningsStats period={selectedPeriod} isDark={isDark} />
        <TopDrivers />
      </ScrollView>

      {/* Status Change Modal */}
      <StatusModal
        visible={statusModalVisible}
        styles={styles}
        vipCurrentHours={vipCurrentHours}
        isOnline={isOnline}
        t={t}
        onClose={() => setStatusModalVisible(false)}
        onConfirm={confirmStatusChange}
      />

      {/* Level Modal */}
      <LevelModal
        visible={levelModalVisible}
        styles={styles}
        levelTranslations={levelTranslations}
        t={t}
        onClose={() => setLevelModalVisible(false)}
      />

      {/* TODO: Implement DayEndModal component */}
      {dayEndModalVisible && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>Day End Modal (TODO)</Text>
            <Text onPress={handleDayEndConfirm} style={{ color: 'blue', marginTop: 10 }}>Confirm</Text>
            <Text onPress={handleDayEndCancel} style={{ color: 'red', marginTop: 5 }}>Cancel</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default EarningsScreen;