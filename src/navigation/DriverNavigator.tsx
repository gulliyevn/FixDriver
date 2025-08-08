import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import TabBar from './TabBar';

// Импорт экранов
import OrdersMapScreen from '../screens/common/OrdersMapScreen';
import OrdersScreen from '../screens/driver/OrdersScreen';
import EarningsScreen from '../screens/common/EarningsScreen';
import ChatListScreen from '../screens/common/chats/ChatListScreen';
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
        component={OrdersMapScreen}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatListScreen}
      />
      <Tab.Screen 
        name="Profile" 
        component={DriverProfileStack}
        options={{
          tabBarStyle: { display: 'none' }, // Скрываем таббар для экрана профиля
        }}
      />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
