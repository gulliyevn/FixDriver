import AsyncStorage from "@react-native-async-storage/async-storage";
import APIClient from "./APIClient";
import { devKeyFor } from "../utils/storageKeysDev";

export interface BalanceRecord {
  balance: number;
  updatedAt: string;
}

export interface TransactionRecord {
  id: string;
  amount: number;
  type: "debit" | "credit";
  description: string;
  createdAt: string;
}

export const BalanceService = {
  async getBalance(userId: string): Promise<BalanceRecord> {
    if (__DEV__) {
      const key = devKeyFor("BALANCE", userId);
      const raw = await AsyncStorage.getItem(key);
      if (raw) return JSON.parse(raw);
      const initial: BalanceRecord = {
        balance: 0,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    const res = await APIClient.get<BalanceRecord>(`/balance/${userId}`);
    return res.data as BalanceRecord;
  },

  async setBalance(userId: string, value: number): Promise<BalanceRecord> {
    if (__DEV__) {
      const record: BalanceRecord = {
        balance: value,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        devKeyFor("BALANCE", userId),
        JSON.stringify(record),
      );
      return record;
    }
    const res = await APIClient.post<BalanceRecord>(`/balance/${userId}`, {
      balance: value,
    } as any);
    return res.data as BalanceRecord;
  },

  async getTransactions(userId: string): Promise<TransactionRecord[]> {
    if (__DEV__) {
      const key = devKeyFor("TRANSACTIONS", userId);
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    }
    const res = await APIClient.get<TransactionRecord[]>(
      `/balance/${userId}/transactions`,
    );
    return (res.data || []) as TransactionRecord[];
  },

  async addTransaction(
    userId: string,
    tx: Omit<TransactionRecord, "id" | "createdAt">,
  ): Promise<TransactionRecord> {
    if (__DEV__) {
      const list = await this.getTransactions(userId);
      const record: TransactionRecord = {
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        ...tx,
      };
      const newList = [record, ...list];
      await AsyncStorage.setItem(
        devKeyFor("TRANSACTIONS", userId),
        JSON.stringify(newList),
      );
      // Update balance
      const b = await this.getBalance(userId);
      const next =
        tx.type === "credit" ? b.balance + tx.amount : b.balance - tx.amount;
      await this.setBalance(userId, next);
      return record;
    }
    const res = await APIClient.post<TransactionRecord>(
      `/balance/${userId}/transactions`,
      tx as any,
    );
    return res.data as TransactionRecord;
  },

  async withdrawBalance(
    userId: string,
    amount: number,
    description: string,
  ): Promise<BalanceRecord> {
    if (__DEV__) {
      const key = devKeyFor("BALANCE", userId);
      const current = await this.getBalance(userId);
      const newBalance = Math.max(0, current.balance - amount);
      const updated: BalanceRecord = {
        balance: newBalance,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      await this.addTransaction(userId, {
        amount: -amount,
        type: "debit",
        description,
        createdAt: new Date().toISOString(),
      });
      return updated;
    }
    const res = await APIClient.post<BalanceRecord>(
      `/balance/${userId}/withdraw`,
      { amount, description },
    );
    return res.data as BalanceRecord;
  },
};
