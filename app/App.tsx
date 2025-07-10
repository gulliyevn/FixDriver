import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { ProfileProvider } from '../src/context/ProfileContext';
import RootNavigator from '../src/navigation/RootNavigator';
import { LanguageProvider } from '../src/context/LanguageContext';

// Импортируем TokenUtils для отладки в режиме разработки
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../src/utils/tokenUtils');
}

function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
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
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
