import { useState, useRef } from 'react';
import { TimeScheduleData } from '../types/fix-wave.types';

export const useScheduleState = (initialData?: TimeScheduleData) => {
  // Флаг для отслеживания инициализации
  const isInitializedRef = useRef(false);
  
  const [timeScheduleData, setTimeScheduleData] = useState<TimeScheduleData>(
    initialData || {
      date: new Date(),
      time: '',
      isRecurring: false,
      notes: '',
    }
  );
  
  const [addresses, setAddresses] = useState({
    from: '',
    to: '',
    stops: [] as string[],
  });
  
  const [coordinates, setCoordinates] = useState({
    from: undefined as { latitude: number; longitude: number } | undefined,
    to: undefined as { latitude: number; longitude: number } | undefined,
    stops: [] as Array<{ latitude: number; longitude: number }>,
  });
  
  const [switchStates, setSwitchStates] = useState({
    switch1: false, // направление: false = туда, true = туда-обратно
    switch2: false, // режим: false = фиксированный, true = плавающий
    switch3: false, // дни: false = ежедневно, true = будни/выходные
  });
  
  const [times, setTimes] = useState({
    fixed: {} as Record<number, string>,
    weekday: {} as Record<number, string>,
    weekend: {} as Record<number, string>,
  });
  
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Функция для сброса всех данных при переключении режимов
  const resetAllData = () => {
    setTimes({
      fixed: {},
      weekday: {},
      weekend: {},
    });
    setSelectedDays([]);
  };

  // Функция для безопасного обновления состояния
  const safeSetTimeScheduleData = (data: TimeScheduleData) => {
    if (!isInitializedRef.current) {
      setTimeScheduleData(data);
      isInitializedRef.current = true;
    }
  };

  const safeSetTimes = (newTimes: typeof times) => {
    if (!isInitializedRef.current) {
      setTimes(newTimes);
    }
  };

  const safeSetSwitchStates = (newSwitchStates: typeof switchStates) => {
    if (!isInitializedRef.current) {
      setSwitchStates(newSwitchStates);
    }
  };

  const safeSetSelectedDays = (newSelectedDays: string[]) => {
    if (!isInitializedRef.current) {
      setSelectedDays(newSelectedDays);
    }
  };
  
  return {
    timeScheduleData,
    setTimeScheduleData: safeSetTimeScheduleData,
    addresses,
    setAddresses,
    coordinates,
    setCoordinates,
    switchStates,
    setSwitchStates: safeSetSwitchStates,
    times,
    setTimes: safeSetTimes,
    selectedDays,
    setSelectedDays: safeSetSelectedDays,
    // Экспортируем оригинальные функции для принудительного обновления
    forceSetTimeScheduleData: setTimeScheduleData,
    forceSetTimes: setTimes,
    forceSetSwitchStates: setSwitchStates,
    forceSetSelectedDays: setSelectedDays,
    // Функция для сброса данных
    resetAllData,
    isInitialized: () => isInitializedRef.current,
  };
};
