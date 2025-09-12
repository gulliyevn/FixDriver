import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/auth';
import { UserRole } from '../../shared/types/user';

// Import main profile screen
import ProfileScreen from '../screens/common/ProfileScreen/ProfileScreen';

// Import common screens (for all roles)
import { SettingsScreen } from '../screens/common/ProfileScreen/components/Settings/SettingsScreen';
import { HelpScreen } from '../screens/common/ProfileScreen/components/Help/HelpScreen';
import { AboutScreen } from '../screens/common/ProfileScreen/components/About/AboutScreen';
import { BalanceScreen } from '../screens/common/ProfileScreen/components/Balance/BalanceScreen';
import { AddressPickerScreen } from '../screens/common/AddressPicker/AddressPickerScreen';
import SupportChatScreen from '../screens/common/Support/SupportChatScreen';
import { PremiumPackagesScreen } from '../screens/common/Premium/PremiumPackagesScreen';
import NotificationsScreen from '../screens/common/Notifications/NotificationsScreen';

// Import client-specific screens
import EditProfileScreen from '../screens/common/ProfileScreen/EditProfile/EditProfileScreen';
import { CardsScreen } from '../screens/common/ProfileScreen/components/Cards/CardsScreen';
import { TripsScreen } from '../screens/common/ProfileScreen/components/Trips/TripsScreen';
import { PaymentHistoryScreen } from '../screens/common/ProfileScreen/components/PaymentHistory/PaymentHistoryScreen';
import { ResidenceScreen } from '../screens/common/ProfileScreen/components/Residence/ResidenceScreen';

import { ClientStackParamList } from '../../shared/types/navigation';

const Stack = createStackNavigator();

const ProfileStack: React.FC = () => {
  const { user } = useAuth();
  const isDriver = user?.role === UserRole.DRIVER;

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main profile screen */}
      <Stack.Screen name="ClientProfile" component={ProfileScreen} />

      {/* Common screens for all roles */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Balance" component={BalanceScreen} />
      <Stack.Screen name="AddressPicker" component={AddressPickerScreen} />
      <Stack.Screen name="SupportChat" component={SupportChatScreen} />
      <Stack.Screen name="PremiumPackages" component={PremiumPackagesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      {/* Common screens for all roles */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Cards" component={CardsScreen} />
      <Stack.Screen name="Trips" component={TripsScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="Residence" component={ResidenceScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
