import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.error("useTheme must be used within a ThemeProvider");
    return { theme: "light" as Theme, toggleTheme: () => {}, isDark: false };
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    console.log('⚫ ThemeContext useEffect triggered');
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        setTheme(savedTheme);
      } else {
        // Use default theme
      }
    } catch (error) {
      console.warn('Failed to load theme:', error);
    }
  };

  const toggleTheme = useCallback(async () => {
    setTheme((currentTheme) => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      AsyncStorage.setItem("theme", newTheme).catch((error) => {
        console.warn('Failed to save theme:', error);
      });
      return newTheme;
    });
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme === "dark",
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
