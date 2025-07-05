import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TabBarStyles } from '../styles/navigation/TabBar.styles';

interface TabBarProps {
  state: {
    routes: Array<{ key: string; name: string }>;
    index: number;
  };
  navigation: {
    navigate: (name: string) => void;
  };
}

const getTabIcon = (routeName: string, isFocused: boolean): string => {
  switch (routeName) {
    case 'Map':
      return isFocused ? 'map' : 'map-outline';
    case 'Bookings':
      return isFocused ? 'calendar' : 'calendar-outline';
    case 'Chat':
      return isFocused ? 'chatbubbles' : 'chatbubbles-outline';
    case 'Profile':
      return isFocused ? 'person' : 'person-outline';
    default:
      return 'help-circle-outline';
  }
};

const getTabLabel = (routeName: string): string => {
  switch (routeName) {
    case 'Map':
      return 'Карта';
    case 'Bookings':
      return 'Заказы';
    case 'Chat':
      return 'Чат';
    case 'Profile':
      return 'Профиль';
    default:
      return routeName;
  }
};

export default function TabBar({ state, navigation }: TabBarProps) {
  const { isDark } = useTheme();

  return (
    <View style={[TabBarStyles.tabBar, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconName = getTabIcon(route.name, isFocused);

        return (
          <TouchableOpacity
            key={route.key}
            style={TabBarStyles.tabItem}
            onPress={() => navigation.navigate(route.name)}
          >
            <Ionicons
              name={iconName as keyof typeof Ionicons.glyphMap}
              size={24}
              color={isFocused ? '#3B82F6' : isDark ? '#9CA3AF' : '#6B7280'}
            />
            <Text style={[TabBarStyles.tabLabel, { color: isFocused ? '#3B82F6' : isDark ? '#9CA3AF' : '#6B7280' }]}>
              {getTabLabel(route.name)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
