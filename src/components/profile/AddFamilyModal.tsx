import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import DatePicker from "../DatePicker";
import {
  AddFamilyModalStyles as styles,
  getAddFamilyModalColors,
} from "../../styles/components/profile/AddFamilyModal.styles";

interface NewFamilyMember {
  name: string;
  surname: string;
  type: string;
  age: string;
  phone: string;
}

interface AddFamilyModalProps {
  visible: boolean;
  newFamilyMember: NewFamilyMember;
  setNewFamilyMember: (member: NewFamilyMember) => void;
  onClose: () => void;
  onAdd: () => void;
  onVerifyPhone?: () => void;
  phoneVerificationStatus?: boolean;
  isVerifyingPhone?: boolean;
}

const AddFamilyModal: React.FC<AddFamilyModalProps> = ({
  visible,
  newFamilyMember,
  setNewFamilyMember,
  onClose,
  onAdd,
  onVerifyPhone,
  isVerifyingPhone = false,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getAddFamilyModalColors(isDark);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [datePickerTouched, setDatePickerTouched] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});
  const [localPhoneVerificationStatus, setLocalPhoneVerificationStatus] =
    useState(false);

  // Сбрасываем локальный статус верификации при открытии модального окна
  useEffect(() => {
    if (visible) {
      setLocalPhoneVerificationStatus(false);
    }
  }, [visible]);

  if (!visible) return null;

  // Функция валидации
  const validateForm = () => {
    const errors: { [key: string]: boolean } = {};

    // Проверяем обязательные поля
    if (!newFamilyMember.name.trim()) {
      errors.name = true;
    }
    if (!newFamilyMember.surname.trim()) {
      errors.surname = true;
    }
    if (!newFamilyMember.type || !newFamilyMember.type.trim()) {
      errors.type = true;
    }
    if (!datePickerTouched) {
      errors.age = true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Функция проверки валидности формы для стилизации кнопки
  const isFormValid = () => {
    return (
      newFamilyMember.name.trim() &&
      newFamilyMember.surname.trim() &&
      newFamilyMember.type &&
      newFamilyMember.type.trim() &&
      datePickerTouched
    );
  };

  // Обработчик добавления члена семьи
  const handleAdd = () => {
    if (validateForm()) {
      onAdd();
    }
  };

  // Обработчик изменения даты
  const handleDateChange = (date: string) => {
    setNewFamilyMember({ ...newFamilyMember, age: date });
    setDatePickerTouched(true);
    // Убираем ошибку валидации для даты
    if (validationErrors.age) {
      setValidationErrors((prev) => ({ ...prev, age: false }));
    }
  };

  // Обработчики изменения текстовых полей
  const handleNameChange = (text: string) => {
    setNewFamilyMember({ ...newFamilyMember, name: text });
    if (validationErrors.name && text.trim()) {
      setValidationErrors((prev) => ({ ...prev, name: false }));
    }
  };

  const handleSurnameChange = (text: string) => {
    setNewFamilyMember({ ...newFamilyMember, surname: text });
    if (validationErrors.surname && text.trim()) {
      setValidationErrors((prev) => ({ ...prev, surname: false }));
    }
  };

  const handleTypeChange = (type: string) => {
    setNewFamilyMember({ ...newFamilyMember, type });
    setShowTypeDropdown(false);
    if (validationErrors.type) {
      setValidationErrors((prev) => ({ ...prev, type: false }));
    }
  };

  // Обработчик изменения телефона
  const handlePhoneChange = (text: string) => {
    setNewFamilyMember({ ...newFamilyMember, phone: text });
    // Сбрасываем локальный статус верификации при изменении телефона
    if (localPhoneVerificationStatus) {
      setLocalPhoneVerificationStatus(false);
    }
  };

  // Обработчик верификации телефона
  const handleVerifyPhone = () => {
    if (onVerifyPhone) {
      onVerifyPhone();
      // Устанавливаем локальный статус верификации
      setLocalPhoneVerificationStatus(true);
    }
  };

  // Определяем, какую иконку показывать
  const getPhoneVerificationIcon = () => {
    // Если есть локальный статус верификации, показываем галочку
    if (localPhoneVerificationStatus) {
      return "checkmark-circle";
    }
    // Иначе показываем щит (по умолчанию)
    return "shield-checkmark-outline";
  };

  // Определяем цвет иконки
  const getPhoneVerificationColor = () => {
    if (localPhoneVerificationStatus) {
      return "#4CAF50"; // Зеленый для верифицированного
    }
    return isDark ? "#3B82F6" : "#083198"; // Синий для неверифицированного
  };

  const familyTypes = [
    { key: "husband", label: t("profile.familyTypes.husband") },
    { key: "wife", label: t("profile.familyTypes.wife") },
    { key: "son", label: t("profile.familyTypes.son") },
    { key: "daughter", label: t("profile.familyTypes.daughter") },
    { key: "mother", label: t("profile.familyTypes.mother") },
    { key: "father", label: t("profile.familyTypes.father") },
    { key: "grandmother", label: t("profile.familyTypes.grandmother") },
    { key: "grandfather", label: t("profile.familyTypes.grandfather") },
    { key: "brother", label: t("profile.familyTypes.brother") },
    { key: "sister", label: t("profile.familyTypes.sister") },
    { key: "uncle", label: t("profile.familyTypes.uncle") },
    { key: "aunt", label: t("profile.familyTypes.aunt") },
    { key: "cousin", label: t("profile.familyTypes.cousin") },
    { key: "nephew", label: t("profile.familyTypes.nephew") },
    { key: "niece", label: t("profile.familyTypes.niece") },
    { key: "stepfather", label: t("profile.familyTypes.stepfather") },
    { key: "stepmother", label: t("profile.familyTypes.stepmother") },
    { key: "stepson", label: t("profile.familyTypes.stepson") },
    { key: "stepdaughter", label: t("profile.familyTypes.stepdaughter") },
    { key: "other", label: t("profile.familyTypes.other") },
  ];

  return (
    <View style={styles.modalOverlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.modalScrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.modalContent, dynamicStyles.modalContent]}>
            <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
              {t("profile.addFamilyMember")}
            </Text>

            {/* Имя */}
            <View style={styles.modalInputContainer}>
              <Text
                style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}
              >
                {t("profile.firstName")} *
              </Text>
              <TextInput
                style={[styles.modalInput, dynamicStyles.modalInput]}
                value={newFamilyMember.name}
                onChangeText={handleNameChange}
                placeholder={t("profile.firstNamePlaceholder")}
                placeholderTextColor={isDark ? "#9CA3AF" : "#666666"}
              />
            </View>

            {/* Фамилия */}
            <View style={styles.modalInputContainer}>
              <Text
                style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}
              >
                {t("profile.lastName")} *
              </Text>
              <TextInput
                style={[styles.modalInput, dynamicStyles.modalInput]}
                value={newFamilyMember.surname}
                onChangeText={handleSurnameChange}
                placeholder={t("profile.lastNamePlaceholder")}
                placeholderTextColor={isDark ? "#9CA3AF" : "#666666"}
              />
            </View>

            {/* Тип */}
            <View
              style={[styles.modalInputContainer, styles.typeInputContainer]}
            >
              <Text
                style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}
              >
                {t("profile.familyType")} *
              </Text>
              <TouchableOpacity
                style={[
                  styles.modalSelectButton,
                  dynamicStyles.modalSelectButton,
                ]}
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <Text
                  style={[
                    styles.modalSelectText,
                    dynamicStyles.modalSelectText,
                  ]}
                >
                  {newFamilyMember.type
                    ? familyTypes.find((t) => t.key === newFamilyMember.type)
                        ?.label
                    : t("profile.familyTypePlaceholder")}
                </Text>
                <Ionicons
                  name={showTypeDropdown ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={isDark ? "#9CA3AF" : "#666666"}
                />
              </TouchableOpacity>

              {/* Выпадающий список типов */}
              {showTypeDropdown && (
                <View style={[styles.typeDropdown, dynamicStyles.typeDropdown]}>
                  <ScrollView
                    style={styles.typeDropdownScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {familyTypes.map((type) => (
                      <TouchableOpacity
                        key={type.key}
                        style={[
                          styles.typeOption,
                          dynamicStyles.typeOption,
                          newFamilyMember.type === type.key &&
                            styles.typeOptionSelected,
                          type.key === "other" && styles.typeOptionLast,
                        ]}
                        onPress={() => handleTypeChange(type.key)}
                      >
                        <Text
                          style={[
                            styles.typeOptionText,
                            dynamicStyles.typeOptionText,
                            newFamilyMember.type === type.key &&
                              styles.typeOptionTextSelected,
                          ]}
                        >
                          {type.label}
                        </Text>
                        {newFamilyMember.type === type.key && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={isDark ? "#3B82F6" : "#083198"}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Дата рождения */}
            <View style={styles.modalInputContainer}>
              <Text
                style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}
              >
                {t("profile.familyAge")} *
              </Text>
              <View
                style={[
                  styles.modalInput,
                  dynamicStyles.modalInput,
                  { alignItems: "flex-start" },
                ]}
              >
                <DatePicker
                  value={newFamilyMember.age}
                  onChange={handleDateChange}
                  placeholder={t("profile.familyAgePlaceholder")}
                  inline={true}
                  readOnly={false}
                />
              </View>
            </View>

            {/* Телефон */}
            <View style={styles.modalInputContainer}>
              <Text
                style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}
              >
                {t("profile.phone")}
              </Text>
              <View
                style={[
                  styles.modalInput,
                  dynamicStyles.modalInput,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <TextInput
                  style={[
                    dynamicStyles.modalInput,
                    {
                      flex: 1,
                      borderWidth: 0,
                      backgroundColor: "transparent",
                      padding: 0,
                      margin: 0,
                    },
                  ]}
                  value={newFamilyMember.phone}
                  onChangeText={handlePhoneChange}
                  placeholder={t("profile.phonePlaceholder")}
                  placeholderTextColor={isDark ? "#9CA3AF" : "#666666"}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Кнопки */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  dynamicStyles.modalCancelButton,
                ]}
                onPress={onClose}
              >
                <Text
                  style={[
                    styles.modalCancelButtonText,
                    dynamicStyles.modalCancelButtonText,
                  ]}
                >
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSaveButton,
                  dynamicStyles.modalSaveButton,
                  !isFormValid() && styles.modalSaveButtonDisabled,
                ]}
                onPress={handleAdd}
                disabled={!isFormValid()}
              >
                <Text
                  style={[
                    styles.modalSaveButtonText,
                    dynamicStyles.modalSaveButtonText,
                    !isFormValid() && styles.modalSaveButtonTextDisabled,
                  ]}
                >
                  {t("common.add")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddFamilyModal;
