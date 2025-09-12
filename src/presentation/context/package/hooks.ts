/**
 * Package context hooks
 * Custom hooks for package functionality
 */

import { useContext } from 'react';
import { PackageContext } from './PackageContext';
import { PackageContextType } from './types';

export const usePackage = (): PackageContextType => {
  const context = useContext(PackageContext);
  if (context === undefined) {
    throw new Error('usePackage must be used within a PackageProvider');
  }
  return context;
};
