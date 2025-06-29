import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import TabBar from './TabBar';

// Импорт экранов
import MapScreen from '../screens/driver/MapScreen';
import OrdersScreen from '../screens/driver/OrdersScreen';
import EarningsScreen from '../screens/driver/EarningsScreen';
import ChatScreen from '../screens/driver/ChatScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';

const Tab = createBottomTabNavigator();

const DriverNavigator: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#181A20' : '#fff',
          borderTopColor: isDark ? '#333' : '#e0e0e0',
        },
      }}
    >
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarLabel: 'Карта',
          tabBarIcon: ({ focused, color, size }) => <Text style={{ fontSize: size }}>🗺️</Text>,
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Заказы',
          tabBarIcon: ({ focused, color, size }) => <Text style={{ fontSize: size }}>📋</Text>,
        }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused, color, size }) => <Text style={{ fontSize: size }}>💰</Text>,
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: 'Чат',
          tabBarIcon: ({ focused, color, size }) => <Text style={{ fontSize: size }}>💬</Text>,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={DriverProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ focused, color, size }) => <Text style={{ fontSize: size }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
