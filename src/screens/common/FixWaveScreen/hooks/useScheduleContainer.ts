import { useState, useEffect } from 'react';
import { RoutePoint } from '../../../../components/MapView/types/map.types';
import { DistanceCalculationService } from '../../../../services/DistanceCalculationService';

export const useScheduleContainer = (
  allowTimeSelection: boolean,
  fromCoordinate?: { latitude: number; longitude: number },
  toCoordinate?: { latitude: number; longitude: number },
  departureTime?: Date,
  shouldCalculateTime?: boolean
) => {
  // Состояние для плавающего режима
  const [pickerState, setPickerState] = useState<{
    dayKey: string | null;
    date: Date;
    isVisible: boolean;
  }>({ dayKey: null, date: new Date(), isVisible: false });
  const [dayTempDate, setDayTempDate] = useState<Date>(new Date());
  const [localDayTimes, setLocalDayTimes] = useState<Record<string, string>>({});

  // Состояние для фиксированного режима
  const [fixedPickerVisible, setFixedPickerVisible] = useState(false);
  const [fixedTempDate, setFixedTempDate] = useState<Date>(new Date());

  // Состояние для будни/выходные
  const [weekdayPickerVisible, setWeekdayPickerVisible] = useState(false);
  const [weekdayTempDate, setWeekdayTempDate] = useState<Date>(new Date());
  const [weekendPickerVisible, setWeekendPickerVisible] = useState(false);
  const [weekendTempDate, setWeekendTempDate] = useState<Date>(new Date());

  // Состояние для расчетного времени
  const [calculatedTime, setCalculatedTime] = useState<string>('--:--');
  const [isCalculating, setIsCalculating] = useState(false);

  // Расчет времени для полей "Откуда" и "Остановки"
  useEffect(() => {
    const calculateEstimatedTime = async () => {
      console.log('🔍 useScheduleContainer - Проверка условий:', {
        allowTimeSelection,
        hasFromCoordinate: !!fromCoordinate,
        hasToCoordinate: !!toCoordinate,
        hasDepartureTime: !!departureTime,
        shouldCalculateTime,
        shouldCalculate: shouldCalculateTime && fromCoordinate && toCoordinate && departureTime,
      });
      
      if (shouldCalculateTime && fromCoordinate && toCoordinate && departureTime) {
        setIsCalculating(true);
        try {
          const fromPoint: RoutePoint = {
            id: 'from',
            coordinate: fromCoordinate,
            type: 'start'
          };
          const toPoint: RoutePoint = {
            id: 'to',
            coordinate: toCoordinate,
            type: 'end'
          };
          
          const result = await DistanceCalculationService.calculateRouteSegment(
            fromPoint,
            toPoint,
            departureTime
          );
          
          
          // Для GREEN контейнера (ОТКУДА) время отбытия = время прибытия минус время маршрута
          let finalTime = result.estimatedTime;
          if (result.durationMinutes && result.durationMinutes > 0) {
            // Время прибытия (из BLUE контейнера)
            const arrivalTime = new Date(departureTime);
            
            // Время отбытия = время прибытия минус время маршрута
            const departureTimeCalculated = new Date(arrivalTime.getTime() - result.durationMinutes * 60 * 1000);
            const departureHours = departureTimeCalculated.getHours().toString().padStart(2, '0');
            const departureMinutes = departureTimeCalculated.getMinutes().toString().padStart(2, '0');
            
            finalTime = `${departureHours}:${departureMinutes}`;
            console.log('⏰ useScheduleContainer - Рассчитанное время отбытия:', {
              arrivalTime: arrivalTime.toISOString(),
              routeDurationMinutes: result.durationMinutes,
              departureTime: finalTime,
            });
          }
          
          setCalculatedTime(finalTime);
        } catch (error) {
          setCalculatedTime('--:--');
        } finally {
          setIsCalculating(false);
        }
      } else {
        setCalculatedTime('--:--');
      }
    };

    calculateEstimatedTime();
  }, [shouldCalculateTime, fromCoordinate, toCoordinate, departureTime]);

  return {
    // Плавающий режим
    pickerState,
    setPickerState,
    dayTempDate,
    setDayTempDate,
    localDayTimes,
    setLocalDayTimes,
    
    // Фиксированный режим
    fixedPickerVisible,
    setFixedPickerVisible,
    fixedTempDate,
    setFixedTempDate,
    
    // Будни/выходные
    weekdayPickerVisible,
    setWeekdayPickerVisible,
    weekdayTempDate,
    setWeekdayTempDate,
    weekendPickerVisible,
    setWeekendPickerVisible,
    weekendTempDate,
    setWeekendTempDate,
    
    // Расчетное время
    calculatedTime,
    isCalculating,
  };
};
