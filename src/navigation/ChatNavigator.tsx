import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import ChatListScreen from '../screens/client/ChatListScreen';
import ChatScreen from '../screens/client/ChatScreen';
import { ClientStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ClientStackParamList>();

const ChatNavigator: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Обрабатываем параметры для создания чата
  useEffect(() => {
    const params = route.params as any;
    if (params?.screen === 'ChatConversation' && params?.params) {
      // Навигация к конкретному чату
      (navigation as any).navigate('ChatConversation', params.params);
    }
  }, [route.params, navigation]);

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