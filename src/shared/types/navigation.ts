import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
  Chat: undefined;
};

export type ClientStackParamList = {
  Home: undefined;
  Drivers: undefined;
  Balance: undefined;
  Cards: undefined;
  Trips: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type DriverStackParamList = {
  Orders: undefined;
  Earnings: undefined;
  Profile: undefined;
  Settings: undefined;
};
