import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { ClientScreenProps } from "../../types/navigation";
import {
  CardsScreenStyles as styles,
  getCardsScreenStyles,
} from "../../styles/screens/profile/CardsScreen.styles";
import { colors } from "../../constants/colors";
import { Card } from "../../services/cardService";
import VisaIcon from "../../components/VisaIcon";
import MastercardIcon from "../../components/MastercardIcon";
import { useI18n } from "../../hooks/useI18n";
import { useCards } from "../../hooks/useCards";
import { CardService } from "../../services/cardService";

// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// const requestCameraPermission = async () => {
//   const perm = Platform.OS === 'ios'
//     ? PERMISSIONS.IOS.CAMERA
//     : PERMISSIONS.ANDROID.CAMERA;
//   let result = await check(perm);
//   if (result !== RESULTS.GRANTED) {
//     result = await request(perm);
//   }
//   return result === RESULTS.GRANTED;
// };

const handleScanCard = async () => {
  // Временно для Expo Go - просто показываем алерт
  Alert.alert(
    "Сканер карт",
    "Функция сканирования карт будет доступна в продакшн версии приложения.",
    [{ text: "OK" }],
  );

  // Код для продакшн билда (раскомментировать после сборки):
  // const granted = await requestCameraPermission();
  // if (!granted) {
  //   Alert.alert('Нет доступа к камере', 'Для сканирования карты разрешите доступ к камере в настройках.');
  //   return;
  // }
  // try {
  //   // Сканирование карты временно отключено
  //   // const card = await startScanner();
  //   // if (card && card.cardNumber) {
  //   //   setNewCard(prev => ({ ...prev, number: card.cardNumber }));
  //   // }
  // } catch (e) {
  //   // пользователь отменил или ошибка
  // }
};

// Универсальный тип для навигации
type CardsScreenProps = ClientScreenProps<"Cards"> ;

const CardsScreen: React.FC<CardsScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const dynamicStyles = getCardsScreenStyles(isDark);
  const currentColors = isDark ? colors.dark : colors.light;
  // const [cards, setCards] = useState<Card[]>([]); // Заменено на useCards
  const {
    cards,
    addCard: addCardToHook,
    deleteCard: deleteCardFromHook,
  } = useCards();
  const [defaultCardId, setDefaultCardId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({
    holderName: "",
    number: "",
    expiry: "",
    type: "visa",
    cvv: "",
  });

  // Валидация
  const [errors, setErrors] = useState({
    holderName: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  // Определяем роль пользователя
  const isDriver = user?.role === "driver";

  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? "Карты для выплат" : t("components.cards.title");
  };

  const getEmptyStateText = () => {
    return isDriver
      ? "Добавьте карту для получения выплат"
      : t("components.cards.emptyDescription");
  };

  const getAddCardButtonText = () => {
    return isDriver ? "Добавить карту для выплат" : t("components.cards.add");
  };

  useEffect(() => {
    (async () => {
      // Теперь карты загружает useCards автоматически
      // Осталось только загрузить карту по умолчанию
      const def = cards.find((c) => c.isDefault);
      setDefaultCardId(def ? def.id : null);
    })();
  }, [cards]); // Зависимость от cards из useCards

  useEffect(() => {
    if (showAddModal) {
      handleScanCard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddModal]);

  // Определение типа карты по номеру
  const getCardType = (number: string): "visa" | "mastercard" => {
    const digits = number.replace(/\D/g, "");
    if (digits.startsWith("4")) return "visa";
    if (digits.startsWith("5")) return "mastercard";
    if (digits.startsWith("34") || digits.startsWith("37")) return "visa"; // American Express (но показываем как Visa)
    if (digits.startsWith("6")) return "mastercard"; // Discover (но показываем как Mastercard)
    return "visa"; // по умолчанию
  };

  const getCardErrors = () => {
    const newErrors = { holderName: "", number: "", expiry: "", cvv: "" };
    if (!newCard.holderName || newCard.holderName.trim().length < 2) {
      newErrors.holderName = t("components.cards.holderError");
    }
    if (!/^([0-9]{4} ){3}[0-9]{4}$/.test(newCard.number)) {
      newErrors.number = t("components.cards.numberError");
    }
    if (!/^\d{2}\/\d{2}$/.test(newCard.expiry)) {
      newErrors.expiry = t("components.cards.expiryError");
    } else {
      const [mm, yy] = newCard.expiry.split("/").map(Number);
      const now = new Date();
      const curYear = now.getFullYear() % 100;
      const curMonth = now.getMonth() + 1;
      if (mm < 1 || mm > 12) {
        newErrors.expiry = t("components.cards.expiryMonthError");
      } else if (yy < curYear || (yy === curYear && mm < curMonth)) {
        newErrors.expiry = t("components.cards.expiryPastError");
      }
    }
    if (!/^\d{3,4}$/.test(newCard.cvv)) {
      newErrors.cvv = t("components.cards.cvvError");
    }
    return newErrors;
  };

  const isCardValid = () => {
    const errs = getCardErrors();
    return !errs.holderName && !errs.number && !errs.expiry && !errs.cvv;
  };

  const handleAddCard = async () => {
    setShowAddModal(true);
  };

  const handleSaveCard = async () => {
    const errs = getCardErrors();
    setErrors(errs);
    if (errs.holderName || errs.number || errs.expiry || errs.cvv) {
      return;
    }
    const id = Date.now().toString();
    const lastFour = newCard.number.slice(-4);
    const cardType = getCardType(newCard.number);
    const newCardData: Card = {
      id,
      holderName: newCard.holderName,
      last4: lastFour,
      type: "card" as const,
      expiryMonth: parseInt(newCard.expiry.split("/")[0]),
      expiryYear: parseInt(newCard.expiry.split("/")[1]),
      brand:
        cardType === "visa"
          ? "Visa"
          : cardType === "mastercard"
            ? "Mastercard"
            : "Visa",
      isDefault: cards.length === 0, // Если это первая карта, делаем её по умолчанию
    };
    // Используем универсальный хук
    const success = await addCardToHook(newCardData);
    if (!success) {
      Alert.alert(t("common.error"), t("cards.addError"));
      return;
    }

    // Если это первая карта, устанавливаем её как карту по умолчанию
    if (cards.length === 1) {
      // Теперь карта уже добавлена
      await CardService.setDefault(id, "current_user_id");
    }
    setDefaultCardId(newCardData.isDefault ? id : defaultCardId);
    setShowAddModal(false);
    setNewCard({
      holderName: "",
      number: "",
      expiry: "",
      type: "visa",
      cvv: "",
    });
    setErrors({ holderName: "", number: "", expiry: "", cvv: "" });
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewCard({
      holderName: "",
      number: "",
      expiry: "",
      type: "visa",
      cvv: "",
    });
  };

  const handleDeleteCard = async (cardId: string) => {
    Alert.alert(
      t("components.cards.delete"),
      t("components.cards.deleteConfirm"),
      [
        { text: t("components.cards.cancel"), style: "cancel" },
        {
          text: t("components.cards.delete"),
          style: "destructive",
          onPress: async () => {
            const success = await deleteCardFromHook(cardId);
            if (!success) {
              Alert.alert(t("common.error"), t("cards.deleteError"));
              return;
            }
            if (defaultCardId === cardId) {
              if (cards.length > 1) {
                const newDefaultId = cards.find((c) => c.id !== cardId)?.id;
                if (newDefaultId) {
                  await CardService.setDefault(newDefaultId, "current_user_id");
                  setDefaultCardId(newDefaultId);
                }
              } else {
                setDefaultCardId(null);
              }
            }
          },
        },
      ],
    );
  };

  const handleSetDefault = async (cardId: string) => {
    await CardService.setDefault(cardId, "current_user_id");
    setDefaultCardId(cardId);
  };

  const getCardColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "visa":
        return isDark ? "#60A5FA" : "#1a1f71"; // фирменный синий Visa
      case "mastercard":
        return isDark ? "#FBBF24" : "#eb001b"; // фирменный цвет Mastercard
      default:
        return currentColors.primary;
    }
  };

  const handleCardNumberChange = (text: string) => {
    // Удаляем все нецифровые символы
    const digits = text.replace(/\D/g, "");
    // Ограничиваем до 16 цифр
    const limited = digits.slice(0, 16);
    // Форматируем в группы по 4 цифры
    let formatted = "";
    for (let i = 0; i < limited.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += limited[i];
    }
    // Определяем тип карты на основе номера
    const cardType = getCardType(formatted);
    setNewCard((prev) => ({ ...prev, number: formatted, type: cardType }));
  };

  const handleExpiryChange = (v: string) => {
    let digits = v.replace(/\D/g, "");
    digits = digits.slice(0, 4);
    let formatted = "";
    if (digits.length > 0) {
      let mm = digits.slice(0, 2);
      if (mm.length === 1 && parseInt(mm) > 1) mm = "0" + mm;
      if (mm.length === 2) {
        let m = parseInt(mm, 10);
        if (m < 1) mm = "01";
        if (m > 12) mm = "12";
      }
      formatted = mm;
      if (digits.length > 2) {
        formatted += "/";
        let yy = digits.slice(2, 4);
        const now = new Date();
        const curYear = now.getFullYear() % 100;
        let y = parseInt(yy, 10);
        if (yy.length === 2 && y < curYear) yy = curYear.toString();
        formatted += yy;
      }
    }
    setNewCard((c) => ({ ...c, expiry: formatted }));
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>
          {getScreenTitle()}
        </Text>
        <TouchableOpacity onPress={handleAddCard} style={styles.addButton}>
          <Ionicons name="add" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </View>

      {/* Модальное окно добавления карты */}
      <Modal
        visible={showAddModal}
        animationType="fade"
        transparent
        onRequestClose={handleCancelAdd}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, dynamicStyles.modalContainer]}>
            <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
              {t("components.cards.addTitle")}
            </Text>
            <TextInput
              placeholder={t("components.cards.holderPlaceholder")}
              placeholderTextColor={currentColors.textSecondary}
              value={newCard.holderName}
              onChangeText={(v) => setNewCard((c) => ({ ...c, holderName: v }))}
              style={[styles.input, dynamicStyles.input]}
            />
            {!!errors.holderName && (
              <Text style={[styles.errorText, dynamicStyles.errorText]}>
                {t("components.cards.holderError")}
              </Text>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t("components.cards.numberPlaceholder")}
                placeholderTextColor={currentColors.textSecondary}
                value={newCard.number}
                onChangeText={handleCardNumberChange}
                style={[
                  styles.input,
                  styles.inputWithIcon,
                  dynamicStyles.input,
                ]}
                keyboardType="numeric"
                maxLength={19}
              />
              <TouchableOpacity
                onPress={handleScanCard}
                style={styles.scanButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="scan-outline"
                  size={22}
                  color={currentColors.primary}
                />
              </TouchableOpacity>
              {/* Индикатор типа карты */}
              {newCard.number.length > 0 && (
                <View style={styles.cardTypeIndicator}>
                  {newCard.type === "visa" ? (
                    <VisaIcon width={24} height={24} />
                  ) : newCard.type === "mastercard" ? (
                    <MastercardIcon width={24} height={24} />
                  ) : null}
                </View>
              )}
            </View>
            {!!errors.number && (
              <Text style={[styles.errorText, dynamicStyles.errorText]}>
                {t("components.cards.numberError")}
              </Text>
            )}
            <View style={styles.inputRow}>
              <TextInput
                placeholder={t("components.cards.expiryPlaceholder")}
                placeholderTextColor={currentColors.textSecondary}
                value={newCard.expiry}
                onChangeText={handleExpiryChange}
                style={[
                  styles.input,
                  styles.inputFlex,
                  dynamicStyles.inputFlex,
                ]}
                keyboardType="numeric"
                maxLength={5}
              />
              <TextInput
                placeholder={t("components.cards.cvvPlaceholder")}
                placeholderTextColor={currentColors.textSecondary}
                value={newCard.cvv || ""}
                onChangeText={(v) =>
                  setNewCard((c) => ({ ...c, cvv: v.replace(/[^0-9]/g, "") }))
                }
                maxLength={4}
                keyboardType="number-pad"
                secureTextEntry
                style={[
                  styles.input,
                  styles.inputFlex,
                  dynamicStyles.inputFlex,
                ]}
              />
            </View>
            <View style={styles.errorRow}>
              <View style={styles.errorContainer}>
                {!!errors.expiry && (
                  <Text style={[styles.errorText, dynamicStyles.errorText]}>
                    {errors.expiry}
                  </Text>
                )}
              </View>
              <View style={styles.errorContainer}>
                {!!errors.cvv && (
                  <Text style={[styles.errorText, dynamicStyles.errorText]}>
                    {t("components.cards.cvvError")}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleCancelAdd}
                style={[
                  styles.modalButton,
                  styles.modalButtonCancel,
                  dynamicStyles.modalButtonCancel,
                ]}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    dynamicStyles.modalButtonText,
                  ]}
                >
                  {t("components.cards.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveCard}
                style={[
                  styles.modalButton,
                  styles.modalButtonSave,
                  !isCardValid() && styles.modalButtonDisabled,
                  isCardValid()
                    ? dynamicStyles.modalButtonSave
                    : dynamicStyles.modalButtonSaveDisabled,
                ]}
                disabled={!isCardValid()}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    isCardValid()
                      ? dynamicStyles.modalButtonTextSave
                      : dynamicStyles.modalButtonTextSaveDisabled,
                  ]}
                >
                  {t("components.cards.save")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color="#ccc" />
            <Text style={[styles.emptyTitle, dynamicStyles.emptyTitle]}>
              {t("components.cards.empty")}
            </Text>
            <Text
              style={[styles.emptyDescription, dynamicStyles.emptyDescription]}
            >
              {getEmptyStateText()}
            </Text>
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={handleAddCard}
            >
              <Text style={styles.addCardButtonText}>
                {getAddCardButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cards.map((card) => (
              <View
                key={card.id}
                style={[styles.cardItem, dynamicStyles.cardItem]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    {card.type.toLowerCase() === "visa" ? (
                      <VisaIcon width={32} height={32} />
                    ) : card.type.toLowerCase() === "mastercard" ? (
                      <MastercardIcon width={32} height={32} />
                    ) : (
                      <Ionicons
                        name={"card"}
                        size={32}
                        color={getCardColor(card.type)}
                      />
                    )}
                    <View style={styles.cardDetails}>
                      <Text style={[styles.cardName, dynamicStyles.cardName]}>
                        {card.holderName}
                      </Text>
                      <View style={styles.cardNumberRow}>
                        <Text
                          style={[styles.cardNumber, dynamicStyles.cardNumber]}
                        >
                          •••• {card.last4 || "****"}
                        </Text>
                        <Text
                          style={[
                            styles.cardExpiry,
                            dynamicStyles.cardExpiry,
                            styles.cardExpiryWithMargin,
                          ]}
                        >
                          {" "}
                          {card.expiryMonth
                            ? `${card.expiryMonth.toString().padStart(2, "0")}/${card.expiryYear}`
                            : "**/**"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.defaultButton,
                          card.id === defaultCardId
                            ? dynamicStyles.defaultButton
                            : dynamicStyles.defaultButtonInactive,
                        ]}
                        onPress={() => handleSetDefault(card.id)}
                        disabled={card.id === defaultCardId}
                      >
                        <Text
                          style={[
                            styles.defaultButtonText,
                            card.id === defaultCardId
                              ? dynamicStyles.defaultButtonText
                              : dynamicStyles.defaultButtonTextInactive,
                          ]}
                        >
                          {t("components.cards.default")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      handleDeleteCard(card.id);
                    }}
                    style={styles.deleteButton}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={currentColors.error}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardFooter}></View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default CardsScreen;
