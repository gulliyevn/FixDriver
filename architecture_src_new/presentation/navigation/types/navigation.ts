// Navigation types for new architecture
// Will contain param lists for all navigators

export type AuthStackParamList = {
  Login: undefined;
  Register: { role: 'client' | 'driver' };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  RoleSelect: undefined;
  Modal: { role: 'client' | 'driver' };
};

export type ClientStackParamList = {
  ClientHome: undefined;
  Drivers: undefined;
  Schedule: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type DriverStackParamList = {
  DriverHome: undefined;
  Orders: undefined;
  Earnings: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Auth: undefined;
  ClientApp: undefined;
  DriverApp: undefined;
};
