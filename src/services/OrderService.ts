import APIClient from "./APIClient";
import { Order, OrderStatus } from "../types/order";

export interface OrderData {
  id: string;
  familyMemberId: string;
  familyMemberName: string;
  packageType: string;
  addresses: Array<{
    id: string;
    type: "from" | "to" | "stop";
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;
  createdAt: number;
  status: "draft" | "confirmed" | "completed" | "cancelled";
}

export class OrderService {
  private static instance: OrderService;

  private constructor() {}

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getOrders(userId: string): Promise<Order[]> {
    try {
      const response = await APIClient.get<Order[]>(`/orders/client/${userId}`);
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await APIClient.get<Order>(`/orders/${orderId}`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async createOrder(
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">,
  ): Promise<Order> {
    const response = await APIClient.post<Order>("/orders", orderData);
    if (response.success && response.data) {
      return response.data;
    }
    console.error(response.error || "Failed to create order");
    return;
  }

  async updateOrder(
    orderId: string,
    updates: Partial<Order>,
  ): Promise<Order | null> {
    try {
      const response = await APIClient.put<Order>(
        `/orders/${orderId}`,
        updates,
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async cancelOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await APIClient.post<Order>(
        `/orders/${orderId}/cancel`,
        {},
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async completeOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await APIClient.post<Order>(
        `/orders/${orderId}/complete`,
        {},
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  // Методы для водителей
  async getDriverOrders(driverId: string): Promise<Order[]> {
    try {
      const response = await APIClient.get<Order[]>(
        `/orders/driver/${driverId}`,
      );
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  async acceptOrder(orderId: string, driverId: string): Promise<Order | null> {
    try {
      const response = await APIClient.post<Order>(
        `/orders/${orderId}/accept`,
        { driverId },
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order | null> {
    try {
      const response = await APIClient.post<Order>(
        `/orders/${orderId}/status`,
        { status },
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  // Методы для отслеживания
  async trackOrder(orderId: string): Promise<{
    location: { latitude: number; longitude: number };
    status: string;
  } | null> {
    try {
      const response = await APIClient.get<{
        location: { latitude: number; longitude: number };
        status: string;
      }>(`/orders/${orderId}/track`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async updateOrderLocation(
    orderId: string,
    location: { latitude: number; longitude: number },
  ): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(
        `/orders/${orderId}/location`,
        { location },
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  }

  // Поиск и фильтрация
  async searchOrders(query: string, userId: string): Promise<Order[]> {
    try {
      const response = await APIClient.get<Order[]>(`/orders/search`, {
        q: query,
        userId,
      });
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  async getOrdersByStatus(
    status: OrderStatus,
    userId: string,
  ): Promise<Order[]> {
    try {
      const response = await APIClient.get<Order[]>(
        `/orders/status/${status}`,
        { userId },
      );
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }
}

export default OrderService;
