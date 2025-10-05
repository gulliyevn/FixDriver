import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../hooks/useI18n";
import { useTheme } from "../../context/ThemeContext";
import {
  DriverProfileScreenStyles as styles,
  getDriverProfileStyles,
} from "../../styles/screens/driver/DriverProfileScreen.styles";
import { DriverScreenProps } from "../../types/driver/DriverNavigation";
import { colors } from "../../constants/colors";
import { useFocusEffect } from "@react-navigation/native";
import { useDriverProfile as useProfile } from "../../hooks/driver/DriverUseProfile";
import { useBalance } from "../../hooks/useBalance";
import { formatBalance } from "../../utils/formatters";

// import { useNotifications } from '../../hooks/useNotifications';
// import { useUserStats } from '../../hooks/useUserStats';

const DriverProfileScreen: React.FC<DriverScreenProps<"DriverProfile">> = ({
  navigation,
}) => {
  const { logout } = useAuth();
  const { t } = useI18n();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getDriverProfileStyles(isDark);

  // Используем хук для работы с профилем
  const { profile, error, loadProfile } =
    useProfile("current_driver_id");

  // Используем умный хук для баланса
  const balanceHook = useBalance();

  useFocusEffect(
    React.useCallback(() => {
      // Перезагружаем профиль при фокусе экрана
      loadProfile();
    }, []), // Убираем loadProfile из зависимостей
  );

  // const { user, loading: userLoading } = useProfile();
  // const { notificationsCount, loading: notificationsLoading } = useNotifications();
  // const { userStats, loading: statsLoading } = useUserStats();

  // Данные из мокдата
  const getUserStats = () => {
    if (!profile) return null;

    return {
      trips: 127,
      spent: "12 450 AFc",
      rating: profile.rating,
      balance: formatBalance(balanceHook.balance) + " AFc",
      address: profile.address,
      email: profile.email,
      memberSince: new Date(profile.createdAt).getFullYear(),
      id: profile.id,
      role: profile.role,
      avatar: profile.avatar,
    };
  };

  const userStats = getUserStats() || {
    trips: 0,
    spent: "0 AFc",
    rating: 0,
    balance: "0 AFc",
    address: "",
    email: "",
    memberSince: new Date().getFullYear(),
    id: "",
    role: "",
    avatar: "",
  };

  // Обработка ошибок
  if (error || !profile) {
    return (
      <View
        style={[
          styles.container,
          dynamicStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={[styles.profileName, dynamicStyles.profileName]}>
          {error || t("profile.failedToLoadProfile")}
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Фиксированная секция с аватаром и статистикой */}
      <View style={[styles.fixedSection, dynamicStyles.fixedSection]}>
        {/* Аватар, имя, телефон, премиум кнопка */}
        <View style={styles.profileRow}>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate("EditDriverProfile" as any)}
          >
            {profile?.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons
                name="person"
                size={48}
                color={styles.avatarIcon.color}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileText}
            onPress={() => navigation.navigate("EditDriverProfile" as any)}
          >
            <Text style={[styles.profileName, dynamicStyles.profileName]}>
              {profile?.name || ""} {profile?.surname || ""}
            </Text>
            <Text style={[styles.profilePhone, dynamicStyles.profilePhone]}>
              {profile?.phone || ""}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.premiumButtonContainer}
            onPress={() => navigation.navigate("PremiumPackages" as any)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FFFFFF", "#E6F3FF", "#B3D9FF", "#80BFFF", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.premiumButton, dynamicStyles.premiumButton]}
            >
              <Ionicons name="star" size={24} color="#0066CC" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* Блок статистики */}
        <View style={[styles.statsBox, dynamicStyles.statsBox]}>
          <View style={styles.statCol}>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>
              {userStats.trips}
            </Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
              {t("client.profile.trips")}
            </Text>
          </View>
          <View style={[styles.statDivider, dynamicStyles.statDivider]} />
          <View style={styles.statCol}>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>
              {userStats.spent}
            </Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
              {t("client.profile.spent")}
            </Text>
          </View>
          <View style={[styles.statDivider, dynamicStyles.statDivider]} />
          <View style={styles.statCol}>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>
              {userStats.rating}
            </Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
              {t("client.profile.rating")}
            </Text>
          </View>
        </View>
        {/* Тонкая линия под статистикой */}
        <View style={[styles.statsDivider, dynamicStyles.statsDivider]} />
      </View>

      {/* Скроллируемая секция с меню */}
      <ScrollView
        style={[styles.scrollSection, dynamicStyles.scrollSection]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Пункты меню */}
        <TouchableOpacity
          style={[
            styles.menuItem,
            styles.menuItemFirst,
            dynamicStyles.menuItem,
            dynamicStyles.menuItemFirst,
          ]}
          onPress={() => navigation.navigate("Balance")}
        >
          <Ionicons
            name="refresh"
            size={28}
            color={currentColors.primary}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>
            {t("client.profile.balance")}
          </Text>
          <Text style={[styles.menuValue, dynamicStyles.menuValue]}>
            {userStats.balance}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, dynamicStyles.menuItem]}
          onPress={() => navigation.navigate("Cards")}
        >
          <Ionicons
            name="card"
            size={22}
            color={currentColors.primary}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>
            {t("client.profile.cards")}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentColors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, dynamicStyles.menuItem]}
          onPress={() => navigation.navigate("Trips")}
        >
          <Ionicons
            name="time"
            size={22}
            color={currentColors.primary}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>
            {t("client.profile.trips")}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentColors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, dynamicStyles.menuItem]}
          onPress={() => navigation.navigate("PaymentHistory")}
        >
          <Ionicons
            name="document-text"
            size={22}
            color={currentColors.primary}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>
            {t("client.profile.paymentHistory")}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentColors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, dynamicStyles.menuItem]}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons
            name="settings"
            size={22}
            color={currentColors.primary}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>
            {t("client.settings")}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentColors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, dynamicStyles.menuItem]}
          onPress={() => navigation.navigate("Residence")}
        >
          <Ionicons
            name="home"
            size={22}
            color={currentColors.primary}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>
            {t("client.profile.residence")}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentColors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, dynamicStyles.menuItem]}
          onPress={() => navigation.navigate("Help")}
        >
          <Ionicons
            name="help-circle"
            size={22}
            color={currentColors.primary}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>
            {t("client.profile.help")}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentColors.textSecondary}
          />
        </TouchableOpacity>
        {/* О приложении */}
        <TouchableOpacity
          style={[styles.menuItem, dynamicStyles.menuItem]}
          onPress={() => navigation.navigate("About")}
        >
          <Ionicons
            name="information-circle"
            size={22}
            color={currentColors.primary}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuLabelAbout, dynamicStyles.menuLabelAbout]}>
            {t("client.profile.about")}
          </Text>
          <Text style={[styles.menuVersion, dynamicStyles.menuVersion]}>
            1.0.0
          </Text>
        </TouchableOpacity>
        {/* Выйти */}
        <TouchableOpacity
          style={[styles.logout, dynamicStyles.logout]}
          onPress={() => {
            Alert.alert(
              t("client.profile.logout"),
              t("client.profile.logoutConfirm"),
              [
                { text: t("common.cancel"), style: "cancel" },
                {
                  text: t("client.profile.logout"),
                  style: "destructive",
                  onPress: logout,
                },
              ],
            );
          }}
        >
          <Text style={styles.logoutText}>{t("client.profile.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default DriverProfileScreen;
