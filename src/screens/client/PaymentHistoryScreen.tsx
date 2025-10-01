import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { useLanguage } from '../../context/LanguageContext';
import { formatDateWithLanguage, formatTime } from '../../utils/formatters';
import { ClientScreenProps } from '../../types/navigation';
import { PaymentHistoryScreenStyles as styles, getPaymentHistoryScreenStyles } from '../../styles/screens/profile/PaymentHistoryScreen.styles';
import PaymentHistoryFilter, { PaymentFilter } from '../../components/PaymentHistoryFilter';
import { colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { usePaymentHistory } from '../../shared/hooks/usePaymentHistory';

/**
 * Экран истории платежей
 * 
 * Интегрирован с PaymentHistoryService и usePaymentHistory hook
 * Поддерживает DEV/PROD режимы, фильтрацию, пагинацию и обновление
 */

type PaymentHistoryScreenProps = ClientScreenProps<'PaymentHistory'> | { navigation: any };

const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { language } = useLanguage();
  const { user } = useAuth();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getPaymentHistoryScreenStyles(isDark);
  
  const isDriver = user?.role === 'driver';
  
  // Используем новый хук для управления историей платежей
  const {
    filteredTransactions,
    loading,
    refreshing,
    errorKey,
    hasMore,
    currentFilter,
    setFilter,
    resetFilter,
    refresh,
    loadMore,
    clearError,
    getTransactionIcon,
    getTransactionColor,
    getStatusColor,
    formatAmount,
  } = usePaymentHistory();
  
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? t('driver.paymentHistory.title') : t('client.paymentHistory.title');
  };
  
  const getEmptyStateTitle = () => {
    return isDriver ? t('driver.paymentHistory.noPayments') : t('client.paymentHistory.noPayments');
  };
  
  const getEmptyStateDescription = () => {
    return isDriver ? t('driver.paymentHistory.emptyDescription') : t('client.paymentHistory.emptyDescription');
  };
  
  // Обработчики
  const handleFilterApply = (filter: PaymentFilter) => {
    setFilter(filter);
    setFilterVisible(false);
  };
  
  const handleLoadMore = () => {
    if (hasMore && !loading && !refreshing) {
      loadMore();
    }
  };
  
  const handleRefresh = () => {
    refresh();
  };

  // Показываем индикатор загрузки при первой загрузке
  if (loading && filteredTransactions.length === 0) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <View style={[styles.header, dynamicStyles.header]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
          </TouchableOpacity>
          <Text style={[styles.title, dynamicStyles.title]}>{getScreenTitle()}</Text>
          <View style={styles.filterButton} />
        </View>
        
        <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
          <ActivityIndicator size="large" color={currentColors.primary} />
          <Text style={[styles.loadingText, dynamicStyles.loadingText]}>
            {t('common.loading')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>{getScreenTitle()}</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Показываем ошибку если есть */}
      {errorKey && (
        <View style={[styles.errorBox, dynamicStyles.errorBox]}>
          <Ionicons name="alert-circle" size={20} color="#e53935" />
          <Text style={[styles.errorText, dynamicStyles.errorText]}>
            {t(errorKey)}
          </Text>
          <TouchableOpacity onPress={clearError} style={styles.errorCloseButton}>
            <Ionicons name="close" size={16} color="#e53935" />
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[styles.contentContainer, { paddingTop: 16 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[currentColors.primary]}
            tintColor={currentColors.primary}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {filteredTransactions.length === 0 ? (
          <View style={[styles.emptyState, { alignItems: 'center', justifyContent: 'center' }]}>
            <Ionicons name="document-outline" size={64} color={currentColors.textSecondary} />
            <Text style={[styles.emptyTitle, dynamicStyles.emptyTitle]}>{getEmptyStateTitle()}</Text>
            <Text style={[styles.emptyDescription, dynamicStyles.emptyDescription]}>
              {getEmptyStateDescription()}
            </Text>
          </View>
        ) : (
          <>
            {filteredTransactions.map((transaction) => {
              const title = transaction.translationKey 
                ? (() => {
                    if (transaction.translationParams?.packageName) {
                      // Для транзакций с пакетами используем переведенные названия
                      const packageName = transaction.translationParams.packageName.split('_')[0];
                      const translatedPackageName = t(`premium.packages.${packageName}`, { defaultValue: packageName });
                      return t(transaction.translationKey, { ...transaction.translationParams, packageName: translatedPackageName });
                    }
                    return t(transaction.translationKey, transaction.translationParams);
                  })()
                : transaction.description;

              return (
                <View key={transaction.id} style={[styles.paymentItem, dynamicStyles.paymentItem]}>
                  <View style={styles.paymentHeader}>
                    <View style={styles.paymentInfo}>
                      <Ionicons 
                        name={getTransactionIcon(transaction.type) as keyof typeof Ionicons.glyphMap} 
                        size={24} 
                        color={getTransactionColor(transaction.type)} 
                      />
                      <View style={styles.paymentDetails}>
                        <Text style={[styles.paymentTitle, dynamicStyles.paymentTitle]}>{title}</Text>
                        <Text style={[styles.paymentDate, dynamicStyles.paymentDate]}>
                          {formatDateWithLanguage(new Date(transaction.date), language, 'short')} • {formatTime(new Date(transaction.date), language)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.paymentAmount}>
                      <Text style={[styles.amountText, { color: getTransactionColor(transaction.type) }]}>
                        {formatAmount(transaction.amount, transaction.type)}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) }]}>
                        <Text style={styles.statusText}>
                          {transaction.status === 'completed' ? t('client.paymentHistory.status.completed') : 
                           transaction.status === 'pending' ? t('client.paymentHistory.status.pending') : t('client.paymentHistory.status.failed')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {transaction.description && (
                    <Text style={[styles.paymentDescription, dynamicStyles.paymentDescription]}>{transaction.description}</Text>
                  )}
                </View>
              );
            })}
            
            {/* Индикатор загрузки следующей страницы */}
            {hasMore && (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color={currentColors.primary} />
                <Text style={[styles.loadingMoreText, dynamicStyles.loadingMoreText]}>
                  {t('common.loadingMore')}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
      
      <PaymentHistoryFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleFilterApply}
        currentFilter={currentFilter}
      />
    </View>
  );
};

export default PaymentHistoryScreen; 