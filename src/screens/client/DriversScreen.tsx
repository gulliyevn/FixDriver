import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert, TextInput, Animated, NativeScrollEvent, NativeSyntheticEvent, Pressable, Easing, Linking, ScrollView } from 'react-native';
import { CommonActions } from '@react-navigation/native';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const filterExpandAnim = useRef(new Animated.Value(0)).current;
  const ITEMS_PER_PAGE = 3; // Загружаем по 3 водителя за раз
  
  // Индивидуальные состояния для каждого водителя
  const [expandedDrivers, setExpandedDrivers] = useState<Set<string>>(new Set());
  const [driverExpandAnims] = useState<Map<string, Animated.Value>>(new Map());
  const [activeCallSheets, setActiveCallSheets] = useState<Set<string>>(new Set());
  const [driverCallAnims] = useState<Map<string, Animated.Value>>(new Map());

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

  const loadDrivers = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
        setPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      // Имитируем загрузку из API с пагинацией
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const pageData = mockDrivers.slice(startIndex, endIndex);
      
      if (pageNumber === 1 || isRefresh) {
        setDrivers(pageData);
      } else {
        setDrivers(prev => [...prev, ...pageData]);
      }
      
      // Проверяем есть ли еще данные
      setHasMore(endIndex < mockDrivers.length);
      setPage(pageNumber);
      
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreDrivers = async () => {
    if (!loadingMore && hasMore) {
      await loadDrivers(page + 1, false);
    }
  };

  const handleRefresh = async () => {
    await loadDrivers(1, true);
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
    // Показываем всех водителей
    setFilteredDrivers(sorted);
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

  const toggleFilter = useCallback(() => {
    const toValue = filterExpanded ? 0 : 1;
    setFilterExpanded(!filterExpanded);
    
    Animated.timing(filterExpandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [filterExpanded, filterExpandAnim]);




  const handleChatWithDriver = useCallback((driver: Driver) => {
    // Исправленная навигация для правильной работы свайпа
    try {
      // Переходим к табу Chat сначала, чтобы установить правильный стек
      navigation.navigate('Chat' as any);
      
      // Небольшая задержка для правильной инициализации навигатора
      setTimeout(() => {
        // Теперь навигируем к конкретному чату с полным стеком ChatList -> ChatConversation
        (navigation as any).navigate('Chat', {
          screen: 'ChatConversation',
          params: {
            driverId: driver.id,
            driverName: `${driver.first_name} ${driver.last_name}`,
            driverCar: `${driver.vehicle_brand} ${driver.vehicle_model}`,
            driverNumber: driver.phone_number,
            driverRating: driver.rating.toString(),
            driverStatus: driver.isAvailable ? 'online' : 'offline'
          }
        });
      }, 100);
    } catch (error) {
      console.warn('Chat navigation failed, falling back to Chat tab:', error);
      navigation.navigate('Chat' as any);
    }
  }, [navigation]);

  // Функции для работы с индивидуальными состояниями водителей
  const getOrCreateExpandAnim = useCallback((driverId: string) => {
    if (!driverExpandAnims.has(driverId)) {
      driverExpandAnims.set(driverId, new Animated.Value(0));
    }
    return driverExpandAnims.get(driverId)!;
  }, [driverExpandAnims]);

  const getOrCreateCallAnim = useCallback((driverId: string) => {
    if (!driverCallAnims.has(driverId)) {
      driverCallAnims.set(driverId, new Animated.Value(0));
    }
    return driverCallAnims.get(driverId)!;
  }, [driverCallAnims]);

  const toggleDriverExpanded = useCallback((driverId: string) => {
    const isExpanded = expandedDrivers.has(driverId);
    const expandAnim = getOrCreateExpandAnim(driverId);
    const toValue = isExpanded ? 0 : 1;
    
    if (isExpanded) {
      setExpandedDrivers(prev => {
        const newSet = new Set(prev);
        newSet.delete(driverId);
        return newSet;
      });
    } else {
      setExpandedDrivers(prev => new Set(prev).add(driverId));
    }
    
    Animated.timing(expandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expandedDrivers, getOrCreateExpandAnim]);

  const openDriverCallSheet = useCallback((driverId: string) => {
    const callAnim = getOrCreateCallAnim(driverId);
    setActiveCallSheets(prev => new Set(prev).add(driverId));
    
    Animated.timing(callAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [getOrCreateCallAnim]);

  const closeDriverCallSheet = useCallback((driverId: string) => {
    const callAnim = getOrCreateCallAnim(driverId);
    
    Animated.timing(callAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setActiveCallSheets(prev => {
        const newSet = new Set(prev);
        newSet.delete(driverId);
        return newSet;
      });
    });
  }, [getOrCreateCallAnim]);

  const handleNetworkCall = useCallback((driver: Driver) => {
    Linking.openURL(`tel:${driver.phone_number}`);
    closeDriverCallSheet(driver.id);
  }, [closeDriverCallSheet]);

  const handleInternetCall = useCallback((driverId: string) => {
    closeDriverCallSheet(driverId);
    Alert.alert('Интернет звонок', 'Функция интернет звонка будет реализована позже.');
  }, [closeDriverCallSheet]);

  // Функция для получения уникальной информации о водителе
  const getDriverInfo = useCallback((driverId: string) => {
    const schedules = ['пн-пт', 'пн, ср, пт', 'вт, чт, сб', 'пн-сб'];
    const packages = ['Basic', 'Plus', 'Premium', 'VIP'];
    const stops = [2, 3, 4, 5];
    
    const driverIndex = parseInt(driverId.replace(/\D/g, '')) % schedules.length;
    
    return {
      schedule: schedules[driverIndex],
      package: packages[driverIndex],
      stops: stops[driverIndex]
    };
  }, []);

  // Функция для получения уникальных поездок каждого водителя
  const getDriverTrips = useCallback((driverId: string) => {
    const tripTemplates = [
      ['Дом', 'Офис', 'Школа'],
      ['Центр города', 'Аэропорт', 'Торговый центр'],
      ['Больница', 'Университет', 'Парк'],
      ['Вокзал', 'Рынок', 'Спортзал']
    ];
    
    const timeTemplates = [
      ['07:30', '08:15', '17:45'],
      ['08:00', '09:30', '18:30'],
      ['07:45', '12:00', '19:15'],
      ['08:30', '14:20', '20:00']
    ];
    
    // Используем ID водителя для консистентного выбора
    const driverIndex = parseInt(driverId.replace(/\D/g, '')) % tripTemplates.length;
    const trips = tripTemplates[driverIndex];
    const times = timeTemplates[driverIndex];
    
    return trips.map((trip, index) => ({
      text: trip,
      time: times[index],
      dotStyle: index === 0 ? 'default' : index === 1 ? 'blue' : 'location'
    }));
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
        leftThreshold={80}
        rightThreshold={80}
        friction={1.5}
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
          {/* Хедер с водителем - теперь вся секция кликабельна */}
          <TouchableOpacity 
            style={styles.driverHeader}
            onPress={() => toggleDriverExpanded(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            
            <View style={styles.driverMainInfo}>
              <View style={styles.nameRatingRow}>
                <Text style={styles.driverName}>{`${item.first_name} ${item.last_name}`}</Text>
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
              <View style={styles.vehicleExpandRow}>
                <Text style={styles.vehicleInfo}>{`${item.vehicle_brand} ${item.vehicle_model} • ${item.vehicle_number}`}</Text>
                <Animated.View style={{
                  transform: [{
                    rotate: getOrCreateExpandAnim(item.id).interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg']
                    })
                  }]
                }}>
                  <Ionicons 
                    name="chevron-down" 
                    size={16} 
                    color={isDark ? '#9CA3AF' : '#6B7280'} 
                  />
                </Animated.View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Панель с расписанием, премиум и остановками - всегда видна */}
          <View style={styles.driverInfoBar}>
            <View style={styles.scheduleInfo}>
              <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
              <Text style={styles.scheduleText}>{getDriverInfo(item.id).schedule}</Text>
            </View>
            
            <View style={styles.premiumInfo}>
              <Ionicons name="diamond" size={16} color="#FFD700" />
              <Text style={styles.premiumText}>{getDriverInfo(item.id).package}</Text>
            </View>
            
            <View style={styles.stopsInfo}>
              <Ionicons name="location" size={16} color="#9CA3AF" />
              <Text style={styles.stopsText}>{getDriverInfo(item.id).stops}</Text>
            </View>
            
            <View style={styles.ballInfo}>
              <Text style={styles.ballText}>Сын</Text>
              <Ionicons name="football" size={16} color="#9CA3AF" />
            </View>
          </View>

          <Animated.View 
            style={[
              styles.expandableContent,
              {
                maxHeight: getOrCreateExpandAnim(item.id).interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 300] // Adjust based on content height
                }),
                opacity: getOrCreateExpandAnim(item.id).interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0, 0, 1]
                })
              }
            ]}
          >
            {/* Список поездок */}
            <View style={styles.tripsContainer}>
              {getDriverTrips(item.id).map((trip, index) => (
                <React.Fragment key={`trip-${item.id}-${index}`}>
                  <View style={styles.tripItem}>
                    <View style={[
                      styles.tripDot, 
                      trip.dotStyle === 'blue' && styles.tripDotBlue,
                      trip.dotStyle === 'location' && styles.tripDotLocation
                    ]} />
                    <Text style={styles.tripText}>{trip.text}</Text>
                    <Text style={styles.tripTime}>{trip.time}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>

            {/* Нижняя разделительная линия */}
            <View style={styles.bottomBorder} />

            {/* Кнопки под линией */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.leftButton} onPress={() => handleChatWithDriver(item)}>
                <View style={styles.buttonContent}>
                  <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.leftButtonText}>Чат</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.rightButton} onPress={() => openDriverCallSheet(item.id)}>
                <View style={styles.rightButtonContent}>
                  <Ionicons name="call-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
                  <Text style={styles.rightButtonText}>Звонок</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
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

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>Загружаем еще водителей...</Text>
      </View>
    );
  };

  const renderDriverCallSheet = (driver: Driver) => {
    const isActive = activeCallSheets.has(driver.id);
    if (!isActive) return null;

    const callAnim = getOrCreateCallAnim(driver.id);

    return (
      <React.Fragment key={`callsheet-${driver.id}`}>
        <View style={(styles as any).callSheetOverlay}>
        <Pressable style={(styles as any).callSheetBackdrop} onPress={() => closeDriverCallSheet(driver.id)} />
        <Animated.View
          style={[
            (styles as any).callSheetContainer,
            {
              transform: [
                {
                  translateY: callAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity 
            style={(styles as any).callSheetClose} 
            onPress={() => closeDriverCallSheet(driver.id)} 
            accessibilityLabel="Закрыть"
          >
            <Ionicons name="close" size={22} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
          <View style={(styles as any).callSheetHandle} />
          <Text style={(styles as any).callSheetTitle}>
            Звонок {driver.first_name} {driver.last_name}
          </Text>
          <TouchableOpacity 
            style={(styles as any).callSheetOption} 
            onPress={() => handleInternetCall(driver.id)}
          >
            <Ionicons name="wifi" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
            <Text style={(styles as any).callSheetOptionText}>Интернет звонок</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={(styles as any).callSheetOption} 
            onPress={() => handleNetworkCall(driver)}
          >
            <Ionicons name="call" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
            <Text style={(styles as any).callSheetOptionText}>
              Обычный звонок {driver.phone_number}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        </View>
      </React.Fragment>
    );
  };

  const onListScrollBegin = (_e: NativeSyntheticEvent<NativeScrollEvent>) => {
    closeOpenSwipe();
  };



  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaTop}>
        <Animated.View style={[
          styles.header,
          {
            paddingTop: filterExpandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 14]
            }),
            paddingBottom: filterExpandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 6]
            })
          }
        ]}>
                    <View style={styles.headerTop}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Водители</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.filterIconContainer}
                  onPress={toggleFilter}
                  accessibilityLabel="Фильтр"
                >
                  <Ionicons
                    name="funnel-outline"
                    size={22}
                    color={isDark ? '#F9FAFB' : '#111827'}
                  />
                </TouchableOpacity>
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
            
            {/* Горизонтальный список фильтров внутри headerTop */}
            {filterExpanded && (
              <View style={styles.filtersWrapper}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.filtersContainer}
                  contentContainerStyle={styles.filtersContent}
                >
                  <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Все</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Онлайн</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Рейтинг 4.5+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Премиум</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Близко</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Быстрая подача</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Эконом</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>
        </Animated.View>



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
      </SafeAreaView>

      <FlatList
        data={filteredDrivers}
        keyExtractor={(item) => item.id}
        renderItem={renderDriverItem}
        style={styles.flatListContainer}
        contentContainerStyle={styles.driversList}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshing={loading}
        onRefresh={handleRefresh}
        onEndReached={loadMoreDrivers}
        onEndReachedThreshold={0.5}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
        onScrollBeginDrag={onListScrollBegin}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        getItemLayout={undefined}
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

      {/* Индивидуальные CallSheet для каждого водителя */}
      {filteredDrivers.map(driver => renderDriverCallSheet(driver))}

    </View>
  );
};

export default DriversScreen;
