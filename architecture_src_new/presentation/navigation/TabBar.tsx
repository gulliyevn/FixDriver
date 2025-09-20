import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../shared/i18n';
import { createTabBarStyles } from '../../shared/styles/navigation/TabBar.styles';
import { useTheme } from '../../core/context/ThemeContext';

type Role = 'client' | 'driver';

interface TabBarProps {
  currentRole: Role;
  onRoleSwitch: (role: Role) => void;
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  currentRole,
  onRoleSwitch,
  activeTab,
  onTabPress,
}) => {
  const { t } = useI18n();
  const { isDark, colors } = useTheme();
  const styles = createTabBarStyles(isDark);

  // Конфигурация табов для каждой роли
  const clientTabs = [
    { name: 'Map', icon: 'map-outline' as const, activeIcon: 'map' as const, label: t('navigation.map') },
    { name: 'Drivers', icon: 'people-outline' as const, activeIcon: 'people' as const, label: t('navigation.drivers') },
    { name: 'Schedule', icon: 'add' as const, activeIcon: 'add' as const, label: t('navigation.schedule'), isSpecial: true },
    { name: 'Chat', icon: 'chatbubbles-outline' as const, activeIcon: 'chatbubbles' as const, label: t('navigation.chats') },
    { name: 'Profile', icon: 'person-outline' as const, activeIcon: 'person' as const, label: t('profile.title') },
  ];

  const driverTabs = [
    { name: 'Map', icon: 'map-outline' as const, activeIcon: 'map' as const, label: t('navigation.map') },
    { name: 'Orders', icon: 'list-outline' as const, activeIcon: 'list' as const, label: t('navigation.orders') },
    { name: 'Earnings', icon: 'wallet-outline' as const, activeIcon: 'wallet' as const, label: t('navigation.earnings'), isSpecial: true },
    { name: 'Chat', icon: 'chatbubbles-outline' as const, activeIcon: 'chatbubbles' as const, label: t('navigation.chats') },
    { name: 'Profile', icon: 'person-outline' as const, activeIcon: 'person' as const, label: t('profile.title') },
  ];

  const currentTabs = currentRole === 'client' ? clientTabs : driverTabs;

  const handleTabPress = (tabName: string) => {
    if (tabName === 'Profile') {
      // В профиле показываем кнопку смены роли
      onTabPress(tabName);
    } else {
      onTabPress(tabName);
    }
  };

  return (
    <View style={styles.tabBar}>
      {currentTabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const isSpecial = tab.isSpecial;

        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabItem, isSpecial && styles.specialTabContainer]}
            onPress={() => handleTabPress(tab.name)}
          >
            {isSpecial ? (
              // Специальная кнопка в круге
              <View style={[
                styles.specialTabCircle,
                {
                  backgroundColor: colors.primary,
                }
              ]}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={30}
                  color="#fff"
                />
              </View>
            ) : (
              // Обычная иконка
              <>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text style={[
                  styles.tabLabel,
                  { color: isActive ? colors.primary : colors.textSecondary }
                ]}>
                  {tab.label}
                </Text>
                {isActive && (
                  <View style={styles.tabIndicator} />
                )}
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
