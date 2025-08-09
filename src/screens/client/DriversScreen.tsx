import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert, TextInput, Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { Swipeable as RNSwipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { createDriversScreenStyles } from '../../styles/screens/drivers/DriversScreen.styles';
import { mockDrivers } from '../../mocks';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { Driver } from '../../types/driver';
import NotificationsModal from '../../components/NotificationsModal';

const ACTION_WIDTH = 100; // Keep in sync with styles.swipeAction.width

const DriversScreen: React.FC = () => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createDriversScreenStyles(isDark), [isDark]);
  const { t } = useI18n();
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<ClientStackParamList>>();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Keep refs to swipeable rows to close them programmatically
  const swipeRefs = useRef<Record<string, RNSwipeable | null>>({});
  const openSwipeRef = useRef<RNSwipeable | null>(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 200);
    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    filterDrivers();
  }, [drivers, debouncedQuery, favorites]);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      // Имитируем загрузку из API
      await new Promise(resolve => setTimeout(resolve, 500));
      setDrivers(mockDrivers);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    const base = drivers.map(d => ({ ...d, isFavorite: favorites.has(d.id) }));
    const list = !debouncedQuery
      ? base
      : base.filter(driver =>
          driver.first_name?.toLowerCase().includes(debouncedQuery) ||
          driver.last_name?.toLowerCase().includes(debouncedQuery) ||
          driver.vehicle_brand?.toLowerCase().includes(debouncedQuery) ||
          driver.vehicle_model?.toLowerCase().includes(debouncedQuery)
        );
    // Sort: favorites first, then by rating desc
    const sorted = list.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.rating - a.rating;
    });
    // Показываем только первый элемент
    setFilteredDrivers(sorted.slice(0, 1));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openDriverDetails = (driver: Driver) => {
    if (selectionMode) {
      toggleSelect(driver.id);
      return;
    }

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
  };

  const handleDriverPress = (driver: Driver) => {
    if (selectionMode) {
      toggleSelect(driver.id);
    } else {
      openDriverDetails(driver);
    }
  };

  const closeOpenSwipe = useCallback(() => {
    if (openSwipeRef.current) {
      try { openSwipeRef.current.close(); } catch {}
      openSwipeRef.current = null;
    }
  }, []);

  const renderDriverItem = ({ item }: { item: Driver & { isFavorite?: boolean } }) => {
    const renderLeftActions = (progress: any, dragX: any) => {
      const scale = dragX.interpolate({
        inputRange: [0, ACTION_WIDTH],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });
      const opacity = dragX.interpolate({
        inputRange: [0, ACTION_WIDTH * 0.6, ACTION_WIDTH],
        outputRange: [0, 0.6, 1],
        extrapolate: 'clamp',
      });

      return (
        <View style={[styles.swipeActionsLeft]}>
          <Animated.View style={{ transform: [{ scale }], opacity }}>
            <TouchableOpacity
              style={[styles.swipeAction, styles.favoriteAction, styles.swipeActionInnerLeft]}
              onPress={() => {
                toggleFavorite(item.id);
                swipeRefs.current[item.id]?.close();
              }}
              accessibilityRole="button"
              accessibilityLabel="bookmark"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.85}
            >
              <Ionicons name="bookmark" size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

    const renderRightActions = (progress: any, dragX: any) => {
      const scale = dragX.interpolate({
        inputRange: [-ACTION_WIDTH, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      const opacity = dragX.interpolate({
        inputRange: [-ACTION_WIDTH, -ACTION_WIDTH * 0.6, 0],
        outputRange: [1, 0.6, 0],
        extrapolate: 'clamp',
      });

      return (
        <View style={[styles.swipeActionsRight]}>
          <Animated.View style={{ transform: [{ scale }], opacity }}>
            <TouchableOpacity
              style={[styles.swipeAction, styles.deleteAction, styles.swipeActionInnerRight]}
              onPress={() => {
                deleteDriver(item.id);
                swipeRefs.current[item.id]?.close();
              }}
              accessibilityRole="button"
              accessibilityLabel="delete"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.85}
            >
              <Ionicons name="trash" size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

    return (
      <Swipeable
        ref={(ref) => { swipeRefs.current[item.id] = ref as RNSwipeable | null; }}
        renderLeftActions={selectionMode ? undefined : renderLeftActions}
        renderRightActions={selectionMode ? undefined : renderRightActions}
        leftThreshold={60}
        rightThreshold={60}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableWillOpen={() => {
          if (openSwipeRef.current && openSwipeRef.current !== swipeRefs.current[item.id]) {
            try { openSwipeRef.current.close(); } catch {}
          }
          openSwipeRef.current = swipeRefs.current[item.id] ?? null;
        }}
        onSwipeableClose={() => {
          if (openSwipeRef.current === swipeRefs.current[item.id]) {
            openSwipeRef.current = null;
          }
        }}
      >
        <View style={styles.driverItem}>
          {/* Хедер с водителем */}
          <View style={styles.driverHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            
            <View style={styles.driverMainInfo}>
              <View style={styles.nameRatingRow}>
                <Text style={styles.driverName}>Дмитрий Петров</Text>
                <Text style={styles.ratingText}>4.8</Text>
              </View>
              <View style={styles.vehicleExpandRow}>
                <Text style={styles.vehicleInfo}>Toyota Camry • А123ББ777</Text>
                <TouchableOpacity 
                  style={styles.expandButton}
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  <Ionicons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color={isDark ? '#9CA3AF' : '#6B7280'} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Панель с расписанием, премиум и остановками - всегда видна */}
          <View style={styles.driverInfoBar}>
            <View style={styles.scheduleInfo}>
              <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
              <Text style={styles.scheduleText}>пн, ср, пт</Text>
            </View>
            
            <View style={styles.premiumInfo}>
              <Ionicons name="diamond" size={16} color="#FFD700" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
            
            <Text style={styles.stopsText}>3 остановок</Text>
          </View>

          {isExpanded && (
            <>
              {/* Список поездок */}
              <View style={styles.tripsContainer}>
                <View style={styles.tripItem}>
                  <View style={styles.tripDot} />
                  <Text style={styles.tripText}>Trip to city center</Text>
                  <Text style={styles.tripTime}>08:00</Text>
                </View>
                
                <View style={styles.tripItem}>
                  <View style={[styles.tripDot, styles.tripDotBlue]} />
                  <Text style={styles.tripText}>Офис БЦ Port Baku</Text>
                  <Text style={styles.tripTime}>09:15</Text>
                </View>
                
                <View style={styles.tripItem}>
                  <View style={[styles.tripDot, styles.tripDotLocation]} />
                  <Text style={styles.tripText}>Торговый центр 28 Mall</Text>
                  <Text style={styles.tripTime}>18:30</Text>
                </View>
              </View>

              {/* Нижняя разделительная линия */}
              <View style={styles.bottomBorder} />

              {/* Кнопки под линией */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.leftButton}>
                  <View style={styles.buttonContent}>
                    <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.leftButtonText}>Чат</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.rightButton}>
                  <View style={styles.rightButtonContent}>
                    <Ionicons name="call-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
                    <Text style={styles.rightButtonText}>Звонок</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Swipeable>
    );
  };

  const selectAll = () => {
    if (selectedIds.size === filteredDrivers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDrivers.map(d => d.id)));
    }
  };

  const bookSelected = () => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      'Забронировать водителей',
      `Забронировать ${selectedIds.size} выбранных водителей?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Забронировать',
          onPress: () => {
            navigation.navigate('Map');
            setSelectionMode(false);
            setSelectedIds(new Set());
          }
        }
      ]
    );
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      'Удалить водителей',
      'Удалить выбранных водителей из списка?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            setDrivers(prev => prev.filter(d => !selectedIds.has(d.id)));
            setSelectionMode(false);
            setSelectedIds(new Set());
          }
        }
      ]
    );
  };

  const toggleFavorite = (driverId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(driverId)) next.delete(driverId); else next.add(driverId);
      return next;
    });
  };

  const deleteDriver = (driverId: string) => {
    Alert.alert(
      'Удалить водителя',
      'Удалить водителя из списка?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            setDrivers(prev => prev.filter(driver => driver.id !== driverId));
          }
        }
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="people-outline"
        size={64}
        color={isDark ? '#6B7280' : '#9CA3AF'}
      />
      <Text style={styles.emptyStateTitle}>
        {loading ? 'Загрузка водителей...' : 'Нет водителей'}
      </Text>
      {!loading && (
        <Text style={styles.emptyStateSubtitle}>
          Водители появятся здесь после загрузки
        </Text>
      )}
    </View>
  );

  const onListScrollBegin = (_e: NativeSyntheticEvent<NativeScrollEvent>) => {
    closeOpenSwipe();
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Водители</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            accessibilityLabel="Уведомления"
            onPress={() => setNotificationsModalVisible(true)}
            style={styles.filterButton}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={isDark ? '#F9FAFB' : '#111827'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск водителей..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredDrivers}
        keyExtractor={(item) => item.id}
        renderItem={renderDriverItem}
        contentContainerStyle={styles.driversList}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={loadDrivers}
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews
        onScrollBeginDrag={onListScrollBegin}
      />

      {selectionMode && (
        <View style={styles.actionButtonsContainer}>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.selectAllButton]}
              onPress={selectAll}
            >
              <Text style={styles.selectAllButtonText}>
                {selectedIds.size === filteredDrivers.length ? 'Снять выбор' : 'Выбрать все'}
              </Text>
            </TouchableOpacity>
            {selectedIds.size > 0 && (
              <TouchableOpacity
                style={[styles.actionButton, styles.bookButton]}
                onPress={bookSelected}
              >
                <Text style={styles.bookButtonText}>
                  Забронировать ({selectedIds.size})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <NotificationsModal
        visible={notificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
      />

    </SafeAreaView>
  );
};

export default DriversScreen;
