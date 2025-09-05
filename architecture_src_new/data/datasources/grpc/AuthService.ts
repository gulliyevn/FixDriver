import { IAuthService } from './types/IAuthService';
import { AuthServiceStub } from './stubs/AuthServiceStub';
import { AuthResponse, RegisterData, User, UserRole, ClientProfile, DriverProfile, AdminProfile } from '../../../shared/types';

/**
 * gRPC AuthService
 * 
 * This service will eventually connect to real gRPC backend.
 * For now, it uses AuthServiceStub for development/testing.
 */
export class AuthService implements IAuthService {
  private stub: AuthServiceStub;
  private isGRPCReady: boolean = false;

  constructor() {
    // Initialize with stub for now
    this.stub = new AuthServiceStub();
    this.checkGRPCConnection();
  }

  /**
   * Check if gRPC connection is available
   */
  private async checkGRPCConnection(): Promise<void> {
    try {
      // For now, always use stub
      this.isGRPCReady = false;
    } catch (error) {
      console.warn('gRPC connection not available, using stub:', error);
      this.isGRPCReady = false;
    }
  }

  /**
   * Get current service status
   */
  public getServiceStatus(): { isGRPCReady: boolean; currentService: string } {
    return {
      isGRPCReady: this.isGRPCReady,
      currentService: this.isGRPCReady ? 'gRPC' : 'Stub'
    };
  }

  /**
   * Force refresh gRPC connection
   */
  public async refreshGRPCConnection(): Promise<void> {
    await this.checkGRPCConnection();
  }

  // Authentication methods

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // return await this.grpcClient.auth.login({ email, password });
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.login(email, password);
      }
    } catch (error) {
      console.error('AuthService login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // return await this.grpcClient.auth.register(userData);
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.register(userData);
      }
    } catch (error) {
      console.error('AuthService register error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // await this.grpcClient.auth.logout();
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        await this.stub.logout();
      }
    } catch (error) {
      console.error('AuthService logout error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // return await this.grpcClient.auth.refreshToken();
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.refreshToken();
      }
    } catch (error) {
      console.error('AuthService refreshToken error:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // const result = await this.grpcClient.auth.validateToken({ token });
        // return result.valid;
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.validateToken(token);
      }
    } catch (error) {
      console.error('AuthService validateToken error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // const result = await this.grpcClient.auth.getCurrentUser();
        // return result.user || null;
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.getCurrentUser();
      }
    } catch (error) {
      console.error('AuthService getCurrentUser error:', error);
      throw error;
    }
  }

  // User management methods

  async switchRole(role: UserRole): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // const result = await this.grpcClient.auth.switchRole({ role });
        // return result.user;
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.switchRole(role);
      }
    } catch (error) {
      console.error('AuthService switchRole error:', error);
      throw error;
    }
  }

  async createProfile(role: UserRole, profileData: ClientProfile | DriverProfile | AdminProfile): Promise<User> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // const result = await this.grpcClient.auth.createProfile({ role, profileData });
        // return result.user;
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.createProfile(role, profileData);
      }
    } catch (error) {
      console.error('AuthService createProfile error:', error);
      throw error;
    }
  }

  // Password reset methods

  async sendPasswordReset(email: string): Promise<{ success: boolean; requestId: string }> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // const result = await this.grpcClient.auth.sendPasswordReset({ email });
        // return { success: result.success, requestId: result.requestId };
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.sendPasswordReset(email);
      }
    } catch (error) {
      console.error('AuthService sendPasswordReset error:', error);
      throw error;
    }
  }

  async verifyPasswordResetOtp(requestId: string, otp: string): Promise<{ success: boolean; token: string }> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // const result = await this.grpcClient.auth.verifyPasswordResetOtp({ requestId, otp });
        // return { success: result.success, token: result.token };
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.verifyPasswordResetOtp(requestId, otp);
      }
    } catch (error) {
      console.error('AuthService verifyPasswordResetOtp error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        // const result = await this.grpcClient.auth.resetPassword({ token, newPassword });
        // return { success: result.success };
        throw new Error('gRPC not implemented yet');
      } else {
        // Use stub for now
        return await this.stub.resetPassword(token, newPassword);
      }
    } catch (error) {
      console.error('AuthService resetPassword error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
