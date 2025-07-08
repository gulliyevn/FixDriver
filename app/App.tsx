import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { ProfileProvider } from '../src/context/ProfileContext';
import RootNavigator from '../src/navigation/RootNavigator';
import SimpleTestScreen from '../src/screens/auth/SimpleTestScreen';

function App() {
  // Временно показываем тестовый экран для отладки
  const showTestScreen = __DEV__;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <NavigationContainer>
              {showTestScreen ? (
                <SimpleTestScreen />
              ) : (
                <RootNavigator />
              )}
              <StatusBar style="auto" />
            </NavigationContainer>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
