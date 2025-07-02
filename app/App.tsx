import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { ProfileProvider } from '../src/context/ProfileContext';
import RootNavigator from '../src/navigation/RootNavigator';
import testJWT from '../src/utils/jwtTest';

function App() {
  useEffect(() => {
    // Тестируем JWT систему при запуске
    if (__DEV__) {
      setTimeout(() => {
        testJWT();
      }, 2000);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
