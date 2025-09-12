import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, Alert, Animated } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useI18n } from '../../../../shared/hooks/useI18n';
import { useAuth } from '../../../../context/AuthContext';
import { useEditProfile } from './hooks/useEditProfile';
import { useProfileValidation } from './hooks/useProfileValidation';
import { useProfileActions } from './hooks/useProfileActions';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileAvatarSection } from './components/ProfileAvatarSection';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { FamilySection } from './components/FamilySection';
import { VehiclesSection } from './components/VehiclesSection';
import { VipSection } from './components/VipSection';
import { AddFamilyModal } from './components/AddFamilyModal';
import { EditProfileScreenStyles as styles } from './styles/EditProfileScreen.styles';

/**
 * Edit Profile Screen
 * 
 * Unified screen for editing both client and driver profiles
 * Uses role-based logic to show appropriate sections
 */

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  
  const isDriver = user?.role === 'driver';
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const {
    profile,
    formData,
    setFormData,
    isEditingPersonalInfo,
    setIsEditingPersonalInfo,
    originalDataRef,
    checkHasChanges,
    loadProfile,
    updateProfile
  } = useEditProfile();

  const {
    validatePersonalInfo,
    validationErrors
  } = useProfileValidation({ formData });

  const {
    handleBackPress,
    handleSaveProfile,
    handleCirclePressAction
  } = useProfileActions({
    navigation,
    isEditingPersonalInfo,
    checkHasChanges,
    validatePersonalInfo,
    formData,
    originalDataRef,
    setIsEditingPersonalInfo,
    updateProfile,
    rotateAnim
  });

  // Family members logic (only for clients)
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
    saveFamilyRef
  } = useEditProfile({ includeFamily: !isDriver });

  // Vehicles logic (only for drivers)
  const {
    vehicles,
    loadVehicles,
    deleteVehicle,
    swipeRefs,
    openSwipeRef,
    closeOpenSwipe,
    handleDeleteVehicle,
    renderRightActions
  } = useEditProfile({ includeVehicles: isDriver });

  // Verification logic
  const {
    verificationStatus,
    isVerifying,
    loadVerificationStatus,
    resetVerificationStatus,
    verifyEmail,
    verifyPhone
  } = useEditProfile({ includeVerification: true });

  useEffect(() => {
    loadProfile();
    loadVerificationStatus();
    if (isDriver) {
      loadVehicles();
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.name,
        lastName: profile.surname,
        phone: profile.phone,
        email: profile.email,
        birthDate: profile.birthDate || '1990-01-01',
      });
      
      originalDataRef.current = {
        firstName: profile.name,
        lastName: profile.surname,
        phone: profile.phone,
        email: profile.email,
        birthDate: profile.birthDate || '1990-01-01',
      };
    }
  }, [profile]);

  // Auto-save birth date
  useEffect(() => {
    if (profile && formData.birthDate !== profile.birthDate && formData.birthDate !== originalDataRef.current.birthDate) {
      updateProfile({ birthDate: formData.birthDate });
    }
  }, [formData.birthDate]);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ProfileHeader
        onBackPress={handleBackPress}
        onEditPress={() => {
          if (isEditingPersonalInfo) {
            const hasChanges = checkHasChanges();
            
            if (hasChanges) {
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
                      const success = await handleSaveProfile();
                      if (success) {
                        setIsEditingPersonalInfo(false);
                      }
                    }
                  }
                ]
              );
            } else {
              setIsEditingPersonalInfo(false);
            }
          } else {
            setIsEditingPersonalInfo(true);
          }
        }}
        isEditing={isEditingPersonalInfo}
        isDark={isDark}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <ProfileAvatarSection
          userName={profile?.name || ''}
          userSurname={profile?.surname || ''}
          onCirclePress={handleCirclePressAction}
          rotateAnim={rotateAnim}
          isDark={isDark}
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
          isDark={isDark}
        />

        {/* Family Section - только для клиентов */}
        {!isDriver && (
          <FamilySection
            familyMembers={familyMembers}
            expandedFamilyMember={expandedFamilyMember}
            editingFamilyMember={editingFamilyMember}
            familyPhoneVerification={familyPhoneVerification}
            onToggleFamilyMember={toggleFamilyMember}
            onOpenAddFamilyModal={openAddFamilyModal}
            onStartEditing={startEditingFamilyMember}
            onCancelEditing={cancelEditingFamilyMember}
            onSaveMember={saveFamilyMember}
            onDeleteMember={deleteFamilyMember}
            onResetPhoneVerification={resetFamilyPhoneVerification}
            onVerifyPhone={verifyFamilyPhone}
            saveFamilyRef={saveFamilyRef}
            isDark={isDark}
          />
        )}

        {/* Vehicles Section - только для водителей */}
        {isDriver && (
          <VehiclesSection
            vehicles={vehicles}
            swipeRefs={swipeRefs}
            openSwipeRef={openSwipeRef}
            onDeleteVehicle={handleDeleteVehicle}
            onVehicleAdded={loadVehicles}
            renderRightActions={renderRightActions}
            isDark={isDark}
          />
        )}

        <VipSection 
          onVipPress={() => navigation.navigate('PremiumPackages')}
          isDark={isDark}
        />
      </ScrollView>

      {/* Family Modal - только для клиентов */}
      {!isDriver && (
        <AddFamilyModal
          visible={showAddFamilyModal}
          newFamilyMember={newFamilyMember}
          setNewFamilyMember={setNewFamilyMember}
          onClose={closeAddFamilyModal}
          onAdd={addFamilyMember}
          onVerifyPhone={verifyPhone}
          phoneVerificationStatus={verificationStatus.phone}
          isVerifyingPhone={isVerifying.phone}
          isDark={isDark}
        />
      )}
    </View>
  );
};

export default EditProfileScreen;
