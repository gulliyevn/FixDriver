import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../hooks/useI18n";
import { createFamilyMemberItemStyles } from "../../styles/components/profile/FamilyMemberItem.styles";
import { FamilyMemberItemProps, FamilyMember } from "../../types/family";
import { calculateAge } from "../../utils/profileHelpers";
import FamilyMemberEditMode from "./FamilyMemberEditMode";
import FamilyMemberViewMode from "./FamilyMemberViewMode";

const FamilyMemberItem: React.FC<FamilyMemberItemProps> = ({
  member,
  isExpanded,
  isEditing,
  phoneVerified,
  onToggle,
  onStartEditing,
  onCancelEditing,
  onSave,
  onDelete,
  onResetPhoneVerification,
  onVerifyPhone,
  saveRef,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const styles = createFamilyMemberItemStyles(isDark);

  const [editingData, setEditingData] = useState<Partial<FamilyMember>>({
    name: member.name,
    surname: member.surname,
    type: member.type,
    birthDate: member.birthDate,
    phone: member.phone ?? "",
  });

  React.useEffect(() => {
    if (isEditing) {
      setEditingData({
        name: member.name,
        surname: member.surname,
        type: member.type,
        birthDate: member.birthDate,
        phone: member.phone ?? "",
      });
    } else {
      // Очищаем функцию сохранения
      if (saveRef?.current) {
        (saveRef as any).current = null;
      }
    }
  }, [isEditing, member.id]); // Изменили зависимость с member на member.id

  // Отдельный useEffect для установки функции сохранения с актуальными данными
  React.useEffect(() => {
    if (isEditing && saveRef?.current) {
      (saveRef as any).current = () => {
        const updatedData = {
          ...editingData,
          age: calculateAge(editingData.birthDate || member.birthDate),
          phone: editingData.phone?.trim() || undefined,
        };
        onSave(updatedData);
      };
    }
  }, [isEditing, editingData, member.birthDate, onSave]); // Добавили editingData в зависимости

  const hasChanges = () => {
    const phoneChanged = (editingData.phone ?? "") !== (member.phone ?? "");
    return (
      editingData.name !== member.name ||
      editingData.surname !== member.surname ||
      editingData.type !== member.type ||
      editingData.birthDate !== member.birthDate ||
      phoneChanged
    );
  };

  const handleToggle = () => {
    if (isEditing && hasChanges()) {
      // Показываем диалог подтверждения сохранения изменений
      Alert.alert(t("common.confirmation"), t("profile.family.confirmSave"), [
        {
          text: t("common.cancel"),
          style: "cancel",
          onPress: () => {
            // При отмене НЕ делаем ничего - остаемся в режиме редактирования
            // НЕ закрываем блок, НЕ сбрасываем изменения
          },
        },
        {
          text: t("common.save"),
          onPress: () => {
            // Сохраняем изменения и закрываем
            const updatedData = {
              ...editingData,
              age: calculateAge(editingData.birthDate || member.birthDate),
              phone: editingData.phone?.trim() || undefined,
            };
            onSave(updatedData);
            onToggle();
          },
        },
      ]);
    } else if (isEditing && !hasChanges()) {
      // Если в режиме редактирования, но нет изменений - сразу закрываем блок
      onCancelEditing();
      onToggle();
    } else {
      // Обычное переключение (открыть/закрыть блок)
      onToggle();
    }
  };

  return (
    <View style={styles.container}>
      {/* Заголовок члена семьи */}
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName}>
            {member.name} {member.surname}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t(`profile.familyTypes.${member.type}`)} • {member.age}{" "}
            {t("profile.years")}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? "#9CA3AF" : "#666666"}
          style={[
            styles.headerIcon,
            { transform: [{ rotate: isExpanded ? "90deg" : "0deg" }] },
          ]}
        />
      </TouchableOpacity>

      {/* Расширенная информация */}
      {isExpanded && (
        <View style={styles.expandedContainer}>
          {isEditing ? (
            <FamilyMemberEditMode
              member={member}
              editingData={editingData}
              phoneVerified={phoneVerified}
              onSave={onSave}
              onCancel={onCancelEditing}
              onDelete={onDelete}
              onResetPhoneVerification={onResetPhoneVerification}
              setEditingData={setEditingData}
            />
          ) : (
            <FamilyMemberViewMode
              member={member}
              phoneVerified={phoneVerified}
              onStartEditing={onStartEditing}
              onVerifyPhone={onVerifyPhone}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default FamilyMemberItem;
