import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useI18n } from "../../../hooks/useI18n";
import { getCurrentColors, SHADOWS, SIZES } from "../../../constants/colors";
import { useLevelProgress } from "../../../context/LevelProgressContext";

interface EarningsLevelProps {
  isDark: boolean;
}

const EarningsLevel: React.FC<EarningsLevelProps> = ({ isDark }) => {
  useI18n();
  const colors = getCurrentColors(isDark);
  const { driverLevel } = useLevelProgress();

  // Анимация для круглого прогресс бара
  const circleProgressAnim = useRef(new Animated.Value(0)).current;
  const barProgressAnim = useRef(new Animated.Value(0)).current;
  const prevProgress = useRef(driverLevel.currentProgress);

  const progressPercentage =
    (driverLevel.currentProgress / driverLevel.maxProgress) * 100;

  // Анимация при изменении прогресса
  useEffect(() => {
    if (driverLevel.currentProgress !== prevProgress.current) {
      // Анимируем круглый прогресс
      Animated.timing(circleProgressAnim, {
        toValue: progressPercentage,
        duration: 800,
        useNativeDriver: false,
      }).start();

      // Анимируем линейный прогресс
      Animated.timing(barProgressAnim, {
        toValue: progressPercentage,
        duration: 800,
        useNativeDriver: false,
      }).start();

      prevProgress.current = driverLevel.currentProgress;
    } else {
      // Устанавливаем начальные значения без анимации
      circleProgressAnim.setValue(progressPercentage);
      barProgressAnim.setValue(progressPercentage);
    }
  }, [
    driverLevel.currentProgress,
    driverLevel.maxProgress,
    progressPercentage,
    circleProgressAnim,
    barProgressAnim,
  ]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: SIZES.xl,
      marginHorizontal: SIZES.xl,
      marginBottom: SIZES.lg,
      borderRadius: SIZES.radius.lg,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    levelContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    progressSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    progressCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 6,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    progressFill: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 6,
      borderColor: "transparent",
      borderTopColor: "#10B981",
      borderRightColor: "#10B981",
    },
    progressText: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: "700",
      color: colors.text,
    },
    levelInfo: {
      flex: 1,
      marginLeft: SIZES.lg,
    },
    levelTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: "600",
      color: colors.text,
      marginBottom: SIZES.xs,
    },
    levelDescription: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      marginBottom: SIZES.sm,
    },
    rewardSection: {
      alignItems: "flex-end",
    },
    rewardIcon: {
      position: "absolute",
      top: -8,
      right: -8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.success + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    rewardText: {
      fontSize: SIZES.fontSize.xs,
      fontWeight: "600",
      color: colors.success,
      marginTop: 2,
    },
    progressBar: {
      width: "100%",
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginTop: SIZES.sm,
      overflow: "hidden",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        {/* Круглый прогресс-бар */}
        <View style={styles.progressSection}>
          <View style={styles.progressCircle}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  transform: [
                    {
                      rotate: circleProgressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["-90deg", "270deg"], // От -90 до 270 градусов для полного круга
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.progressText}>
              {driverLevel.currentProgress}/{driverLevel.maxProgress}
            </Text>
            <Text style={styles.rewardText}>{driverLevel.nextReward}</Text>
          </View>

          {/* Информация об уровне */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>{driverLevel.subLevelTitle}</Text>
            <Text style={styles.levelDescription}>
              Уровень {driverLevel.currentLevel}
            </Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={{
                  width: barProgressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                  height: "100%",
                  borderRadius: 2,
                }}
              >
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 2,
                  }}
                />
              </Animated.View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EarningsLevel;
