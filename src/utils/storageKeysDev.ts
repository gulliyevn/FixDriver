// DEV storage keys, all scoped by userId
import { useAuth } from "../context/AuthContext";

export const DEV_KEYS = {
  PROFILE: "@profile_",
  BALANCE: "@balance_",
  TRANSACTIONS: "@transactions_",
  CARDS: "@cards_",
  ADDRESSES: "@addresses_",
  ADDRESS_AUTOCOMPLETE_HISTORY: "@address_autocomplete_history_",
  CHATS: "@chats_",
  MESSAGES: "@messages_",
  NOTIFICATIONS: "@notifications_",
  ORDERS: "@orders_",
} as const;

export const devKeyFor = (base: keyof typeof DEV_KEYS, userId: string) =>
  `${DEV_KEYS[base]}${userId}`;

export const useUserStorageKey = (
  baseKey: keyof typeof DEV_KEYS,
  fallback?: string,
): string => {
  const { user } = useAuth();
  const userId = user?.id || fallback;

  if (!userId) {
    console.error("DEV storage key requires user context");
    return;
  }

  return devKeyFor(baseKey, userId);
};
