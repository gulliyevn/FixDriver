import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/language';
import TabBar from './TabBar';

// Импорт экранов
import MapScreen from '../screens/common/MapScreen';
import { OrdersScreen } from '../screens/common/OrdersScreen/OrdersScreen';
import EarningsScreen from '../screens/driver/EarningsScreen/EarningsScreen';
import ChatStack from './ChatStack';
import ProfileStack from './ProfileStack';

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
        component={ChatStack}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          tabBarStyle: { display: 'none' }, // Скрываем таббар для экрана профиля
        }}
      />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
