import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { getCurrentColors, SIZES } from "../../../constants/colors";
// Mock functions removed - using hardcoded data
const getRideHistoryByPeriod = () => [];
const getHourlyActivityByPeriod = () => [];
const getDistanceMetricsByPeriod = () => [];
const getRoutePointsByPeriod = () => [];

interface EarningsDetailViewProps {
  selectedStat:
    | "totalRides"
    | "workHours"
    | "totalDistance"
    | "routePoints"
    | null;
  isDark: boolean;
  onClose: () => void;
  period: "today" | "week" | "month" | "year";
}

const EarningsDetailView: React.FC<EarningsDetailViewProps> = React.memo(
  ({ selectedStat, isDark }) => {
    const colors = getCurrentColors(isDark);

    if (!selectedStat) return null;

    const getDetailContent = () => {
      switch (selectedStat) {
        case "totalRides":
          return {
            title: "История поездок",
            icon: "car-outline",
            data: getRideHistoryByPeriod(),
          };

        case "workHours":
          return {
            title: "Активность по часам",
            icon: "time-outline",
            data: getHourlyActivityByPeriod(),
          };

        case "totalDistance":
          return {
            title: "Статистика пробега",
            icon: "navigate-outline",
            data: getDistanceMetricsByPeriod(),
          };

        case "routePoints":
          return {
            title: "Маршруты на сегодня",
            icon: "location-outline",
            data: getRoutePointsByPeriod(),
          };

        default:
          return null;
      }
    };

    const content = getDetailContent();
    if (!content) return null;

    const renderRideItem = (item: any, index: number) => (
      <View key={index} style={styles.rideItem}>
        <View style={styles.rideHeader}>
          <Text style={[styles.clientName, { color: colors.text }]}>
            {item.clientName} {item.clientSurname}
          </Text>
          <Text style={[styles.rideDateTime, { color: colors.textSecondary }]}>
            {item.datetime}
          </Text>
        </View>
        <View style={styles.rideFooter}>
          <Text style={[styles.rideAmount, { color: colors.primary }]}>
            {item.amount}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.success + "20" },
            ]}
          >
            <Text style={[styles.statusText, { color: colors.success }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    );

    const renderHourItem = (item: any, index: number) => (
      <View key={index} style={styles.hourItem}>
        <Text style={[styles.hourText, { color: colors.text }]}>
          {item.hour}
        </Text>
        <View style={styles.hourStats}>
          <Text style={[styles.ridesCount, { color: colors.textSecondary }]}>
            {item.rides} поездок
          </Text>
          <Text style={[styles.hourEarnings, { color: colors.primary }]}>
            {item.earnings}
          </Text>
        </View>
      </View>
    );

    const renderMetricItem = (item: any, index: number) => (
      <View key={index} style={styles.metricItem}>
        <View style={styles.metricHeader}>
          <Ionicons name={item.icon as any} size={16} color={colors.primary} />
          <Text style={[styles.metricName, { color: colors.text }]}>
            {item.metric}
          </Text>
        </View>
        <Text style={[styles.metricValue, { color: colors.primary }]}>
          {item.value}
        </Text>
      </View>
    );

    const renderRouteItem = (item: any, index: number) => (
      <View key={index} style={styles.routeItem}>
        <View style={styles.routeHeader}>
          <Text style={[styles.routePoint, { color: colors.text }]}>
            {item.point}
          </Text>
          <Text style={[styles.routeTime, { color: colors.textSecondary }]}>
            {item.time}
          </Text>
        </View>
        <View style={styles.routeFooter}>
          <Text style={[styles.routeAddress, { color: colors.textSecondary }]}>
            {item.address}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "В процессе"
                    ? colors.warning + "20"
                    : colors.textSecondary + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status === "В процессе"
                      ? colors.warning
                      : colors.textSecondary,
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    );

    const renderContent = () => {
      switch (selectedStat) {
        case "totalRides":
          return content.data.map(renderRideItem);
        case "workHours":
          return content.data.map(renderHourItem);
        case "totalDistance":
          return content.data.map(renderMetricItem);
        case "routePoints":
          return content.data.map(renderRouteItem);
        default:
          return null;
      }
    };

    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {/* Заголовок */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons
              name={content.icon as any}
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.title, { color: colors.text }]}>
              {content.title}
            </Text>
          </View>
        </View>

        {/* Контент */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: SIZES.lg,
    borderRadius: SIZES.radius.md,
    marginHorizontal: SIZES.sm,
    marginBottom: SIZES.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.md,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: SIZES.xs,
  },
  content: {
    maxHeight: 200,
  },
  // Стили для поездок
  rideItem: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.xs,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "500",
  },
  rideDateTime: {
    fontSize: 12,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 12,
  },
  rideFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rideAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Стили для часов
  hourItem: {
    padding: SIZES.md,
    borderRadius: SIZES.radius.sm,
    marginBottom: SIZES.sm,
  },
  hourText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: SIZES.xs,
  },
  hourStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ridesCount: {
    fontSize: 12,
  },
  hourEarnings: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Стили для метрик
  metricItem: {
    padding: SIZES.md,
    borderRadius: SIZES.radius.sm,
    marginBottom: SIZES.sm,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.sm,
    marginBottom: SIZES.xs,
  },
  metricName: {
    fontSize: 14,
    fontWeight: "500",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 24,
  },
  // Стили для маршрутов
  routeItem: {
    padding: SIZES.md,
    borderRadius: SIZES.radius.sm,
    marginBottom: SIZES.sm,
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.xs,
  },
  routeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routePoint: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: SIZES.xs,
  },
  routeTime: {
    fontSize: 12,
  },
  routeAddress: {
    fontSize: 12,
  },
});

EarningsDetailView.displayName = "EarningsDetailView";

// PropTypes для ESLint совместимости
EarningsDetailView.propTypes = {
  selectedStat: PropTypes.oneOf(["routePoints", "totalRides", "workHours", "totalDistance"]),
  isDark: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  period: PropTypes.oneOf(["today", "week", "month", "year"] as const).isRequired,
};

export default EarningsDetailView;
