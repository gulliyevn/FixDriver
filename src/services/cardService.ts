import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../mocks/cardsMock';

const STORAGE_KEY = 'cards';

export const CardService = {
  async getCards(): Promise<Card[]> {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return [];
  },
  async saveCards(cards: Card[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  },
  async addCard(card: Card): Promise<void> {
    const cards = await this.getCards();
    cards.push(card);
    await this.saveCards(cards);
  },
  async deleteCard(cardId: string): Promise<void> {
    const cards = await this.getCards();
    const filtered = cards.filter(c => c.id !== cardId);
    await this.saveCards(filtered);
  },
  async setDefault(cardId: string): Promise<void> {
    const cards = await this.getCards();
    const updated = cards.map(c => ({ ...c, isDefault: c.id === cardId }));
    await this.saveCards(updated);
  },
  async initMockIfEmpty(mock: Card[]): Promise<void> {
    const cards = await this.getCards();
    if (!cards.length) await this.saveCards(mock);
  }
}; 