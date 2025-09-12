/**
 * OrdersService gRPC client types
 * TypeScript interfaces for gRPC OrdersService client
 */

export interface OrdersServiceClient {
  getOrders(request: any): Promise<any>;
  getAvailableDrivers(request: any): Promise<any>;
  getAvailableOrders(request: any): Promise<any>;
  createOrder(request: any): Promise<any>;
  acceptOrder(request: any): Promise<any>;
  updateOrder(request: any): Promise<any>;
  cancelOrder(request: any): Promise<void>;
  getOrder(request: any): Promise<any>;
  rateOrder(request: any): Promise<void>;
  trackOrder(request: any): Promise<any>;
}
