import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoleKeys } from './useRole';
import { Card, mockCards } from '../mocks/cardsMock';
import { CardService } from '../services/cardService';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { getStorageKey, getApiEndpoint, isDriver } = useRoleKeys();

  // Загружаем карты при инициализации
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      
      // Используем разные ключи для driver и client
      const storageKey = getStorageKey('cards');
      const savedCards = await AsyncStorage.getItem(storageKey);
      
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      } else {
        // Загружаем моки в зависимости от роли
        const initialCards = isDriver 
          ? mockCards.filter(card => card.type !== 'family') // Водители без семейных карт
          : mockCards;
        
        setCards(initialCards);
        await AsyncStorage.setItem(storageKey, JSON.stringify(initialCards));
      }
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData: Omit<Card, 'id'>) => {
    try {
      const newCard: Card = {
        ...cardData,
        id: Date.now().toString(),
      };
      
      const updatedCards = [...cards, newCard];
      setCards(updatedCards);
      
      // Сохраняем с правильным ключом роли
      const storageKey = getStorageKey('cards');
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
      
      // API вызов с правильным endpoint
      const apiEndpoint = getApiEndpoint('/cards');
      await CardService.addCard(apiEndpoint, newCard);
      
      return true;
    } catch (error) {
      console.error('Error adding card:', error);
      return false;
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const updatedCards = cards.filter(card => card.id !== cardId);
      setCards(updatedCards);
      
      const storageKey = getStorageKey('cards');
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
      
      const apiEndpoint = getApiEndpoint('/cards');
      await CardService.deleteCard(apiEndpoint, cardId);
      
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      return false;
    }
  };

  return {
    cards,
    loading,
    addCard,
    deleteCard,
    refreshCards: loadCards,
  };
};