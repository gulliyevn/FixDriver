import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClientStackParamList } from '../types/navigation';
import MapScreen from '../screens/client/MapScreen';
import ChatListScreen from '../screens/client/ChatListScreen';
import ChatScreen from '../screens/client/ChatScreen';
import DriversScreen from '../screens/client/DriversScreen';
import PlusScreen from '../screens/client/PlusScreen';
import ScheduleScreen from '../screens/client/ScheduleScreen';

const Tab = createBottomTabNavigator<ClientStackParamList>();

const ClientNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      id="ClientTab"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="ChatList" component={ChatListScreen} />
      <Tab.Screen name="ChatConversation" component={ChatScreen} />
      <Tab.Screen name="Drivers" component={DriversScreen} />
      <Tab.Screen name="Plus" component={PlusScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
    </Tab.Navigator>
  );
};

export default ClientNavigator;
