import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// Удаляем неиспользуемый импорт ClientProfileScreen
import CardsScreen from "../../screens/client/CardsScreen";
import TripsScreen from "../../screens/client/TripsScreen";
import PaymentHistoryScreen from "../../screens/client/PaymentHistoryScreen";

import SettingsScreen from "../../screens/client/SettingsScreen";
import ResidenceScreen from "../../screens/client/ResidenceScreen";
import HelpScreen from "../../screens/client/HelpScreen";
import AboutScreen from "../../screens/client/AboutScreen";
import BalanceScreen from "../../screens/client/BalanceScreen";
import AddressPickerScreen from "../../screens/client/AddressPickerScreen";
import ChangePasswordScreen from "../../screens/client/ChangePasswordScreen";
import SupportChatScreen from "../../screens/common/SupportChatScreen";
import EditDriverProfileScreen from "../../screens/profile/driver/EditDriverProfileScreen";
import DriverVehiclesScreen from "../../screens/profile/driver/DriverVehiclesScreen";
import DriverProfileScreen from "../../screens/driver/DriverProfileScreen";
import PremiumPackagesScreen from "../../screens/profile/PremiumPackagesScreen";

import NotificationsScreen from "../../screens/common/NotificationsScreen";
import { DriverStackParamList } from "../../types/driver/DriverNavigation";

const Stack = createStackNavigator<DriverStackParamList>();

const DriverProfileStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
      <Stack.Screen name="Cards" component={CardsScreen} />
      <Stack.Screen name="Trips" component={TripsScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Residence" component={ResidenceScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Balance" component={BalanceScreen} />
      <Stack.Screen name="AddressPicker" component={AddressPickerScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="SupportChat" component={SupportChatScreen} />
      <Stack.Screen
        name="EditDriverProfile"
        component={EditDriverProfileScreen}
      />
      <Stack.Screen name="DriverVehicles" component={DriverVehiclesScreen} />
      <Stack.Screen name="PremiumPackages" component={PremiumPackagesScreen} />

      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export default DriverProfileStack;
