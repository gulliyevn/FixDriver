import { useState, useEffect, useCallback } from 'react';
import { useLevelProgress } from '../../../../../core/context/LevelProgressContext';

export const useEarningsLevel = () => {
  const { driverLevel, incrementProgress, updateVIPLevel, resetProgress, activateVIPLevel } = useLevelProgress();
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);

  // Sync with context
  useEffect(() => {
    if (driverLevel) {
      setLevel(driverLevel.level);
      setProgress(driverLevel.currentProgress);
    }
  }, [driverLevel]);

  const handleIncrementProgress = useCallback(() => {
    incrementProgress(1);
  }, [incrementProgress]);

  const handleUpdateVIPLevel = useCallback(() => {
    updateVIPLevel([]);
  }, [updateVIPLevel]);

  const handleResetProgress = useCallback(() => {
    resetProgress();
  }, [resetProgress]);

  const handleActivateVIPLevel = useCallback(() => {
    activateVIPLevel();
  }, [activateVIPLevel]);

  return {
    level,
    progress,
    driverLevel,
    incrementProgress: handleIncrementProgress,
    updateVIPLevel: handleUpdateVIPLevel,
    resetProgress: handleResetProgress,
    activateVIPLevel: handleActivateVIPLevel,
  };
};
