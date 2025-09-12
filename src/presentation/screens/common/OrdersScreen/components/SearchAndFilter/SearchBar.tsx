/**
 * SearchBar component
 * Search input for drivers
 */

import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { OrdersScreenStyles as styles } from '../../styles/OrdersScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  const clearSearch = () => {
    onChange('');
  };

  return (
    <View style={[
      styles.searchContainer,
      { backgroundColor: currentColors.surface }
    ]}>
      <View style={styles.searchInputContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={currentColors.textSecondary} 
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            { 
              color: currentColors.text,
              backgroundColor: currentColors.background
            }
          ]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder || t('orders.search.placeholder')}
          placeholderTextColor={currentColors.textSecondary}
          returnKeyType="search"
          clearButtonMode="never"
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearch}
          >
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={currentColors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
