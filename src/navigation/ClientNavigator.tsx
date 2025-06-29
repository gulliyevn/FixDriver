import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import TabBar from './TabBar';
import MapScreen from '../screens/client/MapScreen';
import DriversScreen from '../screens/client/DriversScreen';
import PlusScreen from '../screens/client/PlusScreen';
import ChatNavigator from './ChatNavigator';
import ClientProfileScreen from '../screens/profile/ClientProfileScreen';

const Tab = createBottomTabNavigator();

const ClientNavigator: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={props => <TabBar {...props} />}
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
        name="Drivers" 
        component={DriversScreen}
        options={{
          tabBarLabel: 'Водители',
          tabBarIcon: ({ focused, color, size }) => <Text style={{ fontSize: size }}>🚗</Text>,
        }}
      />
      <Tab.Screen 
        name="Plus" 
        component={PlusScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused, color, size }) => <Text style={{ fontSize: size }}>➕</Text>,
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatNavigator}
        options={{
          tabBarLabel: 'Чат',
          tabBarIcon: ({ focused, color, size }) => <Text style={{ fontSize: size }}>💬</Text>,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ClientProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ focused, color, size }) => <Text style={{ fontSize: size }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default ClientNavigator;
