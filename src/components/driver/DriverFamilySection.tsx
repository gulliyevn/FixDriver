import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import DriverFamilyMemberItem from './DriverFamilyMemberItem';
import { DriverFamilySectionStyles as styles, getDriverFamilySectionColors } from '../../styles/components/driver/DriverFamilySection.styles';

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

interface DriverFamilySectionProps {
  familyMembers: FamilyMember[];
  expandedFamilyMember: string | null;
  editingFamilyMember: string | null;
  familyPhoneVerification: {[key: string]: boolean};
  onToggleFamilyMember: (memberId: string) => void;
  onOpenAddFamilyModal: () => void;
  onStartEditing: (memberId: string) => void;
  onCancelEditing: () => void;
  onSaveMember: (memberId: string, updatedData: Partial<FamilyMember>) => void;
  onDeleteMember: (memberId: string) => void;
  onResetPhoneVerification: (memberId: string) => void;
  onVerifyPhone: (memberId: string) => void;
  saveFamilyRef?: React.RefObject<(() => void) | null>;
}

const DriverFamilySection: React.FC<DriverFamilySectionProps> = ({
  familyMembers,
  expandedFamilyMember,
  editingFamilyMember,
  familyPhoneVerification,
  onToggleFamilyMember,
  onOpenAddFamilyModal,
  onStartEditing,
  onCancelEditing,
  onSaveMember,
  onDeleteMember,
  onResetPhoneVerification,
  onVerifyPhone,
  saveFamilyRef,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getDriverFamilySectionColors(isDark);
  
  // Состояние для редактируемых данных
  const [editingData, setEditingData] = useState<{[key: string]: Partial<FamilyMember>}>({});
  
  // Ref для хранения функции сохранения
  const saveRef = useRef<(() => void) | null>(null);

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
        <DriverFamilyMemberItem
          key={member.id}
          member={member}
          isExpanded={expandedFamilyMember === member.id}
          isEditing={editingFamilyMember === member.id}
          phoneVerified={familyPhoneVerification[member.id] || member.phoneVerified || false}
          onToggle={() => onToggleFamilyMember(member.id)}
          onStartEditing={() => onStartEditing(member.id)}
          onCancelEditing={onCancelEditing}
          onSave={(updatedData) => onSaveMember(member.id, updatedData)}
          onDelete={() => onDeleteMember(member.id)}
          onResetPhoneVerification={() => onResetPhoneVerification(member.id)}
          onVerifyPhone={() => onVerifyPhone(member.id)}
          saveRef={saveFamilyRef}
        />
      ))}
    </View>
  );
};

export default DriverFamilySection; 