import { renderHook, act } from "@testing-library/react-hooks";
import { useDriverModalHandlers } from "../useDriverModalHandlers";

// Моки функций, которые будем проверять
const mockIncrementProgress = jest.fn();
const mockAddEarnings = jest.fn();
const mockRegisterRide = jest.fn();

// Мокаем LevelProgressContext (возвращаем driverLevel и incrementProgress)
jest.mock("../../../../context/LevelProgressContext", () => ({
  useLevelProgress: () => ({
    driverLevel: { isVIP: true },
    incrementProgress: mockIncrementProgress,
  }),
}));

// Мокаем useBalance (addEarnings)
jest.mock("../../../../hooks/useBalance", () => ({
  useBalance: () => ({
    addEarnings: mockAddEarnings,
  }),
}));

// Мокаем useVIPTimeTracking (registerRide)
jest.mock(
  "../../../../components/EarningsScreen/hooks/useVIPTimeTracking",
  () => ({
    useVIPTimeTracking: () => ({
      registerRide: mockRegisterRide,
    }),
  }),
);

// Минимальные заглушки состояния и экшенов, чтобы хук корректно создал колбэки
const createStubState = () => ({
  isDriverExpanded: false,
  buttonColorState: 0,
  isButtonsSwapped: false,
});

const createStubActions = () => ({
  setIsDriverExpanded: jest.fn(),
  setShowLongPressDialog: jest.fn(),
  setShowStopDialog: jest.fn(),
  setShowEndDialog: jest.fn(),
  setShowRatingDialog: jest.fn(),
  setPauseStartTime: jest.fn(),
  setEmergencyActionsUsed: jest.fn(),
  setEmergencyActionType: jest.fn(),
  setButtonColorState: jest.fn(),
  setIconOpacity: jest.fn(),
  setShowSwapIcon: jest.fn(),
  setShowDialog1: jest.fn(),
  setShowDialog2: jest.fn(),
  setShowDialogEmpty: jest.fn(),
  setShowDialogCancel: jest.fn(),
  setIsButtonsSwapped: jest.fn(),
  setCallSheetOpen: jest.fn(),
  setShowContinueDialog: jest.fn(),
});

describe("useDriverModalHandlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("completeTripAccounting", () => {
    it("calls incrementProgress, adds fare, registers VIP ride", async () => {
      mockIncrementProgress.mockResolvedValueOnce({ hasLevelUp: false });

      const state = createStubState();
      const actions = createStubActions();

      const { result } = renderHook(() =>
        useDriverModalHandlers(state as any, actions as any),
      );

      await act(async () => {
        await result.current.handleEndOkPress();
      });

      // incrementProgress вызван
      expect(mockIncrementProgress).toHaveBeenCalled();
      // Добавлен тариф 5.13 AFc
      expect(mockAddEarnings).toHaveBeenCalledWith(5.13);
      // Зарегистрирована поездка для VIP
      expect(mockRegisterRide).toHaveBeenCalled();
    });

    it("adds bonus when level up occurs", async () => {
      mockIncrementProgress.mockResolvedValueOnce({
        hasLevelUp: true,
        bonusAmount: 500,
      });

      const state = createStubState();
      const actions = createStubActions();

      const { result } = renderHook(() =>
        useDriverModalHandlers(state as any, actions as any),
      );

      await act(async () => {
        await result.current.handleEndOkPress();
      });

      // Бонус и тариф начислены
      expect(mockAddEarnings).toHaveBeenCalledWith(500);
      expect(mockAddEarnings).toHaveBeenCalledWith(5.13);
    });
  });
});
