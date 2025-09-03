/**
 * 👥 USER TYPES FOR MOCK DATA
 */

import { Identifiable, Timestamp, ContactInfo, Media, UserStatus, Rating } from './common';

export interface User extends Identifiable, Timestamp, ContactInfo {
  name: string;
  password: string; // Added for mock data
  role: 'client' | 'driver' | 'admin';
  status: UserStatus;
  avatar?: string;
  rating?: Rating;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  orderUpdates: boolean;
  promotions: boolean;
}

export interface PrivacySettings {
  shareLocation: boolean;
  shareProfile: boolean;
  shareHistory: boolean;
}
