import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Removed legacy providers to avoid mounting old screens/contexts

import { 
  AuthNavigator as NewAuthNavigator, 
  ThemeProvider as NewThemeProvider, 
  AuthProvider as NewAuthProvider,
  BalanceProvider as NewBalanceProvider,
  LevelProgressProvider as NewLevelProgressProvider,
  LanguageProvider as NewLanguageProvider,
  ProfileProvider as NewProfileProvider
} from '../architecture_src_new';
import { I18nProvider } from '../architecture_src_new/shared/i18n';
import NotificationService from '../src/services/NotificationService';
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
        <NavigationContainer>
          <I18nProvider>
            <NewThemeProvider>
              <NewLanguageProvider>
                <NewAuthProvider>
                  <NewBalanceProvider>
                    <NewProfileProvider>
                      <NewLevelProgressProvider>
                    <NewAuthNavigator />
                      </NewLevelProgressProvider>
                    </NewProfileProvider>
                  </NewBalanceProvider>
                </NewAuthProvider>
              </NewLanguageProvider>
            </NewThemeProvider>
          </I18nProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);