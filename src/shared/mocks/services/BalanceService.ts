/**
 * 💰 BALANCE SERVICE
 * 
 * Mock balance service for development and testing.
 * Easy to replace with gRPC implementation.
 */

export default class BalanceService {
  /**
   * Get user balance
   */
  async getBalance(userId: string): Promise<number> {
    // Mock balance - in real app this would be gRPC call
    return 150.75;
  }

  /**
   * Add funds to user balance
   */
  async addFunds(userId: string, amount: number): Promise<void> {
    console.log('💰 Mock funds added:', amount, 'for user:', userId);
  }

  /**
   * Withdraw funds from user balance
   */
  async withdrawFunds(userId: string, amount: number): Promise<void> {
    console.log('💰 Mock funds withdrawn:', amount, 'for user:', userId);
  }

  /**
   * Get user transactions
   */
  async getTransactions(userId: string): Promise<any[]> {
    return [
      { id: 'tx_1', amount: 25.50, type: 'payment', date: '2024-01-01T10:00:00Z' },
      { id: 'tx_2', amount: -5.00, type: 'fee', date: '2024-01-01T09:00:00Z' },
    ];
  }
}
