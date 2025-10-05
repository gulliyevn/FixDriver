import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Linking,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { createForgotPasswordScreenStyles } from "../../styles/screens/ForgotPasswordScreen.styles";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../../components/Button";

interface ForgotPasswordScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isDark } = useTheme();
  const { t } = useLanguage();

  // Создаем стили с учетом текущей темы
  const styles = createForgotPasswordScreenStyles(isDark);

  const handleSendResetEmail = async () => {
    if (!email) {
      Alert.alert(
        t("login.forgotPassword.errorTitle"),
        t("login.forgotPassword.errorEmpty"),
      );
      return;
    }
    if (!email.includes("@")) {
      Alert.alert(
        t("login.forgotPassword.errorTitle"),
        t("login.forgotPassword.errorInvalid"),
      );
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const handleContactSupport = () => {
    const phoneNumber = "+994516995513";
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=Здравствуйте! Мне нужна помощь с восстановлением пароля.`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(whatsappUrl);
        } else {
          const webUrl = `https://wa.me/${phoneNumber}?text=Здравствуйте! Мне нужна помощь с восстановлением пароля.`;
          Linking.openURL(webUrl);
        }
      })
      .catch(() => {
        Alert.alert("Ошибка", "Не удалось открыть WhatsApp");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("login.forgotPassword.title")}</Text>
            <Text style={styles.subtitle}>
              {t("login.forgotPassword.subtitle")}
            </Text>
          </View>

          {!isSuccess ? (
            /* Form */
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t("login.forgotPassword.email")}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("login.forgotPassword.emailPlaceholder")}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={isDark ? "#6B7280" : "#999"}
                />
              </View>

              <Button
                title={
                  isLoading
                    ? t("login.forgotPassword.sending")
                    : t("login.forgotPassword.sendButton")
                }
                onPress={handleSendResetEmail}
                loading={isLoading}
                disabled={isLoading}
                style={styles.submitButton}
              />
            </View>
          ) : (
            /* Success Message */
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.successTitle}>
                {t("login.forgotPassword.successTitle")}
              </Text>
              <Text style={styles.successText}>
                {t("login.forgotPassword.successText")}
              </Text>
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <Text style={styles.backButtonText}>
              {t("login.forgotPassword.backToLogin")}
            </Text>
          </TouchableOpacity>

          {/* Support Button */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#25D366",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              marginTop: 20,
              ...(isDark
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }
                : {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }),
            }}
            onPress={handleContactSupport}
          >
            <Ionicons
              name="logo-whatsapp"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Связаться с поддержкой
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
