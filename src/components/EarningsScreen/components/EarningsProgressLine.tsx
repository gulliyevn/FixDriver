import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useI18n } from "../../../hooks/useI18n";
import { getCurrentColors, SIZES } from "../../../constants/colors";
import { useLevelProgress } from "../../../context/LevelProgressContext";
import { getLevelConfig } from "../types/levels.config";

interface EarningsProgressLineProps {
  isDark: boolean;
  // Данные VIP, поднятые на уровень выше для единого источника истины
  vipQualifiedDays?: number;
  vipRidesToday?: number;
  vipCurrentHours?: number;
}

const EarningsProgressLine: React.FC<EarningsProgressLineProps> = ({
  isDark,
  vipQualifiedDays,
  vipRidesToday,
  vipCurrentHours,
}) => {
  const { t } = useI18n();
  const colors = getCurrentColors(isDark);
  const { driverLevel } = useLevelProgress();

  // Получаем текущие часы онлайн из пропсов (единый источник от родителя)
  const currentHours = vipCurrentHours ?? 0;

  // Анимация для прогресс бара
  const progressAnim = useRef(new Animated.Value(0)).current;
  const prevProgress = useRef(
    driverLevel.isVIP ? (vipQualifiedDays ?? 0) : driverLevel.currentProgress,
  );

  // Проверяем условия VIP сегодня
  const isQualifiedToday =
    driverLevel.isVIP && currentHours >= 10 && (vipRidesToday ?? 0) >= 3;
  const displayDays = driverLevel.isVIP
    ? (vipQualifiedDays ?? 0) + (isQualifiedToday ? 1 : 0)
    : 0;

  // Рассчитываем процент прогресса в зависимости от VIP статуса
  const progressPercentage = driverLevel.isVIP
    ? (displayDays / 30) * 100
    : (driverLevel.currentProgress / driverLevel.maxProgress) * 100;

  // Текущий прогресс для анимации
  const currentProgress = driverLevel.isVIP
    ? displayDays
    : driverLevel.currentProgress;

  // Анимация при изменении прогресса
  useEffect(() => {
    if (currentProgress !== prevProgress.current) {
      // Анимируем к новому значению
      Animated.timing(progressAnim, {
        toValue: progressPercentage,
        duration: 800, // 800ms для плавной анимации
        useNativeDriver: false,
      }).start();

      prevProgress.current = currentProgress;
    } else {
      // Устанавливаем начальное значение без анимации
      progressAnim.setValue(progressPercentage);
    }
  }, [
    currentProgress,
    progressPercentage,
    progressAnim,
    vipQualifiedDays,
    vipRidesToday,
    currentHours,
    driverLevel.isVIP,
  ]);

  const styles = StyleSheet.create({
    container: {
      marginTop: SIZES.lg,
    },
    progressBar: {
      width: "100%",
      height: 24,
      backgroundColor: colors.border,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },
    progressText: {
      fontSize: SIZES.fontSize.sm,
      fontWeight: "700",
      color: colors.background,
      textAlign: "center",
      zIndex: 1,
    },
  });

  // Функция для получения названия следующего уровня
  const getNextLevelTitle = (level: number) => {
    const config = getLevelConfig(level, 1);
    return config.levelKey;
  };

  // Функция для получения текста прогресса
  const getProgressText = () => {
    // Если VIP статус, показываем квалифицированные дни
    if (driverLevel.isVIP) {
      // Только формат x/30 без доп. текста
      return `${Math.max(0, Math.floor(displayDays))}/30`;
    }

    // Обычный прогресс поездок
    return `${driverLevel.currentProgress}/${driverLevel.maxProgress}`;
  };

  // Проверяем, есть ли данные
  if (!driverLevel || !driverLevel.subLevelTitle) {
    return (
      <View style={styles.container}>
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>0/0</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Прогресс бар с информацией внутри */}
      <View style={styles.progressBar}>
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            borderRadius: 12,
          }}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 12,
            }}
          />
        </Animated.View>

        <Text style={styles.progressText}>{getProgressText()}</Text>
      </View>
    </View>
  );
};

export default EarningsProgressLine;
