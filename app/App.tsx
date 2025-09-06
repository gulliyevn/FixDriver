import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/presentation/context/ThemeContext';
import { AuthProvider } from '../src/presentation/context/AuthContext';
import { ProfileProvider } from '../src/presentation/context/ProfileContext';
import { PackageProvider } from '../src/presentation/context/PackageContext';
import { LevelProgressProvider } from '../src/presentation/context/LevelProgressContext';
import { BalanceProvider } from '../src/presentation/context/BalanceContext';

import RootNavigator from '../src/presentation/navigation/RootNavigator';
import { LanguageProvider } from '../src/presentation/context/LanguageContext';
import DynamicStatusBar from '../src/presentation/components/DynamicStatusBar';
import { NotificationService } from '../src/data/datasources/notification/NotificationService';
import 'formdata-polyfill';

function App() {
  useEffect(() => {
    // Инициализация уведомлений при запуске приложения
    const initNotifications = async () => {
      try {
        const notificationService = NotificationService.getInstance();
        // NotificationService готов к использованию
        console.log('NotificationService initialized');
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