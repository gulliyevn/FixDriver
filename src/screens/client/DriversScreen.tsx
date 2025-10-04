import React, {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import type { Swipeable as RNSwipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../hooks/useI18n";
import { createDriversScreenStyles } from "../../styles/screens/drivers/DriversScreen.styles";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ClientStackParamList,
  DriverStackParamList,
} from "../../types/navigation";
import useDriversList from "../../hooks/client/useDriversList";
import { Driver } from "../../types/driver";
import NotificationsModal from "../../components/NotificationsModal";
import DriverListItem from "../../components/driver/DriverListItem";
import DriversHeader from "../../components/DriversHeader";
import EmptyDriversState from "../../components/EmptyDriversState";
import LoadingFooter from "../../components/LoadingFooter";
import DriversSearchBar from "../../components/DriversSearchBar";
import DriversSelectionBar from "../../components/DriversSelectionBar";

const ACTION_WIDTH = 100; // Keep in sync with styles.swipeAction.width

const DriversScreen: React.FC = () => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createDriversScreenStyles(isDark), [isDark]);
  const { t } = useI18n();
  const { user } = useAuth();
  const {
    drivers,
    filteredDrivers,
    favorites,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    toggleFavorite,
    restoreFavorites,
    loadMoreDrivers,
    handleRefresh,
    removeDriver: removeDriverFromList,
    removeDrivers: removeDriversFromList,
  } = useDriversList();
  const navigation =
    useNavigation<
      StackNavigationProp<ClientStackParamList | DriverStackParamList>
    >();
  const [lastBookmarkedId, setLastBookmarkedId] = useState<string | null>(null);
  const [pausedDrivers, setPausedDrivers] = useState<Set<string>>(new Set());
  const [deletedDrivers, setDeletedDrivers] = useState<Set<string>>(new Set());

  // Фильтры/сортировки для чипов в хедере
  const [activeFilters, setActiveFilters] = useState<{
    all?: boolean;
    online?: boolean;
    priceAsc?: boolean;
    priceDesc?: boolean;
    rating45?: boolean;
    vip?: boolean;
    dailyTrips?: boolean;
    economy?: boolean;
  }>({
    all: true,
    online: false,
    priceAsc: false,
    priceDesc: false,
    rating45: false,
    vip: false,
    dailyTrips: false,
    economy: false,
  });

  const onSelectFilter = useCallback(
    (
      key:
        | "all"
        | "online"
        | "priceAsc"
        | "priceDesc"
        | "rating45"
        | "vip"
        | "nearby"
        | "fastDispatch"
        | "economy"
        | "dailyTrips",
    ) => {
      setActiveFilters((prev) => {
        const base = {
          all: false,
          online: false,
          priceAsc: false,
          priceDesc: false,
          rating45: false,
          vip: false,
          dailyTrips: false,
          economy: false,
        } as typeof prev;
        if (key === "all") return { ...base, all: true };
        // Эксклюзивно: только один активен. Повторное нажатие возвращает к All
        if ((prev as any)[key]) {
          return { ...base, all: true };
        }
        switch (key) {
          case "online":
            return { ...base, online: true };
          case "priceAsc":
            return { ...base, priceAsc: true };
          case "priceDesc":
            return { ...base, priceDesc: true };
          case "rating45":
            return { ...base, rating45: true };
          case "vip":
            return { ...base, vip: true };
          case "dailyTrips":
            return { ...base, dailyTrips: true };
          case "economy":
            return { ...base, economy: true };
          default:
            return prev;
        }
      });
    },
    [],
  );

  // Загрузка сохраненных статусов при монтировании
  useEffect(() => {
    loadSavedStatuses();
  }, []);

  const loadSavedStatuses = async () => {
    try {
      const [savedFavorites, savedPaused, savedDeleted, savedLastBookmarked] =
        await Promise.all([
          AsyncStorage.getItem("driver_favorites"),
          AsyncStorage.getItem("driver_paused"),
          AsyncStorage.getItem("driver_deleted"),
          AsyncStorage.getItem("driver_last_bookmarked"),
        ]);

      if (savedFavorites) {
        restoreFavorites(JSON.parse(savedFavorites));
      }
      if (savedPaused) {
        setPausedDrivers(new Set(JSON.parse(savedPaused)));
      }
      if (savedDeleted) {
        setDeletedDrivers(new Set(JSON.parse(savedDeleted)));
      }
      if (savedLastBookmarked) {
        setLastBookmarkedId(JSON.parse(savedLastBookmarked));
      }
    } catch (error) {
      console.warn('Failed to load last bookmarked driver:', error);
    }
  };

  // Фильтрация водителей
  const originalIndexById = useMemo(() => {
    const map: Record<string, number> = {};
    drivers.forEach((d, idx) => {
      map[d.id] = idx;
    });
    return map;
  }, [drivers]);

  const parsePrice = (driver: Driver): number => {
    const priceStr = (driver as any).price ?? "";
    const match = priceStr.match(/\d+(?:[.,]\d+)?/);
    return match
      ? parseFloat(match[0].replace(",", "."))
      : Number.POSITIVE_INFINITY;
  };

  const filteredDriversWithFilters = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const filtered = query
      ? filteredDrivers.filter(
          (driver) =>
            driver.first_name?.toLowerCase().includes(query) ||
            driver.last_name?.toLowerCase().includes(query) ||
            driver.vehicle_brand?.toLowerCase().includes(query) ||
            driver.vehicle_model?.toLowerCase().includes(query),
        )
      : filteredDrivers;

    // Исключаем удаленных водителей
    let notDeleted = filtered.filter(
      (driver) => !deletedDrivers.has(driver.id),
    );

    // Фильтр по онлайн, если активен
    if (activeFilters.online) {
      notDeleted = notDeleted.filter((driver) => !!driver.isAvailable);
    }

    // Фильтр по рейтингу 4.5+
    if (activeFilters.rating45) {
      notDeleted = notDeleted.filter((driver) => (driver.rating ?? 0) >= 4.5);
    }

    // Фильтр VIP (как суррогат — высокий рейтинг)
    if (activeFilters.vip) {
      notDeleted = notDeleted.filter((driver) => (driver.rating ?? 0) >= 4.8);
    }

    // Фильтр Ежедневные поездки (по расписанию из моков)
    if (activeFilters.dailyTrips) {
      notDeleted = notDeleted.filter((driver) => {
        const schedule = (driver as any).schedule?.toLowerCase?.() ?? "";
        return (
          schedule.includes("пн-пт") ||
          schedule.includes("пн-сб") ||
          schedule.includes("-")
        );
      });
    }

    // Эконом — низкая цена по мок-цене
    if (activeFilters.economy) {
      notDeleted = notDeleted.filter((driver) => parsePrice(driver) <= 20);
    }

    const mapped = notDeleted.map((d) => ({
      ...d,
      isFavorite: favorites.has(d.id),
      isPaused: pausedDrivers.has(d.id),
    }));

    // Сортировка по цене при активных чипах
    if (activeFilters.priceAsc || activeFilters.priceDesc) {
      mapped.sort((a, b) => {
        const pa = parsePrice(a);
        const pb = parsePrice(b);
        return activeFilters.priceAsc ? pa - pb : pb - pa;
      });
    } else {
      mapped.sort((a, b) => {
        const aIsPinned =
          lastBookmarkedId != null && a.id === lastBookmarkedId && a.isFavorite;
        const bIsPinned =
          lastBookmarkedId != null && b.id === lastBookmarkedId && b.isFavorite;
        if (aIsPinned !== bIsPinned) return aIsPinned ? -1 : 1;
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
        return (originalIndexById[a.id] ?? 0) - (originalIndexById[b.id] ?? 0);
      });
    }

    return mapped;
  }, [
    filteredDrivers,
    searchQuery,
    favorites,
    pausedDrivers,
    deletedDrivers,
    activeFilters,
    lastBookmarkedId,
    originalIndexById,
  ]);

  const togglePause = useCallback(
    (driverId: string) => {
      const driver = drivers.find((d) => d.id === driverId);
      if (!driver) return;

      const isCurrentlyPaused = pausedDrivers.has(driverId);
      const driverName = `${driver.first_name} ${driver.last_name}`;

      // Умная логика ролей
      const isDriver = user?.role === "driver";

      // Выбираем правильные ключи в зависимости от состояния
      let titleKey, messageKey;
      if (isDriver) {
        titleKey = isCurrentlyPaused
          ? "driver.tripDialogs.pauseTrip.resume"
          : "driver.tripDialogs.pauseTrip.title";
        messageKey = isCurrentlyPaused
          ? "driver.tripDialogs.pauseTrip.resumeMessage"
          : "driver.tripDialogs.pauseTrip.message";
      } else {
        titleKey = isCurrentlyPaused
          ? "client.driversScreen.alerts.resumeTripTitle"
          : "client.driversScreen.alerts.pauseTripTitle";
        messageKey = isCurrentlyPaused
          ? "client.driversScreen.alerts.resumeTripMessage"
          : "client.driversScreen.alerts.pauseTripMessage";
      }
      const nameKey = isDriver ? "clientName" : "driverName";

      Alert.alert(t(titleKey), t(messageKey, { [nameKey]: driverName }), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.confirm"),
          onPress: async () => {
            setPausedDrivers((prev) => {
              const next = new Set(prev);
              if (isCurrentlyPaused) {
                next.delete(driverId);
              } else {
                next.add(driverId);
              }
              return next;
            });

            // Сохраняем в AsyncStorage
            try {
              const newPausedDrivers = isCurrentlyPaused
                ? new Set([...pausedDrivers].filter((id) => id !== driverId))
                : new Set([...pausedDrivers, driverId]);

              await AsyncStorage.setItem(
                "driver_paused",
                JSON.stringify([...newPausedDrivers]),
              );
            } catch (error) {
              console.warn('Failed to save paused drivers:', error);
            }

            // Закрываем свайп после подтверждения
            try {
              swipeRefs.current[driverId]?.close?.();
            } catch (error) {
              console.warn('Failed to close swipe ref:', error);
            }
          },
        },
      ]);
    },
    [drivers, pausedDrivers, t, user?.role],
  );

  const removeDriverLocal = useCallback((driverId: string) => {
    // В режиме моков просто скрываем
  }, []);

  const removeDriversLocal = useCallback(
    async (ids: Set<string>) => {
      setDeletedDrivers((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.add(id));
        return next;
      });

      // Сохраняем в AsyncStorage
      try {
        const newDeletedDrivers = new Set([...deletedDrivers, ...ids]);
        await AsyncStorage.setItem(
          "driver_deleted",
          JSON.stringify([...newDeletedDrivers]),
        );
      } catch (error) {
        console.warn('Failed to save deleted drivers:', error);
      }
    },
    [deletedDrivers],
  );
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const filterExpandAnim = useRef(new Animated.Value(0)).current;
  // ITEMS_PER_PAGE и mock удалены из экрана; данные приходят из useDriversList

  // Индивидуальные состояния переносятся внутрь элемента DriverListItem

  // Keep refs to swipeable rows to close them programmatically
  const swipeRefs = useRef<Record<string, RNSwipeable | null>>({});
  const openSwipeRef = useRef<RNSwipeable | null>(null);

  // Загрузка/фильтрация вынесена в useDriversList

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
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
      t("client.driversScreen.alerts.selectDriverTitle"),
      t("client.driversScreen.alerts.selectDriverMessage", {
        firstName: driver.first_name,
        lastName: driver.last_name,
      }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.select"),
          onPress: () => navigation.navigate("Map"),
        },
      ],
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
      try {
        openSwipeRef.current.close();
      } catch (error) {
        console.warn('Failed to close swipe ref:', error);
      }
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

  const handleChatWithDriver = useCallback(
    (driver: Driver) => {
      try {
        // Для обеих ролей используем одинаковую навигацию к стеку чатов
        navigation.navigate("Chat" as any);

        setTimeout(() => {
          // Навигируем к конкретному чату внутри стека
          (navigation as any).navigate("Chat", {
            screen: "ChatConversation",
            params: {
              driverId: driver.id,
              driverName: `${driver.first_name} ${driver.last_name}`,
              driverCar: `${driver.vehicle_brand} ${driver.vehicle_model}`,
              driverNumber: driver.phone_number,
              driverRating: driver.rating.toString(),
              driverStatus: driver.isAvailable ? "online" : "offline",
            },
          });
        }, 100);
      } catch (error) {
        navigation.navigate("Chat" as any);
      }
    },
    [navigation],
  );

  // Анимации и call-sheet теперь инкапсулированы в DriverListItem

  const renderDriverItem = ({
    item,
  }: {
    item: Driver & { isFavorite?: boolean };
  }) => (
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
        if (
          openSwipeRef.current &&
          openSwipeRef.current !== swipeRefs.current[id]
        ) {
          try {
            openSwipeRef.current.close();
          } catch (error) {
            console.warn('Failed to close swipe ref:', error);
          }
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
        try {
          swipeRefs.current[driverId]?.close?.();
        } catch (error) {
          console.warn('Failed to close swipe ref:', error);
        }
      }}
      onDelete={(driverId) => {
        deleteDriver(driverId);
        try {
          swipeRefs.current[driverId]?.close?.();
        } catch (error) {
          console.warn('Failed to close swipe ref:', error);
        }
      }}
      onChat={handleChatWithDriver}
      onTogglePause={togglePause}
      role={user?.role === "driver" ? "driver" : "client"}
    />
  );

  const selectAll = () => {
    if (selectedIds.size === filteredDrivers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDrivers.map((d) => d.id)));
    }
  };

  const bookSelected = () => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      t("client.driversScreen.alerts.bookDriversTitle"),
      t("client.driversScreen.alerts.bookDriversMessage", {
        count: selectedIds.size,
      }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("client.driversScreen.common.book"),
          onPress: () => {
            navigation.navigate("Map");
            setSelectionMode(false);
            setSelectedIds(new Set());
          },
        },
      ],
    );
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      t("client.driversScreen.alerts.deleteDriversTitle"),
      t("client.driversScreen.alerts.deleteDriversMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            removeDriversLocal(selectedIds);
            setSelectionMode(false);
            setSelectedIds(new Set());
          },
        },
      ],
    );
  };

  // toggleFavorite уже предоставлен useDriversList

  const deleteDriver = (driverId: string) => {
    Alert.alert(
      t("client.driversScreen.alerts.deleteOneDriverTitle"),
      t("client.driversScreen.alerts.deleteOneDriverMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            setDeletedDrivers((prev) => {
              const next = new Set(prev);
              next.add(driverId);
              return next;
            });

            // Сохраняем в AsyncStorage
            try {
              const newDeletedDrivers = new Set([...deletedDrivers, driverId]);
              await AsyncStorage.setItem(
                "driver_deleted",
                JSON.stringify([...newDeletedDrivers]),
              );
            } catch (error) {
              console.warn('Failed to save deleted drivers:', error);
            }
          },
        },
      ],
    );
  };

  const renderEmptyState = () => (
    <EmptyDriversState styles={styles} isDark={isDark} loading={loading} />
  );

  const renderFooter = () =>
    loadingMore ? <LoadingFooter styles={styles} /> : null;

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
          activeFilters={activeFilters}
          onSelectFilter={onSelectFilter}
        />

        <DriversSearchBar
          styles={styles}
          isDark={isDark}
          value={searchQuery}
          onChange={setSearchQuery}
        />
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
