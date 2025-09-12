/**
 * Level progress context hooks
 * Custom hooks for level progress functionality
 */

import { useContext } from 'react';
import { LevelProgressContext } from './LevelProgressContext';
import { LevelProgressContextType } from './types';

export const useLevelProgress = (): LevelProgressContextType => {
  const context = useContext(LevelProgressContext);
  if (!context) {
    throw new Error('useLevelProgress must be used within a LevelProgressProvider');
  }
  return context;
};
