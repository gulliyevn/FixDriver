import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockOrders, mockUsers } from '../../mocks';
import { OrdersScreenStyles } from '../../styles/screens/OrdersScreen.styles';

interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  pickup: string;
  destination: string;
  price: string;
  distance: string;
  estimatedTime: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  timestamp: string;
}

const OrdersScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(''); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Используем централизованные моки
  const orders: Order[] = mockOrders.map(order => {
    const client = mockUsers.find(user => user.id === order.clientId);
    return {
      id: order.id,
      clientName: client ? `${client.name} ${client.surname}` : 'Неизвестный клиент',
      clientPhone: client?.phone || '',
      pickup: order.from,
      destination: order.to,
      price: `${order.price || 15} ₽`,
      distance: `${order.distance || 3.2} км`,
      estimatedTime: `${order.duration || 12} мин`,
      status: order.status as 'pending' | 'accepted' | 'completed' | 'cancelled',
      timestamp: order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    };
  });

  const filters = [
    { key: 'all', label: 'Все', icon: 'list' },
    { key: 'active', label: 'Активные', icon: 'checkmark-circle' },
    { key: 'completed', label: 'Завершенные', icon: 'checkmark-done' },
    { key: 'pending', label: 'Ожидающие', icon: 'time' }
  ].map(filter => ({
    ...filter,
    icon: filter.key === 'all' ? 'list' :
          filter.key === 'active' ? 'checkmark-circle' :
          filter.key === 'completed' ? 'checkmark-done' : 'time'
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'accepted': return '#007AFF';
      case 'completed': return '#27ae60';
      case 'cancelled': return '#FF3B30';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Новый';
      case 'accepted': return 'Принят';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return 'Неизвестно';
    }
  };

  const handleOrderAction = (order: Order, action: string) => {
    Alert.alert(
      action === 'accept' ? 'Принять заказ' : 'Завершить поездку',
      action === 'accept' 
        ? `Принять заказ от ${order.clientName}?`
        : `Завершить поездку с ${order.clientName}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: action === 'accept' ? 'Принять' : 'Завершить', 
          onPress: () => Alert.alert('Успех', action === 'accept' ? 'Заказ принят!' : 'Поездка завершена!')
        }
      ]
    );
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const filteredOrders = orders.filter(order => {
    if (selectedFilter === 'all') return true;
    return order.status === selectedFilter;
  });

  return (
    <SafeAreaView style={OrdersScreenStyles.container}>
      {/* Header */}
      <View style={OrdersScreenStyles.header}>
        <Text style={OrdersScreenStyles.headerTitle}>Заказы</Text>
        <TouchableOpacity style={OrdersScreenStyles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={OrdersScreenStyles.searchContainer}>
        <View style={OrdersScreenStyles.searchInput}>
          <Ionicons name="search" size={20} color="#666" style={OrdersScreenStyles.searchIcon} />
          <TextInput
            style={OrdersScreenStyles.input}
            placeholder="Поиск заказов..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Filters */}
      <View style={OrdersScreenStyles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                OrdersScreenStyles.filterButton,
                selectedFilter === filter.key && OrdersScreenStyles.filterButtonActive
              ]}
              onPress={() => handleFilterSelect(filter.key)}
            >
              <Ionicons 
                name={filter.icon as keyof typeof Ionicons.glyphMap} 
                size={16} 
                color={selectedFilter === filter.key ? '#fff' : '#666'} 
              />
              <Text style={[
                OrdersScreenStyles.filterText,
                selectedFilter === filter.key && OrdersScreenStyles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView style={OrdersScreenStyles.ordersList} showsVerticalScrollIndicator={false}>
        {filteredOrders.map((order) => (
          <View key={order.id} style={OrdersScreenStyles.orderCard}>
            <View style={OrdersScreenStyles.orderHeader}>
              <View style={OrdersScreenStyles.orderInfo}>
                <Text style={OrdersScreenStyles.orderId}>Заказ #{order.id}</Text>
                <Text style={OrdersScreenStyles.orderTime}>{order.timestamp}</Text>
              </View>
              <View style={[
                OrdersScreenStyles.statusBadge,
                { backgroundColor: getStatusColor(order.status) }
              ]}>
                <Text style={OrdersScreenStyles.statusText}>{getStatusText(order.status)}</Text>
              </View>
            </View>
            <View style={OrdersScreenStyles.orderDetails}>
              <View style={OrdersScreenStyles.detailRow}>
                <Ionicons name="person" size={16} color="#007AFF" />
                <Text style={OrdersScreenStyles.detailText}>{order.clientName}</Text>
                <Text style={OrdersScreenStyles.detailText}>{order.clientPhone}</Text>
              </View>
              <View style={OrdersScreenStyles.detailRow}>
                <Ionicons name="location" size={16} color="#34C759" />
                <Text style={OrdersScreenStyles.detailText}>{order.pickup}</Text>
              </View>
              <View style={OrdersScreenStyles.detailRow}>
                <Ionicons name="navigate" size={16} color="#FF9500" />
                <Text style={OrdersScreenStyles.detailText}>{order.destination}</Text>
              </View>
              <View style={OrdersScreenStyles.detailRow}>
                <Ionicons name="pricetag" size={16} color="#007AFF" />
                <Text style={OrdersScreenStyles.detailText}>{order.price}</Text>
                <Text style={OrdersScreenStyles.detailText}>{order.distance}</Text>
                <Text style={OrdersScreenStyles.detailText}>{order.estimatedTime}</Text>
              </View>
            </View>
            <View style={OrdersScreenStyles.actionsRow}>
              {order.status === 'pending' && (
                <TouchableOpacity style={OrdersScreenStyles.actionButton} onPress={() => handleOrderAction(order, 'accept')}>
                  <Text style={OrdersScreenStyles.actionButtonText}>Принять</Text>
                </TouchableOpacity>
              )}
              {order.status === 'accepted' && (
                <TouchableOpacity style={OrdersScreenStyles.actionButton} onPress={() => handleOrderAction(order, 'complete')}>
                  <Text style={OrdersScreenStyles.actionButtonText}>Завершить</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrdersScreen;
