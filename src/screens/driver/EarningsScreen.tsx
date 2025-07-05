import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { EarningsScreenStyles } from '../../styles/screens/EarningsScreen.styles';

const EarningsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = [
    { key: 'today', label: 'Сегодня', icon: 'today' },
    { key: 'week', label: 'Неделя', icon: 'calendar' },
    { key: 'month', label: 'Месяц', icon: 'calendar-outline' },
  ];

  const earningsData = {
    today: {
      total: '3,200 ₽',
      rides: 8,
      hours: '6ч 30м',
      average: '400 ₽',
      chart: [1200, 800, 600, 400, 200]
    },
    week: {
      total: '18,500 ₽',
      rides: 45,
      hours: '42ч 15м',
      average: '411 ₽',
      chart: [2800, 3200, 2400, 3600, 2800, 2200, 2000]
    },
    month: {
      total: '72,800 ₽',
      rides: 180,
      hours: '168ч 45м',
      average: '404 ₽',
      chart: [8500, 9200, 7800, 9600, 8200, 7500, 6800]
    }
  };

  const currentData = earningsData[selectedPeriod as keyof typeof earningsData];

  const quickStats = [
    { label: 'Всего поездок', value: currentData.rides.toString(), icon: 'car-sport', color: '#27ae60' },
    { label: 'Время работы', value: currentData.hours, icon: 'time', color: '#007AFF' },
    { label: 'Средний чек', value: currentData.average, icon: 'wallet', color: '#FF9500' },
  ];

  const recentRides = [
    { id: '1', client: 'Анна Иванова', amount: '450 ₽', time: '14:30', rating: 5 },
    { id: '2', client: 'Петр Сидоров', amount: '320 ₽', time: '14:15', rating: 4 },
    { id: '3', client: 'Мария Козлова', amount: '580 ₽', time: '13:45', rating: 5 },
    { id: '4', client: 'Иван Петров', amount: '850 ₽', time: '13:20', rating: 4 },
  ];

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
              key={period.key}
              style={[
                EarningsScreenStyles.periodButton,
                selectedPeriod === period.key && EarningsScreenStyles.periodButtonActive
              ]}
              onPress={() => handlePeriodSelect(period.key)}
            >
              <Ionicons 
                name={period.icon as any} 
                size={16} 
                color={selectedPeriod === period.key ? '#fff' : '#666'} 
              />
              <Text style={[
                EarningsScreenStyles.periodText,
                selectedPeriod === period.key && EarningsScreenStyles.periodTextActive
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
          {quickStats.map((stat, index) => (
            <View key={index} style={EarningsScreenStyles.statCard}>
              <View style={[EarningsScreenStyles.statIcon, { backgroundColor: stat.color }]}>
                <Ionicons name={stat.icon as any} size={20} color="#fff" />
              </View>
              <Text style={EarningsScreenStyles.statValue}>{stat.value}</Text>
              <Text style={EarningsScreenStyles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Chart Placeholder */}
      <View style={EarningsScreenStyles.chartSection}>
        <Text style={EarningsScreenStyles.sectionTitle}>График заработка</Text>
        <View style={EarningsScreenStyles.chartContainer}>
          <View style={EarningsScreenStyles.chartPlaceholder}>
            <MaterialIcons name="show-chart" size={60} color="#ddd" />
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
                  <Text style={EarningsScreenStyles.rideClient}>{ride.client}</Text>
                  <Text style={EarningsScreenStyles.rideTime}>{ride.time}</Text>
                </View>
                <View style={EarningsScreenStyles.rideAmount}>
                  <Text style={EarningsScreenStyles.amountText}>{ride.amount}</Text>
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