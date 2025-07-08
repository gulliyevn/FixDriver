import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '../screens/client/MapScreen';
import DriversScreen from '../screens/client/DriversScreen';
import ChatListScreen from '../screens/client/ChatListScreen';
import ChatScreen from '../screens/client/ChatScreen';
import PlusScreen from '../screens/client/PlusScreen';
import ScheduleScreen from '../screens/client/ScheduleScreen';
import { TabBarStyles } from '../styles/navigation/TabBar.styles';
import { ClientStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<ClientStackParamList>();

const ClientNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      id="ClientTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: TabBarStyles.tabBar,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
          tabBarLabel: 'Карта',
        }}
      />
      <Tab.Screen
        name="Drivers"
        component={DriversScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" size={size} color={color} />
          ),
          tabBarLabel: 'Водители',
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
          tabBarLabel: 'Чаты',
        }}
      />
      <Tab.Screen
        name="Plus"
        component={PlusScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
          tabBarLabel: 'Плюс',
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          tabBarLabel: 'Расписание',
        }}
      />
    </Tab.Navigator>
  );
};

export default ClientNavigator;
