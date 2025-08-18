import { renderHook, act } from '@testing-library/react-hooks';
import { useDriverModalHandlers } from '../useDriverModalHandlers';

// Mock dependencies
jest.mock('../../../../context/LevelProgressContext', () => ({
  useLevelProgress: () => ({
    incrementProgress: jest.fn(),
    addRides: jest.fn(),
  }),
}));

jest.mock('../../../../context/BalanceContext', () => ({
  useBalanceContext: () => ({
    addEarnings: jest.fn(),
  }),
}));

jest.mock('../../../../components/EarningsScreen/hooks/useVIPTimeTracking', () => ({
  useVIPTimeTracking: () => ({
    registerRide: jest.fn(),
  }),
}));

describe('useDriverModalHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('completeTripAccounting', () => {
    it('calls all required functions when completing a trip', async () => {
      const mockIncrementProgress = jest.fn();
      const mockAddRides = jest.fn();
      const mockAddEarnings = jest.fn();
      const mockRegisterRide = jest.fn();

      // Mock the context hooks
      jest.doMock('../../../context/LevelProgressContext', () => ({
        useLevelProgress: () => ({
          incrementProgress: mockIncrementProgress,
          addRides: mockAddRides,
        }),
      }));

      jest.doMock('../../../context/BalanceContext', () => ({
        useBalanceContext: () => ({
          addEarnings: mockAddEarnings,
        }),
      }));

      jest.doMock('../../../hooks/useVIPTimeTracking', () => ({
        useVIPTimeTracking: () => ({
          registerRide: mockRegisterRide,
        }),
      }));

      const { result } = renderHook(() => useDriverModalHandlers());

      const tripData = {
        fare: 1500,
        distance: 5.5,
        duration: 1200,
      };

      await act(async () => {
        await result.current.completeTripAccounting(tripData);
      });

      // Verify all functions were called
      expect(mockIncrementProgress).toHaveBeenCalled();
      expect(mockAddRides).toHaveBeenCalledWith(1);
      expect(mockAddEarnings).toHaveBeenCalledWith(1500); // fare amount
      expect(mockRegisterRide).toHaveBeenCalled();
    });

    it('handles trip completion with bonus earnings', async () => {
      const mockIncrementProgress = jest.fn().mockResolvedValue({
        bonus: 500,
        levelUp: true,
      });
      const mockAddEarnings = jest.fn();

      jest.doMock('../../../context/LevelProgressContext', () => ({
        useLevelProgress: () => ({
          incrementProgress: mockIncrementProgress,
          addRides: jest.fn(),
        }),
      }));

      jest.doMock('../../../context/BalanceContext', () => ({
        useBalanceContext: () => ({
          addEarnings: mockAddEarnings,
        }),
      }));

      const { result } = renderHook(() => useDriverModalHandlers());

      const tripData = {
        fare: 2000,
        distance: 8.0,
        duration: 1800,
      };

      await act(async () => {
        await result.current.completeTripAccounting(tripData);
      });

      // Verify fare and bonus were added
      expect(mockAddEarnings).toHaveBeenCalledWith(2000); // fare
      expect(mockAddEarnings).toHaveBeenCalledWith(500); // bonus
    });
  });
});
