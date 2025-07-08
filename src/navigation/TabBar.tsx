import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { colors, SIZES, SHADOWS } from '../constants/colors';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;

  const tabConfig = [
    {
      name: 'Map',
      icon: 'map',
      activeIcon: 'map',
      label: 'Карта',
    },
    {
      name: 'Drivers',
      icon: 'people-outline',
      activeIcon: 'people',
      label: 'Водители',
    },
    {
      name: 'Plus',
      icon: 'add-circle-outline',
      activeIcon: 'add-circle',
      label: 'Поездка',
    },
    {
      name: 'ChatList',
      icon: 'chatbubbles-outline',
      activeIcon: 'chatbubbles',
      label: 'Чаты',
    },
    {
      name: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
      label: 'Профиль',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentColors.tabBar }]}>
      {state.routes.map((route: any, index: number) => {
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
            style={styles.tab}
          >
            <View style={[
              styles.iconContainer,
              isFocused && { backgroundColor: currentColors.primary + '20' }
            ]}>
                             <Ionicons
                 name={(isFocused ? tab?.activeIcon : tab?.icon) as any}
                 size={24}
                 color={isFocused ? currentColors.primary : currentColors.textSecondary}
               />
            </View>
            <Text style={[
              styles.label,
              { color: isFocused ? currentColors.primary : currentColors.textSecondary }
            ]}>
              {tab?.label}
            </Text>
            {isFocused && (
              <View style={[styles.indicator, { backgroundColor: currentColors.primary }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: SIZES.sm,
    paddingTop: SIZES.sm,
    paddingHorizontal: SIZES.sm,
    ...SHADOWS.light.large,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xs,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xs,
  },
  label: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    borderRadius: 1.5,
  },
});

export default TabBar;
