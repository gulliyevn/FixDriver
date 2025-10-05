import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Modal,
  TextInput,
  Dimensions,
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClientScreenProps } from "../../types/navigation";
import {
  BalanceScreenStyles as styles,
  getBalanceScreenStyles,
  getBalanceScreenColors,
} from "../../styles/screens/profile/BalanceScreen.styles";
// mockQuickAmounts removed - using hardcoded values
const mockQuickAmounts = [10, 25, 50, 100, 200, 500];

import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../hooks/useI18n";
import { colors } from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createCVVStickAnimation } from "../../styles/animations";
import BalanceCardDecoration from "../../components/BalanceCardDecoration";
import BalanceTopUpHistory from "../../components/BalanceTopUpHistory";

import { usePackage } from "../../context/PackageContext";
import { useBalance } from "../../hooks/useBalance";
import {
  useDriverBalance,
  DriverBalanceContextType,
} from "../../hooks/driver/useDriverBalance";
import { useAuth } from "../../context/AuthContext";
import { formatBalance } from "../../utils/formatters";
import { getPackageIcon, getPackageColor } from "../../utils/packageVisuals";

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
} from "../../styles/screens/profile/BalanceScreen.styles";

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

type BalanceScreenProps = ClientScreenProps<"Balance"> ;

const BalanceScreen: React.FC<BalanceScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getBalanceScreenStyles(isDark);
  const balanceColors = getBalanceScreenColors(isDark);

  // Проверяем роль пользователя
  const isDriver = user?.role === "driver";

  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return t("client.balance.title"); // Одинаковый заголовок для обеих ролей
  };

  const getTopUpButtonText = () => {
    return isDriver ? t("client.balance.topUp") : t("client.balance.topUp");
  };

  const getTopUpModalTitle = () => {
    return isDriver ? t("client.balance.topUp") : t("client.balance.topUp");
  };

  // Цвета и стили для кнопок и карты
  const topUpBtnColor = currentColors.primary;
  const cashbackBtnColor = currentColors.success;
  const cardBg = currentColors.card;
  const flipIconColorValue = flipIconColor(isDark);
  const backIconColorValue = backIconColor(isDark);

  const CASHBACK_KEY = "user_cashback";
  const [cashback, setCashback] = useState("0");
  const { currentPackage } = usePackage();
  // Используем разные хуки для клиента и водителя
  const clientBalanceHook = useBalance();
  const driverBalanceHook = useDriverBalance();

  // Выбираем нужный хук в зависимости от роли
  const balanceHook = isDriver ? driverBalanceHook : clientBalanceHook;
  const userBalance = balanceHook?.balance ?? 0;

  // Для водителей показываем общую сумму (баланс + заработок)
  const totalBalance = isDriver
    ? userBalance + ((driverBalanceHook as DriverBalanceContextType)?.earnings ?? 0)
    : userBalance;
  const topUpBalance = isDriver
    ? (driverBalanceHook as DriverBalanceContextType)?.topUpBalance
    : clientBalanceHook?.topUpBalance;
  const withdrawBalance = isDriver
    ? (driverBalanceHook as DriverBalanceContextType).withdrawBalance
    : null;

  React.useEffect(() => {
    (async () => {
      const storedCashback = await AsyncStorage.getItem(CASHBACK_KEY);
      if (storedCashback !== null) setCashback(storedCashback);
    })();
    // Инициализируем анимацию быстрого пополнения в свернутом состоянии
    quickTopUpHeight.setValue(0);
  }, []);

  // Вместо flipAnim._value используем ref
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlippedRef = useRef(false);
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [quickTopUpModalVisible, setQuickTopUpModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

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
    outputRange: ["0deg", "90deg", "180deg"],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"],
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
    if (amount) {
      setTopUpAmount(amount);
    }
    // Не очищаем topUpAmount если amount не передан
    setTopUpModalVisible(true);
  };

  const handleWithdraw = (amount?: string) => {
    if (amount) {
      // Если передана сумма, сразу снимаем
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum) && amountNum > 0) {
        handleWithdrawAmount(amountNum);
      }
    } else {
      // Если сумма не передана, показываем диалог для ввода
      Alert.prompt(
        t("client.balance.withdraw"),
        t("client.balance.enterWithdrawAmount"),
        [
          { text: t("client.balance.cancel"), style: "cancel" },
          {
            text: t("client.balance.withdraw"),
            onPress: (inputAmount: string) => {
              if (inputAmount) {
                const amountNum = parseFloat(inputAmount);
                if (!isNaN(amountNum) && amountNum > 0) {
                  handleWithdrawAmount(amountNum);
                } else {
                  Alert.alert(
                    t("client.balance.error"),
                    t("client.balance.enterValidAmount"),
                  );
                }
              }
            },
          },
        ],
        "plain-text",
        "",
      );
    }
  };

  const handleWithdrawAmount = async (amount: number) => {
    // Проверяем минимальную сумму вывода
    if (amount < 20) {
      Alert.alert(
        t("client.balance.error"),
        t("client.balance.minimumWithdrawal"),
      );
      return;
    }

    if (withdrawBalance) {
      const success = await withdrawBalance(amount);
      if (success) {
        Alert.alert(
          t("client.balance.success"),
          t("client.balance.withdrawRequestSent", { 0: amount }),
        );
      } else {
        Alert.alert(
          t("client.balance.error"),
          t("client.balance.insufficientFunds"),
        );
      }
    }
  };

  const handleUseCashback = () => {
    const cashbackNum = parseFloat(cashback);

    if (cashbackNum < 20) {
      Alert.alert(
        t("client.balance.insufficientFunds"),
        t("client.balance.minimumWithdrawal"),
      );
      return;
    }

    if (isDriver && withdrawBalance) {
      // Для водителей - снятие средств
      Alert.alert(
        t("client.balance.withdraw"),
        t("client.balance.useCashbackConfirm"),
        [
          { text: t("client.balance.cancel"), style: "cancel" },
          {
            text: t("client.balance.yes"),
            onPress: async () => {
              const success = await withdrawBalance(cashbackNum);
              if (success) {
                setCashback("0");
                AsyncStorage.setItem(CASHBACK_KEY, "0");
                Alert.alert(
                  t("client.balance.success"),
                  "Withdrawal request submitted",
                );
              } else {
                Alert.alert(
                  t("client.balance.error"),
                  "Insufficient funds for withdrawal",
                );
              }
            },
          },
        ],
      );
    } else {
      // Для клиентов - использование cashback
      Alert.alert(
        t("client.balance.useCashback"),
        t("client.balance.useCashbackConfirm"),
        [
          { text: t("client.balance.cancel"), style: "cancel" },
          {
            text: t("client.balance.yes"),
            onPress: async () => {
              try {
                await topUpBalance(cashbackNum);
                setCashback("0");
                AsyncStorage.setItem(CASHBACK_KEY, "0");
                Alert.alert(
                  t("client.balance.success"),
                  t("client.balance.cashbackAdded", { 0: cashbackNum }),
                );
              } catch (error) {
                Alert.alert(
                  t("client.balance.error"),
                  "Failed to use cashback",
                );
              }
            },
          },
        ],
      );
    }
  };

  const screenWidth = Dimensions.get("window").width;

  // История транзакций теперь управляется через BalanceContext

  const handleFakeStripePayment = async () => {
    const amountNum = parseFloat(topUpAmount.replace(",", "."));
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert(
        t("client.balance.error"),
        t("client.balance.enterValidAmount"),
      );
      return;
    }

    // Для всех - пополнение
    try {
      await topUpBalance(amountNum);
      setTopUpModalVisible(false);
      Alert.alert(
        t("client.balance.paymentSuccess"),
        t("client.balance.balanceToppedUp", { 0: amountNum }),
      );
    } catch (error) {
      Alert.alert(t("client.balance.error"), "Failed to top up balance");
    }
  };

  const [showCopied, setShowCopied] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const cvvOpacity = useRef(new Animated.Value(0)).current;
  const stickerOpacity = useRef(new Animated.Value(1)).current;
  const stickerTranslateX = useRef(new Animated.Value(0)).current;
  const stickerTranslateY = useRef(new Animated.Value(0)).current;
  const stickerRotate = useRef(new Animated.Value(0)).current;
  const quickTopUpHeight = useRef(new Animated.Value(0)).current;

  const handleCopyCardNumber = async () => {
    try {
      await Clipboard.setString("9876 5432 1098 7654");
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      // Ошибка копирования - молча игнорируем
    }
  };

  const handleToggleCVV = () => {
    createCVVStickAnimation(
      {
        cvvOpacity,
        stickerOpacity,
        stickerTranslateX,
        stickerTranslateY,
        stickerRotate,
      },
      setShowCVV,
    )(showCVV);
  };


  return (
    <View style={[styles.container, balanceColors.container]}>
      <View style={[styles.header, balanceColors.header]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={backIconColorValue} />
        </TouchableOpacity>
        <Text style={[styles.title, balanceColors.title]}>
          {getScreenTitle()}
        </Text>
        <View
          style={[
            styles.backButton,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <TouchableOpacity onPress={() => setQuickTopUpModalVisible(true)}>
            <Ionicons
              name="flash"
              size={24}
              color={currentColors.primary}
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>
          <Ionicons
            name={getPackageIcon(currentPackage) as any}
            size={24}
            color={getPackageColor(currentPackage)}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Основной баланс с анимацией */}
        <View style={mainBalanceContainer}>
          <View style={cardContainerWithDynamicWidth(screenWidth)}>
            {/* Front side - всегда в DOM */}
            <Animated.View
              style={[
                styles.balanceCard,
                styles.balanceCardBorder,
                {
                  ...dynamicStyles.balanceCard,
                  ...balanceCardWithTheme(currentColors, isDark),
                },
                balanceCardAnimated,
                animatedCardFront,
                {
                  transform: [{ rotateY: frontInterpolate }],
                  opacity: frontOpacity,
                },
              ]}
            >
              {/* Декорация в верхней части карты */}
              <BalanceCardDecoration
                isDark={isDark}
                packageType={currentPackage}
              />
              <View style={balanceCardFrontRow}>
                <View>
                  <Text style={styles.balanceLabel}>
                    {isDriver
                      ? "Total Balance"
                      : t("client.balance.currentBalance")}
                  </Text>
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceAmount}>
                      {formatBalance(totalBalance)}
                    </Text>
                    {!String(totalBalance).includes("AFc") && (
                      <Text style={styles.balanceCurrency}>AFc</Text>
                    )}
                  </View>
                  <Text style={cashbackText}>
                    {isDriver
                      ? `Balance: ${formatBalance(userBalance)} | Earnings: ${formatBalance((driverBalanceHook as DriverBalanceContextType).earnings)}`
                      : "FixCash: " + cashback + " AFc"}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleFlip} style={flipButtonFront}>
                  <Ionicons
                    name="swap-horizontal"
                    size={32}
                    color={flipIconColorValue}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.balanceActions, balanceActionsMargin]}>
                <TouchableOpacity
                  style={[
                    styles.cardFrontButton,
                    cardFrontButtonWithTheme(cardBg, topUpBtnColor),
                  ]}
                  onPress={() => (isDriver ? handleTopUp() : handleTopUp())}
                >
                  <Ionicons name="add-circle" size={24} color={topUpBtnColor} />
                  <Text
                    style={[
                      styles.cardFrontBtnText,
                      cardFrontBtnTextWithColor(topUpBtnColor),
                    ]}
                  >
                    {getTopUpButtonText()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.cardFrontButton2,
                    cardFrontButton2WithTheme(cardBg, cashbackBtnColor),
                  ]}
                  onPress={() =>
                    isDriver ? handleWithdraw() : handleUseCashback
                  }
                >
                  <Ionicons
                    name={isDriver ? "card" : "gift"}
                    size={24}
                    color={cashbackBtnColor}
                  />
                  <Text
                    style={[
                      styles.cardFrontBtnText,
                      cardFrontBtnTextWithColor(cashbackBtnColor),
                    ]}
                  >
                    {isDriver ? t("client.balance.withdraw") : "FixCash"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            {/* Back side - всегда в DOM */}
            <Animated.View
              style={[
                styles.balanceCard,
                styles.balanceCardBorder,
                {
                  ...dynamicStyles.balanceCard,
                  ...balanceCardWithTheme(currentColors, isDark),
                },
                balanceCardAnimated,
                animatedCardBack,
                {
                  transform: [{ rotateY: backInterpolate }],
                  opacity: backOpacity,
                },
              ]}
            >
              {/* Декорация обратной стороны карты */}
              <BalanceCardDecoration
                isDark={isDark}
                packageType={currentPackage}
                isBackSide={true}
              />
              <View style={balanceCardBack}>
                <View style={styles.cardBackBtnContainer}>
                  <TouchableOpacity onPress={handleFlip} style={flipButtonBack}>
                    <Ionicons
                      name="swap-horizontal"
                      size={32}
                      color={flipIconColorValue}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[cardBackText, styles.cardBackTextCenter]}>
                  DIGITAL AFc CARD
                </Text>
                <View style={styles.cardNumberContainer}>
                  <Text
                    style={[cardBackText, styles.cardNumberText]}
                    numberOfLines={1}
                  >
                    9876 5432 1098 7654
                  </Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={handleCopyCardNumber}
                  >
                    <Ionicons name="copy-outline" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardDetailsContainer}>
                  <Text style={[cardBackText, styles.cardDetailsText]}>
                    12/25
                  </Text>
                  <View style={styles.cvvContainer}>
                    <TouchableOpacity onPress={handleToggleCVV}>
                      <Animated.Text
                        style={[
                          cardBackText,
                          styles.cardDetailsText,
                          cvvTextWithOpacity(cvvOpacity),
                        ]}
                      >
                        123
                      </Animated.Text>
                    </TouchableOpacity>
                    <Animated.View
                      style={[
                        styles.cvvSticker,
                        cvvStickerWithAnimation(
                          stickerOpacity,
                          stickerTranslateX,
                          stickerTranslateY,
                          stickerRotate,
                        ),
                      ]}
                    >
                      <TouchableOpacity onPress={handleToggleCVV}>
                        <Text style={styles.cvvStickerText}>AFc</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </View>
                <View style={styles.cardNameContainer}>
                  {}
                  <Text style={[cardBackText, styles.cardNameText]}>
                    IVAN IVANOV
                  </Text>
                </View>
                {showCopied && (
                  <View style={styles.copiedNotification}>
                    <View style={styles.copiedContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#fff"
                        style={copiedIconStyle}
                      />
                      <Text style={styles.copiedText}>
                        {t("client.balance.copied")}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </Animated.View>
            {/* Spacer для высоты */}
            <View style={cardSpacer} />
          </View>
        </View>

        {/* История пополнений */}
        <BalanceTopUpHistory maxItems={5} />
      </ScrollView>
      {/* Модальное окно пополнения */}
      <Modal
        visible={topUpModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setTopUpModalVisible(false)}
      >
        <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
          <View
            style={[
              styles.modalContainer,
              modalContainerWithTheme(currentColors),
            ]}
          >
            <Text
              style={[styles.modalTitle, modalTitleWithTheme(currentColors)]}
            >
              {getTopUpModalTitle()}
            </Text>
            <Text
              style={[styles.modalLabel, modalLabelWithTheme(currentColors)]}
            >
              {t("client.balance.amountInAFc")}
            </Text>
            <TextInput
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              placeholder={t("client.balance.enterAmount")}
              placeholderTextColor={currentColors.textSecondary}
              keyboardType="numeric"
              style={[styles.modalInput, modalInputWithTheme(currentColors)]}
            />
            <TouchableOpacity
              style={[styles.modalPayBtn, modalPayBtnWithTheme(currentColors)]}
              onPress={() => {
                Alert.alert(
                  t("client.balance.confirm"),
                  t("client.balance.confirmTopUp", { 0: topUpAmount }),
                  [
                    { text: t("client.balance.cancel"), style: "cancel" },
                    {
                      text: t("client.balance.topUpBalance"),
                      onPress: handleFakeStripePayment,
                    },
                  ],
                );
              }}
            >
              <Text style={styles.modalPayBtnText}>
                {isDriver
                  ? t("client.balance.payButton")
                  : t("client.balance.payButton")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTopUpModalVisible(false)}
              style={styles.modalCancelBtn}
            >
              <Text
                style={[
                  styles.modalCancelBtnText,
                  modalCancelBtnTextWithTheme(currentColors),
                ]}
              >
                {t("client.balance.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модальное окно быстрого пополнения */}
      <Modal
        visible={quickTopUpModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setQuickTopUpModalVisible(false)}
      >
        <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
          <View
            style={[
              styles.modalContainer,
              modalContainerWithTheme(currentColors),
            ]}
          >
            <Text
              style={[styles.modalTitle, modalTitleWithTheme(currentColors)]}
            >
              {t("client.balance.quickTopUp")}
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              {mockQuickAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickAmountButtonLarge,
                    dynamicStyles.quickAmountButtonLarge,
                    { width: "48%", marginBottom: 12 },
                  ]}
                  onPress={() => {
                    setTopUpAmount(amount.toString());
                    setQuickTopUpModalVisible(false);
                    setTopUpModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.quickAmountTextLarge,
                      dynamicStyles.quickAmountTextLarge,
                    ]}
                  >
                    {amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setQuickTopUpModalVisible(false)}
              style={styles.modalCancelBtn}
            >
              <Text
                style={[
                  styles.modalCancelBtnText,
                  modalCancelBtnTextWithTheme(currentColors),
                ]}
              >
                {t("client.balance.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BalanceScreen;
