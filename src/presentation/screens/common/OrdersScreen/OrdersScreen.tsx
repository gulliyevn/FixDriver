/**
 * OrdersScreen component
 * Main screen for displaying orders list with search, filter, and selection
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { OrdersList } from './components/OrdersList';
import { SearchAndFilter } from './components/SearchAndFilter';
import { SelectionBar } from './components/SelectionBar';
import { useOrders } from './hooks/useOrders';
import { useOrdersFilter } from './hooks/useOrdersFilter';
import { useOrdersSelection } from './hooks/useOrdersSelection';
import { OrdersScreenStyles as styles } from './styles/OrdersScreen.styles';
import { lightColors, darkColors } from '../../../../shared/constants/colors';

interface OrdersScreenProps {
  navigation: any;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    all: true,
    online: false,
    priceAsc: false,
    priceDesc: false,
    rating45: false,
    vip: false,
    dailyTrips: false,
    economy: false
  });
  
  const { orders, loading, error, refetch } = useOrders();
  const { filteredOrders } = useOrdersFilter(orders, searchQuery, activeFilters);
  const { 
    selectionMode, 
    selectedIds, 
    toggleSelect, 
    selectAll, 
    clearSelection,
    startSelection,
    endSelection
  } = useOrdersSelection();
  
  // Determine user role
  const isDriver = user?.role === 'driver';
  
  const getScreenTitle = () => {
    return isDriver ? t('orders.titleForDriver') : t('orders.title');
  };

  const handleOrderPress = (order: any) => {
    if (selectionMode) {
      toggleSelect(driver.id);
    } else {
      // Navigate to order details or chat
      navigation.navigate('Chat', {
        screen: 'ChatConversation',
        params: {
          orderId: order.id,
          orderName: `${order.first_name} ${order.last_name}`,
          orderCar: `${order.vehicle_brand} ${order.vehicle_model}`,
          orderNumber: order.phone_number,
          orderRating: order.rating.toString(),
          orderStatus: order.isAvailable ? 'online' : 'offline'
        }
      });
    }
  };

  const handleSelectFilter = (key: string) => {
    setActiveFilters(prev => {
      const base = { 
        all: false, 
        online: false, 
        priceAsc: false, 
        priceDesc: false, 
        rating45: false, 
        vip: false, 
        dailyTrips: false, 
        economy: false 
      };
      
      if (key === 'all') return { ...base, all: true };
      if (prev[key as keyof typeof prev]) {
        return { ...base, all: true };
      }
      
      return { ...base, [key]: true };
    });
  };

  const handleBookSelected = () => {
    if (selectedIds.size === 0) return;
    
    navigation.navigate('Map');
    endSelection();
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    // TODO: Implement delete functionality
    endSelection();
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentColors.surface }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: currentColors.text }]}>
          {getScreenTitle()}
        </Text>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {/* TODO: Open filter modal */}}
        >
          <Ionicons name="filter" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Search and Filter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilters}
        onFilterSelect={handleSelectFilter}
        isDriver={isDriver}
      />
      
      {/* Drivers List */}
      <DriversList
        drivers={filteredDrivers}
        loading={loading}
        error={error}
        onDriverPress={handleDriverPress}
        selectionMode={selectionMode}
        selectedIds={selectedIds}
        onStartSelection={startSelection}
        isDriver={isDriver}
        onRefresh={refetch}
      />
      
      {/* Selection Bar */}
      {selectionMode && (
        <SelectionBar
          selectedCount={selectedIds.size}
          totalCount={filteredOrders.length}
          onSelectAll={selectAll}
          onBook={handleBookSelected}
          onDelete={handleDeleteSelected}
          onCancel={endSelection}
          isDriver={isDriver}
        />
      )}
    </View>
  );
};
