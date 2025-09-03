/**
 * 🏷️ COMMON TYPES FOR MOCK DATA
 * 
 * These types are shared across all mock data and services.
 */

// 📅 TIMESTAMP TYPES
export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

// 📍 LOCATION TYPES
export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  zipCode?: string;
  description?: string;
}

// 🆔 IDENTIFIER TYPES
export interface Identifiable {
  id: string;
}

// 📱 CONTACT TYPES
export interface ContactInfo {
  phone: string;
  email: string;
}

// 🖼️ MEDIA TYPES
export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  filename?: string;
  size?: number;
}

// 🏷️ STATUS TYPES
export type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type DriverStatus = 'available' | 'busy' | 'offline' | 'maintenance';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'verified';

// 💰 PRICING TYPES
export interface Price {
  amount: number;
  currency: string;
  formatted: string;
}

// 📊 RATING TYPES
export interface Rating {
  value: number;
  count: number;
  average: number;
}

// 🔐 AUTHENTICATION TYPES
export interface AuthResult {
  success: boolean;
  user: any;
  token: string;
  message?: string;
}

// 🚨 ERROR TYPES
export interface MockError {
  code: string;
  message: string;
  details?: any;
}

// 🔄 RESPONSE TYPES
export interface MockResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

// 📋 PAGINATION TYPES
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 🎯 FILTER TYPES
export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  location?: Location;
  radius?: number;
}

// 🔍 SEARCH TYPES
export interface SearchParams extends FilterParams {
  query: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 📅 SCHEDULE TYPES
export interface FlexibleScheduleData {
  selectedDays: string[];
  selectedTime?: string;
  returnTime?: string | null;
  isReturnTrip: boolean;
  customizedDays: {[key: string]: {there: string, back: string}};
  timestamp: string;
}

export interface CustomizedScheduleData {
  [key: string]: {there: string, back: string};
}

export interface AllScheduleData {
  flexibleSchedule: FlexibleScheduleData | null;
  customizedSchedule: CustomizedScheduleData | null;
  timestamp: string;
}

// 👤 PROFILE TYPES
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
}

export interface ProfileChangeHandler {
  changeRole?: (role: 'client' | 'driver') => void;
}

export interface ProfileNavigation {
  navigation: any;
  login: (email: string, password: string) => Promise<boolean>;
  t: (key: string) => string;
}

// 📦 PACKAGE TYPES
export enum PackageType {
  FREE = 'free',
  PLUS = 'plus',
  PREMIUM = 'premium',
  PREMIUM_PLUS = 'premiumPlus',
  SINGLE = 'single',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface PackageVisuals {
  icon: string;
  color: string;
  label: string;
  decoration: string;
  isPremium: boolean;
}

// 🔤 FORMATTING TYPES
export enum AppLanguage {
  RUSSIAN = 'ru',
  ENGLISH = 'en',
  AZERBAIJANI = 'az',
  GERMAN = 'de',
  SPANISH = 'es',
  FRENCH = 'fr',
  TURKISH = 'tr',
  ARABIC = 'ar'
}

export enum DateFormat {
  SHORT = 'short',
  LONG = 'long'
}

// 🚨 ERROR TYPES
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'AUTH_001',
  USER_NOT_FOUND = 'AUTH_002',
  ACCOUNT_LOCKED = 'AUTH_003',
  TOO_MANY_ATTEMPTS = 'AUTH_004',
  TOKEN_EXPIRED = 'AUTH_005',
  TOKEN_INVALID = 'AUTH_006',
  EMAIL_NOT_VERIFIED = 'AUTH_007',
  PHONE_NOT_VERIFIED = 'AUTH_008',
  WEAK_PASSWORD = 'AUTH_009',
  EMAIL_ALREADY_EXISTS = 'AUTH_010',
  PHONE_ALREADY_EXISTS = 'AUTH_011',
}

export enum NetworkErrorCode {
  NO_INTERNET = 'NET_001',
  TIMEOUT = 'NET_002',
  SERVER_ERROR = 'NET_003',
  BAD_REQUEST = 'NET_004',
  UNAUTHORIZED = 'NET_005',
  FORBIDDEN = 'NET_006',
  NOT_FOUND = 'NET_007',
  RATE_LIMITED = 'NET_008',
}

export enum ValidationErrorCode {
  INVALID_EMAIL = 'VAL_001',
  INVALID_PHONE = 'VAL_002',
  INVALID_PASSWORD = 'VAL_003',
  INVALID_NAME = 'VAL_004',
  INVALID_LICENSE = 'VAL_005',
  INVALID_VEHICLE = 'VAL_006',
  INVALID_OTP = 'VAL_007',
  MISSING_FIELDS = 'VAL_008',
}

// 🌍 COUNTRY TYPES
export type { Country, CountryService, Region } from '../../types/countries';

// 🚨 EMERGENCY TYPES
export type { EmergencyService, EmergencyContact, EmergencyServiceProvider, EmergencyServiceType } from '../../types/emergency';

// 🚗 DRIVER TYPES
export type { 
  ExperienceOption, 
  CarBrand, 
  CarModel, 
  TariffOption, 
  YearOption, 
  DriverDataService,
  CarCategory,
  TariffType,
  PriceRange
} from '../../types/driver';

// 👤 USER EXPORTS
export type { 
  User, 
  ClientProfile, 
  DriverProfile, 
  AdminProfile,
  Child,
  PaymentMethod,
  VehicleInfo,
  DocumentInfo,
  UserWithClientProfile,
  UserWithDriverProfile,
  UserWithAdminProfile
} from '../../types/user';

// 🔐 PERMISSIONS EXPORTS
export type { 
  UserRole,
  RoleDetails,
  ClientPermission,
  DriverPermission,
  AdminPermission,
  ClientFeature,
  DriverFeature,
  AdminFeature,
  DriverRequirement,
  AdminAccessLevel
} from '../../types/permissions';

// 🔑 AUTH EXPORTS
export type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  LogoutRequest,
  VerifyEmailRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  RefreshTokenResponse,
  LogoutResponse,
  VerifyEmailResponse,
  ChangePasswordResponse,
  UpdateProfileResponse,
  UserSession,
  DeviceInfo,
  SecuritySettings,
  TwoFactorSetup,
  AuthError
} from '../../types/auth';

export type {
  UserService,
  UserManagementService,
  UserValidationService,
  CreateUserData,
  CreateChildData,
  CreatePaymentMethodData,
  CreateVehicleData,
  CreateDocumentData,
  UserFilters,
  UserStats,
  SystemStats,
  ValidationResult,
  ValidationError,
  ValidationWarning
} from '../../types/userService';
