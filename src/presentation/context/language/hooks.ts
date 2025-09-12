/**
 * Language context hooks
 * Custom hooks for language functionality
 */

import React, { useContext } from 'react';
import { LanguageContextType } from './types';

// Create context here to avoid circular dependency
const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
