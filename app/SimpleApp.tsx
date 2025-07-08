import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import SimpleTestScreen from '../src/screens/auth/SimpleTestScreen';

function SimpleApp() {
  return (
    <>
      <SimpleTestScreen />
      <StatusBar style="auto" />
    </>
  );
}

registerRootComponent(SimpleApp); 