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
        // Улучшаем анимации навигации
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
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
          // Включаем свайп назад
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator; 