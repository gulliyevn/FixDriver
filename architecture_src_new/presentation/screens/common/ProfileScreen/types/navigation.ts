export type ClientScreenProps<T extends string = string> = {
  navigation: { navigate: (name: string, params?: any) => void; goBack: () => void };
  route?: { name: T; params?: any };
};


