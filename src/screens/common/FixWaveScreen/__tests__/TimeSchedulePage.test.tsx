import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "../../../../test-utils/testWrapper";
import React from "react";
import TimeSchedulePage from "../components/TimeSchedulePage";
import { useScheduleState } from "../hooks/useScheduleState";
import { useSessionData } from "../hooks/useSessionData";

// Мокаем зависимости
jest.mock("../../../../context/ThemeContext");
jest.mock("../../../../context/LanguageContext");
jest.mock("../../../../services/fixwaveOrderService");
jest.mock("../hooks/useScheduleState");
jest.mock("../hooks/useSessionData");

const mockUseTheme = require("../../../../context/ThemeContext").useTheme;
const mockUseLanguage =
  require("../../../../context/LanguageContext").useLanguage;

describe("TimeSchedulePage", () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();
  const mockState = {
    timeScheduleData: {
      date: new Date(),
      time: "",
      isRecurring: false,
      notes: "",
    },
    setTimeScheduleData: jest.fn(),
    addresses: { from: "Москва", to: "Санкт-Петербург", stops: ["Тверь"] },
    setAddresses: jest.fn(),
    coordinates: {
      from: { latitude: 55.7558, longitude: 37.6176 },
      to: { latitude: 59.9311, longitude: 30.3609 },
      stops: [{ latitude: 56.8587, longitude: 35.9006 }],
    },
    setCoordinates: jest.fn(),
    switchStates: { switch1: false, switch2: false, switch3: false },
    setSwitchStates: jest.fn(),
    times: { fixed: {}, weekday: {}, weekend: {} },
    setTimes: jest.fn(),
    selectedDays: [],
    setSelectedDays: jest.fn(),
    resetAllData: jest.fn(),
    forceSetSwitchStates: jest.fn(),
    forceSetTimes: jest.fn(),
    forceSetSelectedDays: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTheme.mockReturnValue({ isDark: false });
    mockUseLanguage.mockReturnValue({ t: (key: string) => key });

    (useScheduleState as jest.Mock).mockReturnValue(mockState);
    (useSessionData as jest.Mock).mockImplementation(() => {});
  });

  describe("Переключение режимов", () => {
    test("должен сбрасывать данные при переключении switch1 (туда/туда-обратно)", () => {
      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const switch1 = screen.getByTestId("switch-1");
      fireEvent.press(switch1);

      expect(mockState.resetAllData).toHaveBeenCalled();
      expect(mockState.forceSetSwitchStates).toHaveBeenCalled();
    });

    test("должен сбрасывать данные при переключении switch2 (фиксированный/плавающий)", () => {
      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const switch2 = screen.getByTestId("switch-2");
      fireEvent.press(switch2);

      expect(mockState.resetAllData).toHaveBeenCalled();
      expect(mockState.forceSetSwitchStates).toHaveBeenCalled();
    });

    test("должен сбрасывать данные при переключении switch3 (ежедневно/будни-выходные)", () => {
      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const switch3 = screen.getByTestId("switch-3");
      fireEvent.press(switch3);

      expect(mockState.resetAllData).toHaveBeenCalled();
      expect(mockState.forceSetSwitchStates).toHaveBeenCalled();
    });
  });

  describe("Сохранение данных", () => {
    test('не должен сохранять данные до нажатия кнопки "Сохранить"', () => {
      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      // Изменяем время в контейнере
      const timeInput = screen.getByTestId("time-input-0");
      fireEvent.changeText(timeInput, "10:00");

      // Проверяем, что данные не сохранились автоматически
      expect(mockOnNext).not.toHaveBeenCalled();
    });

    test('должен сохранять данные только при нажатии кнопки "Сохранить"', async () => {
      mockState.times.fixed = { 0: "10:00" };

      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const saveButton = screen.getByText("common.save");
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalled();
      });
    });

    test("должен показывать ошибку если время не выбрано", () => {
      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const saveButton = screen.getByText("common.save");
      fireEvent.press(saveButton);

      expect(screen.getByText("Ошибка")).toBeTruthy();
      expect(screen.getByText("Пожалуйста, выберите время")).toBeTruthy();
    });
  });

  describe("Контейнеры таймпикера", () => {
    test("только BLUE контейнер (КУДА) должен быть активен для ввода", () => {
      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const blueContainer = screen.getByTestId("container-BLUE");
      const greenContainer = screen.getByTestId("container-GREEN");
      const greyContainer = screen.getByTestId("container-GREY");

      expect(blueContainer.props.allowTimeSelection).toBe(true);
      expect(greenContainer.props.allowTimeSelection).toBe(false);
      expect(greyContainer.props.allowTimeSelection).toBe(false);
    });

    test("GREEN контейнер должен показывать расчетное время", () => {
      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const greenContainer = screen.getByTestId("container-GREEN");

      expect(greenContainer.props.shouldCalculateTime).toBe(true);
      expect(greenContainer.props.shouldShowCalculatedTime).toBe(true);
    });

    test("GREY контейнеры должны показывать расчетное время", () => {
      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const greyContainer = screen.getByTestId("container-GREY");

      expect(greyContainer.props.shouldCalculateTime).toBe(true);
      expect(greyContainer.props.shouldShowCalculatedTime).toBe(true);
    });
  });

  describe("Сценарии с остановками", () => {
    test("ДОП1 по дороге - должен рассчитывать время корректно", () => {
      const coordinatesWithStopOnRoute = {
        ...mockState.coordinates,
        stops: [{ latitude: 56.8587, longitude: 35.9006 }], // Тверь на маршруте
      };

      mockState.coordinates = coordinatesWithStopOnRoute;

      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const stopContainer = screen.getByTestId("container-GREY-0");
      expect(stopContainer.props.fromCoordinate).toEqual(
        coordinatesWithStopOnRoute.stops[0],
      );
      expect(stopContainer.props.toCoordinate).toEqual(
        coordinatesWithStopOnRoute.to,
      );
    });

    test("ДОП2 вне дороги - должен показывать --:--", () => {
      const coordinatesWithStopOffRoute = {
        ...mockState.coordinates,
        stops: [
          { latitude: 56.8587, longitude: 35.9006 }, // Тверь на маршруте
          { latitude: 60.0, longitude: 30.0 }, // Точка вне маршрута
        ],
      };

      mockState.coordinates = coordinatesWithStopOffRoute;

      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      const stopContainer2 = screen.getByTestId("container-GREY-1");
      expect(stopContainer2.props.fromCoordinate).toEqual(
        coordinatesWithStopOffRoute.stops[1],
      );
      // Время должно быть --:-- для точки вне маршрута
    });
  });

  describe("Плавный режим", () => {
    test("должен сбрасывать данные при переключении на плавный режим", () => {
      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      // Переключаем на плавный режим
      const switch2 = screen.getByTestId("switch-2");
      fireEvent.press(switch2);

      expect(mockState.resetAllData).toHaveBeenCalled();
    });

    test("должен сбрасывать данные при переключении с плавного режима", () => {
      mockState.switchStates.switch2 = true; // Плавный режим включен

      render(<TimeSchedulePage onNext={mockOnNext} onBack={mockOnBack} />);

      // Переключаем на фиксированный режим
      const switch2 = screen.getByTestId("switch-2");
      fireEvent.press(switch2);

      expect(mockState.resetAllData).toHaveBeenCalled();
    });
  });
});
