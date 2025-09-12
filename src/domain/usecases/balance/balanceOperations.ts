import MockServices from '../../../shared/mocks/MockServices';

/**
 * Domain usecase for balance operations
 * Abstracts data layer access from presentation layer
 */
export const balanceOperations = {
  /**
   * Get user balance from server
   */
  async getBalance(userId: string): Promise<number> {
    try {
      return await MockServices.balance.getBalance(userId);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  },

  /**
   * Get user earnings from server
   */
  async getEarnings(userId: string): Promise<number> {
    try {
      const tx = await MockServices.balance.getTransactions(userId);
      // Derive earnings from transactions (sum of positive amounts)
      return tx.reduce((sum: number, t: { amount: number }) => sum + Math.max(0, t.amount), 0);
    } catch (error) {
      console.error('Error getting earnings:', error);
      throw error;
    }
  },

  /**
   * Get user transactions from server
   */
  async getTransactions(userId: string) {
    try {
      return await MockServices.balance.getTransactions(userId);
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  },

  /**
   * Add earnings to user balance
   */
  async addEarnings(userId: string, amount: number) {
    try {
      return await MockServices.balance.addFunds(userId, amount);
    } catch (error) {
      console.error('Error adding earnings:', error);
      throw error;
    }
  },

  /**
   * Top up user balance
   */
  async topUpBalance(userId: string, amount: number) {
    try {
      return await MockServices.balance.addFunds(userId, amount);
    } catch (error) {
      console.error('Error topping up balance:', error);
      throw error;
    }
  },

  /**
   * Withdraw from user balance
   */
  async withdrawBalance(userId: string, amount: number) {
    try {
      return await MockServices.balance.withdrawFunds(userId, amount);
    } catch (error) {
      console.error('Error withdrawing balance:', error);
      throw error;
    }
  },

  /**
   * Reset user balance to zero
   */
  async resetBalance(userId: string): Promise<void> {
    try {
      const current = await MockServices.balance.getBalance(userId);
      if (current > 0) {
        await MockServices.balance.withdrawFunds(userId, current);
      }
    } catch (error) {
      console.error('Error resetting balance:', error);
      throw error;
    }
  },

  /**
   * Reset user earnings to zero
   */
  async resetEarnings(userId: string): Promise<void> {
    try {
      // No direct API in mock; no-op for now
      return;
    } catch (error) {
      console.error('Error resetting earnings:', error);
      throw error;
    }
  }
};
