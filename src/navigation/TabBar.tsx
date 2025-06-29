import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ICONS: Record<string, any> = {
  'Карта': <Ionicons name="map" size={26} />,
  'Водители': <MaterialIcons name="directions-car" size={26} />,
  'Заказы': <MaterialIcons name="assignment" size={26} />,
  'Чат': <Ionicons name="chatbubble-ellipses" size={26} />,
  'Профиль': <Ionicons name="person-circle" size={26} />,
  'Plus': <Ionicons name="add" size={36} />,
  'Earnings': <FontAwesome name="money" size={36} />,
};

const ACTIVE_COLORS: Record<string, string> = {
  'Карта': '#1E3A8A',
  'Водители': '#1E3A8A',
  'Заказы': '#FF9500',
  'Чат': '#1E3A8A',
  'Профиль': '#1E3A8A',
  'Plus': '#fff',
  'Earnings': '#fff',
};

export default function TabBar({ state, descriptors, navigation }: any) {
  const { isDark } = useTheme();

  return (
    <View style={[styles.tabBar, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;
        const isCenter = label === 'Plus';
        const color = isFocused ? ACTIVE_COLORS[label] || '#1E3A8A' : '#6B7280';
        
        if (isCenter) {
          // Центральная кнопка "+" для быстрого бронирования
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => navigation.navigate('Plus')}
              style={styles.centerButtonWrap}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={isDark ? ['#3B82F6', '#60A5FA'] : ['#1E3A8A', '#3B82F6']}
                style={styles.centerButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add" size={36} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          );
        }

        // Обычные табы
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            {ICONS[label] && React.cloneElement(ICONS[label], { color })}
            <Text style={[
              styles.label, 
              { 
                color, 
                fontWeight: isFocused ? '600' : '400',
                fontSize: isFocused ? 12 : 11,
              }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 84,
    paddingBottom: 20,
    paddingTop: 8,
    borderTopWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
  },
  centerButtonWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -18,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
});
