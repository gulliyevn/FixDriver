import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  Animated,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { mockDrivers } from '../../mocks';
import { colors, SIZES, SHADOWS } from '../../constants/colors';
import { Driver } from '../../types/driver';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'Drivers'>;

const DriversScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const currentColors = isDark ? colors.dark : colors.light;

  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(mockDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [searchQuery, selectedFilter, drivers]);

  const filterDrivers = () => {
    let filtered = drivers;

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(
        driver =>
          driver.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.vehicle_brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по статусу
    if (selectedFilter === 'available') {
      filtered = filtered.filter(driver => driver.isAvailable);
    } else if (selectedFilter === 'high-rating') {
      filtered = filtered.filter(driver => driver.rating >= 4.5);
    }

    setFilteredDrivers(filtered);
  };

  const handleDriverPress = (driver: Driver) => {
    // Навигация к деталям водителя или заказу
    navigation.navigate('Map');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderDriverCard = ({ item }: { item: Driver }) => (
    <Animated.View style={[
      styles.driverCard,
      { backgroundColor: currentColors.card, opacity: fadeAnim }
    ]}>
      <View style={styles.driverHeader}>
        <View style={styles.driverAvatar}>
          {item.avatar ? (
            <Text style={[styles.avatarText, { color: currentColors.primary }]}>
              {item.first_name[0]}{item.last_name[0]}
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

  const renderFilterButton = (filter: string, label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { 
          backgroundColor: selectedFilter === filter ? currentColors.primary : currentColors.surface,
          borderColor: currentColors.border
        }
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={selectedFilter === filter ? currentColors.card : currentColors.textSecondary} 
      />
      <Text style={[
        styles.filterText,
        { color: selectedFilter === filter ? currentColors.card : currentColors.textSecondary }
      ]}>
        {label}
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
          Водители
        </Text>
        
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="filter" size={24} color={currentColors.text} />
        </TouchableOpacity>
      </Animated.View>

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton('all', 'Все', 'people')}
          {renderFilterButton('available', 'Доступные', 'checkmark-circle')}
          {renderFilterButton('high-rating', 'Топ рейтинг', 'star')}
        </ScrollView>
      </View>

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
  menuButton: {
    padding: SIZES.sm,
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
  listContainer: {
    padding: SIZES.lg,
  },
  driverCard: {
    borderRadius: SIZES.radius.lg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    ...SHADOWS.light.medium,
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
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: SIZES.fontSize.sm,
    marginLeft: SIZES.xs,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  vehicleText: {
    fontSize: SIZES.fontSize.sm,
    marginLeft: SIZES.xs,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    marginRight: SIZES.md,
  },
  actionText: {
    fontSize: SIZES.fontSize.sm,
    marginLeft: SIZES.xs,
  },
  orderButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
  },
  orderButtonText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxxl,
  },
  emptyText: {
    fontSize: SIZES.fontSize.lg,
    marginTop: SIZES.md,
  },
});

export default DriversScreen;
