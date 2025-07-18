import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getCurrentColors } from '../constants/colors';
import { TabBarStyles as styles } from '../styles/navigation/TabBar.styles';

interface TabBarProps {
  state: { routes: Array<{ key: string; name: string }>; index: number };
  descriptors: Record<string, { options: { tabBarAccessibilityLabel?: string; tabBarTestID?: string } }>;
  navigation: { emit: (event: { type: string; target: string; canPreventDefault?: boolean }) => { defaultPrevented?: boolean }; navigate: (name: string) => void };
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const currentColors = getCurrentColors(isDark);

  // Temporary static translations for debugging
  const staticTranslations = {
    ru: {
      map: 'Карта',
      drivers: 'Водители',
      schedule: 'Расписание',
      chats: 'Чаты',
      profile: 'Профиль'
    },
    en: {
      map: 'Map',
      drivers: 'Drivers',
      schedule: 'Schedule',
      chats: 'Chats',
      profile: 'Profile'
    },
    az: {
      map: 'Xəritə',
      drivers: 'Sürücülər',
      schedule: 'Cədvəl',
      chats: 'Söhbətlər',
      profile: 'Profil'
    },
    tr: {
      map: 'Harita',
      drivers: 'Sürücüler',
      schedule: 'Program',
      chats: 'Sohbetler',
      profile: 'Profil'
    },
    es: {
      map: 'Mapa',
      drivers: 'Conductores',
      schedule: 'Horario',
      chats: 'Chats',
      profile: 'Perfil'
    },
    fr: {
      map: 'Carte',
      drivers: 'Chauffeurs',
      schedule: 'Planning',
      chats: 'Chats',
      profile: 'Profil'
    },
    de: {
      map: 'Karte',
      drivers: 'Fahrer',
      schedule: 'Zeitplan',
      chats: 'Chats',
      profile: 'Profil'
    },
    ar: {
      map: 'الخريطة',
      drivers: 'السائقين',
      schedule: 'الجدول',
      chats: 'الدردشات',
      profile: 'الملف الشخصي'
    }
  };

  const currentTranslations = staticTranslations[language] || staticTranslations.ru;

  const tabConfig = useMemo(() => [
    {
      name: 'Map',
      icon: 'map-outline',
      activeIcon: 'map',
      label: currentTranslations.map,
    },
    {
      name: 'Drivers',
      icon: 'people-outline',
      activeIcon: 'people',
      label: currentTranslations.drivers,
    },
    {
      name: 'Schedule',
      icon: 'calendar-outline',
      activeIcon: 'calendar',
      label: currentTranslations.schedule,
    },
    {
      name: 'Chat',
      icon: 'chatbubbles-outline',
      activeIcon: 'chatbubbles',
      label: currentTranslations.chats,
    },
    {
      name: 'ClientProfile',
      icon: 'person-outline',
      activeIcon: 'person',
      label: currentTranslations.profile,
    },
  ], [language, currentTranslations]);

  return (
    <View style={[
      styles.tabBar, 
      { 
        backgroundColor: currentColors.tabBar,
        borderTopColor: currentColors.border 
      }
    ]}> 
      {state.routes.map((route: { key: string; name: string }, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tab = tabConfig.find(t => t.name === route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <Ionicons
              name={(isFocused ? tab?.activeIcon : tab?.icon) as keyof typeof Ionicons.glyphMap}
              size={24}
              color={isFocused ? currentColors.primary : currentColors.textSecondary}
            />
            <Text style={[
              styles.tabLabel,
              { color: isFocused ? currentColors.primary : currentColors.textSecondary }
            ]}>
              {tab?.label}
            </Text>
            {isFocused && (
              <View style={[styles.tabIndicator, { backgroundColor: currentColors.primary }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
