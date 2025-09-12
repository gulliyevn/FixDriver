import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../../../../context/AuthContext';
import { useProfile } from '../../../../../../shared/hooks/useProfile';
import { useDriverProfile } from '../../../../../../shared/hooks/driver/DriverUseProfile';
import { useVerification } from '../../../../../../shared/hooks/useVerification';
import { useFamilyMembers } from '../../../../../../shared/hooks/useFamilyMembers';
import { useDriverVehicles } from '../../../../../../shared/hooks/driver/useDriverVehicles';

/**
 * Edit Profile Hook
 * 
 * Main hook for managing profile editing logic
 * Handles both client and driver profiles with role-based features
 */

interface UseEditProfileParams {
  includeFamily?: boolean;
  includeVehicles?: boolean;
  includeVerification?: boolean;
}

export const useEditProfile = (params: UseEditProfileParams = {}) => {
  const { user } = useAuth();
  const isDriver = user?.role === 'driver';
  
  // Profile management
  const clientProfile = useProfile();
  const driverProfile = useDriverProfile();
  const profile = isDriver ? driverProfile.profile : clientProfile.profile;
  const updateProfile = isDriver ? driverProfile.updateProfile : clientProfile.updateProfile;
  const loadProfile = isDriver ? driverProfile.loadProfile : clientProfile.loadProfile;

  // Form state
  const [formData, setFormData] = useState({
    firstName: profile?.name || '',
    lastName: profile?.surname || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    birthDate: profile?.birthDate || '1990-01-01',
  });

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const originalDataRef = useRef({
    firstName: profile?.name || '',
    lastName: profile?.surname || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    birthDate: profile?.birthDate || '1990-01-01',
  });

  // Verification (if needed)
  const verification = useVerification();
  const verificationStatus = params.includeVerification ? verification.verificationStatus : { email: '', phone: '' };
  const isVerifying = params.includeVerification ? verification.isVerifying : { email: false, phone: false };
  const loadVerificationStatus = params.includeVerification ? verification.loadVerificationStatus : () => {};
  const resetVerificationStatus = params.includeVerification ? verification.resetVerificationStatus : () => {};
  const verifyEmail = params.includeVerification ? verification.verifyEmail : () => {};
  const verifyPhone = params.includeVerification ? verification.verifyPhone : () => {};

  // Family members (client only)
  const family = useFamilyMembers();
  const familyMembers = params.includeFamily ? family.familyMembers : [];
  const expandedFamilyMember = params.includeFamily ? family.expandedFamilyMember : null;
  const editingFamilyMember = params.includeFamily ? family.editingFamilyMember : null;
  const showAddFamilyModal = params.includeFamily ? family.showAddFamilyModal : false;
  const newFamilyMember = params.includeFamily ? family.newFamilyMember : {};
  const setNewFamilyMember = params.includeFamily ? family.setNewFamilyMember : () => {};
  const familyPhoneVerification = params.includeFamily ? family.familyPhoneVerification : {};
  const familyPhoneVerifying = params.includeFamily ? family.familyPhoneVerifying : false;
  const toggleFamilyMember = params.includeFamily ? family.toggleFamilyMember : () => {};
  const openAddFamilyModal = params.includeFamily ? family.openAddFamilyModal : () => {};
  const closeAddFamilyModal = params.includeFamily ? family.closeAddFamilyModal : () => {};
  const addFamilyMember = params.includeFamily ? family.addFamilyMember : () => {};
  const startEditingFamilyMember = params.includeFamily ? family.startEditingFamilyMember : () => {};
  const cancelEditingFamilyMember = params.includeFamily ? family.cancelEditingFamilyMember : () => {};
  const saveFamilyMember = params.includeFamily ? family.saveFamilyMember : () => {};
  const deleteFamilyMember = params.includeFamily ? family.deleteFamilyMember : () => {};
  const verifyFamilyPhone = params.includeFamily ? family.verifyFamilyPhone : () => {};
  const resetFamilyPhoneVerification = params.includeFamily ? family.resetFamilyPhoneVerification : () => {};
  const saveFamilyRef = useRef<(() => void) | null>(null);

  // Vehicles (driver only)
  const vehicles = useDriverVehicles();
  const vehiclesList = params.includeVehicles ? vehicles.vehicles : [];
  const loadVehicles = params.includeVehicles ? vehicles.loadVehicles : () => {};
  const deleteVehicle = params.includeVehicles ? vehicles.deleteVehicle : () => {};
  const swipeRefs = useRef<Record<string, any>>({});
  const openSwipeRef = useRef<any>(null);

  const closeOpenSwipe = () => {
    if (openSwipeRef.current) {
      try {
        openSwipeRef.current.close();
      } catch {}
      openSwipeRef.current = null;
    }
  };

  const checkHasChanges = () => {
    return formData.firstName !== originalDataRef.current.firstName ||
           formData.lastName !== originalDataRef.current.lastName ||
           formData.phone !== originalDataRef.current.phone ||
           formData.email !== originalDataRef.current.email;
  };

  return {
    // Profile data
    profile,
    formData,
    setFormData,
    isEditingPersonalInfo,
    setIsEditingPersonalInfo,
    originalDataRef,
    checkHasChanges,
    loadProfile,
    updateProfile,

    // Verification
    verificationStatus,
    isVerifying,
    loadVerificationStatus,
    resetVerificationStatus,
    verifyEmail,
    verifyPhone,

    // Family (client only)
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
    saveFamilyRef,

    // Vehicles (driver only)
    vehicles: vehiclesList,
    loadVehicles,
    deleteVehicle,
    swipeRefs,
    openSwipeRef,
    closeOpenSwipe,
  };
};
