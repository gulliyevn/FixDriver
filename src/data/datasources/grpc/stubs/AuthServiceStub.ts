import { IAuthService } from '../types/IAuthService';
import { AuthResponse, RegisterData, User, UserRole } from '../../../../shared/types';

// Mock data for testing
const MOCK_USERS: Record<string, User> = {
  'mock-user-id': {
    id: 'mock-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890',
    role: 'client',
    avatar: undefined,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    profiles: {
      client: {
        balance: 1000,
        rating: 4.8,
        totalTrips: 25,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      driver: {
        licenseNumber: 'DL123456789',
        vehicleInfo: {
          id: 'vehicle-1',
          model: 'Toyota Camry',
          year: 2020,
          color: 'Silver',
          licensePlate: 'ABC123',
        },
        rating: 4.9,
        totalTrips: 150,
        isOnline: false,
        currentLocation: undefined,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  },
};

// Simulate network delay
const simulateNetworkDelay = (min: number = 300, max: number = 800): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export class AuthServiceStub implements IAuthService {
  private currentUser: User | null = null;
  private currentToken: string | null = null;

  async login(email: string, password: string): Promise<AuthResponse> {
    await simulateNetworkDelay();

    // Simulate credential validation
    if (email === 'test@example.com' && password === 'password') {
      const user = MOCK_USERS['mock-user-id'];
      const token = `mock-jwt-token-${Date.now()}`;
      
      this.currentUser = user;
      this.currentToken = token;

      return {
        token,
        userId: user.id,
        success: true,
        user,
      };
    }

    throw new Error('Invalid email or password');
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    await simulateNetworkDelay();

    // Simulate new user creation
    const newUser: User = {
      id: `new-user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
      avatar: undefined,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profiles: {},
    };

    const token = `mock-jwt-token-${Date.now()}`;
    
    this.currentUser = newUser;
    this.currentToken = token;

    return {
      token,
      userId: newUser.id,
      success: true,
      user: newUser,
    };
  }

  async logout(): Promise<void> {
    await simulateNetworkDelay();
    
    this.currentUser = null;
    this.currentToken = null;
  }

  async refreshToken(): Promise<AuthResponse> {
    await simulateNetworkDelay();

    if (!this.currentUser || !this.currentToken) {
      throw new Error('User not authenticated');
    }

    const newToken = `mock-jwt-token-${Date.now()}`;
    this.currentToken = newToken;

    return {
      token: newToken,
      userId: this.currentUser.id,
      success: true,
      user: this.currentUser,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    await simulateNetworkDelay();
    
    // Simulate token validation
    return token.startsWith('mock-jwt-token-');
  }

  async getCurrentUser(): Promise<User | null> {
    await simulateNetworkDelay();
    
    return this.currentUser;
  }

  async switchRole(role: UserRole): Promise<User> {
    await simulateNetworkDelay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    // Update user role
    const updatedUser: User = {
      ...this.currentUser,
      role,
      updatedAt: new Date().toISOString(),
    };

    this.currentUser = updatedUser;
    return updatedUser;
  }

  async createProfile(role: UserRole, profileData: any): Promise<User> {
    await simulateNetworkDelay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    // Create profile for specified role
    const updatedUser: User = {
      ...this.currentUser,
      profiles: {
        ...this.currentUser.profiles,
        [role]: {
          ...profileData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      updatedAt: new Date().toISOString(),
    };

    this.currentUser = updatedUser;
    return updatedUser;
  }
}
