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
import { useI18n } from "../hooks/useI18n";
import {
  TripsFilterStyles as styles,
  getTripsFilterStyles,
} from "../styles/components/TripsFilter.styles";

export interface TripFilter {
  status: "all" | "completed" | "cancelled" | "scheduled";
  dateRange: "all" | "today" | "week" | "month" | "year";
}

interface TripsFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: TripFilter) => void;
  currentFilter: TripFilter;
}

const TripsFilter: React.FC<TripsFilterProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getTripsFilterStyles(isDark);
  const [filter, setFilter] = useState<TripFilter>({
    status: currentFilter.status,
    dateRange: currentFilter.dateRange,
  });

  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Инициализация анимации
  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(1);
    }
  }, [fadeAnim, visible]);

  const statuses = [
    {
      key: "all",
      label: t("client.trips.filter.allStatuses"),
      icon: "checkmark-circle",
    },
    {
      key: "completed",
      label: t("client.trips.status.completed"),
      icon: "checkmark-circle",
    },
    {
      key: "cancelled",
      label: t("client.trips.status.cancelled"),
      icon: "close-circle",
    },
    {
      key: "scheduled",
      label: t("client.trips.status.scheduled"),
      icon: "time",
    },
  ];

  const dateRanges = [
    { key: "all", label: t("client.trips.filter.allTime"), icon: "calendar" },
    { key: "today", label: t("client.trips.filter.today"), icon: "today" },
    {
      key: "week",
      label: t("client.trips.filter.thisWeek"),
      icon: "calendar-outline",
    },
    {
      key: "month",
      label: t("client.trips.filter.thisMonth"),
      icon: "calendar",
    },
    { key: "year", label: t("client.trips.filter.thisYear"), icon: "calendar" },
  ];

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

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
    const resetFilter: TripFilter = {
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
              {t("client.trips.filter.title")}
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
            {/* Статус */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                {t("client.trips.filter.status")}
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
                  onPress={() => setFilter({ ...filter, status: status.key as TripFilter["status"] })}
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
                {t("client.trips.filter.period")}
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
                  onPress={() => setFilter({ ...filter, dateRange: range.key as TripFilter["dateRange"] })}
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
                {t("client.trips.filter.reset")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, dynamicStyles.applyButton]}
              onPress={handleApply}
            >
              <Text
                style={[styles.applyButtonText, dynamicStyles.applyButtonText]}
              >
                {t("client.trips.filter.apply")}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default TripsFilter;
