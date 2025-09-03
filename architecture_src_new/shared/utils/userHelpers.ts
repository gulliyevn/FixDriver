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
} from '../types/user';

import {
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
} from '../types/userService';

/**
 * User management utilities
 * Provides helper functions for common user operations
 */
export class UserHelpers {
  /**
   * Get user's full name
   */
  static getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  /**
   * Get user's display name (first name + first letter of last name)
   */
  static getDisplayName(user: User): string {
    const lastName = user.lastName.charAt(0).toUpperCase() + '.';
    return `${user.firstName} ${lastName}`;
  }

  /**
   * Get user's initials
   */
  static getInitials(user: User): string {
    const first = user.firstName.charAt(0).toUpperCase();
    const last = user.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  }

  /**
   * Check if user has specific role
   */
  static hasRole(user: User, role: UserRole): boolean {
    return user.role === role;
  }

  /**
   * Check if user has multiple roles
   */
  static hasMultipleRoles(user: User): boolean {
    return Object.keys(user.profiles).length > 1;
  }

  /**
   * Get user's primary role
   */
  static getPrimaryRole(user: User): UserRole {
    return user.role;
  }

  /**
   * Get all user roles
   */
  static getAllRoles(user: User): UserRole[] {
    const roles: UserRole[] = [];
    if (user.profiles.client) roles.push('client');
    if (user.profiles.driver) roles.push('driver');
    if (user.profiles.admin) roles.push('admin');
    return roles;
  }

  /**
   * Check if user is verified
   */
  static isVerified(user: User): boolean {
    return user.isVerified;
  }

  /**
   * Check if user is online (for drivers)
   */
  static isOnline(user: User): boolean {
    return user.profiles.driver?.isOnline || false;
  }

  /**
   * Get user's rating
   */
  static getRating(user: User): number | null {
    if (user.profiles.client?.rating) return user.profiles.client.rating;
    if (user.profiles.driver?.rating) return user.profiles.driver.rating;
    return null;
  }

  /**
   * Get user's total trips
   */
  static getTotalTrips(user: User): number {
    let total = 0;
    if (user.profiles.client) total += user.profiles.client.totalTrips;
    if (user.profiles.driver) total += user.profiles.driver.totalTrips;
    return total;
  }

  /**
   * Get user's balance (for clients)
   */
  static getBalance(user: User): number | null {
    return user.profiles.client?.balance || null;
  }

  /**
   * Check if user can create orders
   */
  static canCreateOrders(user: User): boolean {
    return this.hasRole(user, 'client') && this.isVerified(user);
  }

  /**
   * Check if user can accept orders
   */
  static canAcceptOrders(user: User): boolean {
    return this.hasRole(user, 'driver') && this.isOnline(user) && this.isVerified(user);
  }

  /**
   * Check if user can manage other users
   */
  static canManageUsers(user: User): boolean {
    return this.hasRole(user, 'admin');
  }

  /**
   * Get user's current location (for drivers)
   */
  static getCurrentLocation(user: User): Location | null {
    return user.profiles.driver?.currentLocation || null;
  }

  /**
   * Get user's vehicle info (for drivers)
   */
  static getVehicleInfo(user: User): VehicleInfo | null {
    return user.profiles.driver?.vehicleInfo || null;
  }

  /**
   * Get user's children (for clients)
   */
  static getChildren(user: User): Child[] {
    return user.profiles.client?.children || [];
  }

  /**
   * Get user's payment methods (for clients)
   */
  static getPaymentMethods(user: User): PaymentMethod[] {
    return user.profiles.client?.paymentMethods || [];
  }

  /**
   * Get user's default payment method (for clients)
   */
  static getDefaultPaymentMethod(user: User): PaymentMethod | null {
    const methods = this.getPaymentMethods(user);
    return methods.find(m => m.isDefault) || null;
  }

  /**
   * Check if user has active payment methods
   */
  static hasActivePaymentMethods(user: User): boolean {
    const methods = this.getPaymentMethods(user);
    return methods.some(m => m.isActive);
  }

  /**
   * Get user's working schedule (for drivers)
   */
  static getWorkingSchedule(user: User) {
    return user.profiles.driver?.schedule || null;
  }

  /**
   * Check if user is working now (for drivers)
   */
  static isWorkingNow(user: User): boolean {
    const schedule = this.getWorkingSchedule(user);
    if (!schedule || !this.isOnline(user)) return false;

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);

    return schedule.workingDays.includes(currentDay) &&
           currentTime >= schedule.workingHours.start &&
           currentTime <= schedule.workingHours.end;
  }

  /**
   * Get user's experience (for drivers)
   */
  static getExperience(user: User) {
    return user.profiles.driver?.experience || null;
  }

  /**
   * Get user's earnings (for drivers)
   */
  static getEarnings(user: User) {
    return user.profiles.driver?.earnings || null;
  }

  /**
   * Get user's documents (for drivers)
   */
  static getDocuments(user: User): DocumentInfo[] {
    const documents: DocumentInfo[] = [];
    
    if (user.profiles.driver?.documents) {
      const driverDocs = user.profiles.driver.documents;
      if (driverDocs.license) documents.push(driverDocs.license);
      if (driverDocs.insurance) documents.push(driverDocs.insurance);
      if (driverDocs.vehicleRegistration) documents.push(driverDocs.vehicleRegistration);
      if (driverDocs.backgroundCheck) documents.push(driverDocs.backgroundCheck);
    }

    if (user.profiles.driver?.vehicleInfo?.documents) {
      documents.push(...Object.values(user.profiles.driver.vehicleInfo.documents));
    }

    return documents;
  }

  /**
   * Check if user has expired documents
   */
  static hasExpiredDocuments(user: User): boolean {
    const documents = this.getDocuments(user);
    const now = new Date();
    
    return documents.some(doc => {
      const expiryDate = new Date(doc.expiryDate);
      return expiryDate < now;
    });
  }

  /**
   * Get user's preferences (for clients)
   */
  static getPreferences(user: User) {
    return user.profiles.client?.preferences || null;
  }

  /**
   * Check if user needs wheelchair access
   */
  static needsWheelchairAccess(user: User): boolean {
    const preferences = this.getPreferences(user);
    return preferences?.accessibility.wheelchairAccess || false;
  }

  /**
   * Check if user needs child seat
   */
  static needsChildSeat(user: User): boolean {
    const preferences = this.getPreferences(user);
    return preferences?.accessibility.childSeat || false;
  }

  /**
   * Check if user is pet friendly
   */
  static isPetFriendly(user: User): boolean {
    const preferences = this.getPreferences(user);
    return preferences?.accessibility.petFriendly || false;
  }

  /**
   * Get user's preferred language
   */
  static getPreferredLanguage(user: User): string {
    const preferences = this.getPreferences(user);
    return preferences?.language || 'ru';
  }

  /**
   * Check if user has notification enabled
   */
  static hasNotificationEnabled(user: User, type: 'email' | 'push' | 'sms'): boolean {
    const preferences = this.getPreferences(user);
    return preferences?.notifications[type] || false;
  }

  /**
   * Calculate user's age from birth date
   */
  static calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Check if user is adult
   */
  static isAdult(user: User): boolean {
    if (!user.profiles.client?.preferences?.accessibility.childSeat) return true;
    
    const children = this.getChildren(user);
    return children.length === 0;
  }

  /**
   * Get user's member since date
   */
  static getMemberSince(user: User): string {
    return user.createdAt;
  }

  /**
   * Get user's last activity
   */
  static getLastActivity(user: User): string {
    return user.updatedAt;
  }

  /**
   * Check if user is new (less than 30 days)
   */
  static isNewUser(user: User): boolean {
    const createdAt = new Date(user.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
    return daysDiff < 30;
  }

  /**
   * Get user's status summary
   */
  static getUserStatus(user: User): string {
    if (!this.isVerified(user)) return 'Не верифицирован';
    if (this.hasRole(user, 'admin')) return 'Администратор';
    if (this.hasRole(user, 'driver')) {
      if (this.isOnline(user)) return 'Водитель (онлайн)';
      return 'Водитель (офлайн)';
    }
    return 'Клиент';
  }
}

// Legacy function exports for smooth migration
export const getFullName = (user: User) => UserHelpers.getFullName(user);
export const getDisplayName = (user: User) => UserHelpers.getDisplayName(user);
export const getInitials = (user: User) => UserHelpers.getInitials(user);
export const hasRole = (user: User, role: UserRole) => UserHelpers.hasRole(user, role);
export const isVerified = (user: User) => UserHelpers.isVerified(user);
export const isOnline = (user: User) => UserHelpers.isOnline(user);
export const getRating = (user: User) => UserHelpers.getRating(user);
export const canCreateOrders = (user: User) => UserHelpers.canCreateOrders(user);
export const canAcceptOrders = (user: User) => UserHelpers.canAcceptOrders(user);
export const getUserStatus = (user: User) => UserHelpers.getUserStatus(user);
