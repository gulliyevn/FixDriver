import { useState } from 'react';
import { TimeScheduleData } from '../types/fix-wave.types';

export const useScheduleState = (initialData?: TimeScheduleData) => {
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
  
  return {
    timeScheduleData,
    setTimeScheduleData,
    addresses,
    setAddresses,
    coordinates,
    setCoordinates,
    switchStates,
    setSwitchStates,
    times,
    setTimes,
    selectedDays,
    setSelectedDays,
  };
};
