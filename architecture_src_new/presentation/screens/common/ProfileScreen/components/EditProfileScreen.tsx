import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Новая архитектура
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useAuth } from '../../../../../core/context/AuthContext';
import { useI18n } from '../../../../../shared/i18n';
import { colors } from '../../../../../shared/constants/colors';
import { EditProfileScreenStyles as styles, getEditProfileScreenColors } from './styles/EditProfileScreen.styles';

// Временные заглушки (заменить на shared hooks)
const useProfile = () => ({
  profile: null,
  updateProfile: async (data: any) => console.log('Update profile:', data),
  loadProfile: async () => console.log('Load profile'),
});

const useVerification = () => ({
  verificationStatus: { email: false, phone: false },
  isVerifying: false,
  loadVerificationStatus: async () => {},
  resetVerificationStatus: () => {},
  verifyEmail: async () => true,
  verifyPhone: async () => true,
});

const useFamilyMembers = () => ({
  familyMembers: [],
  expandedFamilyMember: null,
  editingFamilyMember: null,
  showAddFamilyModal: false,
  newFamilyMember: null,
  setNewFamilyMember: () => {},
  familyPhoneVerification: null,
  familyPhoneVerifying: false,
  toggleFamilyMember: () => {},
  openAddFamilyModal: () => {},
  closeAddFamilyModal: () => {},
  addFamilyMember: async () => {},
  startEditingFamilyMember: () => {},
  cancelEditingFamilyMember: () => {},
  saveFamilyMember: async () => {},
  deleteFamilyMember: async () => {},
  verifyFamilyPhone: async () => true,
  resetFamilyPhoneVerification: () => {},
});

const useDriverVehicles = () => ({
  vehicles: [],
  loadVehicles: async () => {},
  deleteVehicle: async () => {},
});

// Временные моки пользователей
const mockUsers = [
  {
    id: '1',
    name: 'Иван',
    surname: 'Иванов',
    phone: '+7 777 123 4567',
    email: 'ivan@example.com',
    birthDate: '1990-01-01',
    role: 'client' as const,
  }
];

interface EditProfileScreenProps {
  onBack: () => void;
}

/**
 * Экран редактирования профиля с умной ролью
 * 
 * Показывает разные поля и секции в зависимости от роли пользователя:
 * - Клиент: личная информация, семья, VIP статус
 * - Водитель: личная информация, автомобили, VIP статус
 */
const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getEditProfileScreenColors(isDark);
  
  // Определяем роль пользователя
  const isDriver = user?.role === 'driver';
  
  // Хуки
  const { profile, updateProfile, loadProfile } = useProfile();
  const {
    verificationStatus,
    isVerifying,
    loadVerificationStatus,
    resetVerificationStatus,
    verifyEmail,
    verifyPhone,
  } = useVerification();
  
  // Хук для семейных членов (только для клиентов)
  const familyHook = useFamilyMembers();
  
  // Хук для автомобилей (только для водителей)
  const driverVehiclesHook = useDriverVehicles();
  
  const currentProfile = profile || mockUsers[0];
  
  // Состояние формы
  const [formData, setFormData] = useState({
    firstName: currentProfile.name,
    lastName: currentProfile.surname,
    phone: currentProfile.phone,
    email: currentProfile.email,
    birthDate: currentProfile.birthDate || '1990-01-01',
  });

  // Исходные данные для сравнения
  const originalDataRef = useRef({
    firstName: currentProfile.name,
    lastName: currentProfile.surname,
    phone: currentProfile.phone,
    email: currentProfile.email,
    birthDate: currentProfile.birthDate || '1990-01-01',
  });

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Функция для проверки изменений
  const checkHasChanges = () => {
    const current = formData;
    const original = originalDataRef.current;
    return (
      current.firstName !== original.firstName ||
      current.lastName !== original.lastName ||
      current.phone !== original.phone ||
      current.email !== original.email ||
      current.birthDate !== original.birthDate
    );
  };

  // Анимация поворота иконки
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isEditingPersonalInfo ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isEditingPersonalInfo, rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Обработчики
  const handlePersonalInfoEdit = () => {
    if (isEditingPersonalInfo && checkHasChanges()) {
      Alert.alert(
        t('profile.unsavedChanges'),
        t('profile.unsavedChangesMessage'),
        [
          {
            text: t('common.buttons.cancel'),
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: t('profile.discardChanges'),
            onPress: () => {
              setFormData({ ...originalDataRef.current });
              setIsEditingPersonalInfo(false);
            },
          },
          {
            text: t('common.buttons.save'),
            onPress: handleSavePersonalInfo,
          },
        ]
      );
    } else {
      setIsEditingPersonalInfo(!isEditingPersonalInfo);
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      await updateProfile(formData);
      originalDataRef.current = { ...formData };
      setIsEditingPersonalInfo(false);
      Alert.alert(t('common.messages.success'), t('profile.profileUpdated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t('common.messages.error'), t('profile.updateError'));
    }
  };

  const handleEmailVerify = async () => {
    try {
      await verifyEmail();
      Alert.alert(t('common.messages.success'), t('profile.emailVerificationSent'));
    } catch (error) {
      Alert.alert(t('common.messages.error'), t('profile.verificationError'));
    }
  };

  const handlePhoneVerify = async () => {
    try {
      await verifyPhone();
      Alert.alert(t('common.messages.success'), t('profile.phoneVerificationSent'));
    } catch (error) {
      Alert.alert(t('common.messages.error'), t('profile.verificationError'));
    }
  };

  // Рендер заголовка экрана
  const renderHeader = () => (
    <View style={[styles.header, dynamicStyles.header]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={currentColors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, dynamicStyles.title]}>
        {isDriver ? t('profile.editDriverProfile') : t('profile.editClientProfile')}
      </Text>
      <View style={styles.backButton} />
    </View>
  );

  // Рендер секции личной информации
  const renderPersonalInfoSection = () => (
    <View style={[styles.section, dynamicStyles.section]}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={handlePersonalInfoEdit}
        activeOpacity={0.7}
      >
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {t('profile.personalInfo')}
        </Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Ionicons name="chevron-down" size={20} color={currentColors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>

      {isEditingPersonalInfo && (
        <View style={styles.sectionContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
              {t('profile.firstName')}
            </Text>
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholder={t('profile.firstNamePlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
              {t('profile.lastName')}
            </Text>
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholder={t('profile.lastNamePlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
                {t('profile.email')}
              </Text>
              {!verificationStatus.email && (
                <TouchableOpacity
                  onPress={handleEmailVerify}
                  disabled={isVerifying}
                  style={[styles.verifyButton, dynamicStyles.verifyButton]}
                >
                  <Text style={[styles.verifyButtonText, dynamicStyles.verifyButtonText]}>
                    {t('profile.verify')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder={t('profile.emailPlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
                {t('profile.phone')}
              </Text>
              {!verificationStatus.phone && (
                <TouchableOpacity
                  onPress={handlePhoneVerify}
                  disabled={isVerifying}
                  style={[styles.verifyButton, dynamicStyles.verifyButton]}
                >
                  <Text style={[styles.verifyButtonText, dynamicStyles.verifyButtonText]}>
                    {t('profile.verify')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder={t('profile.phonePlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          {checkHasChanges() && (
            <TouchableOpacity
              style={[styles.saveButton, dynamicStyles.saveButton]}
              onPress={handleSavePersonalInfo}
            >
              <Text style={[styles.saveButtonText, dynamicStyles.saveButtonText]}>
                {t('common.buttons.save')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  // Рендер секции семьи (только для клиентов)
  const renderFamilySection = () => {
    if (isDriver) return null;

    return (
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {t('profile.familyMembers')}
        </Text>
        <View style={styles.sectionContent}>
          <Text style={[styles.infoText, dynamicStyles.infoText]}>
            {t('profile.familyMembersDescription')}
          </Text>
          <TouchableOpacity
            style={[styles.addButton, dynamicStyles.addButton]}
            onPress={familyHook.openAddFamilyModal}
          >
            <Ionicons name="add" size={20} color={currentColors.primary} />
            <Text style={[styles.addButtonText, dynamicStyles.addButtonText]}>
              {t('profile.addFamilyMember')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Рендер секции автомобилей (только для водителей)
  const renderVehiclesSection = () => {
    if (!isDriver) return null;

    return (
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {t('profile.vehicles')}
        </Text>
        <View style={styles.sectionContent}>
          <Text style={[styles.infoText, dynamicStyles.infoText]}>
            {t('profile.vehiclesDescription')}
          </Text>
          <TouchableOpacity
            style={[styles.addButton, dynamicStyles.addButton]}
            onPress={() => {/* Навигация к экрану добавления автомобиля */}}
          >
            <Ionicons name="car" size={20} color={currentColors.primary} />
            <Text style={[styles.addButtonText, dynamicStyles.addButtonText]}>
              {t('profile.addVehicle')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {renderHeader()}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderPersonalInfoSection()}
        {renderFamilySection()}
        {renderVehiclesSection()}
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;
