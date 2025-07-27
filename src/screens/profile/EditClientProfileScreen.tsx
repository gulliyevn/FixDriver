import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Image, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { EditClientProfileScreenStyles as styles, getEditClientProfileScreenColors } from '../../styles/screens/profile/EditClientProfileScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { mockUsers } from '../../mocks/users';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../../hooks/useProfile';
import { useVerification } from '../../hooks/useVerification';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { getDefaultDate, hasChanges, handleCirclePress } from '../../utils/profileHelpers';
import DatePicker from '../../components/DatePicker';
import PersonalInfoSection from '../../components/profile/PersonalInfoSection';
import FamilySection from '../../components/profile/FamilySection';
import AddFamilyModal from '../../components/profile/AddFamilyModal';
import ProfileAvatarSection from '../../components/profile/ProfileAvatarSection';
import VipSection from '../../components/profile/VipSection';
import ProfileHeader from '../../components/profile/ProfileHeader';
import { useLanguage } from '../../context/LanguageContext';

const EditClientProfileScreen: React.FC<ClientScreenProps<'EditClientProfile'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { logout, login } = useAuth();
  const rootNavigation = useNavigation();
  const dynamicStyles = getEditClientProfileScreenColors(isDark);
  const currentColors = isDark ? { dark: { primary: '#3B82F6' } } : { light: { primary: '#083198' } };
  
  const { profile, updateProfile, loadProfile } = useProfile();
  const user = profile || mockUsers[0];
  
  // Состояние формы
  const [formData, setFormData] = useState({
    firstName: user.name,
    lastName: user.surname,
    phone: user.phone,
    email: user.email,
    birthDate: user.birthDate || '1990-01-01',
  });

  // Исходные данные для сравнения
  const originalDataRef = useRef({
    firstName: user.name,
    lastName: user.surname,
    phone: user.phone,
    email: user.email,
    birthDate: user.birthDate || '1990-01-01',
  });

  // Исходное фото для сравнения
  const originalPhotoRef = useRef<string | null>(user.avatar);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Хуки для верификации и семейных членов
  const {
    verificationStatus,
    isVerifying,
    loadVerificationStatus,
    resetVerificationStatus,
    verifyEmail,
    verifyPhone,
  } = useVerification();

  const {
    familyMembers,
    expandedFamilyMember,
    editingFamilyMember,
    showAddFamilyModal,
    newFamilyMember,
    setNewFamilyMember,
    familyPhoneVerification,
    familyPhoneVerifying,
    toggleFamilyMember,
    openAddFamilyModal,
    closeAddFamilyModal,
    addFamilyMember,
    startEditingFamilyMember,
    cancelEditingFamilyMember,
    saveFamilyMember,
    deleteFamilyMember,
    verifyFamilyPhone,
    resetFamilyPhoneVerification,
  } = useFamilyMembers();

  // Функция для проверки изменений
  const checkHasChanges = () => {
    const formChanges = hasChanges(formData, originalDataRef.current);
    const photoChanges = profilePhoto !== originalPhotoRef.current;
    return formChanges || photoChanges;
  };

  // Функция для проверки изменений в семейной секции
  const checkFamilyChanges = () => {
    return editingFamilyMember !== null;
  };

  // Асинхронная функция сохранения профиля
  const saveProfile = async (): Promise<boolean> => {
    try {
      // Проверяем, есть ли изменения в форме (кроме даты и фото, которые сохраняются автоматически)
      const hasFormChanges = formData.firstName !== originalDataRef.current.firstName ||
                            formData.lastName !== originalDataRef.current.lastName ||
                            formData.phone !== originalDataRef.current.phone ||
                            formData.email !== originalDataRef.current.email;

      if (hasFormChanges) {
        // Сохраняем только изменения в форме
        const success = await updateProfile({
          name: formData.firstName,
          surname: formData.lastName,
          phone: formData.phone,
          email: formData.email,
        });

        if (success) {
          Alert.alert('Успех', 'Профиль успешно обновлен');
          setIsEditingPersonalInfo(false);
          // Обновляем исходные данные
          originalDataRef.current = { ...formData };
          originalPhotoRef.current = profilePhoto;
          return true;
        } else {
          Alert.alert('Ошибка', 'Не удалось обновить профиль');
          return false;
        }
      } else {
        // Если изменений в форме нет, просто закрываем режим редактирования
        setIsEditingPersonalInfo(false);
        return true;
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при обновлении профиля');
      return false;
    }
  };

  const handleCirclePressAction = () => {
    // Анимация вращения
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      
      // После завершения анимации вызываем функцию из утилит
      handleCirclePress(navigation, login, t);
    });
  };

  // Загружаем данные только один раз при монтировании компонента
  useEffect(() => {
    loadProfile();
    loadVerificationStatus();
  }, []); // Пустой массив зависимостей - выполняется только один раз

  // Обновляем форму при изменении профиля
  useEffect(() => {
    if (profile && !formData.firstName) {
      console.log('Загружаем данные из профиля:', profile);
      setFormData({
        firstName: profile.name,
        lastName: profile.surname,
        phone: profile.phone,
        email: profile.email,
        birthDate: profile.birthDate || '1990-01-01',
      });
      setProfilePhoto(profile.avatar || null);
      // Обновляем исходные данные
      originalDataRef.current = {
        firstName: profile.name,
        lastName: profile.surname,
        phone: profile.phone,
        email: profile.email,
        birthDate: profile.birthDate || '1990-01-01',
      };
      originalPhotoRef.current = profile.avatar;
      console.log('Исходное фото установлено:', originalPhotoRef.current);
    }
  }, [profile]);

  // Автоматически сохраняем фото при его изменении
  useEffect(() => {
    console.log('useEffect фото сработал:', {
      profile: !!profile,
      profilePhoto,
      profileAvatar: profile?.avatar,
      originalPhoto: originalPhotoRef.current
    });
    
    if (profile && profilePhoto !== null && profilePhoto !== profile.avatar && profilePhoto !== originalPhotoRef.current) {
      console.log('Автосохранение фото:', profilePhoto);
      // Сохраняем только фото, не трогая остальные данные
      updateProfile({ avatar: profilePhoto });
    }
  }, [profilePhoto, profile]);

  // Автоматически сохраняем дату при её изменении
  useEffect(() => {
    if (profile && formData.birthDate !== profile.birthDate && formData.birthDate !== originalDataRef.current.birthDate) {
      // Сохраняем только дату, не трогая остальные данные
      updateProfile({ birthDate: formData.birthDate });
    }
  }, [formData.birthDate]);



  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ProfileHeader
        onBackPress={() => {
          // Проверяем, есть ли несохраненные изменения
          if (checkHasChanges() || checkFamilyChanges()) {
            Alert.alert(
              t('profile.saveChangesConfirm.title'),
              t('profile.saveChangesConfirm.message'),
              [
                { 
                  text: t('profile.saveChangesConfirm.cancel'), 
                  style: 'cancel',
                  onPress: () => {
                    // При отмене НЕ делаем ничего - остаемся на странице с текущими изменениями
                  }
                },
                { 
                  text: t('profile.saveChangesConfirm.save'), 
                  onPress: async () => {
                    // Сохраняем изменения профиля
                    if (checkHasChanges()) {
                      await saveProfile();
                    }
                    // Отменяем редактирование семейной секции
                    if (checkFamilyChanges()) {
                      cancelEditingFamilyMember();
                    }
                    navigation.goBack();
                  }
                }
              ]
            );
          } else {
            navigation.goBack();
          }
        }}
                  onEditPress={() => {
           if (isEditingPersonalInfo) {
             // Если в режиме редактирования, проверяем изменения
             if (checkHasChanges()) {
              // Если есть изменения, показываем подтверждение
              Alert.alert(
                t('profile.saveProfileConfirm.title'),
                t('profile.saveProfileConfirm.message'),
                [
                  { 
                    text: t('profile.saveProfileConfirm.cancel'), 
                    style: 'cancel' 
                  },
                  { 
                    text: t('profile.saveProfileConfirm.save'), 
                    onPress: async () => {
                      const success = await saveProfile();
                      if (success) {
                        setIsEditingPersonalInfo(false);
                      }
                    }
                  }
                ]
              );
            } else {
              // Если изменений нет, просто выключаем режим редактирования без подтверждения
              setIsEditingPersonalInfo(false);
            }
          } else {
            // Если в режиме просмотра, включаем редактирование
            setIsEditingPersonalInfo(true);
          }
        }}
        isEditing={isEditingPersonalInfo}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <ProfileAvatarSection
          userName={user.name}
          userSurname={user.surname}
          profilePhoto={profilePhoto}
          setProfilePhoto={setProfilePhoto}
          onCirclePress={handleCirclePressAction}
          rotateAnim={rotateAnim}
        />

        <PersonalInfoSection
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditingPersonalInfo}
          verificationStatus={verificationStatus}
          isVerifying={isVerifying}
          onVerifyEmail={verifyEmail}
          onVerifyPhone={verifyPhone}
          onResetVerification={resetVerificationStatus}
        />

        <FamilySection
          familyMembers={familyMembers}
          expandedFamilyMember={expandedFamilyMember}
          editingFamilyMember={editingFamilyMember}
          familyPhoneVerification={familyPhoneVerification}
          familyPhoneVerifying={familyPhoneVerifying}
          onToggleFamilyMember={toggleFamilyMember}
          onOpenAddFamilyModal={openAddFamilyModal}
          onStartEditing={startEditingFamilyMember}
          onCancelEditing={cancelEditingFamilyMember}
          onSaveMember={saveFamilyMember}
          onDeleteMember={deleteFamilyMember}
          onVerifyPhone={verifyFamilyPhone}
          onResetPhoneVerification={resetFamilyPhoneVerification}
        />

        <VipSection 
          onVipPress={() => navigation.navigate('PremiumPackages')}
        />

      </ScrollView>

      <AddFamilyModal
        visible={showAddFamilyModal}
        newFamilyMember={newFamilyMember}
        setNewFamilyMember={setNewFamilyMember}
        onClose={closeAddFamilyModal}
        onAdd={addFamilyMember}
        onVerifyPhone={verifyPhone}
        phoneVerificationStatus={verificationStatus.phone}
        isVerifyingPhone={isVerifying.phone}
      />
    </View>
  );
};

export default EditClientProfileScreen;