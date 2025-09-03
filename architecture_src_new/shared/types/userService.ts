import { 
  User, 
  UserRole, 
  ClientProfile, 
  DriverProfile, 
  AdminProfile,
  Child,
  PaymentMethod,
  VehicleInfo,
  DocumentInfo,
  Location,
  UserWithClientProfile,
  UserWithDriverProfile,
  UserWithAdminProfile
} from './user';

export interface UserService {
  // Основные операции с пользователями
  createUser(userData: CreateUserData): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  
  // Управление профилями
  getClientProfile(userId: string): Promise<ClientProfile | null>;
  getDriverProfile(userId: string): Promise<DriverProfile | null>;
  getAdminProfile(userId: string): Promise<AdminProfile | null>;
  updateClientProfile(userId: string, updates: Partial<ClientProfile>): Promise<ClientProfile>;
  updateDriverProfile(userId: string, updates: Partial<DriverProfile>): Promise<DriverProfile>;
  updateAdminProfile(userId: string, updates: Partial<AdminProfile>): Promise<AdminProfile>;
  
  // Управление ролями
  switchUserRole(userId: string, newRole: UserRole): Promise<User>;
  addUserRole(userId: string, role: UserRole): Promise<User>;
  removeUserRole(userId: string, role: UserRole): Promise<User>;
  getUserRoles(userId: string): Promise<UserRole[]>;
  
  // Поиск и фильтрация
  searchUsers(query: string, filters?: UserFilters): Promise<User[]>;
  getUsersByRole(role: UserRole, filters?: UserFilters): Promise<User[]>;
  getOnlineDrivers(location?: Location, radius?: number): Promise<UserWithDriverProfile[]>;
  
  // Статистика
  getUserStats(userId: string): Promise<UserStats>;
  getSystemStats(): Promise<SystemStats>;
}

export interface UserManagementService {
  // Управление детьми клиентов
  addChild(userId: string, childData: CreateChildData): Promise<Child>;
  updateChild(childId: string, updates: Partial<Child>): Promise<Child>;
  removeChild(childId: string): Promise<boolean>;
  getChildren(userId: string): Promise<Child[]>;
  
  // Управление способами оплаты
  addPaymentMethod(userId: string, paymentData: CreatePaymentMethodData): Promise<PaymentMethod>;
  updatePaymentMethod(paymentId: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod>;
  removePaymentMethod(paymentId: string): Promise<boolean>;
  setDefaultPaymentMethod(userId: string, paymentId: string): Promise<PaymentMethod>;
  getPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  
  // Управление транспортными средствами
  addVehicle(userId: string, vehicleData: CreateVehicleData): Promise<VehicleInfo>;
  updateVehicle(vehicleId: string, updates: Partial<VehicleInfo>): Promise<VehicleInfo>;
  removeVehicle(vehicleId: string): Promise<boolean>;
  getVehicles(userId: string): Promise<VehicleInfo[]>;
  
  // Управление документами
  addDocument(userId: string, documentData: CreateDocumentData): Promise<DocumentInfo>;
  updateDocument(documentId: string, updates: Partial<DocumentInfo>): Promise<DocumentInfo>;
  removeDocument(documentId: string): Promise<boolean>;
  verifyDocument(documentId: string): Promise<DocumentInfo>;
  getDocuments(userId: string): Promise<DocumentInfo[]>;
}

export interface UserValidationService {
  // Валидация данных пользователя
  validateUserData(userData: CreateUserData): ValidationResult;
  validateEmail(email: string): ValidationResult;
  validatePhone(phone: string): ValidationResult;
  validatePassword(password: string): ValidationResult;
  validateLicenseNumber(licenseNumber: string): ValidationResult;
  
  // Валидация профилей
  validateClientProfile(profile: Partial<ClientProfile>): ValidationResult;
  validateDriverProfile(profile: Partial<DriverProfile>): ValidationResult;
  validateVehicleInfo(vehicle: Partial<VehicleInfo>): ValidationResult;
  
  // Проверка разрешений
  canUserPerformAction(userId: string, action: string): Promise<boolean>;
  hasUserPermission(userId: string, permission: string): Promise<boolean>;
}

// Типы данных для создания
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface CreateChildData {
  name: string;
  age: number;
  school?: string;
  address?: string;
}

export interface CreatePaymentMethodData {
  type: PaymentMethod['type'];
  last4?: string;
  brand?: PaymentMethod['brand'];
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
}

export interface CreateVehicleData {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  fuelType: VehicleInfo['fuelType'];
  transmission: VehicleInfo['transmission'];
  seats: number;
}

export interface CreateDocumentData {
  type: string;
  number: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  documentUrl?: string;
}

// Фильтры для поиска
export interface UserFilters {
  role?: UserRole;
  isVerified?: boolean;
  isOnline?: boolean;
  rating?: {
    min?: number;
    max?: number;
  };
  createdAt?: {
    from?: string;
    to?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
}

// Статистика пользователя
export interface UserStats {
  totalTrips: number;
  totalDistance: number;
  totalSpent: number;
  averageRating: number;
  totalReviews: number;
  memberSince: string;
  lastActive: string;
}

// Системная статистика
export interface SystemStats {
  totalUsers: number;
  totalClients: number;
  totalDrivers: number;
  totalAdmins: number;
  onlineDrivers: number;
  activeOrders: number;
  totalRevenue: number;
}

// Результат валидации
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}
