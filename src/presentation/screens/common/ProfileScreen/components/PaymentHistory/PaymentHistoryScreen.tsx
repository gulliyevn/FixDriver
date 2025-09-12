/**
 * PaymentHistoryScreen component
 * Main screen for displaying payment history with filtering
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../context/AuthContext';
import { PaymentList } from './components/PaymentList';
import { PaymentFilter } from './components/PaymentFilter';
import { usePaymentHistory } from './hooks/usePaymentHistory';
import { usePaymentFilter } from './hooks/usePaymentFilter';
import { PaymentHistoryScreenStyles as styles } from './styles/PaymentHistoryScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface PaymentFilter {
  type: 'all' | 'trip' | 'topup' | 'refund' | 'fee';
  status: 'all' | 'completed' | 'pending' | 'failed';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
}

interface PaymentHistoryScreenProps {
  navigation: any;
}

export const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [filterVisible, setFilterVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<PaymentFilter>({
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });
  
  const { payments, loading, error, refetch } = usePaymentHistory();
  const { filteredPayments } = usePaymentFilter(payments, currentFilter);
  
  const isDriver = user?.role === 'driver';

  const getScreenTitle = () => {
    return isDriver ? t('paymentHistory.titleForDriver') : t('paymentHistory.title');
  };

  const getEmptyStateTitle = () => {
    return isDriver ? t('paymentHistory.noPaymentsForDriver') : t('paymentHistory.noPayments');
  };

  const getEmptyStateDescription = () => {
    return isDriver ? t('paymentHistory.emptyDescriptionForDriver') : t('paymentHistory.emptyDescription');
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
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[styles.contentContainer, { paddingTop: 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <PaymentList
          payments={filteredPayments}
          loading={loading}
          error={error}
          onRefresh={refetch}
          emptyTitle={getEmptyStateTitle()}
          emptyDescription={getEmptyStateDescription()}
          colors={currentColors}
        />
      </ScrollView>
      
      {/* Filter Modal */}
      <PaymentFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setCurrentFilter}
        currentFilter={currentFilter}
        colors={currentColors}
      />
    </View>
  );
};
