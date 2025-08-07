import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../mocks/cardsMock';
import { getUserStorageKey, STORAGE_KEYS } from '../utils/storageKeys';

export const CardService = {
  async getCards(userId?: string): Promise<Card[]> {
    const storageKey = getUserStorageKey(STORAGE_KEYS.USER_CARDS, userId);
    const stored = await AsyncStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored);
    return [];
  },
  async saveCards(cards: Card[], userId?: string): Promise<void> {
    const storageKey = getUserStorageKey(STORAGE_KEYS.USER_CARDS, userId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(cards));
  },
  async addCard(card: Card, userId?: string): Promise<void> {
    const cards = await this.getCards(userId);
    cards.push(card);
    await this.saveCards(cards, userId);
  },
  async deleteCard(cardId: string, userId?: string): Promise<void> {
    const cards = await this.getCards(userId);
    const filtered = cards.filter(c => c.id !== cardId);
    await this.saveCards(filtered, userId);
  },
  async setDefault(cardId: string, userId?: string): Promise<void> {
    const cards = await this.getCards(userId);
    const updated = cards.map(c => ({ ...c, isDefault: c.id === cardId }));
    await this.saveCards(updated, userId);
  },
  async initMockIfEmpty(mock: Card[], userId?: string): Promise<void> {
    const cards = await this.getCards(userId);
    if (!cards.length) await this.saveCards(mock, userId);
  }
}; 