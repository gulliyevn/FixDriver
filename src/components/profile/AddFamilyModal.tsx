import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import DatePicker from '../DatePicker';
import { AddFamilyModalStyles as styles, getAddFamilyModalColors } from '../../styles/components/profile/AddFamilyModal.styles';

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

const familyTypes = [
  { key: 'husband', label: 'Муж' },
  { key: 'wife', label: 'Жена' },
  { key: 'son', label: 'Сын' },
  { key: 'daughter', label: 'Дочь' },
  { key: 'mother', label: 'Мать' },
  { key: 'father', label: 'Отец' },
  { key: 'grandmother', label: 'Бабушка' },
  { key: 'grandfather', label: 'Дедушка' },
  { key: 'brother', label: 'Брат' },
  { key: 'sister', label: 'Сестра' },
  { key: 'uncle', label: 'Дядя' },
  { key: 'aunt', label: 'Тетя' },
  { key: 'cousin', label: 'Двоюродный брат/сестра' },
  { key: 'nephew', label: 'Племянник' },
  { key: 'niece', label: 'Племянница' },
  { key: 'stepfather', label: 'Отчим' },
  { key: 'stepmother', label: 'Мачеха' },
  { key: 'stepson', label: 'Пасынок' },
  { key: 'stepdaughter', label: 'Падчерица' },
  { key: 'other', label: 'Другое' },
];

const AddFamilyModal: React.FC<AddFamilyModalProps> = ({
  visible,
  newFamilyMember,
  setNewFamilyMember,
  onClose,
  onAdd,
  onVerifyPhone,
  phoneVerificationStatus = false,
  isVerifyingPhone = false,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getAddFamilyModalColors(isDark);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.modalScrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.modalContent, dynamicStyles.modalContent]}>
          <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
            {t('profile.addFamilyMember')}
          </Text>
          
          {/* Имя */}
          <View style={styles.modalInputContainer}>
            <Text style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}>
              {t('profile.firstName')} *
            </Text>
            <TextInput
              style={[styles.modalInput, dynamicStyles.modalInput]}
              value={newFamilyMember.name}
              onChangeText={(text) => setNewFamilyMember({...newFamilyMember, name: text})}
              placeholder={t('profile.firstNamePlaceholder')}
              placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
            />
          </View>

          {/* Фамилия */}
          <View style={styles.modalInputContainer}>
            <Text style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}>
              {t('profile.lastName')} *
            </Text>
            <TextInput
              style={[styles.modalInput, dynamicStyles.modalInput]}
              value={newFamilyMember.surname}
              onChangeText={(text) => setNewFamilyMember({...newFamilyMember, surname: text})}
              placeholder={t('profile.lastNamePlaceholder')}
              placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
            />
          </View>

          {/* Тип */}
          <View style={[styles.modalInputContainer, styles.typeInputContainer]}>
            <Text style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}>
              {t('profile.familyType')} *
            </Text>
            <TouchableOpacity
              style={[styles.modalSelectButton, dynamicStyles.modalSelectButton]}
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <Text style={[styles.modalSelectText, dynamicStyles.modalSelectText]}>
                {familyTypes.find(t => t.key === newFamilyMember.type)?.label || 'Выберите тип'}
              </Text>
              <Ionicons 
                name={showTypeDropdown ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={isDark ? '#9CA3AF' : '#666666'} 
              />
            </TouchableOpacity>
            
            {/* Выпадающий список типов */}
            {showTypeDropdown && (
              <View style={[styles.typeDropdown, dynamicStyles.typeDropdown]}>
                <ScrollView style={styles.typeDropdownScroll} showsVerticalScrollIndicator={false}>
                  {familyTypes.map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.typeOption, 
                        dynamicStyles.typeOption,
                        newFamilyMember.type === type.key && styles.typeOptionSelected,
                        type.key === 'other' && styles.typeOptionLast
                      ]}
                      onPress={() => {
                        setNewFamilyMember({...newFamilyMember, type: type.key});
                        setShowTypeDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.typeOptionText, 
                        dynamicStyles.typeOptionText,
                        newFamilyMember.type === type.key && styles.typeOptionTextSelected
                      ]}>
                        {type.label}
                      </Text>
                      {newFamilyMember.type === type.key && (
                        <Ionicons name="checkmark" size={16} color={isDark ? '#3B82F6' : '#083198'} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Дата рождения */}
          <View style={styles.modalInputContainer}>
            <Text style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}>
              {t('profile.familyAge')} *
            </Text>
            <View style={[styles.modalInput, dynamicStyles.modalInput, { alignItems: 'flex-start' }]}>
              <DatePicker
                value={newFamilyMember.age}
                onChange={(date) => {
                  setNewFamilyMember({...newFamilyMember, age: date});
                }}
                placeholder={t('profile.familyAgePlaceholder')}
                inline={true}
                readOnly={false}
              />
            </View>
          </View>

          {/* Телефон */}
          <View style={styles.modalInputContainer}>
            <Text style={[styles.modalInputLabel, dynamicStyles.modalInputLabel]}>
              {t('profile.phone')}
            </Text>
            <View style={[styles.modalInput, dynamicStyles.modalInput, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
              <TextInput
                style={[dynamicStyles.modalInput, { flex: 1, borderWidth: 0, backgroundColor: 'transparent', padding: 0, margin: 0 }]}
                value={newFamilyMember.phone}
                onChangeText={(text) => setNewFamilyMember({...newFamilyMember, phone: text})}
                placeholder={t('profile.phonePlaceholder')}
                placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
                keyboardType="phone-pad"
              />
              {onVerifyPhone && (
                <TouchableOpacity
                  style={{ 
                    paddingHorizontal: 2, 
                    paddingVertical: 6, 
                    marginLeft: 4,
                    opacity: newFamilyMember.phone.trim() ? 1 : 0.5
                  }}
                  onPress={onVerifyPhone}
                  disabled={isVerifyingPhone || !newFamilyMember.phone.trim()}
                >
                  <Ionicons 
                    name={phoneVerificationStatus ? "checkmark-circle" : "shield-checkmark-outline"} 
                    size={20} 
                    color={phoneVerificationStatus ? '#4CAF50' : (isDark ? '#3B82F6' : '#083198')} 
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Кнопки */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalCancelButton, dynamicStyles.modalCancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.modalCancelButtonText, dynamicStyles.modalCancelButtonText]}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSaveButton, dynamicStyles.modalSaveButton]}
              onPress={onAdd}
            >
              <Text style={[styles.modalSaveButtonText, dynamicStyles.modalSaveButtonText]}>
                {t('common.add')}
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