/**
 * Profile context hooks
 * Custom hooks for profile functionality
 */

import { useContext } from 'react';
import { ProfileContext } from './ProfileContext';
import { ProfileContextType } from './types';

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
