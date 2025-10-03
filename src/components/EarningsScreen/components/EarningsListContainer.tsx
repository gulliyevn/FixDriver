import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCurrentColors, SIZES } from "../../../constants/colors";

interface EarningsListContainerProps {
  isDark: boolean;
}

const EarningsListContainer: React.FC<EarningsListContainerProps> = ({
  isDark,
}) => {
  const colors = getCurrentColors(isDark);

  // Мок данные для топ водителей
  const topDrivers = [
    {
      id: "1",
      name: "Алексей Петров",
      level: "VIP 8",
      rides: "45",
      earnings: "1,250 AFc",
      position: "1",
    },
    {
      id: "2",
      name: "Мария Иванова",
      level: "VIP 6",
      rides: "42",
      earnings: "1,180 AFc",
      position: "2",
    },
    {
      id: "3",
      name: "Дмитрий Сидоров",
      level: "VIP 5",
      rides: "38",
      earnings: "1,050 AFc",
      position: "3",
    },
    {
      id: "4",
      name: "Анна Козлова",
      level: "VIP 3",
      rides: "35",
      earnings: "980 AFc",
      position: "4",
    },
    {
      id: "5",
      name: "Сергей Новиков",
      level: "VIP 2",
      rides: "32",
      earnings: "890 AFc",
      position: "5",
    },
    {
      id: "6",
      name: "Елена Морозова",
      level: "VIP 1",
      rides: "28",
      earnings: "750 AFc",
      position: "6",
    },
    {
      id: "7",
      name: "Андрей Волков",
      level: "Император",
      rides: "25",
      earnings: "680 AFc",
      position: "7",
    },
    {
      id: "8",
      name: "Ольга Лебедева",
      level: "Суперзвезда",
      rides: "22",
      earnings: "620 AFc",
      position: "8",
    },
    {
      id: "9",
      name: "Игорь Соколов",
      level: "Чемпион",
      rides: "20",
      earnings: "580 AFc",
      position: "9",
    },
    {
      id: "10",
      name: "Наталья Романова",
      level: "Надежный",
      rides: "18",
      earnings: "520 AFc",
      position: "10",
    },
  ];

  const renderDriverItem = (driver: any, index: number) => (
    <TouchableOpacity
      key={driver.id}
      style={[
        styles.driverItem,
        index === topDrivers.length - 1 && { borderBottomWidth: 0 },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.driverHeader}>
        <View style={styles.positionContainer}>
          <Text style={[styles.position, { color: colors.primary }]}>
            {driver.position}
          </Text>
        </View>
        <View style={styles.driverContent}>
          <Text style={[styles.driverName, { color: colors.text }]}>
            {driver.name}
          </Text>
          <Text style={[styles.driverLevel, { color: colors.textSecondary }]}>
            {driver.level}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={[styles.rides, { color: colors.textSecondary }]}>
            {driver.rides}
          </Text>
          <Text style={[styles.earnings, { color: colors.primary }]}>
            {driver.earnings}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Заголовок */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="trophy-outline" size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Топ водители
          </Text>
        </View>
      </View>

      {/* Список водителей */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {topDrivers.map(renderDriverItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.xl,
    borderRadius: SIZES.radius.lg,
    marginHorizontal: SIZES.xl,
    marginBottom: SIZES.xs,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.lg,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.sm,
    marginLeft: SIZES.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    maxHeight: 200,
  },
  columnsHeader: {
    flexDirection: "row",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    marginBottom: SIZES.sm,
    alignItems: "center",
  },
  columnHeader: {
    fontSize: 14,
    fontWeight: "600",
  },
  driverItem: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  positionContainer: {
    width: 30,
    alignItems: "center",
  },
  position: {
    fontSize: 16,
    fontWeight: "600",
  },
  driverContent: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: SIZES.xs,
  },
  driverLevel: {
    fontSize: 12,
  },
  statsContainer: {
    alignItems: "flex-end",
  },
  rides: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: SIZES.xs,
  },
  earnings: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EarningsListContainer;
