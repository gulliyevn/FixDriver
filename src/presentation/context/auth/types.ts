/**
 * Auth context types
 * Type definitions for authentication context
 */

import { User, UserRole } from '../../../shared/types/user';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, authMethod?: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  getAuthHeader: () => Promise<{ Authorization: string } | null>;
  changeRole: (role: UserRole) => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface RegisterUserData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  country: string;
  role: UserRole;
  children?: Array<{ name: string; age: number; relationship: string }>;
}
