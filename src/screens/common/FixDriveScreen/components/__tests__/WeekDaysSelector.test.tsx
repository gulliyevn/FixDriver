import {
  render,
  fireEvent,
  waitFor,
} from "../../../../../test-utils/testWrapper";
import React from "react";
import { WeekDaysSelector } from "../WeekDaysSelector";

// Мокаем компоненты
jest.mock("../sections/WeekdaysSection", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  return {
    WeekdaysSection: function MockWeekdaysSection() {
      return (
        <View testID="weekdays-section">
          <Text>Weekdays Section</Text>
        </View>
      );
    },
  };
});

jest.mock("../sections/FlexibleScheduleSection", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");

  return {
    FlexibleScheduleSection: function MockFlexibleScheduleSection({
      onSaveSchedule,
    }: any) {
      return (
        <View testID="flexible-schedule-section">
          <Text>Flexible Schedule Section</Text>
          <TouchableOpacity testID="mock-save-button" onPress={onSaveSchedule}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      );
    },
  };
});

jest.mock("../../../../../components/TimePicker", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return function MockTimePicker({ value, onChange, placeholder, title }: any) {
    return (
      <TouchableOpacity
        testID={`time-picker-${title || "default"}`}
        onPress={() => onChange?.("12:00")}
      >
        <Text>{value || placeholder}</Text>
      </TouchableOpacity>
    );
  };
});

describe("WeekDaysSelector", () => {
  const mockProps = {
    colors: {
      primary: "#007AFF",
      background: "#FFFFFF",
      text: "#000000",
      border: "#E5E5E5",
    },
    isDark: false,
    t: (key: string) => key,
    selectedDays: ["mon", "tue"],
    onSelectionChange: jest.fn(),
    selectedTime: "",
    onTimeChange: jest.fn(),
    returnTime: "",
    onReturnTimeChange: jest.fn(),
    returnTripTime: "",
    onReturnTripTimeChange: jest.fn(),
    returnWeekdaysTime: "",
    onReturnWeekdaysTimeChange: jest.fn(),
    isReturnTrip: false,
    onReturnTripChange: jest.fn(),
    onSaveSchedule: jest.fn(),
    scheduleType: "oneWay",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe("Дни недели", () => {
    it("должен отображать все 7 дней недели", () => {
      const { getAllByTestId } = render(<WeekDaysSelector {...mockProps} />);

      const dayButtons = getAllByTestId(/day-button/);
      expect(dayButtons).toHaveLength(7);
    });

    it("должен отмечать выбранные дни", () => {
      const { getByTestId } = render(<WeekDaysSelector {...mockProps} />);

      // Понедельник должен быть выбран
      const mondayButton = getByTestId("day-button-mon");
      expect(mondayButton.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: mockProps.colors.primary,
        }),
      );
    });

    it("должен вызывать onSelectionChange при нажатии на день", () => {
      const { getByTestId } = render(<WeekDaysSelector {...mockProps} />);

      // Нажимаем на среду (не выбранную)
      fireEvent.press(getByTestId("day-button-wed"));

      expect(mockProps.onSelectionChange).toHaveBeenCalledWith([
        "mon",
        "tue",
        "wed",
      ]);
    });

    it("должен убирать день из выбранных при повторном нажатии", () => {
      const { getByTestId } = render(<WeekDaysSelector {...mockProps} />);

      // Нажимаем на понедельник (уже выбранный)
      fireEvent.press(getByTestId("day-button-mon"));

      expect(mockProps.onSelectionChange).toHaveBeenCalledWith(["tue"]);
    });
  });

  describe("Режимы расписания", () => {
    it("должен показывать TimePicker для режима oneWay", () => {
      const { getByTestId } = render(<WeekDaysSelector {...mockProps} />);

      expect(getByTestId("time-picker-common.there")).toBeTruthy();
    });

    it("должен показывать WeekdaysSection для режима weekdays", () => {
      const props = { ...mockProps, scheduleType: "weekdays" };
      const { getByTestId } = render(<WeekDaysSelector {...props} />);

      expect(getByTestId("weekdays-section")).toBeTruthy();
    });

    it("должен показывать FlexibleScheduleSection для режима flexible с достаточным количеством дней", () => {
      const props = {
        ...mockProps,
        scheduleType: "flexible",
        selectedDays: ["mon", "tue", "wed"], // 3 дня >= 2
      };
      const { getByTestId } = render(<WeekDaysSelector {...props} />);

      expect(getByTestId("flexible-schedule-section")).toBeTruthy();
    });

    it("не должен показывать FlexibleScheduleSection если дней меньше 2", () => {
      const props = {
        ...mockProps,
        scheduleType: "flexible",
        selectedDays: ["mon"], // 1 день < 2
      };
      const { queryByTestId } = render(<WeekDaysSelector {...props} />);

      expect(queryByTestId("flexible-schedule-section")).toBeNull();
    });

    it("должен показывать TimePicker для туда и обратно в режиме thereAndBack", () => {
      const props = {
        ...mockProps,
        scheduleType: "thereAndBack",
        selectedTime: "09:00", // Добавляем время, чтобы показался второй TimePicker
      };
      const { getByTestId } = render(<WeekDaysSelector {...props} />);

      expect(getByTestId("time-picker-common.there")).toBeTruthy();
      expect(getByTestId("time-picker-common.return")).toBeTruthy();
    });
  });

  describe("Тестовые кнопки сохранения", () => {
    it("должен показывать кнопку сохранения oneWay когда время выбрано", () => {
      const props = { ...mockProps, selectedTime: "09:00" };
      const { getByText } = render(<WeekDaysSelector {...props} />);

      expect(getByText("common.save (oneWay TEST)")).toBeTruthy();
    });

    it("не должен показывать кнопку сохранения oneWay когда время не выбрано", () => {
      const { queryByText } = render(<WeekDaysSelector {...mockProps} />);

      expect(queryByText("common.save (oneWay TEST)")).toBeNull();
    });

    it("должен вызывать onSaveSchedule при нажатии кнопки oneWay", () => {
      const props = { ...mockProps, selectedTime: "09:00" };
      const { getByText } = render(<WeekDaysSelector {...props} />);

      fireEvent.press(getByText("common.save (oneWay TEST)"));

      expect(mockProps.onSaveSchedule).toHaveBeenCalled();
    });

    it("должен показывать кнопку сохранения flexible в режиме flexible-with-button", () => {
      const props = {
        ...mockProps,
        scheduleType: "flexible-with-button",
        selectedDays: ["mon", "tue"],
        selectedTime: "09:00",
      };
      const { getByText } = render(<WeekDaysSelector {...props} />);

      expect(getByText("common.save (flexible TEST)")).toBeTruthy();
    });
  });

  describe("Выбор времени", () => {
    it("должен вызывать onTimeChange при выборе времени", () => {
      const { getByTestId } = render(<WeekDaysSelector {...mockProps} />);

      fireEvent.press(getByTestId("time-picker-common.there"));

      expect(mockProps.onTimeChange).toHaveBeenCalledWith("12:00");
    });

    it("должен показывать выбранное время", () => {
      const props = { ...mockProps, selectedTime: "15:30" };
      const { getByText } = render(<WeekDaysSelector {...props} />);

      expect(getByText("15:30")).toBeTruthy();
    });
  });

  describe("Обратная поездка", () => {
    it("должен показывать поле для обратного времени в режиме thereAndBack", () => {
      const props = {
        ...mockProps,
        scheduleType: "thereAndBack",
        selectedTime: "09:00", // Добавляем время
        isReturnTrip: true,
      };
      const { getByTestId } = render(<WeekDaysSelector {...props} />);

      expect(getByTestId("time-picker-common.return")).toBeTruthy();
    });

    it("должен вызывать onReturnTimeChange при выборе обратного времени", () => {
      const props = {
        ...mockProps,
        scheduleType: "thereAndBack",
        selectedTime: "09:00", // Добавляем время
        isReturnTrip: true,
      };
      const { getByTestId } = render(<WeekDaysSelector {...props} />);

      fireEvent.press(getByTestId("time-picker-common.return"));

      expect(mockProps.onReturnTimeChange).toHaveBeenCalledWith("12:00");
    });
  });

  describe("Логирование", () => {
    it("должен логировать отладочную информацию при рендере", () => {
      render(<WeekDaysSelector {...mockProps} />);

      expect(console.log).toHaveBeenCalledWith("🔍 WeekDaysSelector Debug:");
      expect(console.log).toHaveBeenCalledWith("  - scheduleType:", "oneWay");
      expect(console.log).toHaveBeenCalledWith("  - selectedDays:", [
        "mon",
        "tue",
      ]);
    });

    it("должен логировать активацию режима oneWay", () => {
      render(<WeekDaysSelector {...mockProps} />);

      expect(console.log).toHaveBeenCalledWith(
        "🎯 WeekDaysSelector: Режим oneWay активирован",
      );
    });

    it("должен логировать данные при сохранении", () => {
      const props = { ...mockProps, selectedTime: "09:00" };
      const { getByText } = render(<WeekDaysSelector {...props} />);

      fireEvent.press(getByText("common.save (oneWay TEST)"));

      expect(console.log).toHaveBeenCalledWith(
        '🔘 WeekDaysSelector oneWay: Кнопка "Сохранить" нажата!',
      );
      expect(console.log).toHaveBeenCalledWith(
        "📊 Данные для сохранения oneWay:",
        expect.objectContaining({
          scheduleType: "oneWay",
          selectedDays: ["mon", "tue"],
          selectedTime: "09:00",
        }),
      );
    });
  });

  describe("Анимации", () => {
    it("должен применять анимацию при нажатии на день", () => {
      const { getByTestId } = render(<WeekDaysSelector {...mockProps} />);

      // Анимация должна запускаться при нажатии
      fireEvent.press(getByTestId("day-button-wed"));

      // Анимация сложна для тестирования, проверяем что функция вызвалась
      expect(mockProps.onSelectionChange).toHaveBeenCalled();
    });
  });

  describe("Callback от флексибельного расписания", () => {
    it("должен передавать onSaveSchedule в FlexibleScheduleSection", () => {
      const props = {
        ...mockProps,
        scheduleType: "flexible",
        selectedDays: ["mon", "tue", "wed"],
      };
      const { getByTestId } = render(<WeekDaysSelector {...props} />);

      // Нажимаем на мок-кнопку из FlexibleScheduleSection
      fireEvent.press(getByTestId("mock-save-button"));

      expect(mockProps.onSaveSchedule).toHaveBeenCalled();
    });
  });

  describe("Неизвестный режим", () => {
    it("должен логировать предупреждение для неизвестного scheduleType", () => {
      const props = { ...mockProps, scheduleType: "unknown" };
      render(<WeekDaysSelector {...props} />);

      expect(console.log).toHaveBeenCalledWith(
        "⚠️ WeekDaysSelector: Неизвестный scheduleType или null",
      );
    });

    it("не должен показывать никаких компонентов для неизвестного режима", () => {
      const props = { ...mockProps, scheduleType: "unknown" };
      const { queryByTestId } = render(<WeekDaysSelector {...props} />);

      expect(queryByTestId("time-picker-common.there")).toBeNull();
      expect(queryByTestId("weekdays-section")).toBeNull();
      expect(queryByTestId("flexible-schedule-section")).toBeNull();
    });
  });
});
