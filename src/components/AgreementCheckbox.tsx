import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLanguage } from "../context/LanguageContext";

interface AgreementCheckboxProps {
  agree: boolean;
  onAgreeChange: (agree: boolean) => void;
  styles: any;
}

const AgreementCheckbox: React.FC<AgreementCheckboxProps> = ({
  agree,
  onAgreeChange,
  styles,
}) => {
  const { t } = useLanguage();
  const [showTerms, setShowTerms] = React.useState(false);
  const [showPrivacy, setShowPrivacy] = React.useState(false);

  const agreeTermsRich = t("register.agreeTermsRich");
  const termsMatch = agreeTermsRich.match(/<terms>(.*?)<\/terms>/);
  const privacyMatch = agreeTermsRich.match(/<privacy>(.*?)<\/privacy>/);
  const beforeTerms = agreeTermsRich.split("<terms>")[0];
  const afterTerms =
    agreeTermsRich
      .split("<terms>")[1]
      ?.split("</terms>")[1]
      ?.split("<privacy>")[0] || "";
  const afterPrivacy = agreeTermsRich.split("</privacy>")[1] || "";

  return (
    <>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          onPress={() => onAgreeChange(!agree)}
          style={[styles.checkbox, agree && styles.checkboxChecked]}
        >
          {agree && <Ionicons name="checkmark" size={18} color="#fff" />}
        </TouchableOpacity>
        <Text style={styles.agreeText}>
          {beforeTerms as React.ReactNode}
          <Text style={styles.link} onPress={() => setShowTerms(true)}>
            {termsMatch ? termsMatch[1] : ""}
          </Text>
          {afterTerms as React.ReactNode}
          <Text style={styles.link} onPress={() => setShowPrivacy(true)}>
            {privacyMatch ? privacyMatch[1] : ""}
          </Text>
          {afterPrivacy as React.ReactNode}
        </Text>
      </View>

      {/* Модалка для условий */}
      <Modal
        visible={showTerms}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {termsMatch ? termsMatch[1] : t("register.terms")}
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>{t("register.termsText")}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowTerms(false)}
            >
              <Text style={styles.modalCloseText}>{t("register.ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модалка для политики */}
      <Modal
        visible={showPrivacy}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPrivacy(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {privacyMatch ? privacyMatch[1] : t("register.privacy")}
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>{t("register.privacyText")}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowPrivacy(false)}
            >
              <Text style={styles.modalCloseText}>{t("register.ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AgreementCheckbox;
