import { useEffect } from 'react';
import { useAuth } from '../../presentation/context/auth/AuthContext';
import { useFamilyMembersState } from './family/useFamilyMembersState';
import { useFamilyMembersActions } from './family/useFamilyMembersActions';
import { useFamilyMembersUtils } from './family/useFamilyMembersUtils';
import { FamilyMember, NewFamilyMember } from '../../domain/usecases/family/familyOperations';

/**
 * Hook for managing family members
 * Provides comprehensive family member management functionality
 */
export const useFamilyMembers = () => {
  const { user } = useAuth();
  
  // Get clientId for mock DB
  const clientId = user?.id || 'client1';

  // State management
  const {
    familyMembers,
    loading,
    expandedFamilyMember,
    editingFamilyMember,
    showAddFamilyModal,
    newFamilyMember,
    familyPhoneVerification,
    familyPhoneVerifying,
    setFamilyMembers,
    setLoadingState,
    setNewFamilyMember,
    setExpandedFamilyMember,
    setEditingFamilyMember,
    setShowAddFamilyModal,
    setFamilyPhoneVerification,
    setFamilyPhoneVerifying,
    toggleFamilyMember,
    openAddFamilyModal,
    closeAddFamilyModal,
    startEditingFamilyMember,
    cancelEditingFamilyMember,
    resetFamilyPhoneVerification,
    resetNewFamilyMember,
  } = useFamilyMembersState();

  // Actions
  const {
    loadFamilyMembers,
    saveFamilyMembers,
    addFamilyMember,
    saveFamilyMember,
    deleteFamilyMember,
    verifyFamilyPhone,
  } = useFamilyMembersActions({
    clientId,
    familyMembers,
    setFamilyMembers,
    setLoading: setLoadingState,
    setEditingFamilyMember,
    setExpandedFamilyMember,
    setFamilyPhoneVerification,
    setFamilyPhoneVerifying,
    closeAddFamilyModal,
  });

  // Utility functions
  const {
    handlePhoneChange,
    validateFamilyMember,
    formatFamilyMemberName,
    getFamilyMemberTypeDisplay,
    isPhoneVerified,
    getVerificationStatusText,
    getVerificationStatusColor,
    filterFamilyMembersByType,
    sortFamilyMembersByName,
    getFamilyMemberStats,
  } = useFamilyMembersUtils();

  // Wrapper functions to maintain API compatibility
  const handlePhoneChangeWrapper = (phone: string) => {
    handlePhoneChange(phone, setNewFamilyMember);
  };

  const resetFamilyPhoneVerificationWrapper = (memberId: string) => {
    resetFamilyPhoneVerification(memberId);
    // Also reset status in family member data
    const updatedMembers = familyMembers.map(member => 
      member.id === memberId 
        ? { ...member, phoneVerified: false }
        : member
    );
    setFamilyMembers(updatedMembers);
    saveFamilyMembers(updatedMembers);
  };

  // Load data on mount
  useEffect(() => {
    loadFamilyMembers();
  }, [loadFamilyMembers]);

  return {
    // Data
    familyMembers,
    expandedFamilyMember,
    editingFamilyMember,
    showAddFamilyModal,
    newFamilyMember,
    familyPhoneVerification,
    familyPhoneVerifying,
    loading,
    
    // State setters
    setNewFamilyMember,
    
    // Actions
    loadFamilyMembers,
    toggleFamilyMember,
    openAddFamilyModal,
    closeAddFamilyModal,
    addFamilyMember,
    startEditingFamilyMember,
    cancelEditingFamilyMember,
    saveFamilyMember,
    deleteFamilyMember,
    verifyFamilyPhone,
    resetFamilyPhoneVerification: resetFamilyPhoneVerificationWrapper,
    
    // Utilities
    handlePhoneChange: handlePhoneChangeWrapper,
    validateFamilyMember,
    formatFamilyMemberName,
    getFamilyMemberTypeDisplay,
    isPhoneVerified,
    getVerificationStatusText,
    getVerificationStatusColor,
    filterFamilyMembersByType,
    sortFamilyMembersByName,
    getFamilyMemberStats,
  };
};