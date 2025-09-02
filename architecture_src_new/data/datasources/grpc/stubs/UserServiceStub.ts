import { IUserService } from '../types/IUserService';
import { User, PaginationParams, PaginatedResponse } from '../../../../shared/types';

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: 'client',
    avatar: 'https://example.com/avatar1.jpg',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    profiles: {
      client: {
        balance: 500,
        rating: 4.5,
        totalTrips: 15,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  },
  {
    id: 'user-2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567891',
    role: 'driver',
    avatar: 'https://example.com/avatar2.jpg',
    isVerified: true,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    profiles: {
      driver: {
        licenseNumber: 'DL987654321',
        vehicleInfo: {
          id: 'vehicle-2',
          model: 'Honda Civic',
          year: 2019,
          color: 'Black',
          licensePlate: 'XYZ789',
        },
        rating: 4.8,
        totalTrips: 120,
        isOnline: true,
        currentLocation: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'New York, USA',
        },
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  },
  {
    id: 'user-3',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'System',
    phone: '+1234567892',
    role: 'admin',
    avatar: 'https://example.com/avatar3.jpg',
    isVerified: true,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
    profiles: {
      admin: {
        permissions: ['read', 'write', 'delete'],
        accessLevel: 'super',
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z',
      },
    },
  },
];

// Simulate network delay
const simulateNetworkDelay = (min: number = 200, max: number = 600): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export class UserServiceStub implements IUserService {
  private users = new Map<string, User>(MOCK_USERS.map(user => [user.id, user]));

  async getUser(id: string): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    this.users.delete(id);
  }

  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    await simulateNetworkDelay();

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = params?.offset || (page - 1) * limit;

    const allUsers = Array.from(this.users.values());
    const total = allUsers.length;
    const data = allUsers.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> {
    await simulateNetworkDelay();

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = params?.offset || (page - 1) * limit;

    const allUsers = Array.from(this.users.values());
    const filteredUsers = allUsers.filter(user =>
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );

    const total = filteredUsers.length;
    const data = filteredUsers.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...user,
      avatar: avatarUrl,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async verifyUser(id: string): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...user,
      isVerified: true,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async toggleUserStatus(id: string, isBlocked: boolean): Promise<User> {
    await simulateNetworkDelay();

    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    // In real system, there would be blocking logic here
    // For stub, just return the user
    return user;
  }
}
