import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../hooks/useI18n";
import { useAuth } from "../../context/AuthContext";
import { SupportChatScreenStyles } from "../../styles/screens/SupportChatScreen.styles";
import {
  supportService,
  SupportTicket,
} from "../../services/SupportService";

interface AttachedFile {
  id: string;
  name: string;
  uri: string;
  type: "image" | "document";
  size?: number;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: AttachedFile[];
}

interface SupportChatScreenProps {
  navigation: { goBack: () => void };
  route?: {
    params?: {
      initialMessage?: string;
      quickQuestion?: string;
    };
  };
}

const SupportChatScreen: React.FC<SupportChatScreenProps> = ({
  navigation,
  route,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();

  const isDriver = user?.role === "driver";

  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? "Поддержка" : t("support.title");
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const quickQuestions = [
    { id: "q1", question: t("support.quickQuestion1") },
    { id: "q2", question: t("support.quickQuestion2") },
    { id: "q3", question: t("support.quickQuestion3") },
  ];

  useEffect(() => {
    initializeSupportChat();
  }, [route?.params]);

  const initializeSupportChat = () => {
    setIsLoading(true);

    try {
      // Создаем новый тикет поддержки
      const initialMessage =
        route?.params?.initialMessage || t("support.initialMessage");
      const ticket = supportService.createSupportTicket(
        t("support.chatTitle"),
        initialMessage,
      );
      setCurrentTicket(ticket);

      // Конвертируем сообщения тикета в формат для отображения
      const displayMessages: Message[] = ticket.messages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        isUser: msg.sender === "user",
        timestamp: msg.timestamp,
      }));

      setMessages(displayMessages);

      // Если есть быстрый вопрос, выбираем его
      if (route?.params?.quickQuestion) {
        selectQuickQuestion(route.params.quickQuestion);
      }
    } catch (error) {
      Alert.alert(t("errors.error"), t("support.initError"));
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    if ((!inputText.trim() && attachedFiles.length === 0) || !currentTicket)
      return;

    const messageText = inputText.trim();
    const filesToSend = [...attachedFiles];

    setInputText("");
    setAttachedFiles([]);

    try {
      // Добавляем сообщение пользователя в тикет
      supportService.addUserMessage(currentTicket.id, messageText);

      // Обновляем локальное состояние
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        isUser: true,
        timestamp: new Date(),
        attachments: filesToSend.length > 0 ? filesToSend : undefined,
      };

      setMessages((prev) => [...prev, userMessage]);

      // Симулируем ответ поддержки
      supportService.simulateSupportResponse(currentTicket.id, messageText);

      // Обновляем тикет
      const updatedTicket = supportService.getCurrentTicket();
      if (updatedTicket) {
        setCurrentTicket(updatedTicket);

        // Добавляем ответ поддержки в UI
        setTimeout(() => {
          const lastSupportMessage =
            updatedTicket.messages[updatedTicket.messages.length - 1];
          if (lastSupportMessage && lastSupportMessage.sender === "support") {
            const supportMessage: Message = {
              id: lastSupportMessage.id,
              text: lastSupportMessage.text,
              isUser: false,
              timestamp: lastSupportMessage.timestamp,
            };
            setMessages((prev) => [...prev, supportMessage]);
          }
        }, 2000);
      }
    } catch (error) {
      Alert.alert(t("errors.error"), t("support.sendError"));
    }
  };

  const selectQuickQuestion = (question: string) => {
    if (!currentTicket) return;

    try {
      // Добавляем быстрый вопрос как сообщение пользователя
      supportService.addUserMessage(currentTicket.id, question);

      // Обновляем локальное состояние
      const userMessage: Message = {
        id: Date.now().toString(),
        text: question,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Симулируем ответ поддержки
      supportService.simulateSupportResponse(currentTicket.id, question);

      // Обновляем тикет
      const updatedTicket = supportService.getCurrentTicket();
      if (updatedTicket) {
        setCurrentTicket(updatedTicket);

        // Добавляем ответ поддержки в UI
        setTimeout(() => {
          const lastSupportMessage =
            updatedTicket.messages[updatedTicket.messages.length - 1];
          if (lastSupportMessage && lastSupportMessage.sender === "support") {
            const supportMessage: Message = {
              id: lastSupportMessage.id,
              text: lastSupportMessage.text,
              isUser: false,
              timestamp: lastSupportMessage.timestamp,
            };
            setMessages((prev) => [...prev, supportMessage]);
          }
        }, 2000);
      }
    } catch (error) {
      Alert.alert(t("errors.error"), t("support.quickQuestionError"));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAttachFile = async () => {
    Alert.alert(t("support.attachFile"), t("support.selectFileType"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("support.takePhoto"),
        onPress: () => takePhoto(),
      },
      {
        text: t("support.choosePhoto"),
        onPress: () => pickImage(),
      },
      {
        text: t("support.document"),
        onPress: () => pickDocument(),
      },
    ]);
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("errors.permissionDenied"),
          t("support.cameraPermissionError"),
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newFile: AttachedFile = {
          id: Date.now().toString(),
          name: `camera_${Date.now()}.jpg`,
          uri: asset.uri,
          type: "image",
          size: asset.fileSize,
        };
        setAttachedFiles((prev) => [...prev, newFile]);
      }
    } catch (error) {
      Alert.alert(t("errors.error"), t("support.cameraError"));
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("errors.permissionDenied"),
          t("support.photoPermissionError"),
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newFile: AttachedFile = {
          id: Date.now().toString(),
          name: `photo_${Date.now()}.jpg`,
          uri: asset.uri,
          type: "image",
          size: asset.fileSize,
        };
        setAttachedFiles((prev) => [...prev, newFile]);
      }
    } catch (error) {
      Alert.alert(t("errors.error"), t("support.photoSelectionError"));
    }
  };

  const pickDocument = async () => {
    Alert.alert(t("support.documentPicker"), t("support.documentPickerInfo"), [
      { text: t("common.ok"), style: "default" },
    ]);
  };

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleClose = () => {
    Alert.alert(t("support.closeChat"), t("support.closeChatConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("support.close"),
        onPress: () => navigation.goBack(),
        style: "destructive",
      },
    ]);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        SupportChatScreenStyles.messageContainer,
        item.isUser
          ? SupportChatScreenStyles.userMessage
          : SupportChatScreenStyles.supportMessage,
      ]}
    >
      <View
        style={[
          SupportChatScreenStyles.messageBubble,
          item.isUser
            ? [
                SupportChatScreenStyles.userBubble,
                isDark && SupportChatScreenStyles.userBubbleDark,
              ]
            : [
                SupportChatScreenStyles.supportBubble,
                isDark && SupportChatScreenStyles.supportBubbleDark,
              ],
        ]}
      >
        {!item.isUser && (
          <View style={SupportChatScreenStyles.supportHeader}>
            <Ionicons name="person-circle" size={16} color="#003366" />
            <Text style={SupportChatScreenStyles.supportName}>
              {t("support.supportName")}
            </Text>
          </View>
        )}
        <Text
          style={[
            SupportChatScreenStyles.messageText,
            item.isUser
              ? SupportChatScreenStyles.userMessageText
              : [
                  SupportChatScreenStyles.supportMessageText,
                  isDark && SupportChatScreenStyles.supportMessageTextDark,
                ],
          ]}
        >
          {item.text}
        </Text>

        {/* Прикрепленные файлы */}
        {item.attachments && item.attachments.length > 0 && (
          <View style={SupportChatScreenStyles.attachmentsContainer}>
            {item.attachments.map((file) => (
              <View
                key={file.id}
                style={SupportChatScreenStyles.attachmentItem}
              >
                {file.type === "image" ? (
                  <View style={SupportChatScreenStyles.imageAttachment}>
                    <Ionicons
                      name="image"
                      size={20}
                      color={isDark ? "#9CA3AF" : "#6B7280"}
                    />
                    <Text
                      style={[
                        SupportChatScreenStyles.attachmentName,
                        isDark && SupportChatScreenStyles.attachmentNameDark,
                      ]}
                    >
                      {file.name}
                    </Text>
                  </View>
                ) : (
                  <View style={SupportChatScreenStyles.documentAttachment}>
                    <Ionicons
                      name="document"
                      size={20}
                      color={isDark ? "#9CA3AF" : "#6B7280"}
                    />
                    <Text
                      style={[
                        SupportChatScreenStyles.attachmentName,
                        isDark && SupportChatScreenStyles.attachmentNameDark,
                      ]}
                    >
                      {file.name}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <Text
          style={[
            SupportChatScreenStyles.messageTime,
            item.isUser
              ? SupportChatScreenStyles.userMessageTime
              : [
                  SupportChatScreenStyles.supportMessageTime,
                  isDark && SupportChatScreenStyles.supportMessageTimeDark,
                ],
          ]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  const renderQuickQuestions = () => (
    <View style={SupportChatScreenStyles.quickQuestionsContainer}>
      <Text
        style={[
          SupportChatScreenStyles.quickQuestionsTitle,
          isDark && SupportChatScreenStyles.quickQuestionsTitleDark,
        ]}
      >
        {t("support.quickQuestions")}:
      </Text>
      {quickQuestions.map((question, index) => (
        <TouchableOpacity
          key={index}
          style={[
            SupportChatScreenStyles.quickQuestionButton,
            isDark && SupportChatScreenStyles.quickQuestionButtonDark,
          ]}
          onPress={() => selectQuickQuestion(question.question)}
        >
          <Text
            style={[
              SupportChatScreenStyles.quickQuestionText,
              isDark && SupportChatScreenStyles.quickQuestionTextDark,
            ]}
          >
            {question.question}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#9CA3AF" : "#6B7280"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        SupportChatScreenStyles.container,
        isDark && SupportChatScreenStyles.containerDark,
      ]}
    >
      <KeyboardAvoidingView
        style={[
          SupportChatScreenStyles.keyboardView,
          { backgroundColor: isDark ? "#1F2937" : "#F5F5F5" },
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
          style={[
            SupportChatScreenStyles.header,
            isDark && SupportChatScreenStyles.headerDark,
          ]}
        >
          <TouchableOpacity
            style={SupportChatScreenStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#F9FAFB" : "#111827"}
            />
          </TouchableOpacity>

          <View style={SupportChatScreenStyles.headerInfo}>
            <Text
              style={[
                SupportChatScreenStyles.headerTitle,
                isDark && SupportChatScreenStyles.headerTitleDark,
              ]}
            >
              {getScreenTitle()}
            </Text>
            <View style={SupportChatScreenStyles.statusContainer}>
              <View style={SupportChatScreenStyles.onlineIndicator} />
              <Text
                style={[
                  SupportChatScreenStyles.statusText,
                  isDark && SupportChatScreenStyles.statusTextDark,
                ]}
              >
                {t("support.online")}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={SupportChatScreenStyles.closeButton}
            onPress={handleClose}
          >
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "#F9FAFB" : "#111827"}
            />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <View style={SupportChatScreenStyles.messagesContainer}>
          {isLoading ? (
            <View style={SupportChatScreenStyles.loadingContainer}>
              <Text
                style={[
                  SupportChatScreenStyles.loadingText,
                  isDark && SupportChatScreenStyles.loadingTextDark,
                ]}
              >
                {t("support.connecting")}
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={SupportChatScreenStyles.messagesContent}
              style={{ backgroundColor: isDark ? "#1F2937" : "#F5F5F5" }}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              ListFooterComponent={() => (
                <>{messages.length === 1 && renderQuickQuestions()}</>
              )}
            />
          )}
        </View>

        {/* Предварительный просмотр прикрепленных файлов */}
        {attachedFiles.length > 0 && (
          <View
            style={[
              SupportChatScreenStyles.attachedFilesPreview,
              isDark && SupportChatScreenStyles.attachedFilesPreviewDark,
            ]}
          >
            {attachedFiles.map((file) => (
              <View
                key={file.id}
                style={[
                  SupportChatScreenStyles.attachedFilePreview,
                  isDark && SupportChatScreenStyles.attachedFilePreviewDark,
                ]}
              >
                <Ionicons
                  name={file.type === "image" ? "image" : "document"}
                  size={16}
                  color={isDark ? "#9CA3AF" : "#6B7280"}
                />
                <Text
                  style={[
                    SupportChatScreenStyles.attachedFilePreviewName,
                    isDark &&
                      SupportChatScreenStyles.attachedFilePreviewNameDark,
                  ]}
                  numberOfLines={1}
                >
                  {file.name}
                </Text>
                <TouchableOpacity
                  style={SupportChatScreenStyles.removeFileButton}
                  onPress={() => removeAttachedFile(file.id)}
                >
                  <Ionicons name="close-circle" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Input */}
        <View
          style={[
            SupportChatScreenStyles.inputContainer,
            isDark && SupportChatScreenStyles.inputContainerDark,
          ]}
        >
          <TouchableOpacity
            style={[
              SupportChatScreenStyles.attachButton,
              isDark && SupportChatScreenStyles.attachButtonDark,
            ]}
            onPress={handleAttachFile}
          >
            <Ionicons
              name="attach"
              size={20}
              color={isDark ? "#9CA3AF" : "#6B7280"}
            />
          </TouchableOpacity>

          <TextInput
            style={[
              SupportChatScreenStyles.textInput,
              isDark && SupportChatScreenStyles.textInputDark,
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t("support.messagePlaceholder")}
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              SupportChatScreenStyles.sendButton,
              isDark && SupportChatScreenStyles.sendButtonDark,
              !inputText.trim() &&
                attachedFiles.length === 0 &&
                SupportChatScreenStyles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() && attachedFiles.length === 0}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SupportChatScreen;
