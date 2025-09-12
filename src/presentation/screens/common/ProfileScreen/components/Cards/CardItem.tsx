/**
 * CardItem component
 * Individual card display with management options
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useCards } from '../../../../../shared/hooks/useCards';
import { CardService } from '../../../../../data/datasources/cardService';
import { CardsScreenStyles as styles } from '../styles/CardsScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface Card {
  id: string;
  name: string;
  holderName: string;
  lastFour: string;
  type: 'visa' | 'mastercard';
  expiry: string;
  isDefault: boolean;
}

interface CardItemProps {
  card: Card;
  isDriver: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ card, isDriver }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { deleteCard } = useCards();
  const currentColors = isDark ? darkColors : lightColors;

  const getCardIcon = () => {
    switch (card.type.toLowerCase()) {
      case 'visa':
        return 'card-outline';
      case 'mastercard':
        return 'card-outline';
      default:
        return 'card-outline';
    }
  };

  const getCardColor = () => {
    switch (card.type.toLowerCase()) {
      case 'visa':
        return isDark ? '#60A5FA' : '#1a1f71';
      case 'mastercard':
        return isDark ? '#FBBF24' : '#eb001b';
      default:
        return currentColors.primary;
    }
  };

  const handleSetDefault = async () => {
    try {
      await CardService.setDefault(card.id);
    } catch (error) {
      Alert.alert(t('cards.error'), t('cards.setDefaultError'));
    }
  };

  const handleDeleteCard = () => {
    Alert.alert(
      t('cards.delete'),
      t('cards.deleteConfirm'),
      [
        { text: t('cards.cancel'), style: 'cancel' },
        { 
          text: t('cards.delete'), 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteCard(card.id);
            } catch (error) {
              Alert.alert(t('cards.error'), t('cards.deleteError'));
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.cardItem, { backgroundColor: currentColors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={[styles.cardIcon, { backgroundColor: getCardColor() }]}>
            <Ionicons name={getCardIcon()} size={24} color="#fff" />
          </View>
          
          <View style={styles.cardDetails}>
            <Text style={[styles.cardName, { color: currentColors.text }]}>
              {card.holderName || card.name}
            </Text>
            
            <View style={styles.cardNumberRow}>
              <Text style={[styles.cardNumber, { color: currentColors.textSecondary }]}>
                •••• {card.lastFour}
              </Text>
              <Text style={[styles.cardExpiry, { color: currentColors.textSecondary }]}>
                {card.expiry}
              </Text>
            </View>
            
            {card.isDefault && (
              <View style={[styles.defaultBadge, { backgroundColor: currentColors.primary }]}>
                <Text style={styles.defaultBadgeText}>
                  {t('cards.default')}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={handleDeleteCard}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color={currentColors.error} />
        </TouchableOpacity>
      </View>
      
      {!card.isDefault && (
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={[styles.setDefaultButton, { backgroundColor: currentColors.primary }]}
            onPress={handleSetDefault}
          >
            <Text style={styles.setDefaultButtonText}>
              {t('cards.setAsDefault')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
