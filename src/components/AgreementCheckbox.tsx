import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLanguage } from "../context/LanguageContext";

interface AgreementCheckboxProps {
  agree: boolean;
  onAgreeChange: (agree: boolean) => void;
  styles: StyleSheet.NamedStyles<Record<string, unknown>>;
}

const AgreementCheckbox: React.FC<AgreementCheckboxProps> = ({
  agree,
  onAgreeChange,
  styles,
}) => {
  const { t } = useLanguage();

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
          <Text style={styles.link} onPress={() => Linking.openURL('https://fixdrive.tech/terms')}>
            {termsMatch ? termsMatch[1] : ""}
          </Text>
          {afterTerms as React.ReactNode}
          <Text style={styles.link} onPress={() => Linking.openURL('https://fixdrive.tech/privacy')}>
            {privacyMatch ? privacyMatch[1] : ""}
          </Text>
          {afterPrivacy as React.ReactNode}
        </Text>
      </View>
    </>
  );
};

export default AgreementCheckbox;
