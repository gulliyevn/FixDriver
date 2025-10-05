import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import TabBar from "./TabBar";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// Импорт экранов
import OrdersMapScreen from "../screens/common/OrdersMapScreen";
import DriversScreen from "../screens/client/DriversScreen";
import EarningsScreen from "../components/EarningsScreen";
import ChatStack from "./ChatStack";
import DriverProfileStack from "./driver/DriverProfileStack";

const Tab = createBottomTabNavigator();

// Обёртка для TabBar, чтобы подписаться на смену языка
function TabBarWithLanguage(props: BottomTabBarProps) {
  useLanguage();
  return <TabBar {...props} />;
}

const DriverNavigator: React.FC = () => {
  const { isDark } = useTheme();

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
      <Tab.Screen name="Orders" component={DriversScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen
        name="Profile"
        component={DriverProfileStack}
        options={{
          tabBarStyle: { display: "none" }, // Скрываем таббар для экрана профиля
        }}
      />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
