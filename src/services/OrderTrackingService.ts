// Сервис для real-time отслеживания заказов
import WebSocketService, { WebSocketMessage } from "./WebSocketService";
import APIClient from "./APIClient";

// Типы для NodeJS
declare global {
  namespace NodeJS {
    interface Timeout {
      ref(): NodeJS.Timeout;
      unref(): NodeJS.Timeout;
      refresh(): NodeJS.Timeout;
    }
  }
}

export interface OrderStatus {
  id: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  timestamp: string;
  message?: string;
}

export interface OrderLocation {
  orderId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
  heading?: number;
  accuracy?: number;
}

export interface OrderRoute {
  distance: number;
  duration: number;
  polyline?: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleInfo: {
    make: string;
    model: string;
    color: string;
    plateNumber: string;
  };
}

export interface OrderTrackingData {
  orderId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar?: string;
  vehicleInfo: {
    make: string;
    model: string;
    color: string;
    plateNumber: string;
  };
  currentLocation: OrderLocation;
  estimatedArrival?: string;
  route?: OrderRoute;
  statusHistory: OrderStatus[];
  isTracking: boolean;
}

export interface TrackingEventHandlers {
  onLocationUpdate?: (location: OrderLocation) => void;
  onStatusChange?: (status: OrderStatus) => void;
  onDriverUpdate?: (driverInfo: DriverInfo) => void;
  onRouteUpdate?: (route: OrderRoute) => void;
  onTrackingStart?: (orderId: string) => void;
  onTrackingStop?: (orderId: string) => void;
  onError?: (error: Error) => void;
}

class OrderTrackingService {
  private static instance: OrderTrackingService;
  private ws: typeof WebSocketService;
  private trackingOrders: Map<string, OrderTrackingData> = new Map();
  private eventHandlers: Map<string, TrackingEventHandlers> = new Map();
  private isInitialized = false;
  private trackingInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.ws = WebSocketService;
  }

  static getInstance(): OrderTrackingService {
    if (!OrderTrackingService.instance) {
      OrderTrackingService.instance = new OrderTrackingService();
    }
    return OrderTrackingService.instance;
  }

  /**
   * Инициализация сервиса отслеживания
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.ws.connect({
        onMessage: (message: WebSocketMessage) => {
          this.handleWebSocketMessage(message);
        },
        onError: (error) => {
          console.error("WebSocket ошибка в OrderTrackingService:", error);
          this.notifyError(new Error("WebSocket connection error"));
        },
        onClose: () => {},
        onOpen: () => {},
      });

      this.isInitialized = true;
    } catch (error) {
      console.error("Ошибка инициализации OrderTrackingService:", error);
      throw error;
    }
  }

  /**
   * Обработка WebSocket сообщений
   */
  private handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "order_location_update":
        this.handleLocationUpdate(message.data as unknown as OrderLocation);
        break;
      case "order_status_change":
        this.handleStatusChange(message.data as unknown as OrderStatus);
        break;
      case "driver_location_update":
        this.handleDriverLocationUpdate(message.data as unknown as OrderLocation);
        break;
      case "route_update":
        this.handleRouteUpdate(message.data as unknown as OrderLocation);
        break;
      case "tracking_started":
        this.handleTrackingStarted(message.data as { orderId: string; });
        break;
      case "tracking_stopped":
        this.handleTrackingStopped(message.data as { orderId: string; });
        break;
    }
  }

  /**
   * Начало отслеживания заказа
   */
  async startTracking(
    orderId: string,
    handlers: TrackingEventHandlers = {},
  ): Promise<OrderTrackingData> {
    try {
      // Сохраняем обработчики событий
      this.eventHandlers.set(orderId, handlers);

      // Запрашиваем начальные данные заказа
      const response = await APIClient.get(`/orders/${orderId}/tracking`);

      if (!response.success || !response.data) {
        throw new Error("Не удалось получить данные для отслеживания заказа");
      }

      const trackingData: OrderTrackingData =
        response.data as OrderTrackingData;
      this.trackingOrders.set(orderId, trackingData);

      // Отправляем запрос на начало отслеживания через WebSocket
      if (this.ws.isReady()) {
        this.ws.sendMessage("start_order_tracking", {
          orderId,
          timestamp: new Date().toISOString(),
        });
      }

      // Уведомляем о начале отслеживания
      handlers.onTrackingStart?.(orderId);

      return trackingData;
    } catch (error) {
      console.error("Ошибка начала отслеживания заказа:", error);
      this.notifyError(error as Error);
      throw error;
    }
  }

  /**
   * Остановка отслеживания заказа
   */
  stopTracking(orderId: string): void {
    // Удаляем обработчики событий
    this.eventHandlers.delete(orderId);

    // Удаляем данные отслеживания
    this.trackingOrders.delete(orderId);

    // Отправляем запрос на остановку отслеживания
    if (this.ws.isReady()) {
      this.ws.sendMessage("stop_order_tracking", {
        orderId,
        timestamp: new Date().toISOString(),
      });
    }

    // Уведомляем об остановке отслеживания
    const handlers = this.eventHandlers.get(orderId);
    handlers?.onTrackingStop?.(orderId);
  }

  /**
   * Обработка обновления локации заказа
   */
  private handleLocationUpdate(data: OrderLocation): void {
    const orderId = data.orderId;
    const trackingData = this.trackingOrders.get(orderId);

    if (!trackingData) return;

    // Обновляем данные отслеживания
    trackingData.currentLocation = data;
    this.trackingOrders.set(orderId, trackingData);

    // Уведомляем обработчики
    const handlers = this.eventHandlers.get(orderId);
    handlers?.onLocationUpdate?.(data);
  }

  /**
   * Обработка изменения статуса заказа
   */
  private handleStatusChange(data: OrderStatus): void {
    const orderId = data.id;
    const trackingData = this.trackingOrders.get(orderId);

    if (!trackingData) return;

    // Добавляем статус в историю
    trackingData.statusHistory.push(data);
    this.trackingOrders.set(orderId, trackingData);

    // Уведомляем обработчики
    const handlers = this.eventHandlers.get(orderId);
    handlers?.onStatusChange?.(data);
  }

  /**
   * Обработка обновления локации водителя
   */
  private handleDriverLocationUpdate(data: unknown): void {
    // Логика обновления информации о водителе
    console.log("Обновление локации водителя:", data);
  }

  /**
   * Обработка обновления маршрута
   */
  private handleRouteUpdate(data: unknown): void {
    if (!data || typeof data !== 'object') return;
    const dataObj = data as { orderId: string; route: OrderRoute };
    
    const orderId = dataObj.orderId;
    const trackingData = this.trackingOrders.get(orderId);

    if (!trackingData) return;

    // Обновляем маршрут
    trackingData.route = dataObj.route;
    this.trackingOrders.set(orderId, trackingData);

    // Уведомляем обработчики
    const handlers = this.eventHandlers.get(orderId);
    handlers?.onRouteUpdate?.(dataObj.route);
  }

  /**
   * Обработка начала отслеживания
   */
  private handleTrackingStarted(data: { orderId: string }): void {
    console.log("Отслеживание заказа начато:", data.orderId);
  }

  /**
   * Обработка остановки отслеживания
   */
  private handleTrackingStopped(data: { orderId: string }): void {
    console.log("Отслеживание заказа остановлено:", data.orderId);
    this.stopTracking(data.orderId);
  }

  /**
   * Получение текущих данных отслеживания
   */
  getTrackingData(orderId: string): OrderTrackingData | undefined {
    return this.trackingOrders.get(orderId);
  }

  /**
   * Получение всех отслеживаемых заказов
   */
  getAllTrackingOrders(): OrderTrackingData[] {
    return Array.from(this.trackingOrders.values());
  }

  /**
   * Обновление оценки времени прибытия
   */
  async updateEstimatedArrival(orderId: string): Promise<void> {
    try {
      const response = await APIClient.get(`/orders/${orderId}/eta`);

      if (response.success && response.data) {
        const trackingData = this.trackingOrders.get(orderId);
        if (trackingData) {
          const dataObj = response.data as { estimatedArrival?: string };
          trackingData.estimatedArrival = dataObj.estimatedArrival;
          this.trackingOrders.set(orderId, trackingData);
        }
      }
    } catch (error) {
      console.error("Ошибка обновления ETA:", error);
    }
  }

  /**
   * Отправка сообщения водителю
   */
  async sendMessageToDriver(
    orderId: string,
    message: string,
  ): Promise<boolean> {
    try {
      const response = await APIClient.post(
        `/orders/${orderId}/driver-message`,
        {
          message,
          timestamp: new Date().toISOString(),
        },
      );

      return response.success;
    } catch (error) {
      console.error("Ошибка отправки сообщения водителю:", error);
      return false;
    }
  }

  /**
   * Получение истории статусов заказа
   */
  async getOrderStatusHistory(orderId: string): Promise<OrderStatus[]> {
    try {
      const response = await APIClient.get(`/orders/${orderId}/status-history`);

      if (response.success && response.data) {
        const dataObj = response.data as { history?: OrderStatus[] };
        return dataObj.history || [];
      }

      return [];
    } catch (error) {
      console.error("Ошибка получения истории статусов:", error);
      return [];
    }
  }

  /**
   * Получение маршрута заказа
   */
  async getOrderRoute(orderId: string): Promise<OrderRoute | null> {
    try {
      const response = await APIClient.get(`/orders/${orderId}/route`);

      if (response.success && response.data) {
        const dataObj = response.data as { route?: OrderRoute };
        return dataObj.route || null;
      }

      return null;
    } catch (error) {
      console.error("Ошибка получения маршрута:", error);
      return null;
    }
  }

  /**
   * Проверка статуса отслеживания
   */
  isTracking(orderId: string): boolean {
    return this.trackingOrders.has(orderId);
  }

  /**
   * Получение статуса WebSocket соединения
   */
  getConnectionStatus(): {
    isConnected: boolean;
    isAuthenticated: boolean;
    trackingOrdersCount: number;
  } {
    const wsStatus = this.ws.getConnectionStatus();
    return {
      isConnected: wsStatus.isConnected,
      isAuthenticated: wsStatus.isAuthenticated,
      trackingOrdersCount: this.trackingOrders.size,
    };
  }

  /**
   * Уведомление об ошибке
   */
  private notifyError(error: Error): void {
    this.eventHandlers.forEach((handlers) => {
      handlers.onError?.(error);
    });
  }

  /**
   * Очистка всех данных отслеживания
   */
  clearAllTracking(): void {
    this.trackingOrders.forEach((_, orderId) => {
      this.stopTracking(orderId);
    });

    this.trackingOrders.clear();
    this.eventHandlers.clear();
  }

  /**
   * Деинициализация сервиса
   */
  destroy(): void {
    this.clearAllTracking();
    this.ws.disconnect();
    this.isInitialized = false;

    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }
}

export default OrderTrackingService.getInstance();
