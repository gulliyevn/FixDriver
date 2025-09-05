// import { registerRootComponent } from 'expo';
// import React, { useEffect } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { ThemeProvider } from '../src/context/ThemeContext';
// import { AuthProvider } from '../src/context/AuthContext';
// import { ProfileProvider } from '../src/context/ProfileContext';
// import { PackageProvider } from '../src/context/PackageContext';
// import { LevelProgressProvider } from '../src/context/LevelProgressContext';
// import { BalanceProvider } from '../src/context/BalanceContext';

// import RootNavigator from '../src/navigation/RootNavigator';
// import { LanguageProvider } from '../src/context/LanguageContext';
// import DynamicStatusBar from '../src/components/DynamicStatusBar';
// import PushNotificationService from '../src/services/PushNotificationService';
// import 'formdata-polyfill';

// function App() {
//   useEffect(() => {
//     // Инициализация push-уведомлений при запуске приложения
//     const initNotifications = async () => {
//       try {
//         const notificationService = PushNotificationService.getInstance();
//         await notificationService.requestPermissions();
//       } catch (error) {
//         console.warn('Failed to initialize notifications:', error);
//       }
//     };

//     initNotifications();
//   }, []);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <LanguageProvider>
//           <ThemeProvider>
//             <AuthProvider>
//               <BalanceProvider>
//                 <ProfileProvider>
//                   <PackageProvider>
//                     <LevelProgressProvider>
//                       <NavigationContainer>
//                         <RootNavigator />
//                         <DynamicStatusBar />
//                       </NavigationContainer>
//                     </LevelProgressProvider>
//                   </PackageProvider>
//                 </ProfileProvider>
//               </BalanceProvider>
//             </AuthProvider>
//           </ThemeProvider>
//         </LanguageProvider>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }

// registerRootComponent(App);


// Рендеринг новой архитектуры
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

// Импорт из нового index.ts
import { 
  ThemeProvider, 
  AuthProvider,
  MainNavigator 
} from '../architecture_src_new';
import { LevelProgressProvider } from '../architecture_src_new/core/context/LevelProgressContext';
import { BalanceProvider } from '../architecture_src_new/core/context/BalanceContext';
import { I18nProvider } from '../architecture_src_new/shared/i18n';

const Stack = createNativeStackNavigator();

function AppNew() {
  // TODO: Добавить логику аутентификации
  const isAuthenticated = true; // Пока что true для тестирования навигации

  const handleLogout = () => {
    console.log('Logout pressed');
    // TODO: Implement logout logic
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>
              <LevelProgressProvider>
                <BalanceProvider>
                  <NavigationContainer>
        <Stack.Navigator 
          id={undefined}
          initialRouteName={isAuthenticated ? "MainApp" : "Login"} 
          screenOptions={{ headerShown: false }}
        >
          {isAuthenticated ? (
            // Аутентифицированный пользователь
            <Stack.Screen 
              name="MainApp" 
              options={{ gestureEnabled: false }}
            >
              {() => <MainNavigator onLogout={handleLogout} />}
            </Stack.Screen>
          ) : (
            // Неаутентифицированный пользователь
            <>
              <Stack.Screen name="Login" component={() => <></>} options={{ gestureEnabled: false }} />
              <Stack.Screen name="Register" component={() => <></>} />
              <Stack.Screen name="ForgotPassword" component={() => <></>} />
              <Stack.Screen name="ResetPassword" component={() => <></>} />
              <Stack.Screen name="RoleSelect" component={() => <></>} options={{ gestureEnabled: false }} />
              <Stack.Screen name="Modal" component={() => <></>} />
            </>
          )}
        </Stack.Navigator>
                  </NavigationContainer>
                </BalanceProvider>
              </LevelProgressProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default AppNew;

// Регистрация компонента для Expo
registerRootComponent(AppNew);