import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Animated,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { Driver } from '../../types/driver';
import { mockDrivers } from '../../mocks';
import { colors } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';
import { SIZES, SHADOWS } from '../../constants/colors';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'Drivers'>;

interface DriverFilter {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

const DriversScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const currentColors = isDark ? colors.dark : colors.light;

  const [drivers] = useState<Driver[]>(mockDrivers);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(mockDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DriverFilter[]>([
    { id: 'all', label: 'Все', icon: 'people', active: true },
    { id: 'available', label: 'Доступные', icon: 'checkmark-circle', active: false },
    { id: 'high-rating', label: 'Топ рейтинг', icon: 'star', active: false },
    { id: 'nearby', label: 'Рядом', icon: 'location', active: false },
    { id: 'premium', label: 'Премиум', icon: 'diamond', active: false },
  ]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const filterDrivers = useCallback(() => {
    let filtered = drivers;

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(
        driver =>
          driver.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.vehicle_brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.vehicle_model?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Применяем активные фильтры
    const activeFilters = filters.filter(f => f.active);
    
    if (activeFilters.length > 0 && !activeFilters.find(f => f.id === 'all')) {
      activeFilters.forEach(filter => {
        switch (filter.id) {
          case 'available':
            filtered = filtered.filter(driver => driver.isAvailable);
            break;
          case 'high-rating':
            filtered = filtered.filter(driver => driver.rating >= 4.5);
            break;
          case 'nearby':
            // Фильтр по расстоянию (в реальном приложении будет геолокация)
            filtered = filtered.filter(driver => driver.isAvailable);
            break;
          case 'premium':
            filtered = filtered.filter(driver => driver.package === 'premium');
            break;
        }
      });
    }

    setFilteredDrivers(filtered);
  }, [drivers, searchQuery, filters]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    filterDrivers();
  }, [filterDrivers]);

  const handleFilterToggle = (filterId: string) => {
    setFilters(prev => prev.map(filter => {
      if (filter.id === filterId) {
        return { ...filter, active: !filter.active };
      }
      if (filterId === 'all') {
        return { ...filter, active: false };
      }
      if (filter.id === 'all') {
        return { ...filter, active: false };
      }
      return filter;
    }));
  };

  const handleDriverPress = (driver: Driver) => {
    if (isSelectionMode) {
      // В режиме выбора - переключаем выбор
      const newSelected = new Set(selectedDrivers);
      if (newSelected.has(driver.id)) {
        newSelected.delete(driver.id);
      } else {
        newSelected.add(driver.id);
      }
      setSelectedDrivers(newSelected);
    } else {
      // Обычный режим - выбираем водителя
      Alert.alert(
        'Выбрать водителя',
        `Выбрать ${driver.first_name} ${driver.last_name}?`,
        [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Выбрать', 
            onPress: () => navigation.navigate('Map')
          }
        ]
      );
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedDrivers(new Set());
  };

  const handleSelectAll = () => {
    if (selectedDrivers.size === filteredDrivers.length) {
      setSelectedDrivers(new Set());
    } else {
      setSelectedDrivers(new Set(filteredDrivers.map(driver => driver.id)));
    }
  };

  const handleBookSelected = () => {
    Alert.alert(
      'Забронировать водителей',
      `Забронировать ${selectedDrivers.size} выбранных водителей?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Забронировать', 
          onPress: () => {
            navigation.navigate('Map');
            setIsSelectionMode(false);
            setSelectedDrivers(new Set());
          }
        }
      ]
    );
  };

  const renderDriverCard = ({ item }: { item: Driver }) => {
    const isSelected = selectedDrivers.has(item.id);
    
    return (
      <Animated.View style={[
        styles.driverCard,
        { backgroundColor: currentColors.card, opacity: fadeAnim },
        isSelected && { borderColor: currentColors.primary, borderWidth: 2 }
      ]}>
        {/* Checkbox для режима выбора */}
        {isSelectionMode && (
          <TouchableOpacity
            style={[
              styles.selectionCheckbox,
              isSelected && { backgroundColor: currentColors.primary }
            ]}
            onPress={() => handleDriverPress(item)}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        )}

        <View style={styles.driverHeader}>
          <View style={styles.driverAvatar}>
            {item.avatar ? (
              <Text style={[styles.avatarText, { color: currentColors.primary }]}>
                {item.first_name?.[0]}{item.last_name?.[0]}
              </Text>
            ) : (
              <Ionicons name="person" size={24} color={currentColors.primary} />
            )}
          </View>
          <View style={styles.driverInfo}>
            <Text style={[styles.driverName, { color: currentColors.text }]}>
              {item.first_name} {item.last_name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.rating, { color: currentColors.textSecondary }]}>
                {item.rating.toFixed(1)}
              </Text>
              {item.package === 'premium' && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="diamond" size={12} color="#FFD700" />
                  <Text style={styles.premiumText}>Премиум</Text>
                </View>
              )}
            </View>
          </View>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: item.isAvailable ? currentColors.success : currentColors.error }
          ]} />
        </View>

        <View style={styles.vehicleInfo}>
          <Ionicons name="car" size={16} color={currentColors.textSecondary} />
          <Text style={[styles.vehicleText, { color: currentColors.textSecondary }]}>
            {item.vehicle_brand} {item.vehicle_model} • {item.vehicle_number}
          </Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={[styles.actionButton, { borderColor: currentColors.border }]}>
            <Ionicons name="chatbubble-outline" size={16} color={currentColors.textSecondary} />
            <Text style={[styles.actionText, { color: currentColors.textSecondary }]}>
              Чат
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.orderButton,
              { backgroundColor: item.isAvailable ? currentColors.primary : currentColors.textTertiary }
            ]}
            onPress={() => handleDriverPress(item)}
            disabled={!item.isAvailable}
          >
            <Text style={[styles.orderButtonText, { color: currentColors.card }]}>
              {item.isAvailable ? 'Заказать' : 'Недоступен'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderFilterButton = (filter: DriverFilter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        { 
          backgroundColor: filter.active ? currentColors.primary : currentColors.surface,
          borderColor: currentColors.border
        }
      ]}
      onPress={() => handleFilterToggle(filter.id)}
    >
      <Ionicons 
        name={filter.icon as keyof typeof Ionicons.glyphMap} 
        size={16} 
        color={filter.active ? currentColors.card : currentColors.textSecondary} 
      />
      <Text style={[
        styles.filterText,
        { color: filter.active ? currentColors.card : currentColors.textSecondary }
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <Animated.View style={[
        styles.header,
        { backgroundColor: currentColors.card, opacity: fadeAnim }
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={currentColors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: currentColors.text }]}>
          Водители ({filteredDrivers.length})
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={handleSelectionMode}
          >
            <Ionicons 
              name={isSelectionMode ? "checkmark-circle" : "checkmark-circle-outline"} 
              size={24} 
              color={isSelectionMode ? currentColors.primary : currentColors.text} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton} onPress={handleAdvancedFilters}>
            <Ionicons name="options" size={24} color={currentColors.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Selection Actions */}
      {isSelectionMode && selectedDrivers.size > 0 && (
        <View style={[styles.selectionActions, { backgroundColor: currentColors.card }]}>
          <TouchableOpacity 
            style={styles.selectAllButton}
            onPress={handleSelectAll}
          >
            <Text style={[styles.selectAllText, { color: currentColors.primary }]}>
              {selectedDrivers.size === filteredDrivers.length ? 'Снять выбор' : 'Выбрать все'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.bookButton, { backgroundColor: currentColors.primary }]}
            onPress={handleBookSelected}
          >
            <Text style={[styles.bookButtonText, { color: currentColors.card }]}>
              Забронировать ({selectedDrivers.size})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: currentColors.card }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: currentColors.surface }]}>
          <Ionicons name="search" size={20} color={currentColors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: currentColors.text }]}
            placeholder="Поиск водителей..."
            placeholderTextColor={currentColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={[styles.filtersContainer, { backgroundColor: currentColors.card }]}>
        <FlatList
          data={filters}
          renderItem={({ item }) => renderFilterButton(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Animated.View style={[styles.advancedFilters, { backgroundColor: currentColors.card }]}>
          <Text style={[styles.advancedFiltersTitle, { color: currentColors.text }]}>
            Дополнительные фильтры
          </Text>
          <View style={styles.advancedFiltersContent}>
            <TouchableOpacity style={styles.advancedFilterItem}>
              <Ionicons name="star" size={16} color={currentColors.textSecondary} />
              <Text style={[styles.advancedFilterText, { color: currentColors.textSecondary }]}>
                Рейтинг от 4.0
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.advancedFilterItem}>
              <Ionicons name="time" size={16} color={currentColors.textSecondary} />
              <Text style={[styles.advancedFilterText, { color: currentColors.textSecondary }]}>
                Время ожидания
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.advancedFilterItem}>
              <Ionicons name="car-sport" size={16} color={currentColors.textSecondary} />
              <Text style={[styles.advancedFilterText, { color: currentColors.textSecondary }]}>
                Тип автомобиля
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Drivers List */}
      <FlatList
        data={filteredDrivers}
        renderItem={renderDriverCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={currentColors.textSecondary} />
            <Text style={[styles.emptyText, { color: currentColors.textSecondary }]}>
              Водители не найдены
            </Text>
            <Text style={[styles.emptySubtext, { color: currentColors.textTertiary }]}>
              Попробуйте изменить фильтры или поисковый запрос
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    ...SHADOWS.light.medium,
  },
  backButton: {
    padding: SIZES.sm,
  },
  title: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  selectButton: {
    padding: SIZES.sm,
  },
  menuButton: {
    padding: SIZES.sm,
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  selectAllButton: {
    padding: SIZES.sm,
  },
  selectAllText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
  },
  bookButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.md,
  },
  bookButtonText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    ...SHADOWS.light.small,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius.lg,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.sm,
    fontSize: SIZES.fontSize.md,
  },
  filtersContainer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  filtersList: {
    gap: SIZES.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    marginRight: SIZES.sm,
  },
  filterText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
    marginLeft: SIZES.xs,
  },
  advancedFilters: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  advancedFiltersTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  advancedFiltersContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  advancedFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius.sm,
    backgroundColor: colors.light.background,
    gap: SIZES.xs,
  },
  advancedFilterText: {
    fontSize: SIZES.fontSize.sm,
  },
  listContainer: {
    padding: SIZES.lg,
  },
  driverCard: {
    borderRadius: SIZES.radius.lg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    ...SHADOWS.light.medium,
  },
  selectionCheckbox: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  avatarText: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  rating: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD70020',
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    borderRadius: SIZES.radius.xs,
    gap: 2,
  },
  premiumText: {
    fontSize: SIZES.fontSize.xs,
    color: '#FFD700',
    fontWeight: '600',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
    gap: SIZES.xs,
  },
  vehicleText: {
    fontSize: SIZES.fontSize.sm,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    gap: SIZES.xs,
  },
  actionText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
  },
  orderButton: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.md,
  },
  orderButtonText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.xl,
  },
  emptyText: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    marginTop: SIZES.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: SIZES.fontSize.sm,
    marginTop: SIZES.xs,
    textAlign: 'center',
  },
});

export default DriversScreen;
