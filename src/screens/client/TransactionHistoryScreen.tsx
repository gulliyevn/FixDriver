import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { useBalance } from '../../context/BalanceContext';
import { colors } from '../../constants/colors';

interface TransactionHistoryScreenProps {
  navigation: any;
}

const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { transactions } = useBalance();
  const currentColors = isDark ? colors.dark : colors.light;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981'; // green
      case 'pending':
        return '#F59E0B'; // yellow
      case 'failed':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return 'car';
      case 'topup':
        return 'add-circle';
      case 'refund':
        return 'refresh';
      case 'fee':
        return 'card';
      default:
        return 'receipt';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trip':
        return '#3B82F6'; // blue
      case 'topup':
        return '#10B981'; // green
      case 'refund':
        return '#8B5CF6'; // purple
      case 'fee':
        return '#F59E0B'; // yellow
      default:
        return '#6B7280'; // gray
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('client.paymentHistory.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('client.paymentHistory.yesterday');
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toTimeString().split(' ')[0].substring(0, 5);
  };

  const renderTransaction = ({ item }: { item: any }) => {
    const transaction = {
      id: item.id,
      title: item.description,
      amount: `${item.amount > 0 ? '+' : ''}${item.amount} AFC`,
      type: item.type === 'package_purchase' ? 'fee' : 
            item.type === 'balance_topup' ? 'topup' : 'trip',
      status: 'completed',
      date: item.date.split('T')[0],
      time: formatTime(item.date)
    };

    return (
      <View style={{
        backgroundColor: currentColors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: getTypeColor(transaction.type) + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              <Ionicons 
                name={getTypeIcon(transaction.type) as any} 
                size={20} 
                color={getTypeColor(transaction.type)} 
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: currentColors.text,
                marginBottom: 4,
              }}>
                {transaction.title}
              </Text>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 14,
                  color: currentColors.textSecondary,
                  marginRight: 8,
                }}>
                  {formatDate(transaction.date)}
                </Text>
                
                <Text style={{
                  fontSize: 14,
                  color: currentColors.textSecondary,
                }}>
                  {transaction.time}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={{
            alignItems: 'flex-end',
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: transaction.amount.startsWith('+') ? '#10B981' : '#EF4444',
              marginBottom: 4,
            }}>
              {transaction.amount}
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getStatusColor(transaction.status),
                marginRight: 6,
              }} />
              <Text style={{
                fontSize: 12,
                color: currentColors.textSecondary,
                textTransform: 'capitalize',
              }}>
                {transaction.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const mappedTransactions = transactions.map(transaction => ({
    id: transaction.id,
    title: transaction.description,
    amount: `${transaction.amount > 0 ? '+' : ''}${transaction.amount} AFC`,
    type: transaction.type === 'package_purchase' ? 'fee' : 
          transaction.type === 'balance_topup' ? 'topup' : 'trip',
    status: 'completed',
    date: transaction.date.split('T')[0],
    time: formatTime(transaction.date)
  }));

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: currentColors.background 
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 45,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: currentColors.border,
        backgroundColor: currentColors.background,
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
          }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={currentColors.primary} 
          />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: currentColors.text,
        }}>
          {t('client.paymentHistory.title')}
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <FlatList
        data={mappedTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
          }}>
            <Ionicons 
              name="receipt-outline" 
              size={64} 
              color={currentColors.textSecondary} 
            />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: currentColors.textSecondary,
              marginTop: 16,
              textAlign: 'center',
            }}>
              {t('client.paymentHistory.empty')}
            </Text>
            <Text style={{
              fontSize: 14,
              color: currentColors.textSecondary,
              marginTop: 8,
              textAlign: 'center',
              paddingHorizontal: 40,
            }}>
              {t('client.paymentHistory.emptyDescription')}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default TransactionHistoryScreen; 