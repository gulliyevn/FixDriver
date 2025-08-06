import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import TabBar from './TabBar';

// Импорт экранов
import MapScreen from '../screens/driver/MapScreen';
import OrdersScreen from '../screens/driver/OrdersScreen';
import EarningsScreen from '../screens/driver/EarningsScreen';
import ChatScreen from '../screens/driver/ChatScreen';
import DriverProfileStack from './driver/DriverProfileStack';

const Tab = createBottomTabNavigator();

// Обёртка для TabBar, чтобы подписаться на смену языка
function TabBarWithLanguage(props: any) {
  useLanguage();
  return <TabBar {...props} />;
}

const DriverNavigator: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <TabBarWithLanguage {...props} />}
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
          tabBarLabel: '',
          tabBarIcon: () => (
            <Ionicons name="map-outline" size={24} color="#666" />
          ),
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <Ionicons name="list-outline" size={24} color="#666" />
          ),
        }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <Ionicons name="add-circle-outline" size={24} color="#666" />
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <Ionicons name="chatbubbles-outline" size={24} color="#666" />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={DriverProfileStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <Ionicons name="person-outline" size={24} color="#666" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
