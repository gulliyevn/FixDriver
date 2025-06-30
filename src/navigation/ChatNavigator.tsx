import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from '../screens/client/ChatListScreen';
import ChatScreen from '../screens/client/ChatScreen';
import { ClientStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ClientStackParamList>();

const ChatNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="ChatList"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen}
        options={{
          title: 'Чаты',
        }}
      />
      <Stack.Screen 
        name="ChatConversation" 
        component={ChatScreen}
        options={{
          title: 'Чат',
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator; 