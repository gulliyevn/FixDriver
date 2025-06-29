export type ClientStackParamList = {
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
  OrderDetails: {
    orderId: string;
  };
};

export type RootTabParamList = {
  Map: undefined;
  Drivers: undefined;
  Plus: undefined;
  Chat: {
    screen?: keyof ClientStackParamList;
    params?: ClientStackParamList[keyof ClientStackParamList];
  };
  Profile: undefined;
};

// Тип для навигации с поддержкой вложенных экранов
export type RootTabScreenProps<Screen extends keyof RootTabParamList> = {
  navigation: BottomTabNavigationProp<RootTabParamList, Screen>;
  route: RouteProp<RootTabParamList, Screen>;
};

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native'; 