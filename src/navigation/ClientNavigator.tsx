import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '../screens/client/MapScreen';
import DriversScreen from '../screens/client/DriversScreen';
import ChatListScreen from '../screens/client/ChatListScreen';
import ScheduleScreen from '../screens/client/ScheduleScreen';
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
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Drivers" component={DriversScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
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
