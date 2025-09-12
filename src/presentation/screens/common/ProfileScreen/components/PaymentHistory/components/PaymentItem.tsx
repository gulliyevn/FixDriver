/**
 * PaymentItem component
 * Individual payment item display
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { PaymentHistoryScreenStyles as styles } from '../styles/PaymentHistoryScreen.styles';

interface Payment {
  id: string;
  title: string;
  description?: string;
  amount: string;
  type: 'trip' | 'topup' | 'refund' | 'fee';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
}

interface PaymentItemProps {
  payment: Payment;
  colors: any;
}

export const PaymentItem: React.FC<PaymentItemProps> = ({ payment, colors }) => {
  const { t } = useLanguage();

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return 'car';
      case 'topup':
        return 'add-circle';
      case 'refund':
        return 'refresh-circle';
      case 'fee':
        return 'card';
      default:
        return 'card';
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case 'trip':
        return colors.error || '#e53935';
      case 'topup':
        return colors.success || '#4caf50';
      case 'refund':
        return colors.info || '#2196f3';
      case 'fee':
        return colors.warning || '#ff9800';
      default:
        return colors.text || '#003366';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success || '#4caf50';
      case 'pending':
        return colors.warning || '#ff9800';
      case 'failed':
        return colors.error || '#e53935';
      default:
        return colors.textSecondary || '#888';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('paymentHistory.status.completed');
      case 'pending':
        return t('paymentHistory.status.pending');
      case 'failed':
        return t('paymentHistory.status.failed');
      default:
        return status;
    }
  };

  return (
    <View style={[styles.paymentItem, { backgroundColor: colors.surface }]}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Ionicons 
            name={getPaymentIcon(payment.type) as any} 
            size={24} 
            color={getPaymentColor(payment.type)} 
          />
          <View style={styles.paymentDetails}>
            <Text style={[styles.paymentTitle, { color: colors.text }]}>
              {payment.title}
            </Text>
            <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>
              {payment.date} • {payment.time}
            </Text>
          </View>
        </View>
        <View style={styles.paymentAmount}>
          <Text style={[styles.amountText, { color: getPaymentColor(payment.type) }]}>
            {payment.amount}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getPaymentStatusColor(payment.status) }]}>
            <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
              {getStatusText(payment.status)}
            </Text>
          </View>
        </View>
      </View>
      {payment.description && (
        <Text style={[styles.paymentDescription, { color: colors.textSecondary }]}>
          {payment.description}
        </Text>
      )}
    </View>
  );
};
