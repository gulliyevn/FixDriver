import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import {
  PaymentHistoryFilterStyles as styles,
  getPaymentHistoryFilterStyles,
} from "../styles/components/PaymentHistoryFilter.styles";

export interface PaymentFilter {
  type:
    | "all"
    | "trip"
    | "topup"
    | "refund"
    | "fee"
    | "package_purchase"
    | "subscription_renewal"
    | "withdrawal"
    | "earnings";
  status: "all" | "completed" | "pending" | "failed";
  dateRange: "all" | "today" | "week" | "month" | "year";
}

interface PaymentHistoryFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: PaymentFilter) => void;
  currentFilter: PaymentFilter;
}

const PaymentHistoryFilter: React.FC<PaymentHistoryFilterProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const dynamicStyles = getPaymentHistoryFilterStyles(isDark);
  const [filter, setFilter] = useState<PaymentFilter>(currentFilter);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isDriver = user?.role === "driver";

  const paymentTypes = [
    {
      key: "all",
      label: t("client.paymentHistory.filter.allTypes"),
      icon: "list",
    },
    {
      key: "trip",
      label: t("client.paymentHistory.filter.trips"),
      icon: "car",
    },
    {
      key: "topup",
      label: t("client.paymentHistory.filter.topups"),
      icon: "add-circle",
    },
    {
      key: "refund",
      label: t("client.paymentHistory.filter.refunds"),
      icon: "refresh-circle",
    },
    { key: "fee", label: t("client.paymentHistory.filter.fees"), icon: "card" },
    {
      key: "package_purchase",
      label: t("client.paymentHistory.filter.packages"),
      icon: "cube",
    },
    {
      key: "subscription_renewal",
      label: t("client.paymentHistory.filter.subscriptions"),
      icon: "refresh",
    },
    ...(isDriver
      ? [
          {
            key: "withdrawal",
            label: t("driver.balance.transactions.withdrawal"),
            icon: "cash",
          },
          {
            key: "earnings",
            label: t("driver.balance.transactions.earnings"),
            icon: "trending-up",
          },
        ]
      : []),
  ];

  const statuses = [
    {
      key: "all",
      label: t("client.paymentHistory.filter.allStatuses"),
      icon: "checkmark-circle",
    },
    {
      key: "completed",
      label: t("client.paymentHistory.status.completed"),
      icon: "checkmark-circle",
    },
    {
      key: "pending",
      label: t("client.paymentHistory.status.pending"),
      icon: "time",
    },
    {
      key: "failed",
      label: t("client.paymentHistory.status.failed"),
      icon: "close-circle",
    },
  ];

  const dateRanges = [
    {
      key: "all",
      label: t("client.paymentHistory.filter.allTime"),
      icon: "calendar",
    },
    {
      key: "today",
      label: t("client.paymentHistory.filter.today"),
      icon: "today",
    },
    {
      key: "week",
      label: t("client.paymentHistory.filter.thisWeek"),
      icon: "calendar-outline",
    },
    {
      key: "month",
      label: t("client.paymentHistory.filter.thisMonth"),
      icon: "calendar",
    },
    {
      key: "year",
      label: t("client.paymentHistory.filter.thisYear"),
      icon: "calendar",
    },
  ];

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  // Инициализация анимации
  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(1);
    }
  }, []);

  // Анимация появления/скрытия
  useEffect(() => {
    if (visible) {
      // Затемнение появляется сразу
      fadeAnim.setValue(1);
      // Модальное окно слайдится снизу вверх
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
    } else {
      // Модальное окно слайдится сверху вниз
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        fadeAnim.setValue(0);
      });
    }
  }, [visible, fadeAnim, slideAnim]);

  const handleReset = () => {
    const resetFilter: PaymentFilter = {
      type: "all",
      status: "all",
      dateRange: "all",
    };
    setFilter(resetFilter);
    onApply(resetFilter);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            dynamicStyles.modalContainer,
            styles.animatedModalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, dynamicStyles.title]}>
              {t("client.paymentHistory.filter.title")}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={24}
                color={dynamicStyles.title.color}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Тип платежа */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                {t("client.paymentHistory.filter.paymentType")}
              </Text>
              {paymentTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.optionContainer,
                    filter.type === type.key
                      ? [
                          styles.optionContainerSelected,
                          dynamicStyles.optionContainerSelected,
                        ]
                      : styles.optionContainerUnselected,
                  ]}
                  onPress={() => setFilter({ ...filter, type: type.key as PaymentFilter["type"] })}
                >
                  <Ionicons
                    name={type.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={
                      filter.type === type.key
                        ? dynamicStyles.optionTextSelected.color
                        : "#888"
                    }
                    style={styles.optionIcon}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      filter.type === type.key
                        ? dynamicStyles.optionTextSelected
                        : dynamicStyles.optionTextUnselected,
                    ]}
                  >
                    {type.label}
                  </Text>
                  {filter.type === type.key && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={dynamicStyles.optionTextSelected.color}
                      style={styles.checkmark}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Статус */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                {t("client.paymentHistory.filter.status")}
              </Text>
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status.key}
                  style={[
                    styles.optionContainer,
                    filter.status === status.key
                      ? [
                          styles.optionContainerSelected,
                          dynamicStyles.optionContainerSelected,
                        ]
                      : styles.optionContainerUnselected,
                  ]}
                  onPress={() => setFilter({ ...filter, status: status.key as PaymentFilter["status"] })}
                >
                  <Ionicons
                    name={status.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={
                      filter.status === status.key
                        ? dynamicStyles.optionTextSelected.color
                        : "#888"
                    }
                    style={styles.optionIcon}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      filter.status === status.key
                        ? dynamicStyles.optionTextSelected
                        : dynamicStyles.optionTextUnselected,
                    ]}
                  >
                    {status.label}
                  </Text>
                  {filter.status === status.key && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={dynamicStyles.optionTextSelected.color}
                      style={styles.checkmark}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Период */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                {t("client.paymentHistory.filter.period")}
              </Text>
              {dateRanges.map((range) => (
                <TouchableOpacity
                  key={range.key}
                  style={[
                    styles.optionContainer,
                    filter.dateRange === range.key
                      ? [
                          styles.optionContainerSelected,
                          dynamicStyles.optionContainerSelected,
                        ]
                      : styles.optionContainerUnselected,
                  ]}
                  onPress={() => setFilter({ ...filter, dateRange: range.key as PaymentFilter["dateRange"] })}
                >
                  <Ionicons
                    name={range.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={
                      filter.dateRange === range.key
                        ? dynamicStyles.optionTextSelected.color
                        : "#888"
                    }
                    style={styles.optionIcon}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      filter.dateRange === range.key
                        ? dynamicStyles.optionTextSelected
                        : dynamicStyles.optionTextUnselected,
                    ]}
                  >
                    {range.label}
                  </Text>
                  {filter.dateRange === range.key && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={dynamicStyles.optionTextSelected.color}
                      style={styles.checkmark}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Кнопки */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.resetButton, dynamicStyles.resetButton]}
              onPress={handleReset}
            >
              <Text
                style={[styles.resetButtonText, dynamicStyles.resetButtonText]}
              >
                {t("client.paymentHistory.filter.reset")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, dynamicStyles.applyButton]}
              onPress={handleApply}
            >
              <Text
                style={[styles.applyButtonText, dynamicStyles.applyButtonText]}
              >
                {t("client.paymentHistory.filter.apply")}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default PaymentHistoryFilter;
