import { NavigatorScreenParams } from '@react-navigation/native';

// Navigation types for new architecture
// Will contain param lists for all navigators

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: { role: 'client' | 'driver' };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  RoleSelect: undefined;
  Modal: { role: 'client' | 'driver' };
  OTPVerification: { email: string };
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
  Chat: undefined;
};

export type ClientStackParamList = {
  ClientHome: undefined;
  Drivers: undefined;
  Schedule: undefined;
  Chat: undefined;
  Profile: undefined;
  Balance: undefined;
  Cards: undefined;
  Trips: undefined;
  Settings: undefined;
};

export type DriverStackParamList = {
  DriverHome: undefined;
  Orders: undefined;
  Earnings: undefined;
  Chat: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type MainStackParamList = {
  Auth: undefined;
  ClientApp: undefined;
  DriverApp: undefined;
};
