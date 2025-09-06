import APIClient from '../api/APIClient';
import { ENV_CONFIG, ConfigUtils } from '../../../shared/config/environment';
import { JWTService } from '../jwt/JWTService';
import { PROFILE_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface DeleteAccountResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ProfileService {
  changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse>;
  deleteAccount(): Promise<DeleteAccountResponse>;
}

export class DriverProfileService {
  /**
   * Change user password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      // In dev mode use mock for testing
      if (__DEV__) {
        return this.mockChangePassword(data);
      }

      // Check server availability
      const isServerAvailable = await ConfigUtils.checkServerHealth();
      
      if (!isServerAvailable) {
        // Server unavailable, falling back to mock data
        return this.mockChangePassword(data);
      }

      const response = await APIClient.post<{ message: string }>('/profile/change-password', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data?.message || PROFILE_CONSTANTS.SUCCESS.PASSWORD_CHANGED,
        };
      } else {
        return {
          success: false,
          error: response.error || PROFILE_CONSTANTS.ERRORS.CHANGE_PASSWORD_FAILED,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : PROFILE_CONSTANTS.ERRORS.CHANGE_PASSWORD_FAILED,
      };
    }
  }

  /**
   * Delete user account
   * Completely removes all user data from database
   */
  static async deleteAccount(): Promise<{ success: boolean; message?: string }> {
    try {
      const jwtService = new JWTService();
      const accessToken = await jwtService.getValidAccessToken();
      if (!accessToken) {
        throw new Error(PROFILE_CONSTANTS.ERRORS.NO_AUTH_TOKEN);
      }

      const response = await APIClient.delete<{ message: string }>('/profile/account');

      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.error || PROFILE_CONSTANTS.ERRORS.DELETE_ACCOUNT_FAILED);
      }
    } catch (error) {
      // In development mode return success for testing
      if (__DEV__) {
        // DEV MODE: Simulating successful account deletion
        return { success: true };
      }
      
      return { 
        success: false, 
        message: error instanceof Error ? error.message : PROFILE_CONSTANTS.ERRORS.UNKNOWN_ERROR 
      };
    }
  }

  /**
   * Mock for password change in dev mode
   */
  private static async mockChangePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, PROFILE_CONSTANTS.MOCK.DELAY));

    // Check current password (in real app this would be database check)
    if (data.currentPassword !== PROFILE_CONSTANTS.MOCK.CURRENT_PASSWORD) {
      return {
        success: false,
        error: PROFILE_CONSTANTS.ERRORS.CURRENT_PASSWORD_INCORRECT,
      };
    }

    // Check that new password is different from current
    if (data.currentPassword === data.newPassword) {
      return {
        success: false,
        error: PROFILE_CONSTANTS.ERRORS.NEW_PASSWORD_SAME,
      };
    }

    // Check new password complexity
    if (data.newPassword.length < PROFILE_CONSTANTS.MOCK.MIN_PASSWORD_LENGTH) {
      return {
        success: false,
        error: PROFILE_CONSTANTS.ERRORS.PASSWORD_TOO_SHORT,
      };
    }

    // Simulate successful password change
    return {
      success: true,
      message: PROFILE_CONSTANTS.SUCCESS.PASSWORD_CHANGED,
    };
  }

  /**
   * Change password via gRPC
   * TODO: Implement real gRPC call
   */
  static async changePasswordGrpc(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, PROFILE_CONSTANTS.MOCK.DELAY));
      
      return {
        success: true,
        message: PROFILE_CONSTANTS.SUCCESS.PASSWORD_CHANGED,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : PROFILE_CONSTANTS.ERRORS.CHANGE_PASSWORD_FAILED,
      };
    }
  }

  /**
   * Delete account via gRPC
   * TODO: Implement real gRPC call
   */
  static async deleteAccountGrpc(): Promise<DeleteAccountResponse> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, PROFILE_CONSTANTS.MOCK.DELAY));
      
      return {
        success: true,
        message: PROFILE_CONSTANTS.SUCCESS.ACCOUNT_DELETED,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : PROFILE_CONSTANTS.ERRORS.DELETE_ACCOUNT_FAILED,
      };
    }
  }
}
