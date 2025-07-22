import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Animated, Modal, TextInput, Dimensions, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { BalanceScreenStyles as styles, getBalanceScreenStyles, getBalanceScreenColors } from '../../styles/screens/profile/BalanceScreen.styles';
import { 
  mockBalance, 
  mockCashback,
  mockQuickAmounts 
} from '../../mocks/balanceMock';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createCVVStickAnimation } from '../../styles/animations';
import {
  balanceCardAnimated,
  balanceCardFrontRow,
  cashbackText,
  balanceActionsMargin,
  balanceCardBack,
  cardBackText,
  animatedCardFront,
  animatedCardBack,
  cardSpacer,
  flipButtonBack,
  flipButtonFront,
  mainBalanceContainer,
  cardContainerWithDynamicWidth,
  balanceCardWithTheme,
  cardFrontButtonWithTheme,
  cardFrontButton2WithTheme,
  cardFrontBtnTextWithColor,
  quickAmountsRowWithLayout,
  quickAmountTextWithTheme,
  modalContainerWithTheme,
  modalTitleWithTheme,
  modalLabelWithTheme,
  modalInputWithTheme,
  modalPayBtnWithTheme,
  modalCancelBtnTextWithTheme,
  cvvStickerWithAnimation,
  cvvTextWithOpacity,
  copiedIconStyle,
  flipIconColor,
  backIconColor,
  cardNumberLine,
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

  // Цвета и стили для кнопок и карты
  const topUpBtnColor = currentColors.primary;
  const cashbackBtnColor = currentColors.success;
  const cardBg = currentColors.card;
  const flipIconColorValue = flipIconColor(isDark);
  const backIconColorValue = backIconColor(isDark);

  const BALANCE_KEY = 'user_balance';
  const CASHBACK_KEY = 'user_cashback';
  const [balance, setBalance] = useState(mockBalance);
  const [cashback, setCashback] = useState(mockCashback);
  React.useEffect(() => {
    (async () => {
      const storedBalance = await AsyncStorage.getItem(BALANCE_KEY);
      const storedCashback = await AsyncStorage.getItem(CASHBACK_KEY);
      if (storedBalance !== null) setBalance(storedBalance);
      if (storedCashback !== null) setCashback(storedCashback);
    })();
  }, []);


  // Вместо flipAnim._value используем ref
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlippedRef = useRef(false);
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

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

  const handleTopUp = (amount?: string) => {
    if (amount) setTopUpAmount(amount);
    else setTopUpAmount('');
    setTopUpModalVisible(true);
  };



  const handleUseCashback = () => {
    const cashbackNum = parseFloat(cashback);
    
    if (cashbackNum < 20) {
      Alert.alert(
        'Недостаточно средств',
        'Для вывода средств нужны минимум 20 AFc'
      );
      return;
    }
    
    Alert.alert(
      'Использование кэшбэка',
      'Вы уверены что хотите использовать Cashback?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Да',
          onPress: () => {
            setBalance((prev: string) => {
              const cleanPrev = String(prev).replace(/AFc/gi, '').replace(/\s+/g, '');
              const prevNum = parseFloat(cleanPrev);
              const newBalance = (isNaN(prevNum) ? 0 : prevNum) + cashbackNum + '';
              AsyncStorage.setItem(BALANCE_KEY, newBalance);
              return newBalance;
            });
            setCashback('0');
            AsyncStorage.setItem(CASHBACK_KEY, '0');
            Alert.alert('Успешно', `Кэшбэк ${cashbackNum} AFc добавлен к балансу`);
          }
        }
      ]
    );
  };





  const screenWidth = Dimensions.get('window').width;

  const handleFakeStripePayment = () => {
    const amountNum = parseFloat(topUpAmount.replace(',', '.'));
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Ошибка', 'Введите корректную сумму');
      return;
    }
    setBalance((prev: string) => {
      const cleanPrev = String(prev).replace(/AFc/gi, '').replace(/\s+/g, '');
      const prevNum = parseFloat(cleanPrev);
      const newBalance = (isNaN(prevNum) ? 0 : prevNum) + amountNum + '';
      AsyncStorage.setItem(BALANCE_KEY, newBalance);
      return newBalance;
    });
    setTopUpModalVisible(false);
    Alert.alert('Оплата прошла успешно', `Баланс пополнен на ${amountNum} AFc`);
  };

  const [showCopied, setShowCopied] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const cvvOpacity = useRef(new Animated.Value(0)).current;
  const stickerOpacity = useRef(new Animated.Value(1)).current;
  const stickerTranslateX = useRef(new Animated.Value(0)).current;
  const stickerTranslateY = useRef(new Animated.Value(0)).current;
  const stickerRotate = useRef(new Animated.Value(0)).current;

  const handleCopyCardNumber = async () => {
    try {
      await Clipboard.setString('1234 5678 9012 3456');
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      // Ошибка копирования - молча игнорируем
    }
  };

  const handleToggleCVV = () => {
    createCVVStickAnimation(
      { cvvOpacity, stickerOpacity, stickerTranslateX, stickerTranslateY, stickerRotate },
      setShowCVV
    )(showCVV);
  };

  return (
    <View style={[styles.container, balanceColors.container]}>
      <View style={[styles.header, balanceColors.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={backIconColorValue} />
        </TouchableOpacity>
        <Text style={[styles.title, balanceColors.title]}>{t('client.balance.title')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Основной баланс с анимацией */}
        <View style={mainBalanceContainer}>
          <View style={cardContainerWithDynamicWidth(screenWidth)}>  
            {/* Front side - всегда в DOM */}
            <Animated.View
              style={[
                styles.balanceCard,
                styles.balanceCardBorder,
                { ...dynamicStyles.balanceCard, ...balanceCardWithTheme(currentColors) },
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
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceAmount}>{balance}</Text>
                    {!String(balance).includes('AFc') && (
                      <Text style={styles.balanceCurrency}>AFc</Text>
                    )}
                  </View>
                  <Text style={cashbackText}>CashBack: {cashback} AFc</Text>
                </View>
                <TouchableOpacity onPress={handleFlip} style={flipButtonFront}>
                  <Ionicons name="swap-horizontal" size={32} color={flipIconColorValue} />
                </TouchableOpacity>
              </View>
              <View style={[styles.balanceActions, balanceActionsMargin]}> 
                <TouchableOpacity
                  style={[
                    styles.cardFrontButton,
                    cardFrontButtonWithTheme(cardBg, topUpBtnColor),
                  ]}
                  onPress={() => handleTopUp()}
                >
                  <Ionicons name="add-circle" size={24} color={topUpBtnColor} />
                  <Text style={[styles.cardFrontBtnText, cardFrontBtnTextWithColor(topUpBtnColor)]}>{t('client.balance.topUp')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.cardFrontButton2,
                    cardFrontButton2WithTheme(cardBg, cashbackBtnColor),
                  ]}
                  onPress={handleUseCashback}
                >
                  <Ionicons name="gift" size={24} color={cashbackBtnColor} />
                  <Text style={[styles.cardFrontBtnText, cardFrontBtnTextWithColor(cashbackBtnColor)]}>{t('client.balance.cashback.use')}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            {/* Back side - всегда в DOM */}
            <Animated.View
              style={[
                styles.balanceCard,
                styles.balanceCardBorder,
                { ...dynamicStyles.balanceCard, ...balanceCardWithTheme(currentColors) },
                balanceCardAnimated,
                animatedCardBack,
                {
                  transform: [{ rotateY: backInterpolate }],
                  opacity: backOpacity,
                },
              ]}
            >
              <View style={balanceCardBack}>
                <View style={styles.cardBackBtnContainer}>
                  <TouchableOpacity onPress={handleFlip} style={flipButtonBack}>
                    <Ionicons name="swap-horizontal" size={32} color={flipIconColorValue} />
                  </TouchableOpacity>
                </View>
                <Text style={[cardBackText, styles.cardBackTextCenter]}>DIGITAL AFc CARD</Text>
                <View style={styles.cardNumberContainer}>
                  <View style={cardNumberLine} />
                  <Text style={[cardBackText, styles.cardNumberText]}>1234 5678 9012 3456</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopyCardNumber}>
                    <Ionicons name="copy-outline" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardDetailsContainer}>
                  <Text style={[cardBackText, styles.cardDetailsText]}>12/25</Text>
                  <View style={styles.cvvContainer}>
                    <TouchableOpacity onPress={handleToggleCVV}>
                      <Animated.Text 
                        style={[
                          cardBackText, 
                          styles.cardDetailsText, 
                          cvvTextWithOpacity(cvvOpacity)
                        ]}
                      >
                        123
                      </Animated.Text>
                    </TouchableOpacity>
                    <Animated.View 
                      style={[
                        styles.cvvSticker, 
                        cvvStickerWithAnimation(stickerOpacity, stickerTranslateX, stickerTranslateY, stickerRotate)
                      ]}
                    >
                      <TouchableOpacity onPress={handleToggleCVV}>
                        <Text style={styles.cvvStickerText}>AFc</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </View>
                <View style={styles.cardNameContainer}>
                  <Text style={[cardBackText, styles.cardNameText]}>IVAN IVANOV</Text>
                </View>
                {showCopied && (
                  <View style={styles.copiedNotification}>
                                      <View style={styles.copiedContainer}>
                    <Ionicons name="checkmark-circle" size={16} color="#fff" style={copiedIconStyle} />
                    <Text style={styles.copiedText}>Скопировано</Text>
                  </View>
                  </View>
                )}
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
            <View key={row} style={[styles.quickAmountsRow, quickAmountsRowWithLayout]}>
              {mockQuickAmounts.slice(row * 3, row * 3 + 3).map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickAmountButton,
                    dynamicStyles.quickAmountButton || {},
                    styles.quickAmountButtonLarge,
                    dynamicStyles.quickAmountButtonLarge || {},
                  ]}
                  onPress={() => { handleTopUp(amount); }}
                >
                  <Text style={[styles.quickAmountText, styles.quickAmountTextLarge, quickAmountTextWithTheme]}>{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Удалена секция кешбека */}
      </ScrollView>
      {/* Модальное окно пополнения */}
      <Modal
        visible={topUpModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setTopUpModalVisible(false)}
      >
        <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
          <View style={[styles.modalContainer, modalContainerWithTheme(currentColors)]}> 
            <Text style={[styles.modalTitle, modalTitleWithTheme(currentColors)]}>Пополнение баланса</Text>
            <Text style={[styles.modalLabel, modalLabelWithTheme(currentColors)]}>Сумма в AFc</Text>
            <TextInput
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              placeholder="Введите сумму"
              placeholderTextColor={currentColors.textSecondary}
              keyboardType="numeric"
              style={[styles.modalInput, modalInputWithTheme(currentColors)]}
            />
            <TouchableOpacity
              style={[styles.modalPayBtn, modalPayBtnWithTheme(currentColors)]}
              onPress={() => {
                Alert.alert(
                  'Подтверждение',
                  `Вы уверены, что хотите пополнить баланс на ${topUpAmount} AFc?`,
                  [
                    { text: 'Отмена', style: 'cancel' },
                    { text: 'Пополнить', onPress: handleFakeStripePayment }
                  ]
                );
              }}
            >
              <Text style={styles.modalPayBtnText}>Оплатить</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTopUpModalVisible(false)} style={styles.modalCancelBtn}>
              <Text style={[styles.modalCancelBtnText, modalCancelBtnTextWithTheme(currentColors)]}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BalanceScreen; 