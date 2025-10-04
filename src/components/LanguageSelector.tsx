import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../constants/colors";
import { SupportedLanguage } from "../i18n";
import { LanguageSelectorStyles } from "../styles/components/LanguageSelector.styles";

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
}) => {
  const { t, setLanguage, language, languageOptions, isLoading } =
    useLanguage();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim, slideAnim]);

  const handleLanguageSelect = async (selectedLanguage: string) => {
    try {
      await setLanguage(selectedLanguage as SupportedLanguage);
      onClose();
    } catch (error) {
      console.warn('Failed to set language:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const styles = {
    modalOverlay: {
      ...LanguageSelectorStyles.modalOverlay,
    },
    modalContent: {
      ...LanguageSelectorStyles.modalContent,
      backgroundColor: currentColors.background,
    },
    header: {
      ...LanguageSelectorStyles.header,
      borderBottomColor: currentColors.border + "40",
    },
    title: {
      ...LanguageSelectorStyles.title,
      color: currentColors.primary,
    },
    closeButton: {
      ...LanguageSelectorStyles.closeButton,
      backgroundColor: currentColors.surface,
    },
    languageList: {
      ...LanguageSelectorStyles.languageList,
    },
    languageItem: {
      ...LanguageSelectorStyles.languageItem,
      backgroundColor: currentColors.surface,
    },
    languageItemSelected: {
      ...LanguageSelectorStyles.languageItemSelected,
      backgroundColor: currentColors.primary + "15",
      borderColor: currentColors.primary,
      shadowColor: currentColors.primary,
    },
    flagContainer: {
      ...LanguageSelectorStyles.flagContainer,
      backgroundColor: currentColors.background,
    },
    flag: {
      ...LanguageSelectorStyles.flag,
    },
    languageInfo: {
      ...LanguageSelectorStyles.languageInfo,
    },
    languageName: {
      ...LanguageSelectorStyles.languageName,
      color: currentColors.text,
    },
    languageNative: {
      ...LanguageSelectorStyles.languageNative,
      color: currentColors.textSecondary,
    },
    languageNameSelected: {
      ...LanguageSelectorStyles.languageNameSelected,
      color: currentColors.primary,
    },
    checkIcon: {
      ...LanguageSelectorStyles.checkIcon,
      backgroundColor: currentColors.primary,
    },
    loadingContainer: {
      ...LanguageSelectorStyles.loadingContainer,
    },
    loadingText: {
      ...LanguageSelectorStyles.loadingText,
      color: currentColors.textSecondary,
    },
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.6)"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <Animated.View
        style={[
          styles.modalOverlay,
          LanguageSelectorStyles.animatedOverlay,
          { opacity: fadeAnim },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContent,
            LanguageSelectorStyles.animatedContent,
            {
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t("common.selectLanguage")}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={currentColors.text} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons
                name="refresh"
                size={32}
                color={currentColors.primary}
              />
              <Text style={styles.loadingText}>{t("common.loading")}</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.languageList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={LanguageSelectorStyles.scrollViewContent}
            >
              {languageOptions.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    language === lang.code && styles.languageItemSelected,
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.flagContainer}>
                    <Text style={styles.flag}>{lang.flag}</Text>
                  </View>

                  <View style={styles.languageInfo}>
                    <Text
                      style={[
                        styles.languageName,
                        language === lang.code && styles.languageNameSelected,
                      ]}
                    >
                      {lang.name}
                    </Text>
                    <Text style={styles.languageNative}>{lang.native}</Text>
                  </View>

                  {language === lang.code && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default LanguageSelector;
