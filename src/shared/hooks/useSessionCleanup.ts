import { useEffect, useRef } from 'react';
import { fixdriveOrderService } from '../../data/datasources/fixdriveOrder';
import { SESSION_CONSTANTS } from '../constants/sessionConstants';

/**
 * Hook for session cleanup management
 * Provides automatic and manual session cleanup functionality
 */
export const useSessionCleanup = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Function to check and clear expired session
    const checkAndClearSession = async () => {
      try {
        await fixdriveOrderService.checkAndClearExpiredSession();
      } catch (error) {
        console.error('Error in session cleanup:', error);
      }
    };

    // Check immediately on startup
    checkAndClearSession();

    // Set interval to check every 5 minutes
    intervalRef.current = setInterval(checkAndClearSession, SESSION_CONSTANTS.INTERVALS.CLEANUP_CHECK);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Function for forced session cleanup
   */
  const forceClearSession = async () => {
    try {
      await fixdriveOrderService.clearSessionData();
      console.log('Session forcefully cleared');
    } catch (error) {
      console.error('Error forcefully clearing session:', error);
    }
  };

  return { forceClearSession };
};