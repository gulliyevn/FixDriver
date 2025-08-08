import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { EarningsScreenStyles as styles } from '../../styles/screens/EarningsScreen.styles';
import { useBalance } from '../../hooks/useBalance';

const EarningsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { balance } = useBalance() as any;

  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');

  const periodOptions = [
    { key: 'today', label: t('driver.earnings.today') },
    { key: 'week', label: t('driver.earnings.week') },
    { key: 'month', label: t('driver.earnings.month') },
  ] as const;

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('driver.earnings.title')}</Text>
        <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
          <Ionicons name="information-circle-outline" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.periodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {periodOptions.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[styles.periodButton, selectedPeriod === period.key && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Ionicons name="time-outline" size={16} color={selectedPeriod === period.key ? '#fff' : '#6B7280'} />
              <Text style={[styles.periodText, selectedPeriod === period.key && styles.periodTextActive]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
        <ScrollView style={styles.ridesList} showsVerticalScrollIndicator={false}>
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
        </ScrollView>
      </View>

      <View style={styles.withdrawSection}>
        <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
          <Ionicons name="card-outline" size={20} color="#fff" />
          <Text style={styles.withdrawButtonText}>{t('driver.earnings.withdraw')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EarningsScreen;


