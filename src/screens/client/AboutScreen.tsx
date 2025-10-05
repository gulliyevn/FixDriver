import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClientScreenProps } from "../../types/navigation";
import {
  AboutScreenStyles as styles,
  getAboutScreenStyles,
} from "../../styles/screens/profile/AboutScreen.styles";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../hooks/useI18n";
import { colors } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

type AboutScreenProps = ClientScreenProps<"About"> | { navigation: any };

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getAboutScreenStyles(isDark);

  const isDriver = user?.role === "driver";

  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? "О приложении" : t("client.about.title");
  };
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const appInfo = {
    name: "FixDrive",
    version: "1.0.0",
    build: "2025.07.01",
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

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
      >
        <View style={styles.appInfo}>
          <View style={[styles.appIcon, dynamicStyles.appIcon]}>
            <Image
              source={require("../../../assets/icon.png")}
              style={styles.appIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.appTextContainer}>
            <Text style={[styles.appName, dynamicStyles.appName]}>
              {appInfo.name}
            </Text>
            <Text style={[styles.appVersion, dynamicStyles.appVersion]}>
              by Axivion LLC
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            {t("client.about.information")}
          </Text>
          <View style={[styles.infoItem, dynamicStyles.infoItem]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
              {t("client.about.version")}
            </Text>
            <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
              {appInfo.version}
            </Text>
          </View>
          <View style={[styles.infoItem, dynamicStyles.infoItem]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
              {t("client.about.build")}
            </Text>
            <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
              {appInfo.build}
            </Text>
          </View>
          <View style={[styles.infoItem, dynamicStyles.infoItem]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
              {t("client.about.developer")}
            </Text>
            <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
              FixDrive Team
            </Text>
          </View>
        </View>

        <View style={styles.linksSection}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            {t("client.about.links")}
          </Text>
          <TouchableOpacity
            style={[styles.linkItem, dynamicStyles.linkItem]}
            onPress={() => handleOpenLink("https://junago.net")}
          >
            <Ionicons name="globe" size={24} color={currentColors.primary} />
            <Text style={[styles.linkText, dynamicStyles.linkText]}>
              {t("client.about.website")}
            </Text>
            <Ionicons
              name="open-outline"
              size={20}
              color={currentColors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkItem, dynamicStyles.linkItem]}
            onPress={() => handleOpenLink("mailto:junago@junago.net")}
          >
            <Ionicons name="mail" size={24} color={currentColors.primary} />
            <Text style={[styles.linkText, dynamicStyles.linkText]}>
              {t("client.about.support")}
            </Text>
            <Ionicons
              name="open-outline"
              size={20}
              color={currentColors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkItem, dynamicStyles.linkItem]}
            onPress={() => setShowPrivacyModal(true)}
          >
            <Ionicons
              name="shield-checkmark"
              size={24}
              color={currentColors.primary}
            />
            <Text style={[styles.linkText, dynamicStyles.linkText]}>
              {t("client.about.privacy")}
            </Text>
            <Ionicons
              name="open-outline"
              size={20}
              color={currentColors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkItem, dynamicStyles.linkItem]}
            onPress={() => setShowTermsModal(true)}
          >
            <Ionicons
              name="document-text"
              size={24}
              color={currentColors.primary}
            />
            <Text style={[styles.linkText, dynamicStyles.linkText]}>
              {t("client.about.terms")}
            </Text>
            <Ionicons
              name="open-outline"
              size={20}
              color={currentColors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Модальное окно политики конфиденциальности */}
      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.modalContent]}>
            <View style={[styles.modalHeader, dynamicStyles.modalHeader]}>
              <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                {t("client.about.privacy")}
              </Text>
              <TouchableOpacity
                onPress={() => setShowPrivacyModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={currentColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={[styles.modalText, dynamicStyles.modalText]}>
                {t("client.about.privacyText")}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Модальное окно условий использования */}
      <Modal
        visible={showTermsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.modalContent]}>
            <View style={[styles.modalHeader, dynamicStyles.modalHeader]}>
              <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                {t("client.about.terms")}
              </Text>
              <TouchableOpacity
                onPress={() => setShowTermsModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={currentColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={[styles.modalText, dynamicStyles.modalText]}>
                {t("client.about.termsText")}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AboutScreen;
