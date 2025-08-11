import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from '../screens/common/chats/ChatListScreen';
import ChatScreen from '../screens/common/chats/ChatScreen';
import { ChatStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ChatStackParamList>();

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
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator; 