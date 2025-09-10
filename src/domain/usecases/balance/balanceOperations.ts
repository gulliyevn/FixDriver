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
      return await MockServices.balance.getEarnings(userId);
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
      return await MockServices.balance.addEarnings(userId, amount);
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
      return await MockServices.balance.topUpBalance(userId, amount);
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
      return await MockServices.balance.withdrawBalance(userId, amount);
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
      await MockServices.balance.resetBalance(userId);
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
      await MockServices.balance.resetEarnings(userId);
    } catch (error) {
      console.error('Error resetting earnings:', error);
      throw error;
    }
  }
};
