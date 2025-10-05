import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../hooks/useI18n";

type EarningsHeaderProps = {
  styles: Record<string, any>;
  isDark: boolean;
  filterExpandAnim: Animated.Value;
  onToggleFilter: () => void;
  selectedPeriod: "today" | "week" | "month" | "year";
  onPeriodSelect: (period: "today" | "week" | "month" | "year") => void;
  isOnline: boolean;
  onStatusChange: () => void;
};

const EarningsHeader: React.FC<EarningsHeaderProps> = ({
  styles,
  isDark,
  filterExpandAnim,
  onToggleFilter,
  selectedPeriod,
  onPeriodSelect,
  isOnline,
  onStatusChange,
}) => {
  const { t } = useI18n();

  const periodOptions = [
    { key: "today", label: t("driver.earnings.today"), icon: "time" },
    { key: "week", label: t("driver.earnings.week"), icon: "today" },
    { key: "month", label: t("driver.earnings.month"), icon: "calendar" },
    { key: "year", label: t("driver.earnings.year"), icon: "calendar-outline" },
  ] as const;

  return (
    <Animated.View
      style={[
        styles.header,
        {
          paddingTop: filterExpandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 16],
          }),
          paddingBottom: filterExpandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-2, 12],
          }),
        },
      ]}
    >
      <View style={styles.headerTop}>
        <View style={[styles.headerRow, { marginTop: 4 }]}>
          <Text style={styles.headerTitle}>{t("driver.earnings.title")}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.filterIconContainer}
              onPress={onToggleFilter}
              accessibilityLabel={t("client.notifications.filter")}
            >
              <Ionicons
                name="funnel-outline"
                size={22}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel={t("driver.status.changeStatus")}
              onPress={onStatusChange}
              style={styles.statusButton}
            >
              <Ionicons
                name={isOnline ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={isOnline ? "#10B981" : "#6B7280"}
              />
            </TouchableOpacity>

            {/* Кнопки сброса удалены */}
          </View>
        </View>

        <Animated.View
          style={[
            styles.filtersWrapper,
            {
              maxHeight: filterExpandAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 60],
              }),
              opacity: filterExpandAnim.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0, 0, 1],
              }),
              overflow: "hidden",
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {periodOptions.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.filterChip,
                  selectedPeriod === period.key && styles.filterChipActive,
                ]}
                onPress={() => onPeriodSelect(period.key)}
              >
                <Ionicons
                  name={period.icon as any}
                  size={16}
                  color={
                    selectedPeriod === period.key
                      ? isDark
                        ? "#FFFFFF"
                        : "#FFFFFF"
                      : isDark
                        ? "#3B82F6"
                        : "#083198"
                  }
                />
                <Text
                  style={[
                    styles.filterChipText,
                    selectedPeriod === period.key &&
                      styles.filterChipTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default React.memo(EarningsHeader);
