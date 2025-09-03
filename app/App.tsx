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

// Импорт ThemeProvider
import { ThemeProvider } from '../architecture_src_new/core/context/ThemeContext';

// Импорт экранов из новой архитектуры
import LoginScreen from '../architecture_src_new/presentation/screens/auth/LoginScreen';
import RegisterScreen from '../architecture_src_new/presentation/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../architecture_src_new/presentation/screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../architecture_src_new/presentation/screens/auth/ResetPasswordScreen';
import RoleSelectScreen from '../architecture_src_new/presentation/screens/auth/RoleSelectScreen';
import ModalScreen from '../architecture_src_new/presentation/screens/auth/ModalScreen';
import MainNavigator from '../architecture_src_new/presentation/navigation/MainNavigator';

const Stack = createNativeStackNavigator();

function AppNew() {
  // TODO: Добавить логику аутентификации
  const isAuthenticated = true; // Пока что true для тестирования навигации

  return (
    <SafeAreaProvider>
      <ThemeProvider>
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
              component={MainNavigator}
              options={{ gestureEnabled: false }}
            />
          ) : (
            // Неаутентифицированный пользователь
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ gestureEnabled: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
              <Stack.Screen name="RoleSelect" component={RoleSelectScreen} options={{ gestureEnabled: false }} />
              <Stack.Screen name="Modal" component={ModalScreen} />
            </>
          )}
        </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default AppNew;

// Регистрация компонента для Expo
import { registerRootComponent } from 'expo';
registerRootComponent(AppNew);