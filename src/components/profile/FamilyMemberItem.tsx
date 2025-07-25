import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { createFamilyMemberItemStyles } from '../../styles/components/profile/FamilyMemberItem.styles';
import { FamilyMemberItemProps, FamilyMember } from '../../types/family';
import { calculateAge } from '../../utils/profileHelpers';
import FamilyMemberEditMode from './FamilyMemberEditMode';
import FamilyMemberViewMode from './FamilyMemberViewMode';



const FamilyMemberItem: React.FC<FamilyMemberItemProps> = ({
  member,
  isExpanded,
  isEditing,
  phoneVerified,
  isVerifyingPhone,
  onToggle,
  onStartEditing,
  onCancelEditing,
  onSave,
  onDelete,
  onVerifyPhone,
  onResetPhoneVerification,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const styles = createFamilyMemberItemStyles(isDark);
  
  const [editingData, setEditingData] = useState<Partial<FamilyMember>>({
    name: member.name,
    surname: member.surname,
    type: member.type,
    birthDate: member.birthDate,
    phone: member.phone ?? '',
  });

  React.useEffect(() => {
    if (isEditing) {
      setEditingData({
        name: member.name,
        surname: member.surname,
        type: member.type,
        birthDate: member.birthDate,
        phone: member.phone ?? '',
      });
    }
  }, [isEditing, member.id]); // Изменили зависимость с member на member.id

  const hasChanges = () => {
    const phoneChanged = (editingData.phone ?? '') !== (member.phone ?? '');
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
      Alert.alert(
        t('profile.saveChangesConfirm.title'),
        t('profile.saveChangesConfirm.message'),
        [
          { 
            text: t('profile.saveChangesConfirm.cancel'), 
            style: 'cancel',
            onPress: () => {
              // При отмене НЕ делаем ничего - остаемся в режиме редактирования
              // НЕ закрываем блок, НЕ сбрасываем изменения
            }
          },
          { 
            text: t('profile.saveChangesConfirm.save'), 
            onPress: () => {
              // Сохраняем изменения и закрываем
              const updatedData = {
                ...editingData,
                age: calculateAge(editingData.birthDate || member.birthDate),
                phone: editingData.phone?.trim() || undefined,
              };
              onSave(updatedData);
              onToggle();
            }
          }
        ]
      );
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
            {t(`profile.familyTypes.${member.type}`)} • {member.age} {t('profile.years')}
          </Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDark ? '#9CA3AF' : '#666666'}
          style={[styles.headerIcon, { transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }]}
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
              isVerifyingPhone={isVerifyingPhone}
              onSave={onSave}
              onCancel={onCancelEditing}
              onDelete={onDelete}
              onVerifyPhone={onVerifyPhone}
              onResetPhoneVerification={onResetPhoneVerification}
              setEditingData={setEditingData}
            />
          ) : (
            <FamilyMemberViewMode
              member={member}
              phoneVerified={phoneVerified}
              onStartEditing={onStartEditing}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default FamilyMemberItem; 