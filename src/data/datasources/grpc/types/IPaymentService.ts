import { Payment, Balance, CreatePaymentData, PaymentResult, PaginationParams, PaginatedResponse } from '../../../../shared/types';

export interface IPaymentService {
  /**
   * Получение платежей пользователя
   */
  getPayments(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>>;

  /**
   * Получение платежа по ID
   */
  getPayment(id: string): Promise<Payment>;

  /**
   * Создание платежа
   */
  createPayment(paymentData: CreatePaymentData): Promise<Payment>;

  /**
   * Получение баланса пользователя
   */
  getBalance(userId: string): Promise<Balance>;

  /**
   * Пополнение баланса
   */
  topUpBalance(userId: string, amount: number, method: string): Promise<Payment>;

  /**
   * Списание с баланса
   */
  withdrawFromBalance(userId: string, amount: number, description: string): Promise<Payment>;

  /**
   * Возврат средств
   */
  refundPayment(paymentId: string, amount: number, reason: string): Promise<Payment>;

  /**
   * Получение истории транзакций
   */
  getTransactionHistory(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>>;

  /**
   * Проверка статуса платежа
   */
  checkPaymentStatus(paymentId: string): Promise<Payment>;

  /**
   * Получение доступных методов оплаты
   */
  getPaymentMethods(): Promise<string[]>;
}
