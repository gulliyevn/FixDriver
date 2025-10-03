import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "../../test-utils/testWrapper";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Импортируем экраны профиля
import ClientProfileScreen from "../profile/ClientProfileScreen";
import DriverProfileScreen from "../driver/DriverProfileScreen";

// Мокаем зависимости
jest.mock("../../hooks/useProfile");
jest.mock("../../hooks/useBalance");
jest.mock("../../hooks/useI18n");
jest.mock("../../hooks/useAvatar");
jest.mock("../../hooks/driver/DriverUseAvatar");
jest.mock("../../context/ThemeContext");
jest.mock("../../context/AuthContext");
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Мокаем стили
jest.mock("../../styles/components/ProfileHeader.styles", () => ({
  container: {},
  header: {},
  avatarContainer: {},
  avatar: {},
  userInfo: {},
  userName: {},
  userPhone: {},
  ratingContainer: {},
  rating: {},
  editButton: {},
}));

jest.mock("../../styles/components/ProfileOption.styles", () => ({
  container: {},
  icon: {},
  content: {},
  title: {},
  subtitle: {},
}));

jest.mock("../../styles/components/ProfileChildrenSection.styles", () => ({
  container: {},
  title: {},
  addButton: {},
  childItem: {},
  childName: {},
  childInfo: {},
}));

jest.mock("../../styles/components/ProfileNotificationsModal.styles", () => ({
  modal: {},
  container: {},
  title: {},
  notificationItem: {},
  notificationText: {},
}));

// Мокаем навигацию
const Stack = createStackNavigator();

const renderWithNavigation = (
  component: React.ComponentType<any>,
  initialParams = {},
) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={component}
          initialParams={initialParams}
        />
      </Stack.Navigator>
    </NavigationContainer>,
  );
};

describe("Profile Integration Tests - Smart Roles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Client Profile Integration", () => {
    const mockClientProfile = {
      profile: {
        id: "1",
        name: "John",
        surname: "Doe",
        phone: "+1234567890",
        email: "john@example.com",
        birthDate: "1990-01-01",
        rating: 4.5,
        address: "Client Address",
        createdAt: "2024-01-01T00:00:00.000Z",
        role: "client",
        avatar: null,
      },
      loading: false,
      error: null,
      loadProfile: jest.fn(),
      updateProfile: jest.fn(),
      clearProfile: jest.fn(),
    };

    const mockClientBalance = {
      balance: 1000,
      transactions: [],
      cashback: 50,
      topUpBalance: jest.fn(),
      deductBalance: jest.fn(),
      addTransaction: jest.fn(),
      getCashback: jest.fn(),
    };

    beforeEach(() => {
      jest.doMock("../../hooks/useProfile", () => ({
        useProfile: () => mockClientProfile,
      }));

      jest.doMock("../../hooks/useBalance", () => ({
        useBalance: () => mockClientBalance,
      }));

      jest.doMock("../../hooks/useAvatar", () => ({
        useAvatar: () => ({
          avatar: null,
          uploadAvatar: jest.fn(),
          deleteAvatar: jest.fn(),
        }),
      }));
    });

    it("should render complete client profile screen", async () => {
      renderWithNavigation(ClientProfileScreen);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeTruthy();
        expect(screen.getByText("+1234567890")).toBeTruthy();
        expect(screen.getByText("4.5")).toBeTruthy();
        expect(screen.getByText("€1000")).toBeTruthy();
        expect(screen.getByText("€50")).toBeTruthy(); // cashback
      });
    });

    it("should handle client profile navigation", async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
      };

      renderWithNavigation(ClientProfileScreen, { navigation: mockNavigation });

      await waitFor(() => {
        // Проверяем навигацию к редактированию профиля
        const editButton = screen.getByTestId("edit-profile-button");
        fireEvent.press(editButton);
        expect(mockNavigation.navigate).toHaveBeenCalledWith("EditProfile");
      });
    });

    it("should handle client balance operations", async () => {
      renderWithNavigation(ClientProfileScreen);

      await waitFor(() => {
        // Проверяем пополнение баланса
        const topUpButton = screen.getByText("Top Up");
        fireEvent.press(topUpButton);
        expect(mockClientBalance.topUpBalance).toHaveBeenCalled();
      });
    });

    it("should handle client package operations", async () => {
      renderWithNavigation(ClientProfileScreen);

      await waitFor(() => {
        // Проверяем покупку пакета
        const packageButton = screen.getByText("Packages");
        fireEvent.press(packageButton);
        // Должен быть вызов deductBalance при покупке пакета
        expect(mockClientBalance.deductBalance).toHaveBeenCalled();
      });
    });

    it("should handle client children management", async () => {
      renderWithNavigation(ClientProfileScreen);

      await waitFor(() => {
        // Проверяем добавление ребенка
        const addChildButton = screen.getByText("Add Child");
        fireEvent.press(addChildButton);
        // Должен открыться модал добавления ребенка
        expect(screen.getByText("Add New Child")).toBeTruthy();
      });
    });
  });

  describe("Driver Profile Integration", () => {
    const mockDriverProfile = {
      profile: {
        id: "1",
        name: "John",
        surname: "Driver",
        phone: "+1234567890",
        email: "john.driver@example.com",
        birthDate: "1990-01-01",
        rating: 4.8,
        address: "Driver Address",
        createdAt: "2024-01-01T00:00:00.000Z",
        role: "driver",
        avatar: null,
      },
      loading: false,
      error: null,
      loadProfile: jest.fn(),
      updateProfile: jest.fn(),
      clearProfile: jest.fn(),
    };

    const mockDriverBalance = {
      balance: 2500,
      transactions: [],
      earnings: 1500,
      topUpBalance: jest.fn(),
      withdrawBalance: jest.fn(),
      addTransaction: jest.fn(),
      getEarnings: jest.fn(),
    };

    beforeEach(() => {
      jest.doMock("../../hooks/driver/DriverUseProfile", () => ({
        useDriverProfile: () => mockDriverProfile,
      }));

      jest.doMock("../../hooks/useBalance", () => ({
        useBalance: () => mockDriverBalance,
      }));

      jest.doMock("../../hooks/driver/DriverUseAvatar", () => ({
        useDriverAvatar: () => ({
          avatar: null,
          uploadAvatar: jest.fn(),
          deleteAvatar: jest.fn(),
        }),
      }));
    });

    it("should render complete driver profile screen", async () => {
      renderWithNavigation(DriverProfileScreen);

      await waitFor(() => {
        expect(screen.getByText("John Driver")).toBeTruthy();
        expect(screen.getByText("+1234567890")).toBeTruthy();
        expect(screen.getByText("4.8")).toBeTruthy();
        expect(screen.getByText("€2500")).toBeTruthy();
        expect(screen.getByText("€1500")).toBeTruthy(); // earnings
      });
    });

    it("should handle driver profile navigation", async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
      };

      renderWithNavigation(DriverProfileScreen, { navigation: mockNavigation });

      await waitFor(() => {
        // Проверяем навигацию к редактированию профиля
        const editButton = screen.getByTestId("edit-profile-button");
        fireEvent.press(editButton);
        expect(mockNavigation.navigate).toHaveBeenCalledWith(
          "EditDriverProfile",
        );
      });
    });

    it("should handle driver balance operations", async () => {
      renderWithNavigation(DriverProfileScreen);

      await waitFor(() => {
        // Проверяем вывод средств
        const withdrawButton = screen.getByText("Withdraw");
        fireEvent.press(withdrawButton);
        expect(mockDriverBalance.withdrawBalance).toHaveBeenCalled();
      });
    });

    it("should handle driver vehicle management", async () => {
      renderWithNavigation(DriverProfileScreen);

      await waitFor(() => {
        // Проверяем управление транспортным средством
        const vehicleButton = screen.getByText("Vehicle");
        fireEvent.press(vehicleButton);
        expect(screen.getByText("Vehicle Information")).toBeTruthy();
      });
    });

    it("should handle driver family management", async () => {
      renderWithNavigation(DriverProfileScreen);

      await waitFor(() => {
        // Проверяем добавление члена семьи
        const addFamilyButton = screen.getByText("Add Family Member");
        fireEvent.press(addFamilyButton);
        // Должен открыться модал добавления члена семьи
        expect(screen.getByText("Add Family Member")).toBeTruthy();
      });
    });
  });

  describe("Role Switching Integration", () => {
    it("should handle complete role switching", async () => {
      // Начинаем с клиентского профиля
      let mockProfile = {
        profile: {
          id: "1",
          name: "John",
          surname: "Doe",
          phone: "+1234567890",
          email: "john@example.com",
          birthDate: "1990-01-01",
          rating: 4.5,
          address: "Client Address",
          createdAt: "2024-01-01T00:00:00.000Z",
          role: "client",
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      let mockBalance = {
        balance: 1000,
        transactions: [],
        cashback: 50,
        topUpBalance: jest.fn(),
        deductBalance: jest.fn(),
        addTransaction: jest.fn(),
        getCashback: jest.fn(),
      };

      jest.doMock("../../hooks/useProfile", () => ({
        useProfile: () => mockProfile,
      }));

      jest.doMock("../../hooks/useBalance", () => ({
        useBalance: () => mockBalance,
      }));

      const { rerender } = renderWithNavigation(ClientProfileScreen);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeTruthy();
        expect(screen.getByText("€1000")).toBeTruthy();
        expect(screen.getByText("€50")).toBeTruthy(); // cashback
      });

      // Переключаемся на водительский профиль
      mockProfile = {
        profile: {
          id: "1",
          name: "John",
          surname: "Driver",
          phone: "+1234567890",
          email: "john.driver@example.com",
          birthDate: "1990-01-01",
          rating: 4.8,
          address: "Driver Address",
          createdAt: "2024-01-01T00:00:00.000Z",
          role: "driver",
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      mockBalance = {
        balance: 2500,
        transactions: [],
        earnings: 1500,
        topUpBalance: jest.fn(),
        withdrawBalance: jest.fn(),
        addTransaction: jest.fn(),
        getEarnings: jest.fn(),
      };

      jest.doMock("../../hooks/driver/DriverUseProfile", () => ({
        useDriverProfile: () => mockProfile,
      }));

      jest.doMock("../../hooks/useBalance", () => ({
        useBalance: () => mockBalance,
      }));

      rerender(<DriverProfileScreen />);

      await waitFor(() => {
        expect(screen.getByText("John Driver")).toBeTruthy();
        expect(screen.getByText("€2500")).toBeTruthy();
        expect(screen.getByText("€1500")).toBeTruthy(); // earnings
      });
    });
  });

  describe("Data Persistence Integration", () => {
    it("should persist client profile data", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      const mockSetItem = jest.fn();
      AsyncStorage.setItem.mockImplementation(mockSetItem);

      const mockClientProfile = {
        profile: {
          id: "1",
          name: "John",
          surname: "Doe",
          phone: "+1234567890",
          email: "john@example.com",
          birthDate: "1990-01-01",
          rating: 4.5,
          address: "Client Address",
          createdAt: "2024-01-01T00:00:00.000Z",
          role: "client",
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn().mockImplementation(async (data) => {
          await AsyncStorage.setItem("client_profile", JSON.stringify(data));
        }),
        clearProfile: jest.fn(),
      };

      jest.doMock("../../hooks/useProfile", () => ({
        useProfile: () => mockClientProfile,
      }));

      renderWithNavigation(ClientProfileScreen);

      await waitFor(() => {
        const editButton = screen.getByTestId("edit-profile-button");
        fireEvent.press(editButton);
      });

      // Проверяем, что данные сохраняются
      expect(mockSetItem).toHaveBeenCalled();
    });

    it("should persist driver profile data", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      const mockSetItem = jest.fn();
      AsyncStorage.setItem.mockImplementation(mockSetItem);

      const mockDriverProfile = {
        profile: {
          id: "1",
          name: "John",
          surname: "Driver",
          phone: "+1234567890",
          email: "john.driver@example.com",
          birthDate: "1990-01-01",
          rating: 4.8,
          address: "Driver Address",
          createdAt: "2024-01-01T00:00:00.000Z",
          role: "driver",
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn().mockImplementation(async (data) => {
          await AsyncStorage.setItem("driver_profile", JSON.stringify(data));
        }),
        clearProfile: jest.fn(),
      };

      jest.doMock("../../hooks/driver/DriverUseProfile", () => ({
        useDriverProfile: () => mockDriverProfile,
      }));

      renderWithNavigation(DriverProfileScreen);

      await waitFor(() => {
        const editButton = screen.getByTestId("edit-profile-button");
        fireEvent.press(editButton);
      });

      // Проверяем, что данные сохраняются
      expect(mockSetItem).toHaveBeenCalled();
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle client profile loading errors", async () => {
      const mockClientProfile = {
        profile: null,
        loading: false,
        error: "Failed to load client profile",
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      jest.doMock("../../hooks/useProfile", () => ({
        useProfile: () => mockClientProfile,
      }));

      renderWithNavigation(ClientProfileScreen);

      await waitFor(() => {
        expect(screen.getByText("Failed to load client profile")).toBeTruthy();
        expect(screen.getByText("Retry")).toBeTruthy();
      });
    });

    it("should handle driver profile loading errors", async () => {
      const mockDriverProfile = {
        profile: null,
        loading: false,
        error: "Failed to load driver profile",
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      jest.doMock("../../hooks/driver/DriverUseProfile", () => ({
        useDriverProfile: () => mockDriverProfile,
      }));

      renderWithNavigation(DriverProfileScreen);

      await waitFor(() => {
        expect(screen.getByText("Failed to load driver profile")).toBeTruthy();
        expect(screen.getByText("Retry")).toBeTruthy();
      });
    });

    it("should handle balance loading errors", async () => {
      const mockClientProfile = {
        profile: {
          id: "1",
          name: "John",
          surname: "Doe",
          phone: "+1234567890",
          email: "john@example.com",
          birthDate: "1990-01-01",
          rating: 4.5,
          address: "Client Address",
          createdAt: "2024-01-01T00:00:00.000Z",
          role: "client",
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      const mockClientBalance = {
        balance: 0,
        transactions: [],
        cashback: 0,
        topUpBalance: jest.fn().mockRejectedValue(new Error("Balance error")),
        deductBalance: jest.fn(),
        addTransaction: jest.fn(),
        getCashback: jest.fn(),
      };

      jest.doMock("../../hooks/useProfile", () => ({
        useProfile: () => mockClientProfile,
      }));

      jest.doMock("../../hooks/useBalance", () => ({
        useBalance: () => mockClientBalance,
      }));

      renderWithNavigation(ClientProfileScreen);

      await waitFor(() => {
        const topUpButton = screen.getByText("Top Up");
        fireEvent.press(topUpButton);
        expect(screen.getByText("Error occurred")).toBeTruthy();
      });
    });
  });

  describe("Performance Integration", () => {
    it("should handle large profile data efficiently", async () => {
      const largeTransactions = Array.from({ length: 1000 }, (_, i) => ({
        id: `transaction-${i}`,
        type: "trip_payment",
        amount: Math.random() * 100,
        description: `Trip ${i}`,
        date: new Date().toISOString(),
      }));

      const mockClientProfile = {
        profile: {
          id: "1",
          name: "John",
          surname: "Doe",
          phone: "+1234567890",
          email: "john@example.com",
          birthDate: "1990-01-01",
          rating: 4.5,
          address: "Client Address",
          createdAt: "2024-01-01T00:00:00.000Z",
          role: "client",
          avatar: null,
        },
        loading: false,
        error: null,
        loadProfile: jest.fn(),
        updateProfile: jest.fn(),
        clearProfile: jest.fn(),
      };

      const mockClientBalance = {
        balance: 1000,
        transactions: largeTransactions,
        cashback: 50,
        topUpBalance: jest.fn(),
        deductBalance: jest.fn(),
        addTransaction: jest.fn(),
        getCashback: jest.fn(),
      };

      jest.doMock("../../hooks/useProfile", () => ({
        useProfile: () => mockClientProfile,
      }));

      jest.doMock("../../hooks/useBalance", () => ({
        useBalance: () => mockClientBalance,
      }));

      const startTime = Date.now();
      renderWithNavigation(ClientProfileScreen);
      const endTime = Date.now();

      // Проверяем, что рендеринг происходит быстро
      expect(endTime - startTime).toBeLessThan(1000);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeTruthy();
      });
    });
  });
});
