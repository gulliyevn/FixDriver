import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';

// Route types
export interface RoutePoint {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
  type?: 'start' | 'waypoint' | 'end';
}

// Chat stack params
export type ChatStackParamList = {
  ChatList: undefined;
  ChatConversation: {
    driverId: string;
    driverName: string;
    driverCar: string;
    driverNumber: string;
    driverRating: string;
    driverStatus?: string;
    driverPhoto?: string;
  };
};

// Auth stack params
export type AuthStackParamList = {
  RoleSelect: undefined;
  Login: undefined;
  ClientRegister: undefined;
  DriverRegister: undefined;
  ForgotPassword: undefined;
  OTPVerification: {
    phone: string;
    type: 'register' | 'forgot-password';
  };
};

// Client stack params
export type ClientStackParamList = {
  Map: undefined;
  Drivers: undefined;
  Plus: undefined;
  Chat: {
    chatId: string;
    participant: {
      id: string;
      name: string;
      avatar?: string;
      isOnline?: boolean;
    };
  };
  // Chat screens (inlined into ClientStack for simplicity)
  ChatList: undefined;
  ChatConversation: {
    driverId: string;
    driverName: string;
    driverCar: string;
    driverNumber: string;
    driverRating: string;
    driverStatus?: string;
    driverPhoto?: string;
  };
  // Additional screens
  Bookings: undefined;
  Schedule: undefined;
  Notifications: undefined;
  Progress: undefined;
  SupportChat: undefined;

  // Profile screens
  ClientProfile: undefined;
  EditClientProfile: undefined;
  DriverProfile: undefined;
  PaymentPackage: undefined;
  AddChild: undefined;
  ChildrenList: undefined;
  BecomeDriver: undefined;
  ThemeToggle: undefined;
  FixDrive: undefined;
  // New profile screens
  Cards: undefined;
  Debts: undefined;
  Trips: undefined;
  PaymentHistory: undefined;

  Settings: undefined;
  Residence: undefined;
  Help: undefined;
  About: undefined;
  Balance: undefined;
  PremiumPackages: undefined;
  AddressPicker: {
    onAddressSelected: (address: string, latitude: number, longitude: number) => void;
  };
  ChangePassword: undefined;
};

// Driver stack params
export type DriverStackParamList = {
  Map: undefined;
  Orders: undefined;
  Plus: undefined;
  Chat: {
    screen?: keyof ChatStackParamList;
    params?: ChatStackParamList[keyof ChatStackParamList];
  };
  Profile: undefined;
  // Additional screens
  ClientList: undefined;
  Earnings: undefined;
  Schedule: undefined;
  StartTrip: {
    orderId: string;
  };
  DriverProfile: undefined;
  EditDriverProfile: undefined;
};

// Root tabs of the app
export type RootTabParamList = ClientStackParamList | DriverStackParamList;

// Root navigation
export type RootStackParamList = {
  Auth: {
    screen?: keyof AuthStackParamList;
    params?: AuthStackParamList[keyof AuthStackParamList];
  };
  Main: {
    screen?: keyof RootTabParamList;
    params?: RootTabParamList[keyof RootTabParamList];
  };
};

// Navigation prop types
export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
export type ClientNavigationProp = BottomTabNavigationProp<ClientStackParamList>;
export type DriverNavigationProp = BottomTabNavigationProp<DriverStackParamList>;
export type ChatNavigationProp = StackNavigationProp<ChatStackParamList>;
export type RootNavigationProp = StackNavigationProp<RootStackParamList>;

// Composite navigation types for screens
export type ClientScreenNavigationProp<T extends keyof ClientStackParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<ClientStackParamList, T>,
  StackNavigationProp<RootStackParamList>
>;

export type DriverScreenNavigationProp<T extends keyof DriverStackParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<DriverStackParamList, T>,
  StackNavigationProp<RootStackParamList>
>;

export type AuthScreenNavigationProp<T extends keyof AuthStackParamList> = StackNavigationProp<AuthStackParamList, T>;

export type ChatScreenNavigationProp<T extends keyof ChatStackParamList> = StackNavigationProp<ChatStackParamList, T>;

// Route prop types
export type ClientScreenRouteProp<T extends keyof ClientStackParamList> = RouteProp<ClientStackParamList, T>;
export type DriverScreenRouteProp<T extends keyof DriverStackParamList> = RouteProp<DriverStackParamList, T>;
export type AuthScreenRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;
export type ChatScreenRouteProp<T extends keyof ChatStackParamList> = RouteProp<ChatStackParamList, T>;

// Screen props (navigation + route)
export type ClientScreenProps<T extends keyof ClientStackParamList> = {
  navigation: ClientScreenNavigationProp<T>;
  route: ClientScreenRouteProp<T>;
};

export type DriverScreenProps<T extends keyof DriverStackParamList> = {
  navigation: DriverScreenNavigationProp<T>;
  route: DriverScreenRouteProp<T>;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = {
  navigation: AuthScreenNavigationProp<T>;
  route: AuthScreenRouteProp<T>;
};

export type ChatScreenProps<T extends keyof ChatStackParamList> = {
  navigation: ChatScreenNavigationProp<T>;
  route: ChatScreenRouteProp<T>;
};

// Legacy types kept for backward compatibility
export type RootTabScreenProps<Screen extends keyof ClientStackParamList> = {
  navigation: BottomTabNavigationProp<ClientStackParamList, Screen>;
  route: RouteProp<ClientStackParamList, Screen>;
}; 