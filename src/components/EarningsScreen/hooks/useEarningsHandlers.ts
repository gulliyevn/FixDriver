import { useCallback } from "react";
import DriverStatusService from "../../../services/DriverStatusService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from "react-native";
import { useNavigation, NavigationProp, ParamListBase } from "@react-navigation/native";

export const useEarningsHandlers = (
  filterExpanded: boolean,
  setFilterExpanded: (expanded: boolean) => void,
  filterExpandAnim: Animated.Value,
  setSelectedPeriod: (period: "today" | "week" | "month" | "year") => void,
  setStatusModalVisible: (visible: boolean) => void,
  isOnline: boolean,
  setIsOnline: (online: boolean) => void,
  startOnlineTime?: () => void,
  stopOnlineTime?: () => void,
) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const toggleFilter = useCallback(() => {
    const toValue = filterExpanded ? 0 : 1;
    setFilterExpanded(!filterExpanded);

    Animated.timing(filterExpandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [filterExpanded, filterExpandAnim, setFilterExpanded]);

  const handlePeriodSelect = useCallback(
    (period: "today" | "week" | "month" | "year") => {
      setSelectedPeriod(period);
    },
    [setSelectedPeriod],
  );

  const handleStatusChange = useCallback(() => {
    setStatusModalVisible(true);
  }, [setStatusModalVisible]);

  const confirmStatusChange = useCallback(() => {
    const newOnlineStatus = !isOnline;
    setIsOnline(newOnlineStatus);
    setStatusModalVisible(false);
    // Persist status to AsyncStorage
    AsyncStorage.setItem(
      "@driver_online_status",
      String(newOnlineStatus),
    ).catch((error) => {
      console.warn('Failed to save driver online status:', error);
    });

    // Интеграция с VIP системой
    if (newOnlineStatus) {
      // Становимся онлайн
      startOnlineTime?.();
      DriverStatusService.setOnline(true);

      // Принудительно обновляем UI через небольшую задержку
      setTimeout(() => {
        DriverStatusService.setOnline(true);
      }, 100);
    } else {
      // Становимся офлайн
      stopOnlineTime?.();
      DriverStatusService.setOnline(false);
    }
  }, [
    isOnline,
    setIsOnline,
    setStatusModalVisible,
    startOnlineTime,
    stopOnlineTime,
  ]);

  const handleBalancePress = useCallback(() => {
    try {
      // Переходим на таб профиля
      navigation.navigate("Profile");

      setTimeout(() => {
        // Навигируем к экрану баланса внутри стека профиля
        navigation.navigate("Profile", {
          screen: "Balance",
        });
      }, 100);
    } catch (error) {
      navigation.navigate("Profile");
    }
  }, [navigation]);

  return {
    toggleFilter,
    handlePeriodSelect,
    handleStatusChange,
    confirmStatusChange,
    handleBalancePress,
  };
};
