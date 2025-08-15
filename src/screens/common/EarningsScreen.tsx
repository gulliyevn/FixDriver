import React, { useMemo, useState, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Alert, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { createEarningsScreenStyles } from '../../styles/screens/EarningsScreen.styles';
import { useBalance } from '../../hooks/useBalance';
import EarningsHeader from '../../components/EarningsHeader';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { DriverStackParamList, RootStackParamList } from '../../types/driver/DriverNavigation';

const EarningsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { balance } = useBalance() as any;
  const styles = createEarningsScreenStyles(isDark);
  const navigation = useNavigation<any>();

  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('week');
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const filterExpandAnim = useRef(new Animated.Value(0)).current;

  const currentData = useMemo(() => ({
    total: `100 AFc`,
  }), []);

  const quickStats = {
    totalTrips: 42,
    totalEarnings: `${Math.max(0, balance)} AFc`,
    averageRating: 4.8,
    onlineHours: 36,
  };

  const rides = [
    { id: 'r1', from: 'Площадь', to: 'Центр', time: 'Сегодня, 10:20', earnings: '+6 AFc', rating: 5.0 },
    { id: 'r2', from: 'Аэропорт', to: 'Проспект', time: 'Сегодня, 09:15', earnings: '+9 AFc', rating: 4.9 },
  ];

  const handleWithdraw = () => {
    Alert.alert(t('driver.earnings.withdraw'), t('driver.earnings.withdrawMessage'));
  };



  const toggleFilter = useCallback(() => {
    const toValue = filterExpanded ? 0 : 1;
    setFilterExpanded(!filterExpanded);
    
    Animated.timing(filterExpandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [filterExpanded, filterExpandAnim]);

  const handlePeriodSelect = useCallback((period: 'today' | 'week' | 'month' | 'year' | 'custom') => {
    setSelectedPeriod(period);
  }, []);

  const handleStatusChange = useCallback(() => {
    setStatusModalVisible(true);
  }, []);

  const confirmStatusChange = useCallback(() => {
    setIsOnline(!isOnline);
    setStatusModalVisible(false);
  }, [isOnline]);

  const handleBalancePress = useCallback(() => {
    try {
      // Переходим на таб профиля
      navigation.navigate('Profile' as any);
      
      setTimeout(() => {
        // Навигируем к экрану баланса внутри стека профиля
        (navigation as any).navigate('Profile', {
          screen: 'Balance'
        });
      }, 100);
    } catch (error) {
      console.warn('Balance navigation failed, falling back to Profile tab:', error);
      navigation.navigate('Profile' as any);
    }
  }, [navigation]);

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
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
        </TouchableOpacity>





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


