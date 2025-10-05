import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import DatePicker from "../DatePicker";
import {
  DriverPersonalInfoSectionStyles as styles,
  getDriverPersonalInfoSectionColors,
} from "../../styles/components/driver/DriverPersonalInfoSection.styles";

interface DriverPersonalInfoSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
  };
  setFormData: (data: any) => void;
  isEditing: boolean;
  verificationStatus: {
    email: boolean;
    phone: boolean;
  };
  isVerifying: {
    email: boolean;
    phone: boolean;
  };
  onVerifyEmail: () => void;
  onVerifyPhone: () => void;
  onResetVerification: (type: "email" | "phone") => void;
}

const DriverPersonalInfoSection: React.FC<DriverPersonalInfoSectionProps> = ({
  formData,
  setFormData,
  isEditing,
  verificationStatus,
  isVerifying,
  onVerifyEmail,
  onVerifyPhone,
  onResetVerification,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getDriverPersonalInfoSectionColors(isDark);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
        {t("profile.personalInfo")}
      </Text>

      {/* Имя */}
      <View
        style={[
          styles.infoRow,
          dynamicStyles.infoRow,
          isEditing && styles.infoRowEditing,
        ]}
      >
        <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
          {t("profile.firstName")}:
        </Text>
        {isEditing ? (
          <TextInput
            style={[
              styles.infoValue,
              dynamicStyles.infoValue,
              styles.infoInput,
            ]}
            value={formData.firstName}
            onChangeText={(text) =>
              setFormData({ ...formData, firstName: text })
            }
            placeholder={t("profile.firstNamePlaceholder")}
            placeholderTextColor={isDark ? "#9CA3AF" : "#666666"}
          />
        ) : (
          <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
            {formData.firstName}
          </Text>
        )}
      </View>

      {/* Фамилия */}
      <View
        style={[
          styles.infoRow,
          dynamicStyles.infoRow,
          isEditing && styles.infoRowEditing,
        ]}
      >
        <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
          {t("profile.lastName")}:
        </Text>
        {isEditing ? (
          <TextInput
            style={[
              styles.infoValue,
              dynamicStyles.infoValue,
              styles.infoInput,
            ]}
            value={formData.lastName}
            onChangeText={(text) =>
              setFormData({ ...formData, lastName: text })
            }
            placeholder={t("profile.lastNamePlaceholder")}
            placeholderTextColor={isDark ? "#9CA3AF" : "#666666"}
          />
        ) : (
          <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
            {formData.lastName}
          </Text>
        )}
      </View>

      {/* Телефон */}
      <View
        style={[
          styles.infoRow,
          dynamicStyles.infoRow,
          isEditing && styles.infoRowEditing,
        ]}
      >
        <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
          {t("profile.phone")}:
        </Text>
        <View style={styles.infoValueContainer}>
          {isEditing ? (
            <TextInput
              style={[
                styles.infoValue,
                dynamicStyles.infoValue,
                styles.infoInput,
              ]}
              value={formData.phone}
              onChangeText={(text) => {
                setFormData({ ...formData, phone: text });
                // Сбрасываем верификацию при изменении номера
                if (verificationStatus.phone && text !== formData.phone) {
                  onResetVerification("phone");
                }
              }}
              placeholder={t("profile.phonePlaceholder")}
              placeholderTextColor={isDark ? "#9CA3AF" : "#666666"}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
              {formData.phone}
            </Text>
          )}
          {verificationStatus.phone ? (
            // Если верифицирован - показываем галочку (некликабельную)
            <View style={styles.verifyButton}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          ) : (
            // Если не верифицирован - показываем кликабельный щит
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={onVerifyPhone}
              disabled={isVerifying.phone}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={isDark ? "#3B82F6" : "#083198"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Email */}
      <View
        style={[
          styles.infoRow,
          dynamicStyles.infoRow,
          isEditing && styles.infoRowEditing,
        ]}
      >
        <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
          {t("profile.email")}:
        </Text>
        <View style={styles.infoValueContainer}>
          {isEditing ? (
            <TextInput
              style={[
                styles.infoValue,
                dynamicStyles.infoValue,
                styles.infoInput,
              ]}
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                // Сбрасываем верификацию при изменении email
                if (verificationStatus.email && text !== formData.email) {
                  onResetVerification("email");
                }
              }}
              placeholder={t("profile.emailPlaceholder")}
              placeholderTextColor={isDark ? "#9CA3AF" : "#666666"}
              keyboardType="email-address"
            />
          ) : (
            <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
              {formData.email}
            </Text>
          )}
          {verificationStatus.email ? (
            // Если верифицирован - показываем галочку (некликабельную)
            <View style={styles.verifyButton}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          ) : (
            // Если не верифицирован - показываем кликабельный щит
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={onVerifyEmail}
              disabled={isVerifying.email}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={isDark ? "#3B82F6" : "#083198"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Дата рождения */}
      <View
        style={[
          styles.infoRow,
          dynamicStyles.infoRow,
          isEditing && styles.infoRowEditing,
        ]}
      >
        <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>
          {t("profile.birthDate")}:
        </Text>
        <DatePicker
          value={formData.birthDate}
          onChange={(date) => setFormData({ ...formData, birthDate: date })}
          placeholder={t("profile.birthDatePlaceholder")}
          inline={isEditing}
          readOnly={!isEditing}
        />
      </View>
    </View>
  );
};

export default DriverPersonalInfoSection;
