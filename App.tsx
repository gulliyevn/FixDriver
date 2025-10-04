import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Old architecture providers and navigation
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { BalanceProvider } from './src/context/BalanceContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { PackageProvider } from './src/context/PackageContext';
import { LevelProgressProvider } from './src/context/LevelProgressContext';
import './src/utils/devTools'; // DEV tools для консоли
import 'formdata-polyfill';

const App: React.FC = () => {
  useEffect(() => {
    // Инициализация уведомлений при запуске приложения
    const initNotifications = async () => {
      try {
        // NotificationService уже инициализирован как singleton
        console.log('NotificationService ready');
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
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <BalanceProvider>
                  <ProfileProvider>
                    <PackageProvider>
                      <LevelProgressProvider>
                        <RootNavigator />
                      </LevelProgressProvider>
                    </PackageProvider>
                  </ProfileProvider>
                </BalanceProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
registerRootComponent(App);