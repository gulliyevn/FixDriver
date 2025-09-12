import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/language';
import { getCurrentColors } from '../../shared/constants/colors';
import { TabBarStyles as styles } from '../../shared/styles/navigation/TabBar.styles';

interface TabBarProps {
  state: { routes: Array<{ key: string; name: string }>; index: number };
  descriptors: Record<string, { options: { tabBarAccessibilityLabel?: string; tabBarTestID?: string } }>;
  navigation: { emit: (event: { type: string; target: string; canPreventDefault?: boolean }) => { defaultPrevented?: boolean }; navigate: (name: string) => void };
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = getCurrentColors(isDark);

  const tabConfig = useMemo(() => [
    // Client tabs
    {
      name: 'Map',
      icon: 'map-outline',
      activeIcon: 'map',
      label: t('navigation.tabs.map'),
    },
    {
      name: 'Drivers',
      icon: 'people-outline',
      activeIcon: 'people',
      label: t('navigation.tabs.drivers'),
    },
    {
      name: 'Schedule',
      icon: 'add',
      activeIcon: 'add',
      label: t('navigation.tabs.schedule'),
      isSpecial: true,
    },
    {
      name: 'Chat',
      icon: 'chatbubbles-outline',
      activeIcon: 'chatbubbles',
      label: t('navigation.tabs.chats'),
    },
    {
      name: 'ClientProfile',
      icon: 'person-outline',
      activeIcon: 'person',
      label: t('navigation.tabs.profile'),
    },
    // Driver tabs
    {
      name: 'Orders',
      icon: 'list-outline',
      activeIcon: 'list',
      label: t('navigation.tabs.orders'),
    },
    {
      name: 'Earnings',
      icon: 'wallet-outline',
      activeIcon: 'wallet',
      label: t('navigation.tabs.earnings'),
      isSpecial: true,
    },
    {
      name: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
      label: t('navigation.tabs.profile'),
    },
  ], [t]);

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

        // Check if this is a special circular button
        const isSpecialTab = tab?.isSpecial;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabItem, isSpecialTab && styles.specialTabContainer]}
          >
            {isSpecialTab ? (
              // Special circular button
              <View style={[
                styles.specialTabCircle,
                {
                  backgroundColor: currentColors.primary,
                  shadowColor: currentColors.primary,
                  borderColor: currentColors.primary,
                }
              ]}>
                <Ionicons
                  name={(isFocused ? tab?.activeIcon : tab?.icon) as keyof typeof Ionicons.glyphMap}
                  size={30}
                  color="#fff"
                />
              </View>
            ) : (
              // Regular icon
              <Ionicons
                name={(isFocused ? tab?.activeIcon : tab?.icon) as keyof typeof Ionicons.glyphMap}
                size={24}
                color={isFocused ? currentColors.primary : currentColors.textSecondary}
              />
            )}
            
            {!isSpecialTab && (
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? currentColors.primary : currentColors.textSecondary }
              ]}>
                {tab?.label}
              </Text>
            )}
            
            {isFocused && !isSpecialTab && (
              <View style={[styles.tabIndicator, { backgroundColor: currentColors.primary }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
