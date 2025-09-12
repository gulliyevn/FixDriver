/**
 * usePaymentFilter hook
 * Manages payment filtering logic
 */

import { useMemo } from 'react';

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

interface PaymentFilter {
  type: 'all' | 'trip' | 'topup' | 'refund' | 'fee';
  status: 'all' | 'completed' | 'pending' | 'failed';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
}

export const usePaymentFilter = (
  payments: Payment[], 
  filter: PaymentFilter
) => {
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];
    
    // Filter by type
    if (filter.type !== 'all') {
      filtered = filtered.filter(payment => payment.type === filter.type);
    }
    
    // Filter by status
    if (filter.status !== 'all') {
      filtered = filtered.filter(payment => payment.status === filter.status);
    }
    
    // Filter by date range
    if (filter.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        
        switch (filter.dateRange) {
          case 'today':
            return paymentDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return paymentDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return paymentDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            return paymentDate >= yearAgo;
          default:
            return true;
        }
      });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    return filtered;
  }, [payments, filter]);

  return {
    filteredPayments
  };
};
