import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import DriverNavigator from './DriverNavigator';
import { UserRole } from '../types/user';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Можно добавить экран загрузки
    return null;
  }

  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {user ? (
        // Аутентифицированный пользователь
        user.role === UserRole.DRIVER ? (
          <Stack.Screen name="DriverApp" component={DriverNavigator} />
        ) : (
          <Stack.Screen name="ClientApp" component={ClientNavigator} />
        )
      ) : (
        // Неаутентифицированный пользователь
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
