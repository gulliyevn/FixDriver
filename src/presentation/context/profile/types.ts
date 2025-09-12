/**
 * Profile context types
 * Type definitions for profile management
 */

import { User, Client, Child, PaymentMethod } from '../../../shared/types/user';

export interface ProfileContextType {
  profile: User | null;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  addChild: (child: Omit<Child, 'id'>) => Promise<boolean>;
  removeChild: (childId: string) => Promise<boolean>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<boolean>;
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  loading: boolean;
}

export interface ProfileProviderProps {
  children: React.ReactNode;
}
