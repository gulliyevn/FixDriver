import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClientScreenProps } from "../../types/navigation";
import {
  HelpScreenStyles as styles,
  getHelpScreenStyles,
} from "../../styles/screens/profile/HelpScreen.styles";
import { useI18n } from "../../hooks/useI18n";
import RulesModal from "../../components/RulesModal";
import BookingHelpModal from "../../components/BookingHelpModal";
import PaymentHelpModal from "../../components/PaymentHelpModal";
import SafetyHelpModal from "../../components/SafetyHelpModal";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useHelpContent from "../../shared/hooks/useHelpContent";
import { getCurrentColors } from "../../constants/colors";
import type { HelpSection, HelpModalType } from "../../shared/types/help";

type HelpScreenProps = ClientScreenProps<"Help"> | { navigation: any };

const HelpScreen: React.FC<HelpScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const dynamicStyles = useMemo(() => getHelpScreenStyles(isDark), [isDark]);
  const currentColors = useMemo(() => getCurrentColors(isDark), [isDark]);

  const isDriver = user?.role === "driver";

  const getScreenTitle = useCallback(() => {
    return isDriver ? t("help.title") : t("help.title");
  }, [isDriver, t]);

  const { sections, contact, loading, refreshing, errorKey, refresh } =
    useHelpContent();
  const [activeModal, setActiveModal] = useState<HelpModalType | null>(null);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportErrorKey, setSupportErrorKey] = useState<string | null>(null);

  const displaySections = useMemo(
    () =>
      sections.map((section) => ({
        section,
        title: t(section.titleKey),
        description: t(section.descriptionKey),
      })),
    [sections, t],
  );

  const isLoading = loading && displaySections.length === 0;

  const handleSectionPress = useCallback(
    async (section: HelpSection) => {
      if (section.modalType) {
        setActiveModal(section.modalType);
        return;
      }

      if (section.action?.type === "navigation") {
        navigation.navigate(section.action.value as never);
        return;
      }

      if (section.action?.type === "link") {
        try {
          const url = section.action.value;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            return;
          }
          if (contact.fallbackUrl) {
            await Linking.openURL(contact.fallbackUrl);
          }
        } catch (linkError) {
          setSupportErrorKey("errors.unknownError");
        }
      }
    },
    [contact.fallbackUrl, navigation],
  );

  const handleSupportContact = useCallback(async () => {
    const normalizedNumber = (contact.whatsappNumber || "").replace(
      /[^\d]/g,
      "",
    );
    if (!normalizedNumber) {
      setSupportErrorKey("support.whatsappError");
      return;
    }

    const messageKey = contact.messageKey || "support.whatsappMessage";
    const message = t(messageKey);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `whatsapp://send?phone=${normalizedNumber}&text=${encodedMessage}`;
    const fallbackBase =
      contact.fallbackUrl || `https://wa.me/${normalizedNumber}`;
    const fallbackUrl = fallbackBase.includes("?")
      ? `${fallbackBase}&text=${encodedMessage}`
      : `${fallbackBase}?text=${encodedMessage}`;

    setSupportErrorKey(null);
    setSupportLoading(true);

    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(fallbackUrl);
      }
    } catch (error) {
      setSupportErrorKey("support.whatsappError");
    } finally {
      setSupportLoading(false);
    }
  }, [contact.fallbackUrl, contact.messageKey, contact.whatsappNumber, t]);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const errorMessageKey = useMemo(
    () => errorKey ?? supportErrorKey,
    [errorKey, supportErrorKey],
  );
  const errorMessage = useMemo(
    () => (errorMessageKey ? t(errorMessageKey) : null),
    [errorMessageKey, t],
  );

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>
          {getScreenTitle()}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={currentColors.info}
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={currentColors.info} />
          </View>
        ) : (
          <>
            <Text style={[styles.description, dynamicStyles.description]}>
              {t("help.description")}
            </Text>

            {errorMessage && (
              <View style={styles.errorBox}>
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color={currentColors.warning}
                />
                <Text style={[styles.errorText, dynamicStyles.helpDescription]}>
                  {errorMessage}
                </Text>
              </View>
            )}

            {displaySections.map(({ section, title, description }) => (
              <TouchableOpacity
                key={section.id}
                style={[styles.helpItem, dynamicStyles.helpItem]}
                onPress={() => handleSectionPress(section)}
                activeOpacity={0.7}
              >
                <View style={[styles.helpIcon, dynamicStyles.helpIcon]}>
                  <Ionicons
                    name={section.icon as any}
                    size={24}
                    color={isDark ? "#fff" : "#003366"}
                  />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={[styles.helpTitle, dynamicStyles.helpTitle]}>
                    {title}
                  </Text>
                  <Text
                    style={[
                      styles.helpDescription,
                      dynamicStyles.helpDescription,
                    ]}
                  >
                    {description}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDark ? "#666" : "#ccc"}
                />
              </TouchableOpacity>
            ))}

            <View style={styles.contactSection}>
              <Text style={[styles.contactTitle, dynamicStyles.contactTitle]}>
                {t("help.contactTitle")}
              </Text>
              <Text
                style={[
                  styles.contactDescription,
                  dynamicStyles.contactDescription,
                ]}
              >
                {t("help.contactDescription")}
              </Text>
              <TouchableOpacity
                style={[
                  styles.contactButton,
                  supportLoading && styles.contactButtonDisabled,
                ]}
                onPress={handleSupportContact}
                activeOpacity={0.8}
                disabled={supportLoading}
              >
                {supportLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="logo-whatsapp" size={24} color="#fff" />
                )}
                <Text style={styles.contactButtonText}>
                  {t("help.contactWhatsApp")}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <RulesModal visible={activeModal === "rules"} onClose={closeModal} />
      <BookingHelpModal
        visible={activeModal === "booking"}
        onClose={closeModal}
      />
      <PaymentHelpModal
        visible={activeModal === "payment"}
        onClose={closeModal}
      />
      <SafetyHelpModal
        visible={activeModal === "safety"}
        onClose={closeModal}
      />
    </View>
  );
};

export default HelpScreen;
