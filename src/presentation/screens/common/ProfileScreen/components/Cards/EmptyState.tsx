/**
 * EmptyState component
 * Empty state for when user has no cards
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { CardsScreenStyles as styles } from '../styles/CardsScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  onAddCard: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  onAddCard
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <View style={[styles.emptyIcon, { backgroundColor: currentColors.surface }]}>
          <Ionicons name="card-outline" size={48} color={currentColors.textSecondary} />
        </View>
        
        <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
          {title}
        </Text>
        
        <Text style={[styles.emptyDescription, { color: currentColors.textSecondary }]}>
          {description}
        </Text>
        
        <TouchableOpacity 
          style={[styles.addCardButton, { backgroundColor: currentColors.primary }]}
          onPress={onAddCard}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addCardButtonText}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
