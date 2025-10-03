import { StyleSheet } from "react-native";

export const SupportChatScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  containerDark: {
    backgroundColor: "#1F2937",
  },
  keyboardView: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  headerDark: {
    borderBottomColor: "#374151",
    backgroundColor: "#374151",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerTitleDark: {
    color: "#F9FAFB",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusTextDark: {
    color: "#9CA3AF",
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  supportMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: "#003366",
    borderBottomRightRadius: 6,
  },
  userBubbleDark: {
    backgroundColor: "#3B82F6",
  },
  supportBubble: {
    backgroundColor: "#f9f9f9",
    borderBottomLeftRadius: 6,
  },
  supportBubbleDark: {
    backgroundColor: "#374151",
  },
  supportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  supportName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#003366",
    marginLeft: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  supportMessageText: {
    color: "#111827",
  },
  supportMessageTextDark: {
    color: "#F9FAFB",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  supportMessageTime: {
    color: "#6B7280",
  },
  supportMessageTimeDark: {
    color: "#9CA3AF",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6B7280",
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    fontStyle: "italic",
  },
  typingTextDark: {
    color: "#9CA3AF",
  },
  quickQuestionsContainer: {
    marginTop: 20,
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
  },
  quickQuestionsTitleDark: {
    color: "#9CA3AF",
  },
  quickQuestionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  quickQuestionButtonDark: {
    backgroundColor: "#374151",
  },
  quickQuestionText: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    marginRight: 8,
  },
  quickQuestionTextDark: {
    color: "#F9FAFB",
  },
  quickQuestionIcon: {
    width: 20,
    height: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputContainerDark: {
    backgroundColor: "#1F2937",
    borderTopColor: "#374151",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  loadingTextDark: {
    color: "#9CA3AF",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111827",
    marginRight: 8,
    maxHeight: 100,
  },
  textInputDark: {
    backgroundColor: "#374151",
    color: "#F9FAFB",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#003366",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDark: {
    backgroundColor: "#3B82F6",
  },
  sendButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  // Стили для прикрепленных файлов
  attachmentsContainer: {
    marginTop: 8,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  imageAttachment: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentAttachment: {
    flexDirection: "row",
    alignItems: "center",
  },
  attachmentName: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
    flex: 1,
  },
  attachmentNameDark: {
    color: "#9CA3AF",
  },
  // Стили для кнопки прикрепления
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  attachButtonDark: {
    backgroundColor: "#374151",
  },
  // Стили для предварительного просмотра прикрепленных файлов
  attachedFilesPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  attachedFilesPreviewDark: {
    backgroundColor: "#1F2937",
    borderTopColor: "#374151",
  },
  attachedFilePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  attachedFilePreviewDark: {
    backgroundColor: "#374151",
  },
  attachedFilePreviewName: {
    fontSize: 12,
    color: "#374151",
    marginLeft: 6,
    maxWidth: 100,
  },
  attachedFilePreviewNameDark: {
    color: "#9CA3AF",
  },
  removeFileButton: {
    marginLeft: 6,
    padding: 2,
  },
});
