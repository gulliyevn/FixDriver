/**
 * Driver balance related constants
 */

export const DRIVER_BALANCE_CONSTANTS = {
  TRANSACTION_DESCRIPTIONS: {
    TOPUP: (amount: number) => `TopUp ${amount} AFc`,
    EARNINGS: (amount: number) => `Earnings ${amount} AFc`,
    WITHDRAWAL: (amount: number) => `Withdrawal ${amount} AFc`,
  },
  TRANSLATION_KEYS: {
    TOPUP: 'driver.balance.transactions.topup',
    EARNINGS: 'driver.balance.transactions.earnings',
    WITHDRAWAL: 'driver.balance.transactions.withdrawal',
  },
  DEFAULTS: {
    INITIAL_BALANCE: 0,
    INITIAL_EARNINGS: 0,
  },
} as const;
