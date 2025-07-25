import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import FamilyMemberItem from './FamilyMemberItem';
import { FamilySectionStyles as styles, getFamilySectionColors } from '../../styles/components/profile/FamilySection.styles';

interface FamilyMember {
  id: string;
  name: string;
  surname: string;
  type: string;
  birthDate: string;
  age: number;
  phone?: string;
  phoneVerified?: boolean;
}

interface FamilySectionProps {
  familyMembers: FamilyMember[];
  expandedFamilyMember: string | null;
  editingFamilyMember: string | null;
  familyPhoneVerification: {[key: string]: boolean};
  familyPhoneVerifying: {[key: string]: boolean};
  onToggleFamilyMember: (memberId: string) => void;
  onOpenAddFamilyModal: () => void;
  onStartEditing: (memberId: string) => void;
  onCancelEditing: () => void;
  onSaveMember: (memberId: string, updatedData: Partial<FamilyMember>) => void;
  onDeleteMember: (memberId: string) => void;
  onVerifyPhone: (memberId: string) => void;
  onResetPhoneVerification: (memberId: string) => void;
}

const FamilySection: React.FC<FamilySectionProps> = ({
  familyMembers,
  expandedFamilyMember,
  editingFamilyMember,
  familyPhoneVerification,
  familyPhoneVerifying,
  onToggleFamilyMember,
  onOpenAddFamilyModal,
  onStartEditing,
  onCancelEditing,
  onSaveMember,
  onDeleteMember,
  onVerifyPhone,
  onResetPhoneVerification,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getFamilySectionColors(isDark);
  
  // Состояние для редактируемых данных
  const [editingData, setEditingData] = useState<{[key: string]: Partial<FamilyMember>}>({});

  return (
    <View style={styles.familySection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {t('profile.familyInfo')}
        </Text>
        <TouchableOpacity 
          style={[styles.addIconButton, dynamicStyles.addIconButton]}
          onPress={onOpenAddFamilyModal}
        >
          <Ionicons name="add" size={20} color={isDark ? '#3B82F6' : '#083198'} />
        </TouchableOpacity>
      </View>
      
      {familyMembers.map((member) => (
        <FamilyMemberItem
          key={member.id}
          member={member}
          isExpanded={expandedFamilyMember === member.id}
          isEditing={editingFamilyMember === member.id}
          phoneVerified={familyPhoneVerification[member.id] || member.phoneVerified || false}
          isVerifyingPhone={familyPhoneVerifying[member.id] || false}
          onToggle={() => onToggleFamilyMember(member.id)}
          onStartEditing={() => onStartEditing(member.id)}
          onCancelEditing={onCancelEditing}
          onSave={(updatedData) => onSaveMember(member.id, updatedData)}
          onDelete={() => onDeleteMember(member.id)}
          onVerifyPhone={() => onVerifyPhone(member.id)}
          onResetPhoneVerification={() => onResetPhoneVerification(member.id)}
        />
      ))}
    </View>
  );
};

export default FamilySection; 