import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ModalScreen from '../screens/auth/ModalScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import MapScreen from '../screens/common/MapScreen';
import MainNavigator from './MainNavigator';
import { useAuth } from '../../core/context/AuthContext';

// Define the navigation types
export type AuthStackParamList = {
  RoleSelect: undefined;
  Login: undefined;
  Register: { role: 'client' | 'driver' } | undefined;
  ForgotPassword: undefined;
  Modal: {
    type: 'terms' | 'privacy';
    role?: 'client' | 'driver';
  };
  ResetPassword: { token: string };
  Map: undefined;
  Main: undefined;
};

type ScreenName = keyof AuthStackParamList;

// Simple navigator without animations
const AuthNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('RoleSelect');
  const [routeParams, setRouteParams] = useState<any>({});
  const [previousScreen, setPreviousScreen] = useState<ScreenName | null>(null);

  // Redirect to Main if already authenticated
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      setCurrentScreen('Main');
    } else {
      setCurrentScreen('RoleSelect');
    }
  }, [isAuthenticated, isLoading]);

  const navigate = (screenName: ScreenName, params?: any) => {
    setPreviousScreen(currentScreen);
    if (params) {
      setRouteParams(params);
    }
    setCurrentScreen(screenName);
  };

  const goBack = () => {
    if (previousScreen) {
      setCurrentScreen(previousScreen);
      setPreviousScreen(null);
    }
  };

  // Create navigation object
  const navigation = {
    navigate: (screenName: ScreenName, params?: any) => navigate(screenName, params),
    goBack: () => goBack(),
    reset: (config: { index: number; routes: { name: ScreenName; params?: any }[] }) => {
      if (config.routes.length > 0) {
        const first = config.routes[0];
        navigate(first.name, first.params);
      }
    },
  };

  // Show simple loader while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Render current screen
  switch (currentScreen) {
    case 'RoleSelect':
      return <RoleSelectScreen navigation={navigation} />;
    case 'Login':
      return <LoginScreen navigation={navigation} />;
    case 'Register':
      return <RegisterScreen navigation={navigation} route={{ params: routeParams }} />;
    case 'ForgotPassword':
      return <ForgotPasswordScreen navigation={navigation} />;
    case 'Modal':
      return <ModalScreen navigation={navigation} route={{ params: routeParams }} />;
    case 'ResetPassword':
      return <ResetPasswordScreen navigation={navigation} route={{ params: routeParams }} />;
    case 'Map':
      return <MapScreen />;
    case 'Main':
      return <MainNavigator onLogout={() => navigate('Login')} />;
    default:
      return <RoleSelectScreen navigation={navigation} />;
  }
};

export default AuthNavigator;
