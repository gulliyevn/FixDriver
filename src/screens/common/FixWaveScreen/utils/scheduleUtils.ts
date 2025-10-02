import { CONTAINER_COLORS } from '../components/TimeSchedulePage.styles';

// Типы для контейнеров
export interface ScheduleContainer {
  color: string;
  address: string;
  fromCoordinate?: { latitude: number; longitude: number };
  toCoordinate?: { latitude: number; longitude: number };
  index: number;
}

// Функция для создания контейнеров расписания
export const createScheduleContainers = (
  addresses: { from: string; to: string; stops: string[] },
  coordinates: { 
    from?: { latitude: number; longitude: number }; 
    to?: { latitude: number; longitude: number }; 
    stops: Array<{ latitude: number; longitude: number }> 
  },
  switchStates: { switch1: boolean; switch2: boolean; switch3: boolean }
): ScheduleContainer[] => {
  const containers: ScheduleContainer[] = [];
  let index = 0;
  
  // Основной маршрут: отправление -> остановки -> назначение
  if (addresses.from && addresses.to) {
    // Контейнер отправления
    containers.push({
      color: CONTAINER_COLORS.GREEN,
      address: addresses.from,
      fromCoordinate: coordinates.from,
      toCoordinate: coordinates.stops[0] || coordinates.to,
      index: index++,
    });
    
    // Контейнеры остановок
    addresses.stops.forEach((stop, stopIndex) => {
      containers.push({
        color: CONTAINER_COLORS.GREY,
        address: stop,
        fromCoordinate: coordinates.stops[stopIndex],
        toCoordinate: coordinates.stops[stopIndex + 1] || coordinates.to,
        index: index++,
      });
    });
    
    // Контейнер назначения
    containers.push({
      color: CONTAINER_COLORS.BLUE,
      address: addresses.to,
      fromCoordinate: coordinates.stops[coordinates.stops.length - 1] || coordinates.from,
      toCoordinate: coordinates.to,
      index: index++,
    });
  } else {
    // Если нет полного маршрута, добавляем доступные точки
    if (addresses.from) {
      containers.push({
        color: CONTAINER_COLORS.GREEN,
        address: addresses.from,
        fromCoordinate: coordinates.from,
        toCoordinate: coordinates.stops[0] || coordinates.to,
        index: index++,
      });
    }
    
    addresses.stops.forEach((stop, stopIndex) => {
      containers.push({
        color: CONTAINER_COLORS.GREY,
        address: stop,
        fromCoordinate: coordinates.stops[stopIndex],
        toCoordinate: coordinates.stops[stopIndex + 1] || coordinates.to,
        index: index++,
      });
    });
    
    if (addresses.to) {
      containers.push({
        color: CONTAINER_COLORS.BLUE,
        address: addresses.to,
        fromCoordinate: coordinates.stops[coordinates.stops.length - 1] || coordinates.from,
        toCoordinate: coordinates.to,
        index: index++,
      });
    }
  }
  
  // Обратная поездка
  if (switchStates.switch1) {
    containers.push({
      color: CONTAINER_COLORS.YELLOW,
      address: addresses.from || addresses.to || '',
      fromCoordinate: coordinates.to,
      toCoordinate: coordinates.from,
      index: index++,
    });
  }
  
  return containers;
};

// Функция для получения времени из BLUE контейнера (КУДА)
export const getBlueContainerTime = (
  times: { fixed: Record<number, string>; weekday: Record<number, string>; weekend: Record<number, string> },
  isSmooth?: boolean,
  isWeekdaysMode?: boolean,
  isWeekendMode?: boolean,
  activeTimeField?: 'weekday' | 'weekend'
): string | undefined => {
  console.log('🔍 getBlueContainerTime - Ищем время в BLUE контейнере:', {
    times,
    isSmooth,
    isWeekdaysMode,
    isWeekendMode,
    activeTimeField
  });
  
  // В зависимости от режима ищем время в разных объектах
  let timeSource: Record<number, string>;
  
  if (isSmooth) {
    // Плавный режим: используем weekday/weekend
    if (isWeekdaysMode) {
      timeSource = times.weekday;
    } else {
      timeSource = times.weekend;
    }
  } else if (isWeekdaysMode !== undefined) {
    // Режим "Будни/Выходные": используем weekday/weekend
    if (activeTimeField) {
      // Используем активное поле ввода
      timeSource = times[activeTimeField];
    } else if (isWeekendMode) {
      timeSource = times.weekend;
    } else {
      timeSource = times.weekday;
    }
  } else {
    // Фиксированный режим: используем fixed
    timeSource = times.fixed;
  }
  
  console.log('🔍 getBlueContainerTime - Источник времени:', {
    timeSource,
    keys: Object.keys(timeSource),
    values: Object.values(timeSource)
  });
  
  // Ищем время в BLUE контейнере (обычно индекс 1 или 2)
  const allTimes = Object.values(timeSource);
  
  // Ищем первое доступное время
  for (const time of allTimes) {
    if (time && time !== '') {
      return time;
    }
  }
  
  // Если в основном источнике не найдено, пробуем другие источники
  if (isSmooth || isWeekdaysMode !== undefined) {
    // Для плавного и будни/выходные режимов пробуем fixed как fallback
    const fixedTimes = Object.values(times.fixed);
    for (const time of fixedTimes) {
      if (time && time !== '') {
        return time;
      }
    }
  } else {
    // Для фиксированного режима пробуем weekday/weekend как fallback
    const weekdayTimes = Object.values(times.weekday);
    for (const time of weekdayTimes) {
      if (time && time !== '') {
        return time;
      }
    }
    
    const weekendTimes = Object.values(times.weekend);
    for (const time of weekendTimes) {
      if (time && time !== '') {
        return time;
      }
    }
  }
  
  return undefined;
};

// Функция для получения времени отправления для контейнера
// Функция для получения номера дня из ключа
export const getDayNumber = (dayKey: string): number => {
  const dayMap: Record<string, number> = {
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6,
    'sun': 0
  };
  return dayMap[dayKey] ?? 0;
};

export const getDepartureTime = (
  containerIndex: number,
  times: { fixed: Record<number, string>; weekday: Record<number, string>; weekend: Record<number, string> },
  containerColor?: string,
  isSmooth?: boolean,
  isWeekdaysMode?: boolean,
  isWeekendMode?: boolean,
  activeTimeField?: 'weekday' | 'weekend'
): Date | undefined => {
  console.log('🔍 getDepartureTime:', {
    containerIndex,
    containerColor,
    times,
  });
  
  // Для GREEN контейнера (ОТКУДА) получаем время из BLUE контейнера (КУДА)
  if (containerColor === CONTAINER_COLORS.GREEN) {
    const blueTime = getBlueContainerTime(times, isSmooth, isWeekdaysMode, isWeekendMode, activeTimeField);
    
    if (blueTime) {
      // Используем текущую дату с указанным временем
      const today = new Date();
      const [hours, minutes] = blueTime.split(':').map(Number);
      today.setHours(hours, minutes, 0, 0);
      return today;
    }
  }
  
  // Для GREY контейнеров (ДОП1, ДОП2) также получаем время из BLUE контейнера
  if (containerColor === CONTAINER_COLORS.GREY) {
    const blueTime = getBlueContainerTime(times, isSmooth, isWeekdaysMode, isWeekendMode, activeTimeField);
    
    if (blueTime) {
      // Используем текущую дату с указанным временем
      const today = new Date();
      const [hours, minutes] = blueTime.split(':').map(Number);
      today.setHours(hours, minutes, 0, 0);
      return today;
    }
  }
  
  // Для BLUE контейнера (КУДА) возвращаем время из соответствующего источника
  if (containerColor === CONTAINER_COLORS.BLUE) {
    let blueTime: string | undefined;
    
    if (isSmooth) {
      // Плавный режим: используем weekday/weekend
      if (isWeekdaysMode) {
        blueTime = Object.values(times.weekday).find(time => time && time !== '');
      } else {
        blueTime = Object.values(times.weekend).find(time => time && time !== '');
      }
    } else if (isWeekdaysMode !== undefined) {
      // Режим "Будни/Выходные": используем weekday/weekend
      if (activeTimeField) {
        blueTime = Object.values(times[activeTimeField]).find(time => time && time !== '');
      } else if (isWeekendMode) {
        blueTime = Object.values(times.weekend).find(time => time && time !== '');
      } else {
        blueTime = Object.values(times.weekday).find(time => time && time !== '');
      }
    } else {
      // Фиксированный режим: используем fixed
      blueTime = Object.values(times.fixed).find(time => time && time !== '');
    }
    
    if (blueTime) {
      const today = new Date();
      const [hours, minutes] = blueTime.split(':').map(Number);
      today.setHours(hours, minutes, 0, 0);
      return today;
    }
    
    // Если не найдено в основном источнике, используем fallback
    return getBlueContainerTime(times, isSmooth, isWeekdaysMode, isWeekendMode, activeTimeField) ? 
      (() => {
        const fallbackTime = getBlueContainerTime(times, isSmooth, isWeekdaysMode, isWeekendMode, activeTimeField);
        if (fallbackTime) {
          const today = new Date();
          const [hours, minutes] = fallbackTime.split(':').map(Number);
          today.setHours(hours, minutes, 0, 0);
          return today;
        }
        return undefined;
      })() : undefined;
  }
  
  return undefined;
};

// Функция для проверки разрешения выбора времени
export const canSelectTime = (color: string): boolean => {
  const result = color === CONTAINER_COLORS.BLUE || color === CONTAINER_COLORS.YELLOW;
  return result;
};
