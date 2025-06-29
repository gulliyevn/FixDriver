export type ClientStackParamList = {
  ChatList: undefined;
  ChatConversation: {
    driverId: string;
    driverName: string;
    driverCar: string;
    driverNumber: string;
    driverRating: string;
    driverStatus?: string;
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