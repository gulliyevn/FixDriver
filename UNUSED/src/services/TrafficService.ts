import { DATABASE_CONFIG } from '../config/database';

interface TrafficData {
  level: 'free' | 'low' | 'medium' | 'high' | 'heavy';
  speed: number; // км/ч
  delay: number; // задержка в минутах
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

// Отключено для production - только для разработки
const ENABLE_TRAFFIC_LOGS = false;

const log = (message: string, data?: unknown) => {
  if (ENABLE_TRAFFIC_LOGS) {

  }
};

class TrafficService {
  private static instance: TrafficService;
  private trafficData: Map<string, Record<string, unknown>> = new Map();

  static getInstance(): TrafficService {
    if (!TrafficService.instance) {
      TrafficService.instance = new TrafficService();
    }
    return TrafficService.instance;
  }

  // Бесплатные API ключи (нужно получить)
  private static readonly HERE_API_KEY = DATABASE_CONFIG.services.traffic.hereApiKey;
  private static readonly OPENWEATHER_API_KEY = DATABASE_CONFIG.services.traffic.openweatherApiKey;

  // Получение данных о пробках для маршрута
  static async getTrafficForRoute(coordinates: Coordinate[]): Promise<TrafficData[]> {
    try {
      // Пока API ключи не настроены, используем умную симуляцию
      return this.simulateRealisticTraffic(coordinates);
    } catch (error) {
      console.error('Ошибка получения данных о пробках:', error);
      return this.simulateRealisticTraffic(coordinates);
    }
  }

  // HERE Traffic API (когда будет ключ)
  private static async getHereTraffic(coordinates: Coordinate[]): Promise<TrafficData[]> {
    const trafficData: TrafficData[] = [];
    
    for (const coord of coordinates) {
      try {
        const url = `https://traffic.ls.hereapi.com/traffic/6.3/flow.json?apikey=${this.HERE_API_KEY}&bbox=${coord.latitude-0.01},${coord.longitude-0.01};${coord.latitude+0.01},${coord.longitude+0.01}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.RWS && data.RWS[0] && data.RWS[0].RW) {
          const flowInfo = data.RWS[0].RW[0].FIS[0].FI[0];
          const currentSpeed = flowInfo.CF[0].SU || 50;
          const freeFlowSpeed = flowInfo.CF[0].FF || 60;
          
          const speedRatio = currentSpeed / freeFlowSpeed;
          let level: 'free' | 'low' | 'medium' | 'high' | 'heavy';
          
          if (speedRatio > 0.8) level = 'free';
          else if (speedRatio > 0.6) level = 'low';
          else if (speedRatio > 0.4) level = 'medium';
          else if (speedRatio > 0.2) level = 'high';
          else level = 'heavy';
          
          trafficData.push({
            level,
            speed: currentSpeed,
            delay: Math.max(0, (freeFlowSpeed - currentSpeed) / freeFlowSpeed * 10)
          });
        }
      } catch (error) {
        console.error('Ошибка HERE API:', error);
      }
    }
    
    return trafficData;
  }

  // Умная симуляция пробок на основе реальных факторов
  private static simulateRealisticTraffic(coordinates: Coordinate[]): TrafficData[] {
    const trafficData: TrafficData[] = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = воскресенье, 1 = понедельник, etc.
    
    // Определяем базовые условия
    const isWeekend = currentDay === 0 || currentDay === 6;
    const isMorningRush = currentHour >= 7 && currentHour <= 10;
    const isEveningRush = currentHour >= 17 && currentHour <= 20;
    const isNightTime = currentHour >= 22 || currentHour <= 6;
    const isLunchTime = currentHour >= 12 && currentHour <= 14;

    coordinates.forEach((coord) => {
      // Базовый уровень пробок
      let baseTrafficLevel = 0.3; // 30% базовая загруженность
      
      // Модификаторы времени
      if (isWeekend) {
        baseTrafficLevel *= 0.6; // На выходных меньше пробок
        if (isLunchTime) baseTrafficLevel *= 1.3; // Но больше в обеденное время
      } else {
        // Рабочие дни
        if (isMorningRush || isEveningRush) {
          baseTrafficLevel *= 2.5; // Час пик
        } else if (isLunchTime) {
          baseTrafficLevel *= 1.4; // Обеденное время
        } else if (isNightTime) {
          baseTrafficLevel *= 0.2; // Ночью свободно
        }
      }

      // Географические модификаторы для Баку
      const lat = coord.latitude;
      const lng = coord.longitude;
      
      // Центр Баку (более загруженный)
      if (lat > 40.360 && lat < 40.420 && lng > 49.830 && lng < 49.890) {
        baseTrafficLevel *= 1.5;
      }
      
      // Основные магистрали (примерные координаты)
      if (this.isNearMajorRoad(lat, lng)) {
        baseTrafficLevel *= 1.3;
      }
      
      // Жилые районы
      if (this.isResidentialArea(lat, lng)) {
        baseTrafficLevel *= 0.8;
      }

      // Добавляем случайность для реалистичности
      const randomFactor = 0.8 + Math.random() * 0.4; // ±20%
      baseTrafficLevel *= randomFactor;

      // Определяем итоговый уровень
      let level: 'free' | 'low' | 'medium' | 'high' | 'heavy';
      let speed: number;
      
      if (baseTrafficLevel < 0.3) {
        level = 'free';
        speed = 50 + Math.random() * 20; // 50-70 км/ч
      } else if (baseTrafficLevel < 0.6) {
        level = 'low';
        speed = 35 + Math.random() * 15; // 35-50 км/ч
      } else if (baseTrafficLevel < 1.0) {
        level = 'medium';
        speed = 20 + Math.random() * 15; // 20-35 км/ч
      } else if (baseTrafficLevel < 1.5) {
        level = 'high';
        speed = 10 + Math.random() * 10; // 10-20 км/ч
      } else {
        level = 'heavy';
        speed = 5 + Math.random() * 5; // 5-10 км/ч
      }

      const delay = Math.max(0, (50 - speed) / 50 * 15); // Задержка до 15 минут

      trafficData.push({
        level,
        speed: Math.round(speed),
        delay: Math.round(delay)
      });
    });

    return trafficData;
  }

  // Проверка близости к основным дорогам Баку
  private static isNearMajorRoad(lat: number, lng: number): boolean {
    // Примерные координаты основных магистралей Баку
    const majorRoads = [
      { lat: 40.4093, lng: 49.8671 }, // Низами
      { lat: 40.3650, lng: 49.8350 }, // Приморский бульвар
      { lat: 40.3950, lng: 49.8820 }, // Ясамал
      { lat: 40.4200, lng: 49.9100 }, // Нариманов
    ];

    return majorRoads.some(road => {
      const distance = Math.sqrt(
        Math.pow(lat - road.lat, 2) + Math.pow(lng - road.lng, 2)
      );
      return distance < 0.01; // Примерно 1 км
    });
  }

  // Проверка жилого района
  private static isResidentialArea(lat: number, lng: number): boolean {
    // Примерные жилые районы
    return (lat > 40.380 && lat < 40.450 && lng > 49.800 && lng < 49.950) &&
           !(lat > 40.360 && lat < 40.420 && lng > 49.830 && lng < 49.890); // Исключаем центр
  }

  // Получение уровня пробок для одной точки
  static getTrafficLevel(coordinate: { latitude: number; longitude: number }, time: Date): 'free' | 'low' | 'medium' | 'high' | 'heavy' {
    const hour = time.getHours();
    const dayOfWeek = time.getDay();
    
    // Базовый уровень пробок в зависимости от времени
    let baseLevel: 'free' | 'low' | 'medium' | 'high' | 'heavy' = 'medium';
    
    // Утренние часы пик (7-9)
    if (hour >= 7 && hour <= 9) {
      baseLevel = 'high';
    }
    // Вечерние часы пик (17-19)
    else if (hour >= 17 && hour <= 19) {
      baseLevel = 'heavy';
    }
    // Ночные часы (22-6)
    else if (hour >= 22 || hour <= 6) {
      baseLevel = 'free';
    }
    // Выходные дни
    else if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseLevel = 'low';
    }
    
    // Добавляем случайность для реалистичности
    const random = Math.random();
    if (random < 0.1) {
      baseLevel = 'free';
    } else if (random < 0.2) {
      baseLevel = 'low';
    } else if (random < 0.6) {
      baseLevel = 'medium';
    } else if (random < 0.8) {
      baseLevel = 'high';
    } else {
      baseLevel = 'heavy';
    }
    
    return baseLevel;
  }

  // Получение описания уровня пробок
  static getTrafficDescription(level: 'free' | 'low' | 'medium' | 'high' | 'heavy'): string {
    const descriptions = {
      free: 'Свободно',
      low: 'Небольшие пробки',
      medium: 'Умеренные пробки',
      high: 'Сильные пробки',
      heavy: 'Очень сильные пробки'
    };
    return descriptions[level];
  }

  // Обновление данных о пробках
  updateTrafficData(): void {
    log('Данные о пробках обновлены');
    // Здесь будет логика обновления данных
  }

  // Получение прогноза пробок
  getTrafficForecast(coordinate: { latitude: number; longitude: number }, time: Date): Record<string, unknown> {
    const currentLevel = TrafficService.getTrafficLevel(coordinate, time);
    
    return {
      current: currentLevel,
      forecast: currentLevel, // Упрощенный прогноз
      confidence: 0.8,
    };
  }
}

export default TrafficService.getInstance();
export type { TrafficData, Coordinate }; 