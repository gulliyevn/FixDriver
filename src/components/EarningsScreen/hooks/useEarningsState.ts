import { useState, useRef, useEffect } from "react";
import DriverStatusService from "../../../services/DriverStatusService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from "react-native";

export const useEarningsState = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "month" | "year"
  >("today");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  // Добавляем состояние для принудительного обновления UI
  const [uiUpdateTrigger, setUiUpdateTrigger] = useState(0);

  const filterExpandAnim = useRef(new Animated.Value(0)).current;

  // Инициализируем статус онлайн из AsyncStorage, чтобы не сбрасывался при рестарте
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@driver_online_status");
        if (saved === "true" || saved === "false") {
          setIsOnline(saved === "true");
        }
      } catch (error) {
        console.warn('Failed to load driver online status:', error);
      }
    })();
  }, []);

  // Подписка на глобальные изменения статуса (из DriverModal)
  useEffect(() => {
    const unsub = DriverStatusService.subscribe((online) => {
      setIsOnline(online);
      // Принудительно обновляем UI при изменении статуса
      setUiUpdateTrigger((prev) => prev + 1);
    });

    return () => {
      if (typeof unsub === "function") {
        unsub();
      }
    };
  }, []);

  return {
    selectedPeriod,
    setSelectedPeriod,
    filterExpanded,
    setFilterExpanded,
    isOnline,
    setIsOnline,
    statusModalVisible,
    setStatusModalVisible,
    filterExpandAnim,
    uiUpdateTrigger, // Экспортируем триггер для обновления UI
  };
};
