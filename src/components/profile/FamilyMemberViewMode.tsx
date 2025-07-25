import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { createFamilyMemberItemStyles } from '../../styles/components/profile/FamilyMemberItem.styles';
import { FamilyMember } from '../../types/family';

interface FamilyMemberViewModeProps {
  member: FamilyMember;
  onStartEditing: () => void;
}

const FamilyMemberViewMode: React.FC<FamilyMemberViewModeProps> = ({
  member,
  onStartEditing,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const styles = createFamilyMemberItemStyles(isDark);

  return (
    <View>
      {/* Имя */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.firstName')}:
        </Text>
        <View style={styles.fieldDisplay}>
          <Text style={styles.fieldText}>
            {member.name}
          </Text>
        </View>
      </View>

      {/* Фамилия */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.lastName')}:
        </Text>
        <View style={styles.fieldDisplay}>
          <Text style={styles.fieldText}>
            {member.surname}
          </Text>
        </View>
      </View>

      {/* Тип члена семьи */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.familyType')}:
        </Text>
        <View style={styles.fieldDisplay}>
          <Text style={styles.fieldText}>
            {t(`profile.familyTypes.${member.type}`)}
          </Text>
        </View>
      </View>

      {/* Дата рождения */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.birthDate')}:
        </Text>
        <View style={styles.fieldDisplay}>
          <Text style={styles.fieldText}>
            {new Date(member.birthDate).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })} ({member.age} {t('profile.years')})
          </Text>
        </View>
      </View>

      {/* Телефон */}
      <View style={styles.lastFieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.phone')}:
        </Text>
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneText}>
            {member.phone || t('profile.noPhone')}
          </Text>
          {member.phone && (
            <Ionicons 
              name={member.phoneVerified ? "checkmark-circle" : "shield-checkmark-outline"} 
              size={20} 
              color={member.phoneVerified ? '#4CAF50' : (isDark ? '#3B82F6' : '#083198')} 
            />
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.editButton}
        onPress={onStartEditing}
      >
        <Text style={styles.buttonText}>
          {t('profile.editFamilyMember')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FamilyMemberViewMode; 