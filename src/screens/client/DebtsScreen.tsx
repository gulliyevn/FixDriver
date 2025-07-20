import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { ClientScreenProps } from '../../types/navigation';
import { DebtsScreenStyles as styles, getDebtsScreenStyles } from '../../styles/screens/profile/DebtsScreen.styles';
import { mockDebts } from '../../mocks/debtsMock';
import { getCurrentColors } from '../../constants/colors';

/**
 * Экран управления долгами
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useDebts hook
 * 2. Подключить DebtsService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать погашение долгов
 * 5. Подключить уведомления о долгах
 */

const DebtsScreen: React.FC<ClientScreenProps<'Debts'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getDebtsScreenStyles(isDark);
  const currentColors = getCurrentColors(isDark);
  const [debts] = useState(mockDebts);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<any>(null);

  const handlePayDebt = (debt: any) => {
    setSelectedDebt(debt);
    setConfirmModalVisible(true);
  };

  const confirmPayDebt = () => {
    // TODO: Здесь будет логика погашения долга
    setConfirmModalVisible(false);
    setSelectedDebt(null);
    Alert.alert(t('client.debts.paymentSuccess'));
  };

  const cancelPayDebt = () => {
    setConfirmModalVisible(false);
    setSelectedDebt(null);
  };

  const getTripDestination = (tripId: string) => {
    // TODO: В продакшне здесь будет запрос к API для получения данных поездки
    // Пока используем мок-данные для демонстрации
    const tripData: { [key: string]: string } = {
      'trip_001': t('client.debts.toAirport'),
      'trip_002': t('client.debts.toCityCenter'),
    };
    return tripData[tripId] || '';
  };

  const getDebtStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return '#e53935';
      case 'due_soon':
        return '#ff9800';
      case 'active':
        return '#2196f3';
      default:
        return '#4caf50';
    }
  };

  const getDebtStatusText = (status: string) => {
    switch (status) {
      case 'overdue':
        return t('client.debts.status.overdue');
      case 'due_soon':
        return t('client.debts.status.dueSoon');
      case 'active':
        return t('client.debts.status.active');
      default:
        return t('client.debts.status.paid');
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>{t('client.debts.title')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {debts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#4caf50" />
            <Text style={[styles.emptyTitle, dynamicStyles.emptyTitle]}>{t('client.debts.noDebts')}</Text>
            <Text style={[styles.emptyDescription, dynamicStyles.emptyDescription]}>
              {t('client.debts.noDebtsDescription')}
            </Text>
          </View>
        ) : (
          <>
            {debts.map((debt) => (
              <View key={debt.id} style={[styles.debtItem, dynamicStyles.debtItem]}>
                <View style={styles.debtHeader}>
                  <View style={styles.debtInfo}>
                    <Text style={[styles.debtTitle, dynamicStyles.debtTitle]}>{t(debt.titleKey)}</Text>
                    <Text style={[styles.debtDescription, dynamicStyles.debtDescription]}>
                      {t(debt.descriptionKey)} {debt.tripId ? getTripDestination(debt.tripId) : ''}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getDebtStatusColor(debt.status) }]}>
                    <Text style={styles.statusText}>{getDebtStatusText(debt.status)}</Text>
                  </View>
                </View>
                <View style={styles.debtDetails}>
                  <View style={styles.debtAmount}>
                    <Text style={[styles.amountLabel, dynamicStyles.amountLabel]}>{t('client.debts.debtAmount')}</Text>
                    <Text style={[styles.amountValue, dynamicStyles.amountValue]}>{debt.amount} {debt.currency}</Text>
                  </View>
                  <View style={styles.debtDate}>
                    <Text style={[styles.dateLabel, dynamicStyles.dateLabel]}>{t('client.debts.dueDate')}</Text>
                    <Text style={[styles.dateValue, dynamicStyles.dateValue]}>{debt.dueDate} • {debt.dueTime}</Text>
                  </View>
                </View>
                {debt.status !== 'paid' && (
                  <TouchableOpacity 
                    style={styles.payButton}
                    onPress={() => handlePayDebt(debt)}
                  >
                    <Text style={styles.payButtonText}>{t('client.debts.payDebt')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Модалка подтверждения погашения долга */}
      <Modal
        visible={confirmModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelPayDebt}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.modalContent]}>
            <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
              {t('client.debts.confirmPayment')}
            </Text>
            <Text style={[styles.modalMessage, dynamicStyles.modalMessage]}>
              {selectedDebt && t('client.debts.confirmPaymentMessage', { amount: selectedDebt.amount })}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={cancelPayDebt}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={confirmPayDebt}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                  {t('client.debts.payDebt')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DebtsScreen; 