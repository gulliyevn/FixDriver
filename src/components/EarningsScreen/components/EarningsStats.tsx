import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useI18n } from "../../../hooks/useI18n";
import { useEarningsData } from "../hooks/useEarningsData";

import { getCurrentColors, SHADOWS, SIZES } from "../../../constants/colors";
import EarningsDetailView from "./EarningsDetailView";

interface EarningsStatsProps {
  period: "today" | "week" | "month" | "year";
  isDark: boolean;
}

const EarningsStats: React.FC<EarningsStatsProps> = ({ period, isDark }) => {
  const { t } = useI18n();
  const colors = getCurrentColors(isDark);
  const { quickStats } = useEarningsData(period);

  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [selectedStat, setSelectedStat] = useState<
    "totalRides" | "workHours" | "totalDistance" | "routePoints" | null
  >("routePoints");
  const [chevronRotation] = useState(new Animated.Value(0));

  // Создаем карточки статистики на основе реальных данных из БД

  const statsCards = useMemo(
    () => [
      {
        key: "totalRides",
        title: "totalRides",
        value: quickStats.totalTrips,
        icon: "checkmark-outline",
        color: "#3B82F6",
        trend: { value: 12, isPositive: true },
      },
      {
        key: "workHours",
        title: "workHours",
        value: quickStats.onlineHours.toString(),
        icon: "time-outline",
        color: "#10B981",
        trend: { value: 1.5, isPositive: true },
      },
      {
        key: "totalDistance",
        title: "totalDistance",
        value: "85", // Моковые данные, в реальности будут из БД
        icon: "navigate-outline",
        color: "#F59E0B",
        trend: { value: 0.2, isPositive: true },
      },
      {
        key: "routePoints",
        title: "waitingTime",
        value: "15", // Моковые данные времени ожидания в минутах
        icon: "calendar-outline",
        color: "#8B5CF6",
        trend: { value: 0.8, isPositive: true },
      },
    ],
    [quickStats],
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: SIZES.xl,
      marginHorizontal: SIZES.xl,
      marginBottom: SIZES.lg,
      borderRadius: SIZES.radius.lg,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SIZES.lg,
    },
    title: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: "600",
      color: colors.text,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    statCard: {
      width: "24%",
      backgroundColor: colors.background,
      borderRadius: SIZES.radius.md,
      padding: SIZES.md,
      marginBottom: SIZES.sm,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    valueContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SIZES.xs,
    },
    statValue: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    statSubtitle: {
      fontSize: SIZES.fontSize.xs,
      color: colors.textSecondary,
      marginBottom: SIZES.xs,
      textAlign: "center",
      marginLeft: SIZES.xs,
      marginTop: SIZES.xs,
    },
    statTitle: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: SIZES.xs,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: SIZES.lg,
    },
    chartSection: {
      marginTop: SIZES.md,
    },
    chartTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: "600",
      color: colors.text,
      marginTop: SIZES.md,
      textAlign: "center",
      lineHeight: SIZES.lineHeight.lg,
    },
  });

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    const toRotation = isExpanded ? 1 : 0;

    Animated.parallel([
      Animated.timing(animation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(chevronRotation, {
        toValue: toRotation,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.headerContainer} onPress={toggleExpanded}>
        <Text style={styles.title}>{t("driver.earnings.stats.title")}</Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: chevronRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          }}
        >
          <Ionicons
            name="chevron-down"
            size={20}
            color={colors.textSecondary}
          />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        {statsCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.statCard}
            onPress={() => {
              setSelectedStat(card.key as typeof selectedStat);
              if (!isExpanded) {
                setIsExpanded(true);
                const toValue = 1;
                const toRotation = 1;

                Animated.parallel([
                  Animated.timing(animation, {
                    toValue,
                    duration: 300,
                    useNativeDriver: false,
                  }),
                  Animated.timing(chevronRotation, {
                    toValue: toRotation,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                ]).start();
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.valueContainer}>
              <Ionicons name={card.icon as keyof typeof Ionicons.glyphMap} size={16} color={card.color} style={{ marginRight: SIZES.xs }} />
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={styles.statValue}>{card.value}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Линия разделения и детальная статистика */}
      <Animated.View
        style={{
          maxHeight: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 300],
          }),
          opacity: animation,
          overflow: "hidden",
        }}
      >
        {/* Линия разделения */}
        <View style={styles.divider} />

        {/* Детальная статистика */}
        {selectedStat && (
          <EarningsDetailView
            selectedStat={selectedStat}
            isDark={isDark}
            onClose={() => setSelectedStat(null)}
            period={period}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default EarningsStats;
