import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ChatListScreen.styles';

/**
 * Search Bar Component
 * 
 * Search input for filtering chats
 * Includes clear button functionality
 */

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  isDark: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  isDark,
}) => {
  const { t } = useI18n();

  return (
    <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      <Ionicons 
        name="search" 
        size={20} 
        color={isDark ? '#9CA3AF' : '#6B7280'} 
      />
      <TextInput
        style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
        placeholder={t('common.search')}
        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={isDark ? '#9CA3AF' : '#6B7280'} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
