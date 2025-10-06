import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { createChatScreenStyles } from "../../../styles/screens/ChatScreen.styles";
import { ChatService, Message } from "../../../services/ChatService";

type ChatRouteParams = {
  driverId?: string;
  driverName?: string;
  driverCar?: string;
  driverNumber?: string;
  driverStatus?: "online" | "offline";
  driverRating?: string;
};

const ChatScreen: React.FC<{ route?: { params?: ChatRouteParams } }> = ({ route }) => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createChatScreenStyles(isDark), [isDark]);
  const { t } = useLanguage();
  const chatId = route?.params?.driverId || "chat_1";
  const chatName = route?.params?.driverName || t("client.chat.title");
  const driverCar = route?.params?.driverCar as string | undefined;
  const driverNumber = route?.params?.driverNumber as string | undefined;
  const headerDetails = [driverCar, driverNumber].filter(Boolean).join(" · ");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showCallSheet, setShowCallSheet] = useState(false);
  const callSheetAnim = useRef(new Animated.Value(0)).current; // 0 hidden, 1 shown
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const profileSheetAnim = useRef(new Animated.Value(0)).current;
  const [showActionsSheet, setShowActionsSheet] = useState(false);
  const actionsSheetAnim = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messagesList = await ChatService.getMessages(chatId);
      setMessages(messagesList);
    } catch (error) {
      console.warn('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!text.trim()) return;

    try {
      const msg = await ChatService.sendMessage(chatId, text.trim());
      if (msg) {
        setMessages((prev) => [...prev, msg]);
      }
      setText("");
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (error) {
      Alert.alert(t("client.chat.messageError"), t("client.chat.messageError"));
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === "me";
    return (
      <View
        style={[
          styles.messageContainer,
          isMine ? styles.userMessage : styles.clientMessage,
        ]}
      >
        {!isMine && (
          <View style={styles.messageAvatar}>
            <Ionicons name="person" size={16} color="#fff" />
          </View>
        )}

        <View style={[styles.messageBubble, !isMine && styles.otherMessage]}>
          <Text
            style={[styles.messageText, !isMine && styles.otherMessageText]}
          >
            {item.content}
          </Text>

          <View style={styles.messageStatus}>
            <Text style={styles.messageTime}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
            {isMine && (
              <Ionicons
                name={
                  (item as Message & { status?: string }).status === "sent"
                    ? "checkmark"
                    : (item as Message & { status?: string }).status === "delivered"
                      ? "checkmark-done"
                      : "time"
                }
                size={12}
                color={isDark ? "#9CA3AF" : "#6B7280"}
                style={styles.statusIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="chatbubbles-outline"
        size={64}
        color={isDark ? "#6B7280" : "#9CA3AF"}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>
        {loading
          ? t("client.chat.loadingMessages")
          : t("client.chat.noMessages")}
      </Text>
      {!loading && (
        <Text style={styles.emptyStateSubtitle}>
          {t("client.chat.startConversation")}
        </Text>
      )}
    </View>
  );

  // Typing indicator removed per design

  const renderAttachmentMenu = () => (
    <View style={styles.attachmentMenu}>
      <TouchableOpacity
        style={styles.attachmentOption}
        onPress={attachFromCamera}
      >
        <Ionicons
          name="camera"
          size={20}
          color={isDark ? "#F9FAFB" : "#111827"}
        />
        <Text style={styles.attachmentOptionText}>
          {t("client.chat.camera")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.attachmentOption}
        onPress={attachFromGallery}
      >
        <Ionicons
          name="images"
          size={20}
          color={isDark ? "#F9FAFB" : "#111827"}
        />
        <Text style={styles.attachmentOptionText}>
          {t("client.chat.gallery")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.attachmentOption}
        onPress={attachDocument}
      >
        <Ionicons
          name="document"
          size={20}
          color={isDark ? "#F9FAFB" : "#111827"}
        />
        <Text style={styles.attachmentOptionText}>
          {t("client.chat.document")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.attachmentOption}
        onPress={attachLocation}
      >
        <Ionicons
          name="location"
          size={20}
          color={isDark ? "#F9FAFB" : "#111827"}
        />
        <Text style={styles.attachmentOptionText}>
          {t("client.chat.location")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const pushMessageAndScroll = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const attachFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("errors.permissionDenied"));
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
        const msg = await ChatService.sendMessage(
          chatId,
          t("client.chat.camera"),
          "image",
          { imageUrl: asset.uri, fileSize: asset.fileSize || 0 },
        );
        if (msg) pushMessageAndScroll(msg);
        setShowAttachments(false);
      }
    } catch (e) {
      Alert.alert(t("errors.error"));
    }
  };

  const attachFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("errors.permissionDenied"));
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
        const msg = await ChatService.sendMessage(
          chatId,
          t("client.chat.gallery"),
          "image",
          { imageUrl: asset.uri, fileSize: asset.fileSize || 0 },
        );
        if (msg) pushMessageAndScroll(msg);
        setShowAttachments(false);
      }
    } catch (e) {
      Alert.alert(t("errors.error"));
    }
  };

  const attachDocument = async () => {
    Alert.alert(t("common.featureSoon"));
  };

  const attachLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("errors.permissionDenied"));
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const msg = await ChatService.sendMessage(
        chatId,
        t("client.chat.location"),
        "location",
        {
          location: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        },
      );
      if (msg) {
        pushMessageAndScroll(msg);
      }
      setShowAttachments(false);
    } catch (e) {
      Alert.alert(t("client.map.locationError"));
    }
  };

  const openCallSheet = () => {
    setShowCallSheet(true);
    Animated.timing(callSheetAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeCallSheet = () => {
    Animated.timing(callSheetAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setShowCallSheet(false);
      }
    });
  };

  const openProfileSheet = () => {
    setShowProfileSheet(true);
    Animated.timing(profileSheetAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeProfileSheet = () => {
    Animated.timing(profileSheetAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setShowProfileSheet(false);
    });
  };

  const openActionsSheet = () => {
    setShowActionsSheet(true);
    Animated.timing(actionsSheetAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeActionsSheet = () => {
    Animated.timing(actionsSheetAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setShowActionsSheet(false);
    });
  };

  const handleClearChat = async () => {
    await ChatService.deleteChat(chatId);
    setMessages([]);
    closeActionsSheet();
  };

  const handleExportChat = async () => {
    try {
      const msgs = await ChatService.getMessages(chatId);
      msgs
        .map(
          (m) => `${new Date(m.timestamp).toLocaleTimeString()}: ${m.content}`,
        )
        .join("\n");
      Alert.alert(t("client.chat.title"), t("common.success"));
    } catch {
      Alert.alert(t("errors.error"));
    } finally {
      closeActionsSheet();
    }
  };

  const handleDeleteChat = async () => {
    await ChatService.deleteChat(chatId);
    closeActionsSheet();
  };

  const handleReport = () => {
    Alert.alert(t("client.chat.title"), t("common.success"));
    closeActionsSheet();
  };

  const handleBlock = () => {
    Alert.alert(t("client.chat.title"), t("common.success"));
    closeActionsSheet();
  };

  const handleInternetCall = () => {
    Alert.alert(t("client.chat.internetCall"));
    closeCallSheet();
  };

  const handleNetworkCall = () => {
    Alert.alert(t("client.chat.networkCall"));
    closeCallSheet();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerAvatar}
          onPress={openProfileSheet}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={20} color="#fff" />
          <View
            style={
              route?.params?.driverStatus === "online"
                ? styles.headerOnlineIndicator
                : styles.headerOfflineIndicator
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfo}
          onPress={openProfileSheet}
          activeOpacity={0.8}
        >
          <Text style={styles.headerName}>
            {chatName || t("client.chat.title")}
          </Text>
          {headerDetails ? (
            <Text style={styles.headerStatus}>{headerDetails}</Text>
          ) : null}
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={openCallSheet}>
            <Ionicons
              name="call"
              size={20}
              color={isDark ? "#F9FAFB" : "#111827"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={openActionsSheet}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={isDark ? "#F9FAFB" : "#111827"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={loadMessages}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={styles.inputAvoider}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => setShowAttachments(!showAttachments)}
            >
              <Ionicons
                name="add"
                size={18}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder={t("components.input.message")}
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              multiline
              maxLength={1000}
            />

            <TouchableOpacity
              style={[styles.sendButton, !text.trim() && { opacity: 0.5 }]}
              onPress={send}
              disabled={!text.trim()}
            >
              <Ionicons name="send" size={18} style={styles.sendIcon} />
            </TouchableOpacity>
          </View>

          {showAttachments && renderAttachmentMenu()}
        </View>
      </KeyboardAvoidingView>

      {showCallSheet && (
        <View style={styles.callSheetOverlay}>
          <Pressable
            style={styles.callSheetBackdrop}
            onPress={closeCallSheet}
          />
          <Animated.View
            style={[
              styles.callSheetContainer,
              {
                transform: [
                  {
                    translateY: callSheetAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.callSheetClose}
              onPress={closeCallSheet}
              accessibilityLabel={t("common.close")}
            >
              <Ionicons
                name="close"
                size={22}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
            </TouchableOpacity>
            <View style={styles.callSheetHandle} />
            <Text style={styles.callSheetTitle}>
              {t("client.chat.callOptions")}
            </Text>
            <TouchableOpacity
              style={styles.callSheetOption}
              onPress={handleInternetCall}
            >
              <Ionicons
                name="wifi"
                size={20}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
              <Text style={styles.callSheetOptionText}>
                {t("client.chat.internetCall")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callSheetOption}
              onPress={handleNetworkCall}
            >
              <Ionicons
                name="call"
                size={20}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
              <Text style={styles.callSheetOptionText}>
                {t("client.chat.networkCall")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {showProfileSheet && (
        <View style={styles.callSheetOverlay}>
          <Pressable
            style={styles.callSheetBackdrop}
            onPress={closeProfileSheet}
          />
          <Animated.View
            style={[
              styles.callSheetContainer,
              {
                transform: [
                  {
                    translateY: profileSheetAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.callSheetClose}
              onPress={closeProfileSheet}
              accessibilityLabel={t("common.close")}
            >
              <Ionicons
                name="close"
                size={22}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
            </TouchableOpacity>
            <View style={styles.callSheetHandle} />
            <View style={styles.profileHeaderRow}>
              <View style={styles.profileAvatarLarge}>
                <Ionicons name="person" size={28} color="#fff" />
                <View
                  style={
                    route?.params?.driverStatus === "online"
                      ? styles.headerOnlineIndicator
                      : styles.headerOfflineIndicator
                  }
                />
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.profileNameRow}>
                  <Text style={styles.profileName}>{chatName}</Text>
                  <View style={styles.profileRating}>
                    <Text style={styles.profileRatingText}>
                      {route?.params?.driverRating || "4.8"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.profileSubline}>
                  {[driverCar, driverNumber].filter(Boolean).join(" · ")}
                </Text>
              </View>
            </View>
            <View style={styles.profileDivider} />
            <View style={styles.routeList}>
              <View style={styles.routeItem}>
                <View style={styles.routeLeft}>
                  <View style={styles.dotGreen} />
                  <Text style={styles.routeText}>
                    {t("client.paymentHistory.mock.tripToCityCenterTitle")}
                  </Text>
                </View>
                <Text style={styles.routeTime}>08:00</Text>
              </View>
              <View style={styles.routeItem}>
                <View style={styles.routeLeft}>
                  <View style={styles.dotBlue} />
                  <Text style={styles.routeText}>Офис БЦ Port Baku</Text>
                </View>
                <Text style={styles.routeTime}>09:15</Text>
              </View>
              <View style={styles.routeItem}>
                <View style={styles.routeLeft}>
                  <Ionicons
                    name="location"
                    size={18}
                    color={isDark ? "#F9FAFB" : "#111827"}
                  />
                  <Text style={styles.routeText}>Торговый центр 28 Mall</Text>
                </View>
                <Text style={styles.routeTime}>18:30</Text>
              </View>
            </View>
            <View style={styles.bottomInfoRow}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="calendar"
                  size={18}
                  color={isDark ? "#9CA3AF" : "#6B7280"}
                />
                <Text style={styles.infoText}>пн, ср, пт</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons
                  name="star"
                  size={18}
                  color={isDark ? "#9CA3AF" : "#6B7280"}
                />
                <Text style={styles.infoText}>
                  {t("premium.packages.premium")}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>3 остановок</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      )}

      {showActionsSheet && (
        <View style={styles.callSheetOverlay}>
          <Pressable
            style={styles.callSheetBackdrop}
            onPress={closeActionsSheet}
          />
          <Animated.View
            style={[
              styles.callSheetContainer,
              {
                transform: [
                  {
                    translateY: actionsSheetAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.callSheetClose}
              onPress={closeActionsSheet}
              accessibilityLabel={t("common.close")}
            >
              <Ionicons
                name="close"
                size={22}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
            </TouchableOpacity>
            <View style={styles.callSheetHandle} />
            <Text style={styles.callSheetTitle}>{t("client.chat.title")}</Text>
            <TouchableOpacity
              style={styles.callSheetOption}
              onPress={handleClearChat}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
              <Text style={styles.callSheetOptionText}>Clear chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callSheetOption}
              onPress={handleExportChat}
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
              <Text style={styles.callSheetOptionText}>Export chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callSheetOption}
              onPress={handleDeleteChat}
            >
              <Ionicons
                name="trash"
                size={20}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
              <Text style={styles.callSheetOptionText}>
                {t("client.chat.deleteChat")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callSheetOption}
              onPress={handleReport}
            >
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
              <Text style={styles.callSheetOptionText}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callSheetOption}
              onPress={handleBlock}
            >
              <Ionicons
                name="hand-left-outline"
                size={20}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
              <Text style={styles.callSheetOptionText}>Block</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;
