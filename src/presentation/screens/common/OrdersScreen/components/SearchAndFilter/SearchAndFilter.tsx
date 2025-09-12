/**
 * SearchAndFilter component
 * Combined search and filter functionality
 */

import React from 'react';
import { View } from 'react-native';
import { SearchBar } from './SearchBar';
import { FilterChips } from './FilterChips';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilters: {
    all?: boolean;
    online?: boolean;
    priceAsc?: boolean;
    priceDesc?: boolean;
    rating45?: boolean;
    vip?: boolean;
    dailyTrips?: boolean;
    economy?: boolean;
  };
  onFilterSelect: (key: string) => void;
  isDriver: boolean;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterSelect,
  isDriver
}) => {
  return (
    <View>
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
      />
      <FilterChips
        activeFilters={activeFilters}
        onFilterSelect={onFilterSelect}
        isDriver={isDriver}
      />
    </View>
  );
};
