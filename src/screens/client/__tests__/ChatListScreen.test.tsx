import { render, fireEvent, waitFor } from "../../../test-utils/testWrapper";
import React from "react";
import { Alert } from "react-native";
import ChatListScreen from "../../common/chats/ChatListScreen";
import { ChatService } from "../../../services/ChatService";
import { useTheme } from "../../../context/ThemeContext";

// Mock dependencies
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock("../../../services/ChatService", () => ({
  ChatService: {
    getChats: jest.fn(),
    formatMessageTime: jest.fn(),
  },
}));

jest.mock("../../../context/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;
const mockChatService = ChatService as jest.Mocked<typeof ChatService>;

describe("ChatListScreen", () => {
  const mockChats = [
    {
      id: "1",
      participant: { id: "1", name: "John Doe", avatar: "avatar1.jpg" },
      lastMessage: {
        content: "Hello there!",
        timestamp: "2024-01-01T10:00:00Z",
      },
      unreadCount: 2,
      updatedAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "2",
      participant: { id: "2", name: "Jane Smith", avatar: "avatar2.jpg" },
      lastMessage: {
        content: "How are you?",
        timestamp: "2024-01-01T09:00:00Z",
      },
      unreadCount: 0,
      updatedAt: "2024-01-01T09:00:00Z",
    },
  ];

  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      isDark: false,
      toggleTheme: jest.fn(),
      theme: "light",
    });

    mockChatService.getChats.mockResolvedValue(mockChats as any);
    mockChatService.formatMessageTime.mockReturnValue("10:00");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with chats", async () => {
    const { getByText, getByPlaceholderText } = render(<ChatListScreen />);

    await waitFor(() => {
      expect(getByText("Чаты")).toBeTruthy();
      expect(getByPlaceholderText("Поиск чатов...")).toBeTruthy();
      expect(getByText("John Doe")).toBeTruthy();
      expect(getByText("Jane Smith")).toBeTruthy();
    });
  });

  it("shows loading state initially", () => {
    const { getByText } = render(<ChatListScreen />);
    expect(getByText("Загрузка чатов...")).toBeTruthy();
  });

  it("enters selection mode when select button is pressed", async () => {
    const { getByTestId } = render(<ChatListScreen />);

    await waitFor(() => {
      const selectButton = getByTestId("select-button");
      fireEvent.press(selectButton);

      expect(getByTestId("selection-header")).toBeTruthy();
    });
  });

  it("selects all chats when select all is pressed", async () => {
    const { getByTestId, getByText } = render(<ChatListScreen />);

    await waitFor(() => {
      const selectButton = getByTestId("select-button");
      fireEvent.press(selectButton);

      const selectAllButton = getByText("Выбрать все");
      fireEvent.press(selectAllButton);

      expect(getByText("Выбрано: 2")).toBeTruthy();
    });
  });

  it("marks selected chats as read", async () => {
    const { getByTestId, getByText } = render(<ChatListScreen />);

    await waitFor(() => {
      const selectButton = getByTestId("select-button");
      fireEvent.press(selectButton);

      const selectAllButton = getByText("Выбрать все");
      fireEvent.press(selectAllButton);

      const markAsReadButton = getByText("Прочитано");
      fireEvent.press(markAsReadButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        "Успешно",
        "Выбранные чаты отмечены как прочитанные",
      );
    });
  });

  it("deletes selected chats", async () => {
    const { getByTestId, getByText } = render(<ChatListScreen />);

    await waitFor(() => {
      const selectButton = getByTestId("select-button");
      fireEvent.press(selectButton);

      const selectAllButton = getByText("Выбрать все");
      fireEvent.press(selectAllButton);

      const deleteButton = getByText("Удалить");
      fireEvent.press(deleteButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        "Удалить чаты",
        "Удалить 2 выбранных чатов?",
        expect.any(Array),
      );
    });
  });

  it("filters chats by search query", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <ChatListScreen />,
    );

    await waitFor(() => {
      const searchInput = getByPlaceholderText("Поиск чатов...");
      fireEvent.changeText(searchInput, "John");

      expect(getByText("John Doe")).toBeTruthy();
      expect(queryByText("Jane Smith")).toBeNull();
    });
  });

  it("handles long press to enter selection mode", async () => {
    const { getByText, getByTestId } = render(<ChatListScreen />);

    await waitFor(() => {
      const chatItem = getByText("John Doe");
      fireEvent(chatItem, "longPress");

      expect(getByText("Выбрано: 1")).toBeTruthy();
    });
  });

  it("cancels selection mode", async () => {
    const { getByTestId, getByText, queryByText } = render(<ChatListScreen />);

    await waitFor(() => {
      const selectButton = getByTestId("select-button");
      fireEvent.press(selectButton);

      const cancelButton = getByText("Отмена");
      fireEvent.press(cancelButton);

      expect(getByText("Чаты")).toBeTruthy();
      expect(queryByText("Выбрано:")).toBeNull();
    });
  });
});
