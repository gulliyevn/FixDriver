import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ClientProfileScreen from '../screens/profile/ClientProfileScreen';
import CardsScreen from '../screens/client/CardsScreen';
import DebtsScreen from '../screens/client/DebtsScreen';
import CarsScreen from '../screens/client/CarsScreen';
import PaymentHistoryScreen from '../screens/client/PaymentHistoryScreen';
import SettingsScreen from '../screens/client/SettingsScreen';
import ResidenceScreen from '../screens/client/ResidenceScreen';
import HelpScreen from '../screens/client/HelpScreen';
import AboutScreen from '../screens/client/AboutScreen';
import BalanceScreen from '../screens/client/BalanceScreen';
import AddressPickerScreen from '../screens/client/AddressPickerScreen';
import ChangePasswordScreen from '../screens/client/ChangePasswordScreen';
import SupportChatScreen from '../screens/common/SupportChatScreen';
import { ClientStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ClientStackParamList>();

const ClientProfileStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ClientProfile" component={ClientProfileScreen} />
      <Stack.Screen name="Cards" component={CardsScreen} />
      <Stack.Screen name="Debts" component={DebtsScreen} />
      <Stack.Screen name="Cars" component={CarsScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Residence" component={ResidenceScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Balance" component={BalanceScreen} />
      <Stack.Screen name="AddressPicker" component={AddressPickerScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="SupportChat" component={SupportChatScreen} />
    </Stack.Navigator>
  );
};

export default ClientProfileStack; 