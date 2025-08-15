import React, { useMemo, useState, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { createEarningsScreenStyles } from '../../styles/screens/EarningsScreen.styles';
import { useBalance } from '../../hooks/useBalance';
import EarningsHeader from '../../components/EarningsHeader';

const EarningsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { balance } = useBalance() as any;
  const styles = createEarningsScreenStyles(isDark);

  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('week');
  const [filterExpanded, setFilterExpanded] = useState(false);
  const filterExpandAnim = useRef(new Animated.Value(0)).current;

  const currentData = useMemo(() => ({
    total: `${balance} AFc`,
  }), [balance]);

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

  const handleViewDetails = () => {
    Alert.alert(t('driver.earnings.viewDetails'), t('driver.earnings.detailsMessage'));
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
          onViewDetails={handleViewDetails}
        />
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Text style={styles.earningsLabel}>{t('driver.earnings.total')}</Text>
            <Ionicons name="wallet-outline" size={20} color="#6B7280" />
          </View>
          <Text style={styles.earningsAmount}>{currentData.total}</Text>
          <Text style={styles.earningsSubtext}>+12% {t('common.success') || ''}</Text>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>{t('common.info')}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="car-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.statValue}>{quickStats.totalTrips}</Text>
              <Text style={styles.statLabel}>{t('driver.orders.all')}</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#27ae60' }]}>
                <Ionicons name="cash-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.statValue}>{quickStats.totalEarnings}</Text>
              <Text style={styles.statLabel}>{t('driver.earnings.total')}</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#f39c12' }]}>
                <Ionicons name="star" size={20} color="#fff" />
              </View>
              <Text style={styles.statValue}>{quickStats.averageRating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#6c5ce7' }]}>
                <Ionicons name="time-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.statValue}>{quickStats.onlineHours}</Text>
              <Text style={styles.statLabel}>Online</Text>
            </View>
          </View>
        </View>

        <View style={styles.ridesSection}>
          <Text style={styles.sectionTitle}>{t('driver.orders.completed')}</Text>
          {rides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <View style={styles.rideHeader}>
                <View style={styles.rideInfo}>
                  <Text style={styles.rideClient}>{ride.from} → {ride.to}</Text>
                  <Text style={styles.rideTime}>{ride.time}</Text>
                </View>
                <View style={styles.rideAmount}>
                  <Text style={styles.amountText}>{ride.earnings}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>{ride.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default EarningsScreen;


