import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { EditProfileScreenStyles as styles } from '../styles/EditProfileScreen.styles';

/**
 * Family Section Component
 * 
 * Section for managing family members (client only)
 */

interface FamilySectionProps {
  familyMembers: any[];
  expandedFamilyMember: string | null;
  editingFamilyMember: string | null;
  familyPhoneVerification: any;
  onToggleFamilyMember: (id: string) => void;
  onOpenAddFamilyModal: () => void;
  onStartEditing: (id: string) => void;
  onCancelEditing: () => void;
  onSaveMember: (id: string, data: any) => void;
  onDeleteMember: (id: string) => void;
  onResetPhoneVerification: () => void;
  onVerifyPhone: (phone: string) => void;
  saveFamilyRef: React.MutableRefObject<(() => void) | null>;
  isDark: boolean;
}

export const FamilySection: React.FC<FamilySectionProps> = ({
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
  isDark
}) => {
  const { t } = useI18n();

  return (
    <View style={[styles.section, isDark && styles.sectionDark]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          {t('profile.family.title')} ({familyMembers.length})
        </Text>
        <TouchableOpacity
          style={[styles.addButton, isDark && styles.addButtonDark]}
          onPress={onOpenAddFamilyModal}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {familyMembers.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons 
            name="people-outline" 
            size={48} 
            color={isDark ? '#6B7280' : '#9CA3AF'} 
          />
          <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>
            {t('profile.family.noMembers')}
          </Text>
          <Text style={[styles.emptyStateSubtext, isDark && styles.emptyStateSubtextDark]}>
            {t('profile.family.addFirstMember')}
          </Text>
        </View>
      ) : (
        familyMembers.map((member) => (
          <View key={member.id} style={[styles.familyMemberCard, isDark && styles.familyMemberCardDark]}>
            <TouchableOpacity
              style={styles.familyMemberHeader}
              onPress={() => onToggleFamilyMember(member.id)}
            >
              <View style={styles.familyMemberInfo}>
                <Text style={[styles.familyMemberName, isDark && styles.familyMemberNameDark]}>
                  {member.name} {member.surname}
                </Text>
                <Text style={[styles.familyMemberPhone, isDark && styles.familyMemberPhoneDark]}>
                  {member.phone}
                </Text>
              </View>
              <Ionicons
                name={expandedFamilyMember === member.id ? "chevron-up" : "chevron-down"}
                size={20}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
            </TouchableOpacity>

            {expandedFamilyMember === member.id && (
              <View style={styles.familyMemberActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => onStartEditing(member.id)}
                >
                  <Ionicons name="create-outline" size={16} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>{t('profile.family.edit')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => onDeleteMember(member.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                    {t('profile.family.delete')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
};
