import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert, Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
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
import { ClientStackParamList, DriverStackParamList } from '../../types/navigation';
import { Driver } from '../../types/driver';
import NotificationsModal from '../../components/NotificationsModal';
import DriverListItem from '../../components/driver/DriverListItem';
import DriversHeader from '../../components/DriversHeader';
import useDriversList from '../../hooks/client/useDriversList';
import EmptyDriversState from '../../components/EmptyDriversState';
import LoadingFooter from '../../components/LoadingFooter';
import DriversSearchBar from '../../components/DriversSearchBar';
import DriversSelectionBar from '../../components/DriversSelectionBar';

const ACTION_WIDTH = 100; // Keep in sync with styles.swipeAction.width

const DriversScreen: React.FC = () => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createDriversScreenStyles(isDark), [isDark]);
  const { t } = useI18n();
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<ClientStackParamList | DriverStackParamList>>();
  const {
    drivers,
    filteredDrivers,
    favorites,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    loadMoreDrivers,
    handleRefresh,
    toggleFavorite,
    removeDriver,
    removeDrivers,
  } = useDriversList();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const filterExpandAnim = useRef(new Animated.Value(0)).current;
  // ITEMS_PER_PAGE и mock удалены из экрана; данные приходят из useDriversList
  
  // Индивидуальные состояния переносятся внутрь элемента DriverListItem

  // Keep refs to swipeable rows to close them programmatically
  const swipeRefs = useRef<Record<string, RNSwipeable | null>>({});
  const openSwipeRef = useRef<RNSwipeable | null>(null);

  // Загрузка/фильтрация вынесена в useDriversList

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
      t('client.driversScreen.alerts.selectDriverTitle'),
      t('client.driversScreen.alerts.selectDriverMessage', {
        firstName: driver.first_name,
        lastName: driver.last_name,
      }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.select'), 
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

  // Анимации и call-sheet теперь инкапсулированы в DriverListItem

  const renderDriverItem = ({ item }: { item: Driver & { isFavorite?: boolean } }) => (
    <DriverListItem
      driver={{ ...item, isFavorite: favorites.has(item.id) }}
      isDark={isDark}
      styles={styles}
      actionWidth={ACTION_WIDTH}
      SwipeableComponent={Swipeable}
      swipeRefSetter={(id, ref) => {
        swipeRefs.current[id] = ref as RNSwipeable | null;
      }}
      onSwipeableWillOpen={(id) => {
        if (openSwipeRef.current && openSwipeRef.current !== swipeRefs.current[id]) {
          try {
            openSwipeRef.current.close();
          } catch {}
        }
        openSwipeRef.current = swipeRefs.current[id] ?? null;
      }}
      onSwipeableClose={(id) => {
        if (openSwipeRef.current === swipeRefs.current[id]) {
          openSwipeRef.current = null;
        }
      }}
      onToggleFavorite={(driverId) => {
        toggleFavorite(driverId);
        try { swipeRefs.current[driverId]?.close?.(); } catch {}
      }}
      onDelete={(driverId) => {
        deleteDriver(driverId);
        try { swipeRefs.current[driverId]?.close?.(); } catch {}
      }}
      onChat={(d) => {
        if (user?.role === 'driver') {
          // для водителя можно навигировать к старту поездки или профилю клиента
          try {
            (navigation as any).navigate('StartTrip' as any, { orderId: d.id });
          } catch {
            // fallback в чат
            handleChatWithDriver(d);
          }
        } else {
          handleChatWithDriver(d);
        }
      }}
      role={user?.role === 'driver' ? 'driver' : 'client'}
    />
  );

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
      t('client.driversScreen.alerts.bookDriversTitle'),
      t('client.driversScreen.alerts.bookDriversMessage', { count: selectedIds.size }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('client.driversScreen.common.book'),
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
      t('client.driversScreen.alerts.deleteDriversTitle'),
      t('client.driversScreen.alerts.deleteDriversMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            removeDrivers(selectedIds);
            setSelectionMode(false);
            setSelectedIds(new Set());
          }
        }
      ]
    );
  };

  // toggleFavorite уже предоставлен useDriversList

  const deleteDriver = (driverId: string) => {
    Alert.alert(
      t('client.driversScreen.alerts.deleteOneDriverTitle'),
      t('client.driversScreen.alerts.deleteOneDriverMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            removeDriver(driverId);
          }
        }
      ]
    );
  };

  const renderEmptyState = () => <EmptyDriversState styles={styles} isDark={isDark} loading={loading} />;

  const renderFooter = () => (loadingMore ? <LoadingFooter styles={styles} /> : null);

  // CallSheet удален: реализован внутри DriverListItem

  const onListScrollBegin = (_e: NativeSyntheticEvent<NativeScrollEvent>) => {
    closeOpenSwipe();
  };



  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaTop}>
        <DriversHeader
          styles={styles}
          isDark={isDark}
          filterExpandAnim={filterExpandAnim}
          onToggleFilter={toggleFilter}
          onOpenNotifications={() => setNotificationsModalVisible(true)}
        />



        <DriversSearchBar styles={styles} isDark={isDark} value={searchQuery} onChange={setSearchQuery} />
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
        <DriversSelectionBar
          styles={styles}
          selectedCount={selectedIds.size}
          totalCount={filteredDrivers.length}
          onSelectAll={selectAll}
          onBook={bookSelected}
        />
      )}

      <NotificationsModal
        visible={notificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
      />

      {/* Удалены индивидуальные CallSheet: теперь в элементе списка */}

    </View>
  );
};

export default DriversScreen;
