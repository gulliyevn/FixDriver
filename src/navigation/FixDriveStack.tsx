import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FixWaveScreen from '../screens/common/FixWaveScreen';
import { ClientStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ClientStackParamList>();

const FixDriveStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FixDrive" component={FixWaveScreen} />
    </Stack.Navigator>
  );
};

export default FixDriveStack;
