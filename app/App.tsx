import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { ProfileProvider } from '../src/context/ProfileContext';
import { PackageProvider } from '../src/context/PackageContext';
import { LevelProgressProvider } from '../src/context/LevelProgressContext';
import { BalanceProvider } from '../src/context/BalanceContext';

import RootNavigator from '../src/navigation/RootNavigator';
import { LanguageProvider } from '../src/context/LanguageContext';
import DynamicStatusBar from '../src/components/DynamicStatusBar';
import PushNotificationService from '../src/services/PushNotificationService';
import 'formdata-polyfill';

function App() {
  useEffect(() => {
    // Инициализация push-уведомлений при запуске приложения
    const initNotifications = async () => {
      try {
        const notificationService = PushNotificationService.getInstance();
        await notificationService.requestPermissions();
      } catch (error) {
        console.warn('Failed to initialize notifications:', error);
      }
    };

    initNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <BalanceProvider>
                <ProfileProvider>
                  <PackageProvider>
                    <LevelProgressProvider>
                      <NavigationContainer>
                        <RootNavigator />
                        <DynamicStatusBar />
                      </NavigationContainer>
                    </LevelProgressProvider>
                  </PackageProvider>
                </ProfileProvider>
              </BalanceProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);