/**
 * 🔌 MOCK SERVICES MANAGER
 * 
 * Centralized access to all mock services. Easy to replace with gRPC later.
 * Clean implementation with English comments and modular structure.
 */

// Import all services
import AuthService from './services/AuthService';
import UserService from './services/UserService';
import DriverService from './services/DriverService';
import OrderService from './services/OrderService';
import MapService from './services/MapService';
import ScheduleService from './services/ScheduleService';
import PackageService from './services/PackageService';
import LanguageService from './services/LanguageService';
import ErrorService from './services/ErrorService';
import CountryService from './services/CountryService';
import EmergencyService from './services/EmergencyService';
import BalanceService from './services/BalanceService';
import DriverStatsService from './services/DriverStatsService';

// Types for ProfileService
interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
}

export default class MockServices {
  // 🔐 AUTHENTICATION SERVICE
  static auth = new AuthService();

  // 👥 USER SERVICE
  static users = new UserService();

  // 🚗 DRIVER SERVICE
  static drivers = new DriverService();

  // 📦 ORDER SERVICE
  static orders = new OrderService();

  // 🗺️ MAP SERVICE
  static map = new MapService();

  // 📅 SCHEDULE SERVICE
  static schedule = new ScheduleService();

  // 📦 PACKAGE SERVICE
  static packages = new PackageService();

  // 🌍 LANGUAGE SERVICE
  static i18n = new LanguageService();

  // ❌ ERROR SERVICE
  static errors = new ErrorService();

  // 🌍 COUNTRY SERVICE
  static countries = new CountryService();

  // 🚨 EMERGENCY SERVICE
  static emergency = new EmergencyService();

  // 💰 BALANCE SERVICE
  static balance = new BalanceService();

  // 📊 DRIVER STATS SERVICE
  static driverStats = new DriverStatsService();

  // 👤 PROFILE SERVICE (wrapper around UserService)
  static profile = {
    async update(userId: string, profileData: ProfileFormData) {
      return MockServices.users.updateProfile(userId, profileData);
    },

    async get(userId: string) {
      return MockServices.users.getById(userId);
    },

    async delete(userId: string) {
      return MockServices.users.deleteUser(userId);
    },
  };
}
