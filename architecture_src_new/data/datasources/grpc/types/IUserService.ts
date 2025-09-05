import { 
  User, 
  UserRole, 
  ClientProfile, 
  DriverProfile, 
  AdminProfile,
  Location,
  UserWithClientProfile,
  UserWithDriverProfile,
  UserWithAdminProfile,
  PaginationParams, 
  PaginatedResponse 
} from '../../../../shared/types';

export interface IUserService {
  // Basic CRUD operations
  createUser(userData: CreateUserData): Promise<User>;
  getUser(id: string): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // Profile management
  getClientProfile(userId: string): Promise<ClientProfile | null>;
  getDriverProfile(userId: string): Promise<DriverProfile | null>;
  getAdminProfile(userId: string): Promise<AdminProfile | null>;
  updateClientProfile(userId: string, updates: Partial<ClientProfile>): Promise<ClientProfile>;
  updateDriverProfile(userId: string, updates: Partial<DriverProfile>): Promise<DriverProfile>;
  updateAdminProfile(userId: string, updates: Partial<AdminProfile>): Promise<AdminProfile>;
  
  // Role management
  switchUserRole(userId: string, newRole: UserRole): Promise<User>;
  addUserRole(userId: string, role: UserRole): Promise<User>;
  removeUserRole(userId: string, role: UserRole): Promise<User>;
  getUserRoles(userId: string): Promise<UserRole[]>;
  
  // Search and filtering
  getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>>;
  searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>>;
  getUsersByRole(role: UserRole, filters?: UserFilters): Promise<User[]>;
  getOnlineDrivers(location?: Location, radius?: number): Promise<UserWithDriverProfile[]>;
  
  // Avatar and verification
  updateAvatar(id: string, avatarUrl: string): Promise<User>;
  verifyUser(id: string): Promise<User>;
  toggleUserStatus(id: string, isBlocked: boolean): Promise<User>;
  
  // Statistics
  getUserStats(userId: string): Promise<UserStats>;
  getSystemStats(): Promise<SystemStats>;
}

// Data types for creation
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

// Filter and result types
export interface UserFilters {
  role?: UserRole;
  isVerified?: boolean;
  isOnline?: boolean;
  location?: Location;
  radius?: number;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageRating: number;
  memberSince: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalDrivers: number;
  onlineDrivers: number;
}
