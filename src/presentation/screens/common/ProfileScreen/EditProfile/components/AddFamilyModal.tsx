import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { EditProfileScreenStyles as styles } from '../styles/EditProfileScreen.styles';

/**
 * Add Family Modal Component
 * 
 * Modal for adding new family members
 */

interface AddFamilyModalProps {
  visible: boolean;
  newFamilyMember: {
    name: string;
    surname: string;
    phone: string;
    relationship: string;
  };
  setNewFamilyMember: (member: any) => void;
  onClose: () => void;
  onAdd: () => void;
  onVerifyPhone: (phone: string) => void;
  phoneVerificationStatus: string;
  isVerifyingPhone: boolean;
  isDark: boolean;
}

export const AddFamilyModal: React.FC<AddFamilyModalProps> = ({
  visible,
  newFamilyMember,
  setNewFamilyMember,
  onClose,
  onAdd,
  onVerifyPhone,
  phoneVerificationStatus,
  isVerifyingPhone,
  isDark
}) => {
  const { t } = useI18n();

  const handleAdd = () => {
    if (!newFamilyMember.name.trim() || !newFamilyMember.surname.trim() || !newFamilyMember.phone.trim()) {
      Alert.alert(
        t('profile.family.validation.title'),
        t('profile.family.validation.fillAllFields')
      );
      return;
    }
    onAdd();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
        <View style={[styles.modalHeader, isDark && styles.modalHeaderDark]}>
          <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
            {t('profile.family.addMember')}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              {t('profile.firstName')}
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={newFamilyMember.name}
              onChangeText={(text) => setNewFamilyMember({ ...newFamilyMember, name: text })}
              placeholder={t('profile.firstNamePlaceholder')}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              {t('profile.lastName')}
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={newFamilyMember.surname}
              onChangeText={(text) => setNewFamilyMember({ ...newFamilyMember, surname: text })}
              placeholder={t('profile.lastNamePlaceholder')}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              {t('profile.phone')}
            </Text>
            <View style={styles.inputWithAction}>
              <TextInput
                style={[styles.input, isDark && styles.inputDark, styles.inputWithActionInput]}
                value={newFamilyMember.phone}
                onChangeText={(text) => setNewFamilyMember({ ...newFamilyMember, phone: text })}
                placeholder={t('profile.phonePlaceholder')}
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                style={styles.verificationButton}
                onPress={() => onVerifyPhone(newFamilyMember.phone)}
                disabled={isVerifyingPhone}
              >
                <Ionicons
                  name={phoneVerificationStatus === 'verified' ? "checkmark-circle" : "time"}
                  size={20}
                  color={phoneVerificationStatus === 'verified' ? "#10B981" : "#F59E0B"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              {t('profile.family.relationship')}
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={newFamilyMember.relationship}
              onChangeText={(text) => setNewFamilyMember({ ...newFamilyMember, relationship: text })}
              placeholder={t('profile.family.relationshipPlaceholder')}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>
        </View>

        <View style={[styles.modalActions, isDark && styles.modalActionsDark]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleAdd}
          >
            <Text style={styles.saveButtonText}>{t('profile.family.add')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
