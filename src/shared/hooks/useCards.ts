import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoleKeys } from './useRole';
import { Card, mockCards } from '../mocks/shared/cardsMock';
import { cardOperations } from '../../domain/usecases/card/cardOperations';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { getStorageKey, getApiEndpoint, isDriver } = useRoleKeys();
  
  // Get user ID for operations
  const userId = 'current-user'; // TODO: Get from auth context

  // Load cards on initialization
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      
      // Load cards from storage
      const savedCards = await cardOperations.loadCardsFromStorage(userId);
      
      if (savedCards.length > 0) {
        setCards(savedCards);
      } else {
        // Load initial cards based on role
        const initialCards = cardOperations.getInitialCards(isDriver, mockCards);
        
        setCards(initialCards);
        await cardOperations.saveCardsToStorage(userId, initialCards);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData: Omit<Card, 'id'>) => {
    try {
      // Create new card
      const newCard = cardOperations.createNewCard(cardData);
      
      const updatedCards = [...cards, newCard];
      setCards(updatedCards);
      
      // Save to storage
      await cardOperations.saveCardsToStorage(userId, updatedCards);
      
      // API call
      const apiSuccess = await cardOperations.addCard(newCard, userId);
      
      return apiSuccess;
    } catch (error) {
      console.error('Error adding card:', error);
      return false;
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const updatedCards = cards.filter(card => card.id !== cardId);
      setCards(updatedCards);
      
      // Save to storage
      await cardOperations.saveCardsToStorage(userId, updatedCards);
      
      // API call
      const apiSuccess = await cardOperations.deleteCard(cardId, userId);
      
      return apiSuccess;
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