import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../hooks/useI18n";
import {
  DriverVipSectionStyles as styles,
  getDriverVipSectionColors,
} from "../../styles/components/driver/DriverVipSection.styles";

interface DriverVipSectionProps {
  onVipPress?: () => void;
}

const DriverVipSection: React.FC<DriverVipSectionProps> = ({ onVipPress }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  getDriverVipSectionColors(isDark);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.vipButtonContainer}
        onPress={onVipPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#FFD700", "#FFA500", "#FF8C00", "#FFD700"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vipButton}
        >
          <Ionicons
            name="star"
            size={16}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={[styles.vipButtonText, { color: "#fff" }]}>
            {t("profile.becomePremium")}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default DriverVipSection;
