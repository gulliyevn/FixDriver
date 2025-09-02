import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../hooks/useI18n';
import { ClientScreenProps } from '../../types/navigation';
import { DriverStackParamList } from '../../types/driver/DriverNavigation';
import { TripsScreenStyles as styles, getTripsScreenStyles } from '../../styles/screens/profile/TripsScreen.styles';
import { getMockTrips } from '../../mocks/tripsMock';
import TripsFilter, { TripFilter } from '../../components/TripsFilter';
import { colors } from '../../constants/colors';

// Универсальный тип для навигации
type TripsScreenProps = ClientScreenProps<'Trips'> | { navigation: any };

/**
 * Экран истории поездок
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useTrips hook
 * 2. Подключить TripsService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать фильтрацию и поиск
 * 5. Добавить экспорт данных
 * 6. Подключить пагинацию
 */

const TripsScreen: React.FC<TripsScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getTripsScreenStyles(isDark);
  
  // Определяем роль пользователя
  const isDriver = user?.role === 'driver';
  
  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? 'Мои поездки' : t('client.trips.title');
  };
  
  const getEmptyStateText = () => {
    return isDriver 
      ? 'История выполненных поездок пуста' 
      : t('client.trips.emptyDescription');
  };
  
  const getEmptyStateTitle = () => {
    return isDriver ? 'Нет поездок' : t('client.trips.noTrips');
  };
  
  const getDriverLabel = () => {
    return isDriver ? 'Клиент' : t('client.trips.driver');
  };

  const [filterVisible, setFilterVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<TripFilter>({
    status: 'all',
    dateRange: 'all'
  });
  
  const allTrips = useMemo(() => getMockTrips(t), [t]);
  
  const filteredTrips = useMemo(() => {
    let filtered = allTrips;
    
    // Фильтр по статусу
    if (currentFilter.status !== 'all') {
      filtered = filtered.filter(trip => trip.status === currentFilter.status);
    }
    
    // Фильтр по дате (упрощенная логика для мок данных)
    if (currentFilter.dateRange !== 'all') {
      switch (currentFilter.dateRange) {
        case 'today':
          filtered = filtered.filter((_, index) => index === 0);
          break;
        case 'week':
          filtered = filtered.filter((_, index) => index < 2);
          break;
        case 'month':
          filtered = filtered.filter((_, index) => index < 3);
          break;
        case 'year':
          break;
      }
    }
    
    return filtered;
  }, [allTrips, currentFilter]);

  const getTripIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      case 'scheduled':
        return 'time';
      default:
        return 'car';
    }
  };

  const getTripColor = (type: string) => {
    switch (type) {
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#e53935';
      case 'scheduled':
        return '#2196f3';
      default:
        return '#003366';
    }
  };

  const getTripStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#e53935';
      case 'scheduled':
        return '#2196f3';
      default:
        return '#888';
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>{getScreenTitle()}</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[styles.contentContainer, { paddingTop: 16 }]}
        showsVerticalScrollIndicator={false}
      >

        {filteredTrips.length === 0 ? (
          <View style={[styles.emptyState, { alignItems: 'center', justifyContent: 'center' }]}>
            <Ionicons name="car-outline" size={64} color={currentColors.textSecondary} />
            <Text style={[styles.emptyTitle, dynamicStyles.emptyTitle]}>{getEmptyStateTitle()}</Text>
            <Text style={[styles.emptyDescription, dynamicStyles.emptyDescription]}>
              {getEmptyStateText()}
            </Text>
          </View>
        ) : (
          <>
            {filteredTrips.map((trip) => (
              <View key={trip.id} style={[styles.carItem, dynamicStyles.carItem]}>
                <View style={styles.carHeader}>
                  <View style={styles.carInfo}>
                    <Ionicons 
                      name={getTripIcon(trip.type) as any} 
                      size={24} 
                      color={getTripColor(trip.type)} 
                    />
                    <View style={styles.carDetails}>
                      <Text style={[styles.carModel, dynamicStyles.carModel]}>{trip.title}</Text>
                      <Text style={[styles.carPlate, dynamicStyles.carPlate]}>{trip.date} • {trip.time}</Text>
                    </View>
                  </View>
                  <View style={styles.paymentAmount}>
                    <Text style={[styles.amountText, { color: getTripColor(trip.type) }]}>
                      {trip.amount}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getTripStatusColor(trip.status) }]}>
                      <Text style={styles.statusText}>
                        {trip.status === 'completed' ? t('client.trips.status.completed') : 
                         trip.status === 'cancelled' ? t('client.trips.status.cancelled') : t('client.trips.status.scheduled')}
                      </Text>
                    </View>
                  </View>
                </View>
                {trip.description && (
                  <Text style={[styles.carPlate, dynamicStyles.carPlate]}>{trip.description}</Text>
                )}
                {trip.driver && (
                  <Text style={[styles.carPlate, dynamicStyles.carPlate]}>
                    {getDriverLabel()}: {trip.driver}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
      
      <TripsFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setCurrentFilter}
        currentFilter={currentFilter}
      />
    </View>
  );
};

export default TripsScreen; 