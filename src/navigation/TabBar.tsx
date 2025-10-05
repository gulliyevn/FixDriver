import React, { useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { getCurrentColors } from "../constants/colors";
import { TabBarStyles as styles } from "../styles/navigation/TabBar.styles";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const currentColors = getCurrentColors(isDark);

  // Temporary static translations for debugging
  const staticTranslations = {
    ru: {
      map: "Карта",
      drivers: "Водители",
      schedule: "Расписание",
      chats: "Чаты",
      profile: "Профиль",
      orders: "Заказы",
      earnings: "Заработок",
    },
    en: {
      map: "Map",
      drivers: "Drivers",
      schedule: "Schedule",
      chats: "Chats",
      profile: "Profile",
      orders: "Orders",
      earnings: "Earnings",
    },
    az: {
      map: "Xəritə",
      drivers: "Sürücülər",
      schedule: "Cədvəl",
      chats: "Söhbətlər",
      profile: "Profil",
      orders: "Sifarişlər",
      earnings: "Qazanc",
    },
    tr: {
      map: "Harita",
      drivers: "Sürücüler",
      schedule: "Program",
      chats: "Sohbetler",
      profile: "Profil",
      orders: "Siparişler",
      earnings: "Kazanç",
    },
    es: {
      map: "Mapa",
      drivers: "Conductores",
      schedule: "Horario",
      chats: "Chats",
      profile: "Perfil",
      orders: "Pedidos",
      earnings: "Ganancias",
    },
    fr: {
      map: "Carte",
      drivers: "Chauffeurs",
      schedule: "Planning",
      chats: "Chats",
      profile: "Profil",
      orders: "Commandes",
      earnings: "Gains",
    },
    de: {
      map: "Karte",
      drivers: "Fahrer",
      schedule: "Zeitplan",
      chats: "Chats",
      profile: "Profil",
      orders: "Aufträge",
      earnings: "Verdienst",
    },
    ar: {
      map: "الخريطة",
      drivers: "السائقين",
      schedule: "الجدول",
      chats: "الدردشات",
      profile: "الملف الشخصي",
      orders: "الطلبات",
      earnings: "الأرباح",
    },
  };

  const currentTranslations =
    staticTranslations[language] || staticTranslations.ru;

  const tabConfig = useMemo(
    () => [
      // Клиентские табы
      {
        name: "Map",
        icon: "map-outline",
        activeIcon: "map",
        label: currentTranslations.map,
      },
      {
        name: "Drivers",
        icon: "people-outline",
        activeIcon: "people",
        label: currentTranslations.drivers,
      },
      {
        name: "Schedule",
        icon: "add",
        activeIcon: "add",
        label: currentTranslations.schedule,
        isSpecial: true, // Специальная кнопка в круге
      },
      {
        name: "Chat",
        icon: "chatbubbles-outline",
        activeIcon: "chatbubbles",
        label: currentTranslations.chats,
      },
      {
        name: "ClientProfile",
        icon: "person-outline",
        activeIcon: "person",
        label: currentTranslations.profile,
      },
      // Водительские табы
      {
        name: "Orders",
        icon: "list-outline",
        activeIcon: "list",
        label: currentTranslations.orders,
      },
      {
        name: "Earnings",
        icon: "wallet-outline",
        activeIcon: "wallet",
        label: currentTranslations.earnings,
        isSpecial: true, // Специальная кнопка в круге
      },
      {
        name: "Profile",
        icon: "person-outline",
        activeIcon: "person",
        label: currentTranslations.profile,
      },
    ],
    [language, currentTranslations],
  );

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: currentColors.tabBar,
          borderTopColor: currentColors.border,
        },
      ]}
    >
      {state.routes.map(
        (route: { key: string; name: string }, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tab = tabConfig.find((t) => t.name === route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Проверяем, является ли это специальной кнопкой в круге
          const isSpecialTab = tab?.isSpecial;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tabItem,
                isSpecialTab && styles.specialTabContainer,
              ]}
            >
              {isSpecialTab ? (
                // Специальная кнопка в круге
                <View
                  style={[
                    styles.specialTabCircle,
                    {
                      backgroundColor: isFocused
                        ? currentColors.primary
                        : currentColors.primary,
                      shadowColor: isFocused
                        ? currentColors.primary
                        : currentColors.primary,
                      borderColor: isFocused
                        ? currentColors.primary
                        : currentColors.primary,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      (isFocused
                        ? tab?.activeIcon
                        : tab?.icon) as keyof typeof Ionicons.glyphMap
                    }
                    size={30}
                    color="#fff"
                    style={styles.specialTabIcon}
                  />
                </View>
              ) : (
                // Обычная иконка
                <Ionicons
                  name={
                    (isFocused
                      ? tab?.activeIcon
                      : tab?.icon) as keyof typeof Ionicons.glyphMap
                  }
                  size={24}
                  color={
                    isFocused
                      ? currentColors.primary
                      : currentColors.textSecondary
                  }
                />
              )}

              {!isSpecialTab && (
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused
                        ? currentColors.primary
                        : currentColors.textSecondary,
                    },
                  ]}
                >
                  {tab?.label}
                </Text>
              )}

              {isFocused && !isSpecialTab && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: currentColors.primary },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        },
      )}
    </View>
  );
};

export default TabBar;
