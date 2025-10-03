import React from "react";
import { View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { BalanceCardDecorationStyles } from "../styles/components/BalanceCardDecoration.styles";

// Удалено использование временного изображения

interface BalanceCardDecorationProps {
  isDark?: boolean;
  packageType?:
    | "free"
    | "plus"
    | "premium"
    | "premiumPlus"
    | "plus_month"
    | "plus_year"
    | "premium_month"
    | "premium_year"
    | "premiumPlus_month"
    | "premiumPlus_year";
  isBackSide?: boolean;
}

const BalanceCardDecoration: React.FC<BalanceCardDecorationProps> = ({
  packageType = "basic",
  isBackSide = false,
}) => {
  // Убираем суффикс периода для определения базового типа пакета
  const basePackageType = packageType.replace(/_month$|_year$/, "");

  // Если free пакет - показываем пустой контейнер
  if (basePackageType === "free") {
    return (
      <View style={BalanceCardDecorationStyles.container}>
        {/* Free пакет без декораций */}
      </View>
    );
  }

  // Определяем стиль декорации в зависимости от пакета
  const getDecorationStyle = () => {
    switch (basePackageType) {
      case "free":
        return "leaf"; // Без декорации для Free
      case "plus":
        return "lead"; // Свинцовый металл для Plus
      case "premium":
        return "platinum"; // Платиновый металл для Premium
      case "premiumPlus":
        return "gold"; // Золотой металл для Premium+
      default:
        return "lead"; // По умолчанию
    }
  };

  const decorationStyle = getDecorationStyle();

  // Если это обратная сторона - показываем только металлические цвета
  if (isBackSide) {
    return (
      <View style={BalanceCardDecorationStyles.container}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 400 220"
          fill="none"
          style={BalanceCardDecorationStyles.svg}
        >
          {decorationStyle === "lead" && (
            <>
              <Defs>
                {/* Свинцовый металлический градиент для обратной стороны */}
                <LinearGradient
                  id="leadBackGradient"
                  x1="100%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <Stop offset="0%" stopColor="#2F4F4F" stopOpacity="0.9" />
                  <Stop offset="50%" stopColor="#708090" stopOpacity="0.7" />
                  <Stop offset="100%" stopColor="#696969" stopOpacity="0.5" />
                </LinearGradient>
                {/* Свинцовая рамка для обратной стороны */}
                <LinearGradient
                  id="leadBackBorder"
                  x1="100%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <Stop offset="0%" stopColor="#1A1A1A" stopOpacity="0.9" />
                  <Stop offset="50%" stopColor="#2F4F4F" stopOpacity="0.8" />
                  <Stop offset="100%" stopColor="#696969" stopOpacity="0.7" />
                </LinearGradient>
              </Defs>

              {/* Свинцовый металлический фон для обратной стороны */}
              <Path
                d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
                fill="url(#leadBackGradient)"
              />

              {/* Свинцовая рамка для обратной стороны */}
              <Path
                d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
                stroke="url(#leadBackBorder)"
                strokeWidth="8"
                fill="none"
              />
            </>
          )}

          {decorationStyle === "gold" && (
            <>
              <Defs>
                {/* Реалистичный золотой металлический градиент для обратной стороны */}
                <LinearGradient
                  id="goldBackGradient"
                  x1="100%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <Stop offset="0%" stopColor="#FFD700" stopOpacity="1.0" />
                  <Stop offset="25%" stopColor="#FFA500" stopOpacity="0.9" />
                  <Stop offset="50%" stopColor="#DAA520" stopOpacity="0.8" />
                  <Stop offset="75%" stopColor="#B8860B" stopOpacity="0.9" />
                  <Stop offset="100%" stopColor="#8B4513" stopOpacity="0.7" />
                </LinearGradient>
                {/* Золотая рамка для обратной стороны */}
                <LinearGradient
                  id="goldBackBorder"
                  x1="100%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <Stop offset="0%" stopColor="#8B4513" stopOpacity="1.0" />
                  <Stop offset="25%" stopColor="#DAA520" stopOpacity="0.9" />
                  <Stop offset="50%" stopColor="#FFD700" stopOpacity="0.8" />
                  <Stop offset="75%" stopColor="#FFA500" stopOpacity="0.9" />
                  <Stop offset="100%" stopColor="#8B4513" stopOpacity="0.7" />
                </LinearGradient>
              </Defs>

              {/* Золотой металлический фон для обратной стороны */}
              <Path
                d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
                fill="url(#goldBackGradient)"
              />

              {/* Золотая рамка для обратной стороны */}
              <Path
                d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
                stroke="url(#goldBackBorder)"
                strokeWidth="8"
                fill="none"
              />
            </>
          )}

          {decorationStyle === "platinum" && (
            <>
              <Defs>
                {/* Платиновый металлический градиент для обратной стороны */}
                <LinearGradient
                  id="platinumBackGradient"
                  x1="100%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <Stop offset="0%" stopColor="#E5E4E2" stopOpacity="0.95" />
                  <Stop offset="50%" stopColor="#C0C0C0" stopOpacity="0.8" />
                  <Stop offset="100%" stopColor="#A8A8A8" stopOpacity="0.6" />
                </LinearGradient>
                {/* Платиновая рамка для обратной стороны */}
                <LinearGradient
                  id="platinumBackBorder"
                  x1="100%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <Stop offset="0%" stopColor="#696969" stopOpacity="0.9" />
                  <Stop offset="50%" stopColor="#E5E4E2" stopOpacity="0.8" />
                  <Stop offset="100%" stopColor="#A8A8A8" stopOpacity="0.7" />
                </LinearGradient>
              </Defs>

              {/* Платиновый металлический фон для обратной стороны */}
              <Path
                d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
                fill="url(#platinumBackGradient)"
              />

              {/* Платиновая рамка для обратной стороны */}
              <Path
                d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
                stroke="url(#platinumBackBorder)"
                strokeWidth="8"
                fill="none"
              />
            </>
          )}
        </Svg>
      </View>
    );
  }

  return (
    <View style={BalanceCardDecorationStyles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 220"
        fill="none"
        style={BalanceCardDecorationStyles.svg}
      >
        {decorationStyle === "lead" && (
          <>
            <Defs>
              {/* Свинцовый металлический градиент справа налево */}
              <LinearGradient
                id="leadGradient"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#2F4F4F" stopOpacity="0.9" />
                <Stop offset="50%" stopColor="#708090" stopOpacity="0.7" />
                <Stop offset="100%" stopColor="#696969" stopOpacity="0.5" />
              </LinearGradient>
              {/* Свинцовая рамка */}
              <LinearGradient
                id="leadBorder"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#1A1A1A" stopOpacity="0.9" />
                <Stop offset="50%" stopColor="#2F4F4F" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#696969" stopOpacity="0.7" />
              </LinearGradient>
            </Defs>

            {/* Свинцовый металлический фон */}
            <Path
              d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
              fill="url(#leadGradient)"
            />

            {/* Свинцовая рамка */}
            <Path
              d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
              stroke="url(#leadBorder)"
              strokeWidth="8"
              fill="none"
            />

            {/* Удалено использование временного изображения */}
          </>
        )}

        {decorationStyle === "gold" && (
          <>
            <Defs>
              {/* Реалистичный золотой металлический градиент */}
              <LinearGradient
                id="goldGradient"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#FFD700" stopOpacity="1.0" />
                <Stop offset="25%" stopColor="#FFA500" stopOpacity="0.9" />
                <Stop offset="50%" stopColor="#DAA520" stopOpacity="0.8" />
                <Stop offset="75%" stopColor="#B8860B" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#8B4513" stopOpacity="0.7" />
              </LinearGradient>
              {/* Золотая рамка */}
              <LinearGradient
                id="goldBorder"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#8B4513" stopOpacity="1.0" />
                <Stop offset="25%" stopColor="#DAA520" stopOpacity="0.9" />
                <Stop offset="50%" stopColor="#FFD700" stopOpacity="0.8" />
                <Stop offset="75%" stopColor="#FFA500" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#8B4513" stopOpacity="0.7" />
              </LinearGradient>
            </Defs>

            {/* Золотой металлический фон */}
            <Path
              d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
              fill="url(#goldGradient)"
            />

            {/* Золотая рамка */}
            <Path
              d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
              stroke="url(#goldBorder)"
              strokeWidth="8"
              fill="none"
            />

            {/* Удалено использование временного изображения */}
          </>
        )}

        {decorationStyle === "platinum" && (
          <>
            <Defs>
              {/* Платиновый металлический градиент справа налево */}
              <LinearGradient
                id="platinumGradient"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#E5E4E2" stopOpacity="0.95" />
                <Stop offset="50%" stopColor="#C0C0C0" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#A8A8A8" stopOpacity="0.6" />
              </LinearGradient>
              {/* Платиновая рамка */}
              <LinearGradient
                id="platinumBorder"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#696969" stopOpacity="0.9" />
                <Stop offset="50%" stopColor="#E5E4E2" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#A8A8A8" stopOpacity="0.7" />
              </LinearGradient>
            </Defs>

            {/* Платиновый металлический фон */}
            <Path
              d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
              fill="url(#platinumGradient)"
            />

            {/* Платиновая рамка */}
            <Path
              d="M-10 -10 L410 -10 L410 230 L-10 230 Z"
              stroke="url(#platinumBorder)"
              strokeWidth="8"
              fill="none"
            />

            {/* Удалено использование временного изображения */}
          </>
        )}
      </Svg>
    </View>
  );
};

export default BalanceCardDecoration;
