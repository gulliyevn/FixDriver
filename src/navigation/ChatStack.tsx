import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from '../screens/common/chats/ChatListScreen';
import ChatScreen from '../screens/common/chats/ChatScreen';
import { ChatStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ChatStackParamList>();

const ChatStack: React.FC = () => {
  return (
    <Stack.Navigator
      // @ts-ignore
      id="ChatStack"
      initialRouteName="ChatList"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen}
      />
      <Stack.Screen 
        name="ChatConversation" 
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
