import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import OrdersMapScreen from "../screens/common/OrdersMapScreen";
import DriversScreen from "../screens/client/DriversScreen";
import ChatStack from "./ChatStack";
import ScheduleScreen from "../screens/common/ScheduleScreen";
import ClientProfileStack from "./ClientProfileStack";
import { ClientStackParamList } from "../types/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import TabBar from "./TabBar";

const Stack = createStackNavigator<ClientStackParamList>();

// Компонент для табов
const TabNavigator: React.FC = () => {
  const { isDark } = useTheme();
  const { createBottomTabNavigator } = require("@react-navigation/bottom-tabs");
  const Tab = createBottomTabNavigator();

  // Обёртка для TabBar, чтобы подписаться на смену языка
  function TabBarWithLanguage(props: any) {
    useLanguage();
    return <TabBar {...props} />;
  }

  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <TabBarWithLanguage {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#181A20" : "#fff",
          borderTopColor: isDark ? "#333" : "#e0e0e0",
        },
      }}
    >
      <Tab.Screen name="Map" component={OrdersMapScreen} />
      <Tab.Screen name="Drivers" component={DriversScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen
        name="ClientProfile"
        component={ClientProfileStack}
        options={{
          tabBarStyle: { display: "none" }, // Скрываем таббар для экрана профиля
        }}
      />
    </Tab.Navigator>
  );
};

const ClientNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default ClientNavigator;
