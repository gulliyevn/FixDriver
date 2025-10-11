import APIClient from "./APIClient";
import JWTService from "./JWTService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/user";
import { isDevModeEnabled } from "../config/devMode";

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  // Client specific
  children?: Array<{ name: string; age: number; relationship: string }>;
  // Driver specific
  vehicle?: {
    brand: string;
    model: string;
    year: string;
    licensePlate: string;
  };
}

export class ProfileService {
  private static STORAGE_KEY = "@profile_";

  /**
   * Получить профиль пользователя
   * DEV: загружает из AsyncStorage
   * PROD: загружает с API
   */
  static async getProfile(userId: string): Promise<User | null> {
    try {
      // ⚠️ DEV ONLY: Загружаем из локального хранилища
      if (isDevModeEnabled()) {
        const profileJson = await AsyncStorage.getItem(
          `${this.STORAGE_KEY}${userId}`,
        );
        if (profileJson) {
          const profile = JSON.parse(profileJson);
          return profile;
        }

        return null;
      }

      // PROD: Загружаем с API
      const response = await APIClient.get<User>(`/profile/${userId}`);

      if (response.success && response.data) {
        // Кэшируем в AsyncStorage
        await AsyncStorage.setItem(
          `${this.STORAGE_KEY}${userId}`,
          JSON.stringify(response.data),
        );
        return response.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Обновить профиль пользователя
   * DEV: сохраняет в AsyncStorage
   * PROD: отправляет на API
   */
  static async updateProfile(
    userId: string,
    updates: UpdateProfileRequest,
  ): Promise<{ success: boolean; profile?: User; error?: string }> {
    try {
      // ⚠️ DEV ONLY: Обновляем в локальном хранилище
      if (isDevModeEnabled()) {
        // Получаем текущий профиль
        const currentProfile = await this.getProfile(userId);
        if (!currentProfile) {
          return { success: false, error: "Profile not found" };
        }

        // Обновляем
        const updatedProfile: User = {
          ...currentProfile,
          ...updates,
        };

        // Сохраняем
        await AsyncStorage.setItem(
          `${this.STORAGE_KEY}${userId}`,
          JSON.stringify(updatedProfile),
        );

        return { success: true, profile: updatedProfile };
      }

      // PROD: Отправляем на API
      const response = await APIClient.patch<User>(
        `/profile/${userId}`,
        updates,
      );

      if (response.success && response.data) {
        // Обновляем кэш
        await AsyncStorage.setItem(
          `${this.STORAGE_KEY}${userId}`,
          JSON.stringify(response.data),
        );

        return { success: true, profile: response.data };
      }

      return { success: false, error: response.error || "Update failed" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Update failed",
      };
    }
  }

  /**
   * Загрузить аватар
   * DEV: сохраняет base64 в AsyncStorage
   * PROD: загружает файл на сервер
   */
  static async uploadAvatar(
    userId: string,
    imageUri: string,
  ): Promise<{ success: boolean; avatarUrl?: string; error?: string }> {
    try {
      // ⚠️ DEV ONLY: Сохраняем URI локально
      if (isDevModeEnabled()) {
        const profile = await this.getProfile(userId);
        if (!profile) {
          return { success: false, error: "Profile not found" };
        }

        const updatedProfile = {
          ...profile,
          avatar: imageUri, // В DEV просто URI
        };

        await AsyncStorage.setItem(
          `${this.STORAGE_KEY}${userId}`,
          JSON.stringify(updatedProfile),
        );

        return { success: true, avatarUrl: imageUri };
      }

      // PROD: Загружаем на сервер
      const formData = new FormData();
      const file: { uri: string; type: string; name: string } = {
        uri: imageUri,
        type: "image/jpeg",
        name: "avatar.jpg",
      };
      formData.append("avatar", file as unknown as Blob);

      const response = await APIClient.post<{ avatarUrl: string }>(
        `/profile/${userId}/avatar`,
        formData,
      );

      if (response.success && response.data) {
        // Обновляем кэш
        const profile = await this.getProfile(userId);
        if (profile) {
          profile.avatar = response.data.avatarUrl;
          await AsyncStorage.setItem(
            `${this.STORAGE_KEY}${userId}`,
            JSON.stringify(profile),
          );
        }

        return { success: true, avatarUrl: response.data.avatarUrl };
      }

      return { success: false, error: response.error || "Upload failed" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }
  /**
   * Изменение пароля пользователя
   */
  static async changePassword(
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    try {
      const response = await APIClient.post<{ message: string }>(
        "/profile/change-password",
        {
          current_password: data.currentPassword,
          new_password: data.newPassword,
        },
      );

      if (response.success) {
        return {
          success: true,
          message: response.data?.message || "Password changed successfully",
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to change password",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Change password failed",
      };
    }
  }

  /**
   * Удаление аккаунта пользователя
   * Полностью удаляет все данные пользователя из БД
   */
  static async deleteAccount(): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const authHeader = await JWTService.getAuthHeader();
      if (!authHeader) {
        console.error("No authentication token");
        return {
          success: false,
          message: "No authentication token",
        };
      }

      const response = await APIClient.delete<{ message: string }>(
        "/profile/account",
      );

      if (response.success) {
        return { success: true };
      } else {
        console.error(response.error || "Failed to delete account");
        return {
          success: false,
          message: response.error || "Failed to delete account",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
