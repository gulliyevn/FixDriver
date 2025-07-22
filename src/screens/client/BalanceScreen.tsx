import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Animated, TouchableWithoutFeedback, Dimensions, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { BalanceScreenStyles as styles, getBalanceScreenStyles, getBalanceScreenColors } from '../../styles/screens/profile/BalanceScreen.styles';
import { Transaction, TopUpMethod, WithdrawalMethod } from '../../types/balance';
import { 
  mockTransactions, 
  mockTopUpMethods, 
  mockWithdrawalMethods, 
  mockBalance, 
  mockQuickAmounts 
} from '../../mocks/balanceMock';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../constants/colors';
import {
  balanceCardAnimated,
  balanceCardFrontRow,
  cashbackText,
  flipButton,
  balanceActionsMargin,
  balanceCardBack,
  cardBackRow,
  cardBackText,
  cardBackTextNormal,
  cardBackTextLetter,
  cardBackTextLast,
  sectionTitleCenter,
  cardContainerWithWidth,
  animatedCardFront,
  animatedCardBack,
  cardSpacer,
  flipButtonBack,
} from '../../styles/screens/profile/BalanceScreen.styles';

/**
 * Экран баланса пользователя
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useBalance hook
 * 2. Подключить BalanceService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать реальные платежные методы
 * 5. Добавить валидацию сумм
 * 6. Подключить уведомления о транзакциях
 */

const BalanceScreen: React.FC<ClientScreenProps<'Balance'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getBalanceScreenStyles(isDark);
  const balanceColors = getBalanceScreenColors(isDark);
  
  const [balance] = useState(mockBalance);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [topUpMethods] = useState<TopUpMethod[]>(mockTopUpMethods);
  const [withdrawalMethods] = useState<WithdrawalMethod[]>(mockWithdrawalMethods);
  // Вместо flipAnim._value используем ref
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlippedRef = useRef(false);

  const handleFlip = () => {
    const toValue = isFlippedRef.current ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      isFlippedRef.current = !isFlippedRef.current;
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '90deg', '0deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const handleTopUp = () => {
    const options = topUpMethods.map(method => ({
      text: method.name,
              onPress: () => {}
    }));
    
    Alert.alert(
      'Пополнение баланса',
      'Выберите способ пополнения',
      [...options, { text: 'Отмена', style: 'cancel' }]
    );
  };

  const handleWithdraw = () => {
    const options = withdrawalMethods.map(method => ({
      text: method.name,
              onPress: () => {}
    }));
    
    Alert.alert(
      'Вывод средств',
      'Выберите способ вывода',
      [...options, { text: 'Отмена', style: 'cancel' }]
    );
  };

  const handleQuickTopUp = (amount: string) => {
    Alert.alert(
      'Быстрое пополнение',
      `Пополнить баланс на ${amount}?`,
      [
        { text: 'Пополнить', onPress: () => {} },
        { text: 'Отмена', style: 'cancel' }
      ]
    );
  };

  const handleUseCashback = () => {
    Alert.alert('Кешбек', 'Функция использования кешбека пока не реализована.');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return 'car';
      case 'topup':
        return 'add-circle';
      case 'refund':
        return 'refresh-circle';
      default:
        return 'card';
    }
  };

  const getTransactionAmountStyle = (type: string) => {
    switch (type) {
      case 'payment':
        return styles.transactionAmountPayment;
      case 'topup':
        return styles.transactionAmountTopUp;
      case 'refund':
        return styles.transactionAmountRefund;
      default:
        return {};
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    return status === 'completed' ? styles.statusBadgeCompleted : styles.statusBadgePending;
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={[styles.container, balanceColors.container]}>
      <View style={[styles.header, balanceColors.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, balanceColors.title]}>{t('client.balance.title')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Основной баланс с анимацией */}
        <View style={{ marginTop: 12 }}>
          <View style={[cardContainerWithWidth, { width: screenWidth * 0.95 }]}>  
            {/* Front side - всегда в DOM */}
            <Animated.View
              style={[
                styles.balanceCard,
                dynamicStyles.balanceCard,
                balanceCardAnimated,
                animatedCardFront,
                { 
                  transform: [{ rotateY: frontInterpolate }],
                  opacity: frontOpacity,
                },
              ]}
            >
              <View style={balanceCardFrontRow}>
                <View>
                  <Text style={styles.balanceLabel}>{t('client.balance.currentBalance')}</Text>
                  <Text style={styles.balanceAmount}>{balance}</Text>
                  <Text style={cashbackText}>CashBack: 125 AFc</Text>
                </View>
                <TouchableOpacity onPress={handleFlip} style={flipButton}>
                  <Ionicons name="swap-horizontal" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={[styles.balanceActions, balanceActionsMargin]}> 
                <TouchableOpacity style={styles.actionButton} onPress={handleTopUp}>
                  <Ionicons name="add-circle" size={24} color="#fff" />
                  <Text style={styles.actionButtonText}>{t('client.balance.topUp')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.cashbackButton]} onPress={handleUseCashback}>
                  <Ionicons name="gift" size={24} color="#fff" />
                  <Text style={styles.actionButtonText}>{t('client.balance.cashback.use')}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            {/* Back side - всегда в DOM */}
            <Animated.View
              style={[
                styles.balanceCard,
                dynamicStyles.balanceCard,
                balanceCardAnimated,
                animatedCardBack,
                {
                  transform: [{ rotateY: backInterpolate }],
                  opacity: backOpacity,
                },
              ]}
            >
              <View style={balanceCardBack}>
                <View style={cardBackRow}>
                  <Text style={cardBackText}>DIGITAL AFc CARD</Text>
                  <Text style={cardBackTextLetter}>1234 5678 9012 3456</Text>
                  <Text style={cardBackTextNormal}>Иван Иванов</Text>
                  <Text style={cardBackTextNormal}>12/25</Text>
                  <Text style={cardBackTextLast}>CVV: 123</Text>
                </View>
                <View style={flipButtonBack}>
                  <TouchableOpacity onPress={handleFlip} style={flipButton}>
                    <Ionicons name="swap-horizontal" size={32} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
            {/* Spacer для высоты */}
            <View style={cardSpacer} />
          </View>
        </View>
        {/* Кнопки вынесены ниже карты */}
        {/* Быстрое пополнение - обновлённый красивый вид */}
        <View style={[styles.quickTopUpCard, dynamicStyles.quickTopUpCard]}> 
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('client.balance.quickTopUp')}</Text>
          {[0, 1, 2].map(row => (
            <View key={row} style={[styles.quickAmountsRow, dynamicStyles.quickAmountsRow || {}]}>
              {mockQuickAmounts.slice(row * 3, row * 3 + 3).map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickAmountButton,
                    dynamicStyles.quickAmountButton || {},
                    styles.quickAmountButtonLarge,
                    dynamicStyles.quickAmountButtonLarge || {},
                  ]}
                  onPress={() => handleQuickTopUp(amount)}
                >
                  <Text style={[styles.quickAmountText, styles.quickAmountTextLarge, dynamicStyles.quickAmountTextLarge || {}]}>{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Удалена секция кешбека */}
      </ScrollView>
    </View>
  );
};

export default BalanceScreen; 