import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoleKeys } from './useRole';
import { Card, mockCards } from '../mocks/cardsMock';
import { CardService } from '../services/cardService';
import { useUserStorageKey, STORAGE_KEYS } from '../utils/storageKeys';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { getStorageKey, getApiEndpoint, isDriver } = useRoleKeys();
  
  // Получаем ключ с изоляцией по пользователю
  const cardsKey = useUserStorageKey(STORAGE_KEYS.USER_CARDS);

  // Загружаем карты при инициализации
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      
      // Используем ключ с изоляцией по пользователю
      const savedCards = await AsyncStorage.getItem(cardsKey);
      
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      } else {
        // Загружаем моки в зависимости от роли
        const initialCards = isDriver 
          ? mockCards.filter(card => card.type !== 'family') // Водители без семейных карт
          : mockCards;
        
        setCards(initialCards);
        await AsyncStorage.setItem(cardsKey, JSON.stringify(initialCards));
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
      
      // Сохраняем с ключом изоляции по пользователю
      await AsyncStorage.setItem(cardsKey, JSON.stringify(updatedCards));
      
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
      
      await AsyncStorage.setItem(cardsKey, JSON.stringify(updatedCards));
      
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