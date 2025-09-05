import { User, PaginationParams, PaginatedResponse } from '../../shared/types';

export interface IUserRepository {
  // User CRUD operations
  getUser(id: string): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // User listing and search
  getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>>;
  searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>>;
  
  // User profile management
  updateAvatar(id: string, avatarUrl: string): Promise<User>;
  verifyUser(id: string): Promise<User>;
  toggleUserStatus(id: string, isBlocked: boolean): Promise<User>;
  
  // User validation
  isUserExists(email: string): Promise<boolean>;
  
  // Helper methods
  getUserByEmail(email: string): Promise<User | null>;
  getUsersByRole(role: string): Promise<User[]>;
}
