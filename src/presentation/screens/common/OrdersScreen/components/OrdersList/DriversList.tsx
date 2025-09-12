/**
 * OrdersList component
 * List of orders with pull-to-refresh and loading states
 */

import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { OrderCard } from './OrderCard';
import { EmptyState } from './EmptyState';
import { OrdersScreenStyles as styles } from '../../styles/OrdersScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { useTheme } from '../../../../context/ThemeContext';

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  rating: number;
  isAvailable: boolean;
  phone_number: string;
  price?: string;
}

interface OrdersListProps {
  orders: Driver[];
  loading: boolean;
  error: string | null;
  onOrderPress: (order: Driver) => void;
  selectionMode: boolean;
  selectedIds: Set<string>;
  onStartSelection: () => void;
  isDriver: boolean;
  onRefresh: () => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  loading,
  error,
  onOrderPress,
  selectionMode,
  selectedIds,
  onStartSelection,
  isDriver,
  onRefresh
}) => {
  const { isDark } = useTheme();
  const currentColors = isDark ? darkColors : lightColors;

  const renderOrderItem = ({ item }: { item: Driver }) => (
    <OrderCard
      order={item}
      isSelected={selectedIds.has(item.id)}
      selectionMode={selectionMode}
      onPress={onOrderPress}
      onLongPress={onStartSelection}
      isDriver={isDriver}
    />
  );

  const renderEmptyComponent = () => (
    <EmptyState
      loading={loading}
      error={error}
      isDriver={isDriver}
      onRetry={onRefresh}
    />
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderOrderItem}
      style={styles.list}
      contentContainerStyle={[
        styles.listContent,
        { backgroundColor: currentColors.background }
      ]}
      ListEmptyComponent={renderEmptyComponent}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={currentColors.primary}
          colors={[currentColors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
};
