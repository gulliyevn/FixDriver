import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet } from 'react-native';
import 'formdata-polyfill';

// Import new architecture components
import AuthNavigator from '../src/presentation/navigation/AuthNavigator';
import { I18nProvider } from '../src/shared/i18n';

// Feature flag for switching between old and new code
const USE_NEW_ARCHITECTURE = true; // Set to false to use old code

// ===== NEW APP COMPONENT =====
const NewApp = () => {
  useEffect(() => {
    console.log('🚀 New Architecture initialized');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <NavigationContainer>
            {/* Import and use the AuthNavigator */}
            <AuthNavigator />
          </NavigationContainer>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

// ===== OLD APP COMPONENT =====
const OldApp = () => {
  useEffect(() => {
    console.log('📱 Old Architecture initialized');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          {/* Temporary placeholder for old app */}
          <View style={[styles.container, { backgroundColor: '#e0e0e0' }]}>
            <Text style={styles.title}>📱 Old Architecture</Text>
            <Text style={styles.subtitle}>Original app is here...</Text>
            <Text style={styles.item}>✅ All original components</Text>
            <Text style={styles.item}>✅ Original navigation</Text>
            <Text style={styles.item}>✅ Original services</Text>
            <Text style={styles.hint}>
              Set USE_NEW_ARCHITECTURE = true to switch to new code
            </Text>
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

// ===== MAIN APP COMPONENT WITH SWITCHING =====
function App() {
  console.log(`🚀 Using ${USE_NEW_ARCHITECTURE ? 'NEW' : 'OLD'} architecture`);
  
  if (USE_NEW_ARCHITECTURE) {
    return <NewApp />;
  } else {
    return <OldApp />;
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  item: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

registerRootComponent(App);
