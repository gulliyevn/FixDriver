import { render, act, waitFor } from "../../test-utils/testWrapper";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AuthProvider, useAuth } from "../AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock JWTService
jest.mock("../../services/JWTService", () => ({
  generateTokens: jest.fn().mockResolvedValue({
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expiresIn: 3600,
    tokenType: "Bearer",
  }),
  saveTokens: jest.fn(),
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  clearTokens: jest.fn(),
  hasValidToken: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Mock createAuthMockUser
jest.mock("../../mocks/auth", () => ({
  createAuthMockUser: jest.fn().mockReturnValue({
    id: "123",
    email: "test@example.com",
    name: "Test User",
    surname: "Test",
    role: "client",
    phone: "+1234567890",
    avatar: null,
    rating: 4.5,
    createdAt: "2024-01-01T00:00:00Z",
    address: "Test Address",
  }),
  findAuthUserByCredentials: jest.fn(),
}));

// Test component to access context
const TestComponent = () => {
  const { user, isLoading, login, logout } = useAuth();

  return (
    <View>
      <Text testID="user">{user ? user.email : "no-user"}</Text>
      <Text testID="loading">{isLoading ? "loading" : "not-loading"}</Text>
      <TouchableOpacity
        testID="login-btn"
        onPress={() => login("test@example.com", "password")}
      >
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="logout-btn" onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it("provides initial state", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(getByTestId("user").props.children).toBe("no-user");
    expect(getByTestId("loading").props.children).toBe("not-loading");
  });

  it("handles login successfully", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {
      getByTestId("login-btn").props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId("user").props.children).toBe("test@example.com");
    });
  });

  it("handles logout", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // First login
    await act(async () => {
      getByTestId("login-btn").props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId("user").props.children).toBe("test@example.com");
    });

    // Then logout
    await act(async () => {
      getByTestId("logout-btn").props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId("user").props.children).toBe("no-user");
    });
  });

  it("loads user from storage on mount", async () => {
    const mockUser = {
      id: "123",
      email: "stored@example.com",
      name: "Stored User",
      surname: "Test",
      role: "client",
      phone: "+1234567890",
      avatar: null,
      rating: 4.5,
      createdAt: "2024-01-01T00:00:00Z",
      address: "Test Address",
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockUser),
    );

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("user").props.children).toBe("stored@example.com");
    });
  });

  it("handles loading state during login", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    act(() => {
      getByTestId("login-btn").props.onPress();
    });

    // Should show loading state
    expect(getByTestId("loading").props.children).toBe("loading");

    await waitFor(() => {
      expect(getByTestId("loading").props.children).toBe("not-loading");
    });
  });
});
