import APIClient from "../APIClient";
import { JWTService } from "../JWTService";

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class DriverProfileService {
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
        return;
      }

      const response = await APIClient.delete<{ message: string }>(
        "/profile/account",
      );

      if (response.success) {
        return { success: true };
      } else {
        console.error(response.error || "Failed to delete account");
        return;
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
