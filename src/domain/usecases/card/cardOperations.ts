import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../../../shared/mocks/shared/cardsMock';
import { CardService } from '../../../data/datasources/cardService';
import { getUserStorageKey, STORAGE_KEYS } from '../../../shared/utils/storageKeys';

/**
 * Domain usecase for card operations
 * Abstracts data layer access from presentation layer
 */
export const cardOperations = {
  /**
   * Load cards from storage
   */
  async loadCardsFromStorage(userId: string): Promise<Card[]> {
    try {
      const cardsKey = getUserStorageKey(STORAGE_KEYS.USER_CARDS);
      const savedCards = await AsyncStorage.getItem(cardsKey);
      
      if (savedCards) {
        return JSON.parse(savedCards);
      }
      return [];
    } catch (error) {
      console.error('Error loading cards from storage:', error);
      return [];
    }
  },

  /**
   * Save cards to storage
   */
  async saveCardsToStorage(userId: string, cards: Card[]): Promise<void> {
    try {
      const cardsKey = getUserStorageKey(STORAGE_KEYS.USER_CARDS);
      await AsyncStorage.setItem(cardsKey, JSON.stringify(cards));
    } catch (error) {
      console.error('Error saving cards to storage:', error);
      throw error;
    }
  },

  /**
   * Add card via API
   */
  async addCard(card: Card, userId?: string): Promise<boolean> {
    try {
      await CardService.addCard(card, userId);
      return true;
    } catch (error) {
      console.error('Error adding card via API:', error);
      return false;
    }
  },

  /**
   * Delete card via API
   */
  async deleteCard(cardId: string, userId?: string): Promise<boolean> {
    try {
      await CardService.deleteCard(cardId, userId);
      return true;
    } catch (error) {
      console.error('Error deleting card via API:', error);
      return false;
    }
  },

  /**
   * Get initial cards based on role
   */
  getInitialCards(isDriver: boolean, mockCards: Card[]): Card[] {
    // For now, all roles get the same cards
    // TODO: Implement role-based card filtering when family cards are added
    return mockCards;
  },

  /**
   * Create new card with generated ID
   */
  createNewCard(cardData: Omit<Card, 'id'>): Card {
    return {
      ...cardData,
      id: Date.now().toString(),
    };
  }
};
