/**
 * Level progress context
 * Main driver level progress management context
 */

import React, { createContext, useContext } from 'react';
import { LevelProgressContextType, LevelProgressProviderProps } from './types';

export const LevelProgressContext = createContext<LevelProgressContextType | undefined>(undefined);

export const LevelProgressProvider: React.FC<LevelProgressProviderProps> = ({ children }) => {
  // Mock implementation for now
  const value: LevelProgressContextType = {
    driverLevel: null,
    incrementProgress: async () => ({ hasLevelUp: false, bonusAmount: 0, completedLevel: 0, completedSubLevel: 0 }),
    activateVIPLevel: async () => {},
    addRides: async () => {},
    resetProgress: async () => {},
    getTotalRidesForLevel: () => 0,
    updateVIPLevel: async () => {},
  };

  return (
    <LevelProgressContext.Provider value={value}>
      {children}
    </LevelProgressContext.Provider>
  );
};
