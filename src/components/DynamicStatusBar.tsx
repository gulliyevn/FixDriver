import React from "react";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../context/ThemeContext";

const DynamicStatusBar: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <StatusBar
      style={isDark ? "light" : "dark"}
      backgroundColor="transparent"
      translucent
    />
  );
};

export default DynamicStatusBar;
