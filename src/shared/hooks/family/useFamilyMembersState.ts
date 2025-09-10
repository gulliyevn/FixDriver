import { useState } from 'react';
import { familyOperations, FamilyMember, NewFamilyMember } from '../../../domain/usecases/family/familyOperations';

/**
 * Hook for managing family members state
 */
export const useFamilyMembersState = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFamilyMember, setExpandedFamilyMember] = useState<string | null>(null);
  const [editingFamilyMember, setEditingFamilyMember] = useState<string | null>(null);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [familyPhoneVerification, setFamilyPhoneVerification] = useState<{[key: string]: boolean}>({});
  const [familyPhoneVerifying, setFamilyPhoneVerifying] = useState<{[key: string]: boolean}>({});
  const [newFamilyMember, setNewFamilyMember] = useState<NewFamilyMember>(
    familyOperations.getDefaultNewFamilyMember()
  );

  /**
   * Set loading state
   */
  const setLoadingState = (loading: boolean) => {
    setLoading(loading);
  };

  /**
   * Reset new family member form
   */
  const resetNewFamilyMember = () => {
    setNewFamilyMember(familyOperations.getDefaultNewFamilyMember());
  };

  /**
   * Toggle family member expansion
   */
  const toggleFamilyMember = (memberId: string) => {
    setExpandedFamilyMember(expandedFamilyMember === memberId ? null : memberId);
  };

  /**
   * Open add family modal
   */
  const openAddFamilyModal = () => {
    setShowAddFamilyModal(true);
  };

  /**
   * Close add family modal
   */
  const closeAddFamilyModal = () => {
    setShowAddFamilyModal(false);
    resetNewFamilyMember();
  };

  /**
   * Start editing family member
   */
  const startEditingFamilyMember = (memberId: string) => {
    setEditingFamilyMember(memberId);
  };

  /**
   * Cancel editing family member
   */
  const cancelEditingFamilyMember = () => {
    setEditingFamilyMember(null);
  };

  /**
   * Reset family phone verification
   */
  const resetFamilyPhoneVerification = (memberId: string) => {
    setFamilyPhoneVerification(prev => ({ ...prev, [memberId]: false }));
  };

  return {
    // State
    familyMembers,
    loading,
    expandedFamilyMember,
    editingFamilyMember,
    showAddFamilyModal,
    newFamilyMember,
    familyPhoneVerification,
    familyPhoneVerifying,
    
    // Setters
    setFamilyMembers,
    setLoadingState,
    setNewFamilyMember,
    setExpandedFamilyMember,
    setEditingFamilyMember,
    setShowAddFamilyModal,
    setFamilyPhoneVerification,
    setFamilyPhoneVerifying,
    
    // Actions
    toggleFamilyMember,
    openAddFamilyModal,
    closeAddFamilyModal,
    startEditingFamilyMember,
    cancelEditingFamilyMember,
    resetFamilyPhoneVerification,
    resetNewFamilyMember,
  };
};
