import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EarningsScreenStyles } from '../../styles/screens/EarningsScreen.styles';
import { mockEarningsData } from '../../mocks';

const EarningsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const { periods, earningsData, quickStats, recentRides } = mockEarningsData;
  const currentData = earningsData[selectedPeriod as keyof typeof earningsData];

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleWithdraw = () => {
    Alert.alert('Вывод средств', 'Функция вывода средств будет доступна в следующем обновлении');
  };

  const handleViewDetails = () => {
    Alert.alert('Детали', 'Подробная статистика будет доступна в следующем обновлении');
  };

  return (
    <SafeAreaView style={EarningsScreenStyles.container}>
      {/* Header */}
      <View style={EarningsScreenStyles.header}>
        <Text style={EarningsScreenStyles.headerTitle}>Заработок</Text>
        <TouchableOpacity style={EarningsScreenStyles.detailsButton} onPress={handleViewDetails}>
          <Ionicons name="analytics" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={EarningsScreenStyles.periodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.value}
              style={[
                EarningsScreenStyles.periodButton,
                selectedPeriod === period.value && EarningsScreenStyles.periodButtonActive
              ]}
              onPress={() => handlePeriodSelect(period.value)}
            >
              <Text style={[
                EarningsScreenStyles.periodText,
                selectedPeriod === period.value && EarningsScreenStyles.periodTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Total Earnings */}
      <View style={EarningsScreenStyles.earningsCard}>
        <View style={EarningsScreenStyles.earningsHeader}>
          <Text style={EarningsScreenStyles.earningsLabel}>Общий заработок</Text>
          <Ionicons name="trending-up" size={24} color="#27ae60" />
        </View>
        <Text style={EarningsScreenStyles.earningsAmount}>{currentData.total}</Text>
        <Text style={EarningsScreenStyles.earningsSubtext}>+12% по сравнению с прошлым периодом</Text>
      </View>

      {/* Quick Stats */}
      <View style={EarningsScreenStyles.statsSection}>
        <Text style={EarningsScreenStyles.sectionTitle}>Статистика</Text>
        <View style={EarningsScreenStyles.statsGrid}>
          <View style={EarningsScreenStyles.statCard}>
            <View style={[EarningsScreenStyles.statIcon, { backgroundColor: '#007AFF' }]}> 
              <Ionicons name="car" size={20} color="#fff" />
            </View>
            <Text style={EarningsScreenStyles.statValue}>{quickStats.totalTrips}</Text>
            <Text style={EarningsScreenStyles.statLabel}>Всего поездок</Text>
          </View>
          <View style={EarningsScreenStyles.statCard}>
            <View style={[EarningsScreenStyles.statIcon, { backgroundColor: '#27ae60' }]}> 
              <Ionicons name="cash" size={20} color="#fff" />
            </View>
            <Text style={EarningsScreenStyles.statValue}>{quickStats.totalEarnings}</Text>
            <Text style={EarningsScreenStyles.statLabel}>Всего заработано</Text>
          </View>
          <View style={EarningsScreenStyles.statCard}>
            <View style={[EarningsScreenStyles.statIcon, { backgroundColor: '#f39c12' }]}> 
              <Ionicons name="star" size={20} color="#fff" />
            </View>
            <Text style={EarningsScreenStyles.statValue}>{quickStats.averageRating}</Text>
            <Text style={EarningsScreenStyles.statLabel}>Средний рейтинг</Text>
          </View>
          <View style={EarningsScreenStyles.statCard}>
            <View style={[EarningsScreenStyles.statIcon, { backgroundColor: '#6c5ce7' }]}> 
              <Ionicons name="time" size={20} color="#fff" />
            </View>
            <Text style={EarningsScreenStyles.statValue}>{quickStats.onlineHours}</Text>
            <Text style={EarningsScreenStyles.statLabel}>Часы онлайн</Text>
          </View>
        </View>
      </View>

      {/* Chart Placeholder */}
      <View style={EarningsScreenStyles.chartSection}>
        <Text style={EarningsScreenStyles.sectionTitle}>График заработка</Text>
        <View style={EarningsScreenStyles.chartContainer}>
          <View style={EarningsScreenStyles.chartPlaceholder}>
            <Ionicons name="stats-chart" size={60} color="#ddd" />
            <Text style={EarningsScreenStyles.chartText}>График</Text>
            <Text style={EarningsScreenStyles.chartSubtext}>Интерактивный график заработка</Text>
          </View>
        </View>
      </View>

      {/* Recent Rides */}
      <View style={EarningsScreenStyles.ridesSection}>
        <Text style={EarningsScreenStyles.sectionTitle}>Последние поездки</Text>
        <ScrollView style={EarningsScreenStyles.ridesList} showsVerticalScrollIndicator={false}>
          {recentRides.map((ride) => (
            <View key={ride.id} style={EarningsScreenStyles.rideCard}>
              <View style={EarningsScreenStyles.rideHeader}>
                <View style={EarningsScreenStyles.rideInfo}>
                  <Text style={EarningsScreenStyles.rideClient}>{ride.from} → {ride.to}</Text>
                  <Text style={EarningsScreenStyles.rideTime}>{ride.time}</Text>
                </View>
                <View style={EarningsScreenStyles.rideAmount}>
                  <Text style={EarningsScreenStyles.amountText}>{ride.earnings}</Text>
                  <View style={EarningsScreenStyles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={EarningsScreenStyles.ratingText}>{ride.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Withdraw Button */}
      <View style={EarningsScreenStyles.withdrawSection}>
        <TouchableOpacity style={EarningsScreenStyles.withdrawButton} onPress={handleWithdraw}>
          <Ionicons name="card" size={24} color="#fff" />
          <Text style={EarningsScreenStyles.withdrawButtonText}>Вывести средства</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EarningsScreen; 