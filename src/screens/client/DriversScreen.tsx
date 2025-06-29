import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  StatusBar
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import RatingStars from '../../components/RatingStars';

interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  carModel: string;
  carNumber: string;
  isOnline: boolean;
  distance: string;
  estimatedTime: string;
  isAvailable: boolean;
  photo?: string;
}

const DriversScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const drivers: Driver[] = [];

  const handleDriverSelect = (driver: Driver) => {
    Alert.alert(
      'Выбор водителя',
      `Выбрать ${driver.name}?\n${driver.carModel} • ${driver.carNumber}\nРейтинг: ${driver.rating} ⭐`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выбрать', onPress: () => Alert.alert('Успешно', 'Водитель выбран!') }
      ]
    );
  };

  const handleBookDriver = (driver: Driver) => {
    Alert.alert(
      'Бронирование',
      `Забронировать ${driver.name} на завтра?\n${driver.carModel} • ${driver.carNumber}`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Забронировать', onPress: () => Alert.alert('Успешно', 'Водитель забронирован!') }
      ]
    );
  };

  const filters = [
    { id: 'all', label: 'Все', icon: 'car' },
    { id: 'online', label: 'Онлайн', icon: 'radio-button-on' },
    { id: 'nearby', label: 'Близко', icon: 'location' },
    { id: 'top', label: 'Топ', icon: 'star' },
    { id: 'available', label: 'Свободны', icon: 'checkmark-circle' },
  ];

  const filteredDrivers = drivers.filter(driver => {
    if (selectedFilter === 'online') return driver.isOnline;
    if (selectedFilter === 'nearby') return parseFloat(driver.distance) <= 1.0;
    if (selectedFilter === 'top') return driver.rating >= 4.8;
    if (selectedFilter === 'available') return driver.isAvailable;
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Доступные водители
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск водителей..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
            underlineColorAndroid="transparent"
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={14} 
                color={selectedFilter === filter.id ? '#FFFFFF' : '#1E3A8A'} 
              />
              <Text style={[
                styles.filterText,
                { color: selectedFilter === filter.id ? '#FFFFFF' : '#1E3A8A' }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Drivers List */}
      <ScrollView style={styles.driversList} showsVerticalScrollIndicator={false}>
        {filteredDrivers.map((driver) => (
          <AppCard key={driver.id} style={styles.driverCard} margin={8}>
            <View style={styles.driverContent}>
              <View style={styles.driverHeader}>
                <View style={styles.driverInfo}>
                  <View style={styles.driverAvatar}>
                    {driver.photo ? (
                      <Ionicons name="person" size={24} color="#1E3A8A" />
                    ) : (
                      <Ionicons name="person" size={24} color="#1E3A8A" />
                    )}
                  </View>
                  <View style={styles.driverDetails}>
                    <Text style={styles.driverName}>{driver.name}</Text>
                    <Text style={styles.carInfo}>
                      {driver.carModel} • {driver.carNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.driverStatus}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: driver.isOnline ? '#10B981' : '#6B7280' }
                  ]} />
                  <Text style={styles.statusText}>
                    {driver.isOnline ? 'Онлайн' : 'Офлайн'}
                  </Text>
                </View>
              </View>

              <View style={styles.driverStats}>
                <View style={styles.statItem}>
                  <RatingStars rating={driver.rating} size={16} />
                  <Text style={styles.statText}>{driver.rating}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="car" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{driver.totalRides} поездок</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="location" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{driver.distance}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{driver.estimatedTime}</Text>
                </View>
              </View>

              <View style={styles.driverFooter}>
                <View style={styles.actionButtons}>
                  {driver.isAvailable ? (
                    <>
                      <TouchableOpacity 
                        style={styles.selectButton}
                        onPress={() => handleDriverSelect(driver)}
                      >
                        <Text style={styles.selectButtonText}>Выбрать</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.bookButton}
                        onPress={() => handleBookDriver(driver)}
                      >
                        <Text style={styles.bookButtonText}>Забронировать</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity style={styles.unavailableButton} disabled>
                      <Text style={styles.unavailableButtonText}>Недоступен</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  filterButton: {
    padding: 8,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 44,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  filtersContainer: {
    marginBottom: 0,
    paddingBottom: 0,
    marginTop: 8,
    height: 32,
    minHeight: 32,
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 0,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  driversList: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  driverCard: {
    marginBottom: 8,
  },
  driverContent: {
    paddingVertical: 8,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  carInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  driverStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  driverStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  driverFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  selectButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookButtonText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '600',
  },
  unavailableButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  unavailableButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DriversScreen;
