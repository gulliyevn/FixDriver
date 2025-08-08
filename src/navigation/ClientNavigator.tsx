import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import OrdersMapScreen from '../screens/common/OrdersMapScreen';
import DriversScreen from '../screens/client/DriversScreen';
import ChatStack from './ChatStack';
import AddOrderScreen from '../screens/common/AddOrderScreen';
import ClientProfileStack from './ClientProfileStack';
import { ClientStackParamList } from '../types/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import TabBar from './TabBar';

const Tab = createBottomTabNavigator<ClientStackParamList>();

// Обёртка для TabBar, чтобы подписаться на смену языка
function TabBarWithLanguage(props: any) {
  useLanguage();
  return <TabBar {...props} />;
}

const ClientNavigator: React.FC = () => {
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
      <Tab.Screen name="Map" component={OrdersMapScreen} />
      <Tab.Screen name="Drivers" component={DriversScreen} />
      <Tab.Screen name="Schedule" component={AddOrderScreen} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen 
        name="ClientProfile" 
        component={ClientProfileStack}
        options={{
          tabBarStyle: { display: 'none' }, // Скрываем таббар для экрана профиля
        }}
      />
    </Tab.Navigator>
  );
};

export default ClientNavigator;
