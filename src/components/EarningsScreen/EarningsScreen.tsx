import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { createEarningsScreenStyles } from '../../styles/screens/EarningsScreen.styles';
import EarningsHeader from '../EarningsHeader';

import { useEarningsState } from './hooks/useEarningsState';
import { useEarningsHandlers } from './hooks/useEarningsHandlers';
import { useEarningsData } from './hooks/useEarningsData';
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
    setIsOnline
  );

  const { currentData } = useEarningsData(selectedPeriod);

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
              <Ionicons name="wallet-outline" size={28} color="#6B7280" />
              <Text style={styles.earningsAmount}>{currentData.total}</Text>
              <Text style={styles.earningsReward}>+25 AFc</Text>
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


    </View>
  );
};

export default EarningsScreen;
