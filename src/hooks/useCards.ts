import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../services/cardService';
import { CardService } from '../services/cardService';
import { useUserStorageKey, STORAGE_KEYS } from '../utils/storageKeys';
import { useAuth } from '../context/AuthContext';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Получаем ключ с изоляцией по пользователю
  const cardsKey = useUserStorageKey(STORAGE_KEYS.USER_CARDS);

  // Загружаем карты при инициализации
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      
      if (__DEV__) {
        // DEV: загружаем из AsyncStorage
        const savedCards = await AsyncStorage.getItem(cardsKey);
        if (savedCards) {
          setCards(JSON.parse(savedCards));
        } else {
          setCards([]);
        }
      } else {
        // PROD: загружаем из API
        if (user?.id) {
          const apiCards = await CardService.getCards(user.id);
          setCards(apiCards);
        } else {
          setCards([]);
        }
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData: Omit<Card, 'id'>) => {
    try {
      if (__DEV__) {
        // DEV: сохраняем в AsyncStorage
        const newCard: Card = {
          ...cardData,
          id: Date.now().toString(),
        };
        
        const updatedCards = [...cards, newCard];
        setCards(updatedCards);
        await AsyncStorage.setItem(cardsKey, JSON.stringify(updatedCards));
        return true;
      } else {
        // PROD: отправляем в API
        if (!user?.id) return false;
        const newCard = await CardService.addCard(cardData, user.id);
        if (newCard) {
          setCards(prev => [...prev, newCard]);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error adding card:', error);
      return false;
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      if (__DEV__) {
        // DEV: удаляем из AsyncStorage
        const updatedCards = cards.filter(card => card.id !== cardId);
        setCards(updatedCards);
        await AsyncStorage.setItem(cardsKey, JSON.stringify(updatedCards));
        return true;
      } else {
        // PROD: удаляем через API
        const success = await CardService.deleteCard(cardId);
        if (success) {
          setCards(prev => prev.filter(card => card.id !== cardId));
          return true;
        }
        return false;
      }
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