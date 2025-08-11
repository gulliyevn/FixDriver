import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { ProfileProvider } from '../src/context/ProfileContext';
import { PackageProvider } from '../src/context/PackageContext';

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
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProfileProvider>
              <PackageProvider>
                <NavigationContainer>
                  <RootNavigator />
                  <DynamicStatusBar />
                </NavigationContainer>
              </PackageProvider>
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
