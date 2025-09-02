import { Order, CreateOrderData, OrderFilters, OrderResult, PaginationParams, PaginatedResponse } from '../../../../shared/types';

export interface IOrderService {
  /**
   * Получение заказов с фильтрами
   */
  getOrders(filters?: OrderFilters, params?: PaginationParams): Promise<PaginatedResponse<Order>>;

  /**
   * Получение заказа по ID
   */
  getOrder(id: string): Promise<Order>;

  /**
   * Создание нового заказа
   */
  createOrder(orderData: CreateOrderData): Promise<Order>;

  /**
   * Обновление заказа
   */
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;

  /**
   * Отмена заказа
   */
  cancelOrder(id: string, reason?: string): Promise<Order>;

  /**
   * Принятие заказа водителем
   */
  acceptOrder(orderId: string, driverId: string): Promise<Order>;

  /**
   * Начало поездки
   */
  startTrip(orderId: string): Promise<Order>;

  /**
   * Завершение поездки
   */
  completeTrip(orderId: string): Promise<Order>;

  /**
   * Получение заказов пользователя
   */
  getUserOrders(userId: string, filters?: OrderFilters): Promise<Order[]>;

  /**
   * Получение активных заказов водителя
   */
  getDriverActiveOrders(driverId: string): Promise<Order[]>;

  /**
   * Расчет стоимости поездки
   */
  calculatePrice(from: any, to: any, options?: any): Promise<number>;
}
