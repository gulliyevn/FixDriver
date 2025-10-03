import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../hooks/useI18n";
import {
  VehicleIdCardStyles as styles,
  getVehicleIdCardColors,
} from "../../styles/components/driver/VehicleIdCard.styles";

interface VehicleIdCardProps {
  vehicleNumber: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  isVerified?: boolean; // Статус верификации автомобиля
}

const VehicleIdCard: React.FC<VehicleIdCardProps> = ({
  vehicleNumber,
  brand,
  model,
  year,
  mileage,
  isVerified = false, // По умолчанию не верифицирован
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getVehicleIdCardColors(isDark);
  const currentColors = isDark
    ? { primary: "#3B82F6" }
    : { primary: "#083198" };

  // Определяем иконку и цвет в зависимости от статуса верификации
  const getVerificationIcon = () => {
    if (isVerified) {
      return {
        name: "shield-checkmark" as const,
        color: "#10B981", // Зеленый цвет для верифицированного
      };
    } else {
      return {
        name: "time-outline" as const,
        color: "#fff", // Белый цвет для ожидания
      };
    }
  };

  const verificationIcon = getVerificationIcon();

  // Функция для получения фото автомобиля
  const getVehicleImage = () => {
    // Здесь будет логика для получения фото в зависимости от марки и модели
    // Пока используем заглушку
    return require("../../../assets/vehicles/toyota-camry.jpg");
  };

  return (
    <View style={[styles.card, dynamicStyles.card]}>
      {/* Заголовок FixDrive */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Ionicons
          name={verificationIcon.name}
          size={16}
          color={verificationIcon.color}
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>FixDrive</Text>
      </View>

      {/* Основной контент */}
      <View style={styles.content}>
        {/* Фото автомобиля слева */}
        <View style={styles.photoContainer}>
          <Image
            source={getVehicleImage()}
            style={styles.vehiclePhoto}
            resizeMode="cover"
          />
        </View>

        {/* Данные справа */}
        <View style={styles.dataContainer}>
          <View style={[styles.dataRow, dynamicStyles.dataRow]}>
            <Text style={[styles.dataLabel, dynamicStyles.dataLabel]}>
              {t("profile.vehicles.vehicleLabels.number")}
            </Text>
            <Text style={[styles.dataValue, dynamicStyles.dataValue]}>
              {vehicleNumber}
            </Text>
          </View>

          <View style={[styles.dataRow, dynamicStyles.dataRow]}>
            <Text style={[styles.dataLabel, dynamicStyles.dataLabel]}>
              {t("profile.vehicles.vehicleLabels.brand")}
            </Text>
            <Text style={[styles.dataValue, dynamicStyles.dataValue]}>
              {brand}
            </Text>
          </View>

          <View style={[styles.dataRow, dynamicStyles.dataRow]}>
            <Text style={[styles.dataLabel, dynamicStyles.dataLabel]}>
              {t("profile.vehicles.vehicleLabels.model")}
            </Text>
            <Text style={[styles.dataValue, dynamicStyles.dataValue]}>
              {model}
            </Text>
          </View>

          <View style={[styles.dataRow, dynamicStyles.dataRow]}>
            <Text style={[styles.dataLabel, dynamicStyles.dataLabel]}>
              {t("profile.vehicles.vehicleLabels.year")}
            </Text>
            <Text style={[styles.dataValue, dynamicStyles.dataValue]}>
              {year}
            </Text>
          </View>

          <View style={[styles.dataRow, dynamicStyles.dataRow]}>
            <Text style={[styles.dataLabel, dynamicStyles.dataLabel]}>
              {t("profile.vehicles.vehicleLabels.mileage")}
            </Text>
            <Text style={[styles.dataValue, dynamicStyles.dataValue]}>
              {mileage}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default VehicleIdCard;
