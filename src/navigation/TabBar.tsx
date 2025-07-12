import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../constants/colors';
import { TabBarStyles as styles } from '../styles/navigation/TabBar.styles';

interface TabBarProps {
  state: { routes: Array<{ key: string; name: string }>; index: number };
  descriptors: Record<string, { options: { tabBarAccessibilityLabel?: string; tabBarTestID?: string } }>;
  navigation: { emit: (event: { type: string; target: string; canPreventDefault?: boolean }) => { defaultPrevented?: boolean }; navigate: (name: string) => void };
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? colors.dark : colors.light;

  const tabConfig = [
    {
      name: 'Map',
      icon: 'map',
      activeIcon: 'map',
      label: t('navigation.map'),
    },
    {
      name: 'Drivers',
      icon: 'people-outline',
      activeIcon: 'people',
      label: t('navigation.drivers'),
    },
    {
      name: 'Plus',
      icon: 'add-circle-outline',
      activeIcon: 'add-circle',
      label: t('navigation.plus'),
    },
    {
      name: 'ChatList',
      icon: 'chatbubbles-outline',
      activeIcon: 'chatbubbles',
      label: t('navigation.chats'),
    },
    {
      name: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
      label: t('navigation.profile'),
    },
  ];

  return (
    <View style={[styles.tabBar, { backgroundColor: currentColors.tabBar }]}> 
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
            <View style={styles.tabIcon}>
              <Ionicons
                name={(isFocused ? tab?.activeIcon : tab?.icon) as keyof typeof Ionicons.glyphMap}
                size={24}
                color={isFocused ? currentColors.primary : currentColors.textSecondary}
              />
            </View>
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
