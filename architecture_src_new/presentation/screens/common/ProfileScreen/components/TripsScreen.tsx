import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, Filter } from '../../../../../shared/components/IconLibrary';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useAuth } from '../../../../../core/context/AuthContext';
import { useI18n } from '../../../../../shared/i18n';
import { getMockTrips } from '../../../../../shared/mocks/tripsMock';
import TripsFilter, { TripFilter } from './TripsFilter';
import { createTripsScreenStyles } from './styles/TripsScreen.styles';

interface TripsScreenProps {
  onBack: () => void;
}

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

const TripsScreen: React.FC<TripsScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const styles = createTripsScreenStyles(colors);
  
  // Определяем роль пользователя
  const isDriver = user?.role === 'driver';
  
  // Состояние для фильтрации
  const [filter, setFilter] = useState<TripFilter>({
    status: 'all',
    dateRange: 'all'
  });
  
  // Состояние для модального окна фильтра
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Получаем моковые данные поездок
  const allTrips = useMemo(() => getMockTrips(t), [t]);
  
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
    return isDriver 
      ? 'Поездки не найдены' 
      : t('client.trips.emptyTitle');
  };
  
  // Фильтрация поездок
  const filteredTrips = useMemo(() => {
    return allTrips.filter(trip => {
      // Фильтр по статусу
      if (filter.status !== 'all' && trip.status !== filter.status) {
        return false;
      }
      
      // Фильтр по дате (базовая реализация)
      if (filter.dateRange !== 'all') {
        const tripDate = new Date(trip.date);
        const now = new Date();
        
        switch (filter.dateRange) {
          case 'today':
            return tripDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return tripDate >= weekAgo;
          case 'month':
            return tripDate.getMonth() === now.getMonth() && 
                   tripDate.getFullYear() === now.getFullYear();
          case 'year':
            return tripDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [allTrips, filter]);
  
  // Обработчик применения фильтра
  const handleFilterApply = (newFilter: TripFilter) => {
    setFilter(newFilter);
  };
  
  // Получение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      case 'scheduled':
        return '#F59E0B';
      default:
        return colors.textSecondary;
    }
  };
  
  // Получение текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Отменено';
      case 'scheduled':
        return 'Запланировано';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{getScreenTitle()}</Text>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setIsFilterVisible(true)}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTrips.length === 0 ? (
          // Empty State
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{getEmptyStateTitle()}</Text>
            <Text style={styles.emptyDescription}>{getEmptyStateText()}</Text>
          </View>
        ) : (
          // Trips List
          filteredTrips.map((trip, index) => (
            <View key={index} style={styles.tripItem}>
              <View style={styles.tripHeader}>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripRoute}>
                    {trip.from} → {trip.to}
                  </Text>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                </View>
                <View style={styles.tripPayment}>
                  <Text style={styles.paymentAmount}>
                    ${trip.amount}
                  </Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(trip.status) }
                  ]}>
                    <Text style={styles.statusText}>
                      {getStatusText(trip.status)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.tripDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Водитель:</Text>
                  <Text style={styles.detailValue}>{trip.driver}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Время:</Text>
                  <Text style={styles.detailValue}>{trip.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Автомобиль:</Text>
                  <Text style={styles.detailValue}>{trip.vehicle}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <TripsFilter
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleFilterApply}
        currentFilter={filter}
      />
    </View>
  );
};

export default TripsScreen;
