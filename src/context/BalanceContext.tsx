import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { BalanceService, TransactionRecord } from "../services/BalanceService";

interface BalanceContextType {
  balance: number;
  earnings: number;
  transactions: TransactionRecord[];
  addEarnings: (
    amount: number,
  ) => Promise<{ newBalance: number; newEarnings: number }>;
  topUpBalance: (amount: number) => Promise<boolean>;
  withdrawBalance: (amount: number) => Promise<boolean>;
  deductBalance: (amount: number, description?: string) => Promise<boolean>;
  resetBalance: () => Promise<void>;
  resetEarnings: () => Promise<number>;
  loadBalance: () => Promise<void>;
  loadEarnings: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalanceContext = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    console.error("useBalanceContext must be used within a BalanceProvider");
    return;
  }
  return context;
};

interface BalanceProviderProps {
  children: React.ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  // Загружаем данные при инициализации
  useEffect(() => {
    if (user) {
      loadBalance();
      loadEarnings();
      loadTransactions();
    }
  }, [user]);

  const loadBalance = async () => {
    if (!user) return;
    try {
      const data = await BalanceService.getBalance(user.id);
      setBalance(data.balance);
      const list = await BalanceService.getTransactions(user.id);
      setTransactions(list);
    } catch (error) {
      setBalance(0);
    }
  };

  const loadEarnings = async () => {
    // В DEV/минимальной версии earnings считаем агрегатом транзакций типа credit с пометкой 'earning'
    if (!user) return;
    try {
      const list = await BalanceService.getTransactions(user.id);
      setTransactions(list);
      const total = list
        .filter(
          (t) =>
            t.type === "credit" &&
            /earning|заработ/gi.test(t.description || ""),
        )
        .reduce((acc, t) => acc + t.amount, 0);
      setEarnings(total);
    } catch (error) {
      setEarnings(0);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;
    try {
      const list = await BalanceService.getTransactions(user.id);
      setTransactions(list);
    } catch (error) {
      setTransactions([]);
    }
  };

  const addEarnings = async (amount: number) => {
    if (!user) return { newBalance: balance, newEarnings: earnings };
    await BalanceService.addTransaction(user.id, {
      amount,
      type: "credit",
      description: `earning ${amount}`,
    });
    const b = await BalanceService.getBalance(user.id);
    const list = await BalanceService.getTransactions(user.id);
    setBalance(b.balance);
    setTransactions(list);
    const total = list
      .filter(
        (t) =>
          t.type === "credit" && /earning|заработ/gi.test(t.description || ""),
      )
      .reduce((acc, t) => acc + t.amount, 0);
    setEarnings(total);
    return { newBalance: b.balance, newEarnings: total };
  };

  // Stripe top-up flow (DEV: instant credit; PROD: backend orchestrates Stripe)
  const topUpBalance = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    try {
      if (__DEV__) {
        await BalanceService.addTransaction(user.id, {
          amount,
          type: "credit",
          description: `topup ${amount}`,
        });
      } else {
        // Backend should create PaymentIntent and confirm; here we assume success
        // await APIClient.post('/payments/stripe/topup', { userId: user.id, amount });
      }
      const b = await BalanceService.getBalance(user.id);
      const list = await BalanceService.getTransactions(user.id);
      setBalance(b.balance);
      setTransactions(list);
      return true;
    } catch (e) {
      return false;
    }
  };

  const withdrawBalance = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    try {
      // Represent withdrawal as debit transaction
      await BalanceService.addTransaction(user.id, {
        amount,
        type: "debit",
        description: `withdrawal ${amount}`,
      });
      const b = await BalanceService.getBalance(user.id);
      const list = await BalanceService.getTransactions(user.id);
      setBalance(b.balance);
      setTransactions(list);
      return true;
    } catch (e) {
      return false;
    }
  };

  const resetBalance = async () => {
    try {
      setBalance(0);
      setEarnings(0);
      setTransactions([]);
      // В DEV можно очистить через перезапись ключей, но оставим минимально без IO
    } catch (error) {}
  };

  const resetEarnings = async (): Promise<number> => {
    try {
      const old = earnings;
      setEarnings(0);
      return old;
    } catch (error) {
      return earnings;
    }
  };

  const deductBalance = async (
    amount: number,
    description?: string,
  ): Promise<boolean> => {
    try {
      if (balance < amount) {
        return false;
      }
      await BalanceService.withdrawBalance(
        user?.id || "",
        amount,
        description || "Balance deduction",
      );
      setBalance((prev) => prev - amount);
      return true;
    } catch (error) {
      return false;
    }
  };

  const value: BalanceContextType = {
    balance,
    earnings,
    transactions,
    addEarnings,
    topUpBalance,
    withdrawBalance,
    deductBalance,
    resetBalance,
    resetEarnings,
    loadBalance,
    loadEarnings,
  };

  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};
