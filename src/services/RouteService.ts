import { RoutePoint } from '../types/navigation';

interface Route {
  id: string;
  points: RoutePoint[];
  distance: number;
  duration: number;
  trafficLevel: 'low' | 'medium' | 'high';
  tolls: number;
  polyline: string;
}

// Отключено для production - только для разработки
const ENABLE_ROUTE_LOGS = false;

const log = (message: string, data?: unknown) => {
  if (ENABLE_ROUTE_LOGS) {

  }
};

export class RouteService {
  private static instance: RouteService;

  static getInstance(): RouteService {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService();
    }
    return RouteService.instance;
  }

  constructor() {
    log('RouteService инициализирован');
  }

  // TODO: Полный рефакторинг RouteService
  // - Добавить правильные типы
  // - Интегрировать с реальными картами
  // - Добавить кэширование маршрутов
  // - Добавить обработку ошибок

  async calculateRoute(
    from: RoutePoint,
    to: RoutePoint,
    waypoints: RoutePoint[] = []
  ): Promise<Route> {
    log('Расчет маршрута', { from, to, waypoints });
    
    // TODO: заменить на реальный API запрос к картам
    return new Promise((resolve) => {
      setTimeout(() => {
        const route: Route = {
          id: `route_${Date.now()}`,
          points: [from, ...waypoints, to],
          distance: 15.5,
          duration: 25,
          trafficLevel: 'medium',
          tolls: 0,
          polyline: 'mock_polyline_data',
        };
        resolve(route);
      }, 1000);
    });
  }

  async optimizeRoute(
    points: RoutePoint[],
    constraints: Record<string, unknown> = {}
  ): Promise<Route> {
    log('Оптимизация маршрута', { points, constraints });
    
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        const optimizedRoute: Route = {
          id: `route_${Date.now()}`,
          points,
          distance: 12.3,
          duration: 20,
          trafficLevel: 'low',
          tolls: 0,
          polyline: 'mock_optimized_polyline',
        };
        resolve(optimizedRoute);
      }, 800);
    });
  }

  // Статические методы для совместимости
  static async calculateRoute(from: RoutePoint, to: RoutePoint): Promise<Route> {
    const instance = RouteService.getInstance();
    return instance.calculateRoute(from, to);
  }

  static async optimizeRoute(points: RoutePoint[]): Promise<Route> {
    const instance = RouteService.getInstance();
    return instance.optimizeRoute(points);
  }
}

export default RouteService.getInstance(); 