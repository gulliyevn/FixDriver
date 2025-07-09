import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DriversScreenStyles as styles } from '../../styles/screens/DriversScreen.styles';

export interface DriverFilter {
  id: string;
  label: string;
  icon: string;
}

interface DriverFiltersProps {
  filters: DriverFilter[];
  selectedFilter: string;
  searchQuery: string;
  onFilterSelect: (filterId: string) => void;
  onSearchChange: (query: string) => void;
}

const DriverFilters: React.FC<DriverFiltersProps> = ({
  filters,
  selectedFilter,
  searchQuery,
  onFilterSelect,
  onSearchChange,
}) => {
  return (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск водителей..."
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterButton, selectedFilter === filter.id && styles.filterButtonActive]}
            onPress={() => onFilterSelect(filter.id)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === filter.id && styles.filterButtonTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default DriverFilters; 