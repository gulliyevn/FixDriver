/**
 * usePaymentHistory hook
 * Manages payment history data fetching with gRPC integration
 */

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { useAuth } from '../../../../../../context/AuthContext';
import { PaymentHistoryService } from '../../../../../../data/datasources/paymentHistory/PaymentHistoryService';
import { PaymentHistoryRequest, Payment } from '../../../../../../shared/types/paymentHistory/PaymentTypes';

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

export const usePaymentHistory = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize PaymentHistoryService (currently using mock)
  const paymentHistoryService = useMemo(() => {
    return new PaymentHistoryService(undefined, true); // Use mock for now
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const request: PaymentHistoryRequest = {
          userId: user.id,
          role: user.role === 'driver' ? 'driver' : 'client',
          limit: 100,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        };

        const response = await paymentHistoryService.getPaymentHistory(request);
        
        // Transform API response to component format
        const transformedPayments: Payment[] = response.payments.map(payment => ({
          id: payment.id,
          title: payment.title,
          description: payment.description,
          amount: payment.amount,
          type: payment.type,
          status: payment.status,
          date: payment.date,
          time: payment.time
        }));

        setPayments(transformedPayments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment history');
        
        // Fallback to empty array if API fails
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.id, user?.role, paymentHistoryService]);

  const refetch = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const request: PaymentHistoryRequest = {
        userId: user.id,
        role: user.role === 'driver' ? 'driver' : 'client',
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await paymentHistoryService.getPaymentHistory(request);
      
      const transformedPayments: Payment[] = response.payments.map(payment => ({
        id: payment.id,
        title: payment.title,
        description: payment.description,
        amount: payment.amount,
        type: payment.type,
        status: payment.status,
        date: payment.date,
        time: payment.time
      }));

      setPayments(transformedPayments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh payment history');
    } finally {
      setLoading(false);
    }
  };

  const exportPayments = async (format: 'csv' | 'pdf' = 'csv') => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      return await paymentHistoryService.exportPaymentHistory(user.id, format);
    } catch (error) {
      throw error;
    }
  };

  return {
    payments,
    loading,
    error,
    refetch,
    exportPayments
  };
};
