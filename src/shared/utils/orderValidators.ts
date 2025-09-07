// Local minimal structural types to avoid tight coupling
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Address extends Coordinates {}

interface CreateOrderData {
  clientId: string;
  from: Address;
  to: Address;
  scheduledTime?: string;
}

/**
 * Validate order ID
 */
export function validateOrderId(id: string): void {
  if (!id || id.trim() === '') {
    throw new Error('Order ID is required');
  }
}

/**
 * Validate addresses
 */
export function validateAddresses(from: Address, to: Address): void {
  if (!from || !to) {
    throw new Error('From and to addresses are required');
  }

  if (!from.latitude || !from.longitude || !to.latitude || !to.longitude) {
    throw new Error('Address coordinates are required');
  }
}

/**
 * Validate order creation data
 */
export function validateOrderData(orderData: CreateOrderData): void {
  if (!orderData.clientId || orderData.clientId.trim() === '') {
    throw new Error('Client ID is required');
  }

  if (!orderData.from || !orderData.to) {
    throw new Error('From and to addresses are required');
  }

  validateAddresses(orderData.from, orderData.to);

  if (orderData.scheduledTime && new Date(orderData.scheduledTime) < new Date()) {
    throw new Error('Scheduled time cannot be in the past');
  }
}

/**
 * Validate order filters
 */
export function validateOrderFilters(filters: any): void {
  if (filters?.status && !['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].includes(filters.status)) {
    throw new Error('Invalid order status');
  }

  if (filters?.dateFrom && filters?.dateTo && new Date(filters.dateFrom) > new Date(filters.dateTo)) {
    throw new Error('Date from cannot be after date to');
  }
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(params: any): void {
  if (params?.page && (params.page < 1 || !Number.isInteger(params.page))) {
    throw new Error('Page must be a positive integer');
  }

  if (params?.limit && (params.limit < 1 || params.limit > 100 || !Number.isInteger(params.limit))) {
    throw new Error('Limit must be between 1 and 100');
  }
}
