import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import DatePicker from '../DatePicker';
import { calculateAge } from '../../utils/profileHelpers';
import { createDriverFamilyMemberItemStyles } from '../../styles/components/driver/DriverFamilyMemberItem.styles';
import { FamilyMember } from '../../types/driver/DriverFamily';

interface DriverFamilyMemberEditModeProps {
  member: FamilyMember;
  editingData: Partial<FamilyMember>;
  phoneVerified: boolean;
  onSave: (updatedData: Partial<FamilyMember>) => void;
  onCancel: () => void;
  onDelete: () => void;
  onResetPhoneVerification: () => void;
  setEditingData: (data: Partial<FamilyMember>) => void;
}

const DriverFamilyMemberEditMode: React.FC<DriverFamilyMemberEditModeProps> = ({
  member,
  editingData,
  phoneVerified,
  onSave,
  onCancel,
  onDelete,
  onResetPhoneVerification,
  setEditingData,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const styles = createFamilyMemberItemStyles(isDark);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Локальное определение типов семьи с переводами
  const familyTypes = [
    { key: 'husband', label: t('profile.familyTypes.husband') },
    { key: 'wife', label: t('profile.familyTypes.wife') },
    { key: 'son', label: t('profile.familyTypes.son') },
    { key: 'daughter', label: t('profile.familyTypes.daughter') },
    { key: 'mother', label: t('profile.familyTypes.mother') },
    { key: 'father', label: t('profile.familyTypes.father') },
    { key: 'grandmother', label: t('profile.familyTypes.grandmother') },
    { key: 'grandfather', label: t('profile.familyTypes.grandfather') },
    { key: 'brother', label: t('profile.familyTypes.brother') },
    { key: 'sister', label: t('profile.familyTypes.sister') },
    { key: 'uncle', label: t('profile.familyTypes.uncle') },
    { key: 'aunt', label: t('profile.familyTypes.aunt') },
    { key: 'cousin', label: t('profile.familyTypes.cousin') },
    { key: 'nephew', label: t('profile.familyTypes.nephew') },
    { key: 'niece', label: t('profile.familyTypes.niece') },
    { key: 'stepfather', label: t('profile.familyTypes.stepfather') },
    { key: 'stepmother', label: t('profile.familyTypes.stepmother') },
    { key: 'stepson', label: t('profile.familyTypes.stepson') },
    { key: 'stepdaughter', label: t('profile.familyTypes.stepdaughter') },
    { key: 'other', label: t('profile.familyTypes.other') },
  ];

  const hasChanges = () => {
    return (
      editingData.name !== member.name ||
      editingData.surname !== member.surname ||
      editingData.type !== member.type ||
      editingData.birthDate !== member.birthDate ||
      (editingData.phone || '') !== (member.phone || '')
    );
  };

  const handleSave = () => {
    if (hasChanges()) {
      Alert.alert(
        t('common.confirmation'),
        t('profile.family.confirmSave'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { 
            text: t('common.save'), 
            onPress: () => {
              const updatedData = {
                ...editingData,
                age: calculateAge(editingData.birthDate || member.birthDate),
                phone: editingData.phone?.trim() || undefined,
              };
              onSave(updatedData);
            }
          }
        ]
      );
    } else {
      onCancel();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('common.confirmation'),
      t('profile.family.confirmDelete'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: onDelete }
      ]
    );
  };

  return (
    <View>
      {/* Имя */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.firstName')}:
        </Text>
        <TextInput
          style={styles.fieldInput}
          value={editingData.name}
          onChangeText={(text) => setEditingData({...editingData, name: text})}
          placeholder={t('profile.firstNamePlaceholder')}
          placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
        />
      </View>

      {/* Фамилия */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.lastName')}:
        </Text>
        <TextInput
          style={styles.fieldInput}
          value={editingData.surname}
          onChangeText={(text) => setEditingData({...editingData, surname: text})}
          placeholder={t('profile.lastNamePlaceholder')}
          placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
        />
      </View>

      {/* Тип члена семьи */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.familyType')}:
        </Text>
        <View style={styles.typeDropdownContainer}>
          <TouchableOpacity
            style={styles.typeDropdownButton}
            onPress={() => setShowTypeDropdown(!showTypeDropdown)}
          >
            <Text style={styles.typeDropdownText}>
              {editingData.type ? familyTypes.find(t => t.key === editingData.type)?.label : t('profile.familyTypePlaceholder')}
            </Text>
            <Ionicons 
              name={showTypeDropdown ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={isDark ? '#9CA3AF' : '#666666'} 
            />
          </TouchableOpacity>
          
          {/* Выпадающий список типов */}
          {showTypeDropdown && (
            <View style={styles.typeDropdownList}>
              <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                {familyTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.typeDropdownItem,
                      type.key === 'other' && styles.typeDropdownItemLast,
                      (editingData.type || member.type) === type.key && styles.typeDropdownItemSelected
                    ]}
                    onPress={() => {
                      setEditingData({...editingData, type: type.key});
                      setShowTypeDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.typeDropdownItemText,
                      (editingData.type || member.type) === type.key && styles.typeDropdownItemTextSelected
                    ]}>
                      {type.label}
                    </Text>
                    {(editingData.type || member.type) === type.key && (
                      <Ionicons name="checkmark" size={16} color={isDark ? '#3B82F6' : '#083198'} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Дата рождения */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.birthDate')}:
        </Text>
        <View style={styles.fieldDisplay}>
          <DatePicker
            value={editingData.birthDate || member.birthDate}
            onChange={(date) => setEditingData({...editingData, birthDate: date})}
            placeholder={t('profile.birthDatePlaceholder')}
            inline={true}
            readOnly={false}
          />
        </View>
      </View>

      {/* Телефон */}
      <View style={styles.lastFieldContainer}>
        <Text style={styles.fieldLabel}>
          {t('profile.phone')}:
        </Text>
        <View style={styles.phoneContainer}>
          <TextInput
            style={styles.phoneInput}
            value={editingData.phone ?? ''}
            onChangeText={(text) => {
              setEditingData({...editingData, phone: text});
              if (text !== (member.phone ?? '')) {
                onResetPhoneVerification();
              }
            }}
            placeholder={t('profile.phonePlaceholder')}
            placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
            keyboardType="phone-pad"
            editable={true}
            selectTextOnFocus={false}
          />
          {editingData.phone && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setEditingData({...editingData, phone: ''});
                onResetPhoneVerification();
              }}
            >
              <Ionicons name="close-circle" size={16} color={isDark ? '#9CA3AF' : '#666666'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Кнопки действий */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>
            {t('common.delete')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>
            {t('common.save')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DriverFamilyMemberEditMode; 