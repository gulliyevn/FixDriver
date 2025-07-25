import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { createFamilyMemberItemStyles } from '../../styles/components/profile/FamilyMemberItem.styles';
import { FamilyMemberItemProps, FamilyMember } from '../../types/family';
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
    phone: member.phone || '',
  });

  React.useEffect(() => {
    if (isEditing) {
      setEditingData({
        name: member.name,
        surname: member.surname,
        type: member.type,
        birthDate: member.birthDate,
        phone: member.phone || '',
      });
    }
  }, [isEditing, member]);

  const hasChanges = () => {
    return (
      editingData.name !== member.name ||
      editingData.surname !== member.surname ||
      editingData.type !== member.type ||
      editingData.birthDate !== member.birthDate ||
      editingData.phone !== (member.phone || '')
    );
  };

  const handleToggle = () => {
    if (isEditing && hasChanges()) {
      // Показываем диалог отмены изменений
      onCancelEditing();
    } else {
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
              onStartEditing={onStartEditing}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default FamilyMemberItem; 