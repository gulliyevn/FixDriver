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

// Функция для получения времени отправления для контейнера
export const getDepartureTime = (
  containerIndex: number,
  times: { fixed: Record<number, string>; weekday: Record<number, string>; weekend: Record<number, string> }
): Date | undefined => {
  if (containerIndex === 0) return undefined;
  
  const prevTime = times.fixed[containerIndex - 1];
  if (prevTime) {
    return new Date(`2000-01-01T${prevTime}:00`);
  }
  
  const firstTime = times.fixed[0];
  return firstTime ? new Date(`2000-01-01T${firstTime}:00`) : undefined;
};

// Функция для проверки разрешения выбора времени
export const canSelectTime = (color: string): boolean => {
  return color === CONTAINER_COLORS.GREEN || 
         color === CONTAINER_COLORS.BLUE || 
         color === CONTAINER_COLORS.YELLOW;
};
