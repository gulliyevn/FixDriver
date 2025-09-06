import { CreatePaymentData, PaginationParams } from '../types';

/**
 * Validate payment ID
 */
export function validatePaymentId(id: string): void {
  if (!id || id.trim() === '') {
    throw new Error('Payment ID is required');
  }
}

/**
 * Validate user ID
 */
export function validateUserId(userId: string): void {
  if (!userId || userId.trim() === '') {
    throw new Error('User ID is required');
  }
}

/**
 * Validate payment amount
 */
export function validateAmount(amount: number): void {
  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
}

/**
 * Validate payment method
 */
export function validatePaymentMethod(method: string): void {
  if (!method || method.trim() === '') {
    throw new Error('Payment method is required');
  }
}

/**
 * Validate description
 */
export function validateDescription(description: string): void {
  if (!description || description.trim() === '') {
    throw new Error('Description is required');
  }
}

/**
 * Validate payment creation data
 */
export function validatePaymentData(paymentData: CreatePaymentData): void {
  validateUserId(paymentData.userId);
  
  if (!paymentData.type) {
    throw new Error('Payment type is required');
  }

  validateAmount(paymentData.amount);
  validateDescription(paymentData.description);

  // Validate payment type
  const validTypes = ['top_up', 'trip_payment', 'refund', 'bonus'];
  if (!validTypes.includes(paymentData.type)) {
    throw new Error('Invalid payment type');
  }
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(params: PaginationParams): void {
  if (params?.page && (params.page < 1 || !Number.isInteger(params.page))) {
    throw new Error('Page must be a positive integer');
  }

  if (params?.limit && (params.limit < 1 || params.limit > 100 || !Number.isInteger(params.limit))) {
    throw new Error('Limit must be between 1 and 100');
  }
}

/**
 * Validate refund data
 */
export function validateRefundData(amount: number, reason: string): void {
  validateAmount(amount);
  validateDescription(reason);
}
