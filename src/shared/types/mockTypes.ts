/**
 * Mock service types
 * Types used by mock services for easy replacement with real APIs
 */

import { User, Order, Location, OrderStatus, EmergencyService, CarBrand, CarModel } from '../mocks/types';

// Authentication types
export interface AuthResult {
  success: boolean;
  user: User;
  token: string;
}

export interface Driver {
  id: string;
  name: string;
  status: string;
  isOnline: boolean;
}

export interface DriverStatus {
  status: string;
  isOnline: boolean;
}

// Schedule types
export interface FlexibleScheduleData {
  id: string;
  name: string;
}

export interface CustomizedScheduleData {
  id: string;
  name: string;
}

export interface AllScheduleData {
  flexibleSchedule: FlexibleScheduleData | null;
  customizedSchedule: CustomizedScheduleData | null;
  timestamp: string;
}

// Profile types
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
}

// Package types
export interface PackageType {
  type: string;
  name: string;
}

export interface PackageVisuals {
  icon: string;
  color: string;
  label: string;
  decoration: string;
  isPremium: boolean;
}

// Language types
export enum AppLanguage {
  ENGLISH = 'en',
  RUSSIAN = 'ru',
  AZERBAIJANI = 'az'
}

export interface DateFormat {
  format: string;
}

// Error types
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
}

export enum NetworkErrorCode {
  NO_INTERNET = 'NO_INTERNET'
}

export enum ValidationErrorCode {
  INVALID_EMAIL = 'INVALID_EMAIL'
}

// Country types
export interface Country {
  code: string;
  name: string;
  emergencyNumber: string;
}
