/**
 * PaymentList component
 * List of payment items with loading and error states
 */

import React from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentItem } from './PaymentItem';
import { EmptyState } from './EmptyState';
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

interface PaymentListProps {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  emptyTitle: string;
  emptyDescription: string;
  colors: any;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  loading,
  error,
  onRefresh,
  emptyTitle,
  emptyDescription,
  colors
}) => {
  const renderPaymentItem = (payment: Payment) => (
    <PaymentItem
      key={payment.id}
      payment={payment}
      colors={colors}
    />
  );

  if (loading && payments.length === 0) {
    return (
      <EmptyState
        type="loading"
        title=""
        description=""
        colors={colors}
      />
    );
  }

  if (error && payments.length === 0) {
    return (
      <EmptyState
        type="error"
        title=""
        description={error}
        colors={colors}
        onRetry={onRefresh}
      />
    );
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        type="empty"
        title={emptyTitle}
        description={emptyDescription}
        colors={colors}
      />
    );
  }

  return (
    <View style={styles.paymentList}>
      {payments.map(renderPaymentItem)}
    </View>
  );
};
