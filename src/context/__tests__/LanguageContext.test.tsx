import { renderHook, act } from "../../test-utils/testWrapper";
import React from "react";
import { LanguageProvider, useLanguage } from "../LanguageContext";
import { AuthProvider } from "../AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Мокаем AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const renderWithProviders = (hook: () => any) => {
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <AuthProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </AuthProvider>
    ),
  });
};

describe("LanguageContext - User Individuality", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Individual Language Settings", () => {
    it("should maintain separate language settings for different users", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");

      // Мокаем разные языки для разных пользователей
      AsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === "user_1_language") return Promise.resolve("en");
        if (key === "user_2_language") return Promise.resolve("ru");
        return Promise.resolve(null);
      });

      // Первый пользователь
      const { result: user1Result } = renderWithProviders(() => useLanguage());

      // Симулируем первого пользователя
      await act(async () => {
        // Здесь должен быть вызов для загрузки языка пользователя 1
        await user1Result.current.loadUserLanguage("user_1");
      });

      expect(user1Result.current.currentLanguage).toBe("en");

      // Второй пользователь
      const { result: user2Result } = renderWithProviders(() => useLanguage());

      // Симулируем второго пользователя
      await act(async () => {
        // Здесь должен быть вызов для загрузки языка пользователя 2
        await user2Result.current.loadUserLanguage("user_2");
      });

      expect(user2Result.current.currentLanguage).toBe("ru");

      // Проверяем, что языки разные
      expect(user1Result.current.currentLanguage).not.toBe(
        user2Result.current.currentLanguage,
      );
    });

    it("should save language settings per user", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      const mockSetItem = jest.fn();
      AsyncStorage.setItem.mockImplementation(mockSetItem);

      const { result } = renderWithProviders(() => useLanguage());

      // Пользователь 1 меняет язык
      await act(async () => {
        await result.current.changeLanguage("en", "user_1");
      });

      expect(mockSetItem).toHaveBeenCalledWith("user_1_language", "en");

      // Пользователь 2 меняет язык
      await act(async () => {
        await result.current.changeLanguage("ru", "user_2");
      });

      expect(mockSetItem).toHaveBeenCalledWith("user_2_language", "ru");

      // Проверяем, что сохранились разные настройки
      expect(mockSetItem).toHaveBeenCalledWith("user_1_language", "en");
      expect(mockSetItem).toHaveBeenCalledWith("user_2_language", "ru");
    });

    it("should not affect other users when one user changes language", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");

      // Начальные языки
      AsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === "user_1_language") return Promise.resolve("en");
        if (key === "user_2_language") return Promise.resolve("ru");
        return Promise.resolve(null);
      });

      const { result: user1Result } = renderWithProviders(() => useLanguage());
      const { result: user2Result } = renderWithProviders(() => useLanguage());

      // Загружаем языки
      await act(async () => {
        await user1Result.current.loadUserLanguage("user_1");
        await user2Result.current.loadUserLanguage("user_2");
      });

      const initialUser1Lang = user1Result.current.currentLanguage;
      const initialUser2Lang = user2Result.current.currentLanguage;

      // Пользователь 1 меняет язык
      await act(async () => {
        await user1Result.current.changeLanguage("fr", "user_1");
      });

      // Проверяем, что язык пользователя 1 изменился
      expect(user1Result.current.currentLanguage).toBe("fr");

      // Проверяем, что язык пользователя 2 НЕ изменился
      expect(user2Result.current.currentLanguage).toBe(initialUser2Lang);
    });
  });

  describe("Language Persistence", () => {
    it("should persist language settings across app restarts", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");

      // Симулируем сохраненный язык
      AsyncStorage.getItem.mockResolvedValue("ru");

      const { result } = renderWithProviders(() => useLanguage());

      // Симулируем загрузку приложения
      await act(async () => {
        await result.current.loadUserLanguage("user_1");
      });

      // Проверяем, что язык загрузился из хранилища
      expect(result.current.currentLanguage).toBe("ru");
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("user_1_language");
    });

    it("should use default language for new users", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");

      // Новый пользователь без сохраненного языка
      AsyncStorage.getItem.mockResolvedValue(null);

      const { result } = renderWithProviders(() => useLanguage());

      await act(async () => {
        await result.current.loadUserLanguage("new_user");
      });

      // Должен использовать язык по умолчанию
      expect(result.current.currentLanguage).toBe("en"); // или другой дефолтный
    });
  });

  describe("Role-Specific Language Behavior", () => {
    it("should maintain language settings when switching roles", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");

      // Пользователь с сохраненным языком
      AsyncStorage.getItem.mockResolvedValue("ru");

      const { result } = renderWithProviders(() => useLanguage());

      // Загружаем язык для клиента
      await act(async () => {
        await result.current.loadUserLanguage("user_1");
      });

      expect(result.current.currentLanguage).toBe("ru");

      // Переключаемся на роль водителя
      await act(async () => {
        await result.current.loadUserLanguage("user_1"); // тот же пользователь
      });

      // Язык должен остаться тем же
      expect(result.current.currentLanguage).toBe("ru");
    });

    it("should handle different language preferences for different roles", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");

      // Разные языки для разных ролей одного пользователя
      AsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === "user_1_client_language") return Promise.resolve("en");
        if (key === "user_1_driver_language") return Promise.resolve("ru");
        return Promise.resolve(null);
      });

      const { result } = renderWithProviders(() => useLanguage());

      // Клиентская роль
      await act(async () => {
        await result.current.loadUserLanguage("user_1", "client");
      });

      expect(result.current.currentLanguage).toBe("en");

      // Водительская роль
      await act(async () => {
        await result.current.loadUserLanguage("user_1", "driver");
      });

      expect(result.current.currentLanguage).toBe("ru");
    });
  });

  describe("Error Handling", () => {
    it("should handle storage errors gracefully", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      AsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

      const { result } = renderWithProviders(() => useLanguage());

      await act(async () => {
        await result.current.loadUserLanguage("user_1");
      });

      // Должен использовать язык по умолчанию при ошибке
      expect(result.current.currentLanguage).toBe("en");
    });

    it("should handle invalid language codes", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      AsyncStorage.getItem.mockResolvedValue("invalid_lang");

      const { result } = renderWithProviders(() => useLanguage());

      await act(async () => {
        await result.current.loadUserLanguage("user_1");
      });

      // Должен использовать язык по умолчанию для невалидного кода
      expect(result.current.currentLanguage).toBe("en");
    });
  });
});
