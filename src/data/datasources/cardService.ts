import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../../shared/mocks/cardsMock';
import { CARD_CONSTANTS } from '../../shared/constants/adaptiveConstants';

export interface ICardService {
  getCards(userId?: string): Promise<Card[]>;
  saveCards(cards: Card[], userId?: string): Promise<void>;
  addCard(card: Card, userId?: string): Promise<void>;
  deleteCard(cardId: string, userId?: string): Promise<void>;
  setDefault(cardId: string, userId?: string): Promise<void>;
  initMockIfEmpty(mock: Card[], userId?: string): Promise<void>;
  syncWithBackend(): Promise<boolean>;
}

export const CardService = {
  async getCards(userId?: string): Promise<Card[]> {
    const storageKey = userId ? `${CARD_CONSTANTS.STORAGE_KEYS.USER_CARDS}_${userId}` : CARD_CONSTANTS.STORAGE_KEYS.USER_CARDS;
    const stored = await AsyncStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored);
    return [];
  },
  async saveCards(cards: Card[], userId?: string): Promise<void> {
    const storageKey = userId ? `${CARD_CONSTANTS.STORAGE_KEYS.USER_CARDS}_${userId}` : CARD_CONSTANTS.STORAGE_KEYS.USER_CARDS;
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
  },

  /**
   * Sync cards with backend via gRPC
   * TODO: Implement real gRPC call
   */
  async syncWithBackend(): Promise<boolean> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      const cards = await this.getCards();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Cards synced with backend:', { cardsCount: cards.length });
      return true;
    } catch (error) {
      console.error('Failed to sync cards:', error);
      return false;
    }
  }
}; 