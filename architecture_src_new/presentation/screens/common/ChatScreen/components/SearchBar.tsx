import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBarProps } from '../types/Chat';
import { createChatListScreenStyles } from '../styles/ChatListScreen.styles';
import { useTheme } from '../../../../../core/context/ThemeContext';

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search',
  onClear
}) => {
  const { isDark } = useTheme();
  const styles = createChatListScreenStyles(isDark);

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close-circle" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
