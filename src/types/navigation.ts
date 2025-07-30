import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';

// Типы для маршрутов
export interface RoutePoint {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
  type?: 'start' | 'waypoint' | 'end';
}

// Параметры для экранов чата
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

// Параметры для экранов аутентификации
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

// Параметры для клиентских экранов
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
  // Чат экраны (добавляем прямо в ClientStack для упрощения)
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
  // Дополнительные экраны
  Bookings: undefined;
  Schedule: undefined;
  Notifications: undefined;
  Progress: undefined;
  SupportChat: undefined;
  // Профильные экраны
  ClientProfile: undefined;
  EditClientProfile: undefined;
  DriverProfile: undefined;
  PaymentPackage: undefined;
  AddChild: undefined;
  ChildrenList: undefined;
  BecomeDriver: undefined;
  ThemeToggle: undefined;
  // Новые экраны профиля
  Cards: undefined;
  Debts: undefined;
  Trips: undefined;
  PaymentHistory: undefined;
  TransactionHistory: undefined;
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

// Параметры для водительских экранов
export type DriverStackParamList = {
  Map: undefined;
  Orders: undefined;
  Plus: undefined;
  Chat: {
    screen?: keyof ChatStackParamList;
    params?: ChatStackParamList[keyof ChatStackParamList];
  };
  Profile: undefined;
  // Дополнительные экраны
  ClientList: undefined;
  Earnings: undefined;
  Schedule: undefined;
  StartTrip: {
    orderId: string;
  };
  DriverProfile: undefined;
  EditDriverProfile: undefined;
};

// Основные табы приложения
export type RootTabParamList = ClientStackParamList | DriverStackParamList;

// Корневая навигация
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

// Типы для навигации в различных контекстах
export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
export type ClientNavigationProp = BottomTabNavigationProp<ClientStackParamList>;
export type DriverNavigationProp = BottomTabNavigationProp<DriverStackParamList>;
export type ChatNavigationProp = StackNavigationProp<ChatStackParamList>;
export type RootNavigationProp = StackNavigationProp<RootStackParamList>;

// Композитные типы навигации для экранов
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

// Типы для route props
export type ClientScreenRouteProp<T extends keyof ClientStackParamList> = RouteProp<ClientStackParamList, T>;
export type DriverScreenRouteProp<T extends keyof DriverStackParamList> = RouteProp<DriverStackParamList, T>;
export type AuthScreenRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;
export type ChatScreenRouteProp<T extends keyof ChatStackParamList> = RouteProp<ChatStackParamList, T>;

// Типы для screen props (navigation + route)
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

// Устаревшие типы для обратной совместимости
export type RootTabScreenProps<Screen extends keyof ClientStackParamList> = {
  navigation: BottomTabNavigationProp<ClientStackParamList, Screen>;
  route: RouteProp<ClientStackParamList, Screen>;
}; 