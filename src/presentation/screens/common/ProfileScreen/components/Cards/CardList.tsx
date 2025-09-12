/**
 * CardList component
 * List of user's cards with management options
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { CardItem } from './CardItem';
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

interface CardListProps {
  cards: Card[];
  onAddCard: () => void;
  isDriver: boolean;
}

export const CardList: React.FC<CardListProps> = ({ 
  cards, 
  onAddCard, 
  isDriver 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  return (
    <View style={styles.listContainer}>
      <View style={[styles.header, { backgroundColor: currentColors.background }]}>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>
          {isDriver ? t('cards.titleForDriver') : t('cards.title')}
        </Text>
        <TouchableOpacity 
          onPress={onAddCard} 
          style={[styles.addButton, { backgroundColor: currentColors.primary }]}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>{t('cards.add')}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isDriver={isDriver}
          />
        ))}
      </ScrollView>
    </View>
  );
};
