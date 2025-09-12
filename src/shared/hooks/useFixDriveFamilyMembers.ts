import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../presentation/context/auth/AuthContext';
import { useProfile } from './useProfile';
import { useFocusEffect } from '@react-navigation/native';
import { fixDriveFamilyOperations } from '../../domain/usecases/family/fixDriveFamilyOperations';
import { FamilyMember } from '../types/family';

/**
 * Hook for managing family members in FixDrive context
 * Provides family members with account owner included for FixDrive orders
 */
export const useFixDriveFamilyMembers = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load family members with account owner
   */
  const loadFamilyMembers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load data directly from AsyncStorage
      const members = await fixDriveFamilyOperations.loadFamilyMembersFromStorage();
      
      // Create account owner as family member
      const accountOwner = fixDriveFamilyOperations.createAccountOwner(profile, user);
      
      // Combine account owner with family members
      const allMembers = fixDriveFamilyOperations.combineAccountOwnerWithMembers(accountOwner, members);
      
      setFamilyMembers(allMembers);
    } catch (error) {
      console.error('Error loading family members for FixDrive:', error);
      setFamilyMembers([]);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  // Load data on mount
  useEffect(() => {
    loadFamilyMembers();
  }, [loadFamilyMembers]);

  // Automatically update data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadFamilyMembers();
    }, [loadFamilyMembers])
  );

  /**
   * Get family member options for dropdown
   */
  const getFamilyMemberOptions = useCallback(() => {
    return fixDriveFamilyOperations.createFamilyMemberOptions(familyMembers);
  }, [familyMembers]);

  /**
   * Get family member by ID
   */
  const getFamilyMemberById = useCallback((id: string) => {
    return fixDriveFamilyOperations.findFamilyMemberById(familyMembers, id);
  }, [familyMembers]);

  /**
   * Force refresh family members from AsyncStorage
   */
  const refreshFamilyMembers = useCallback(async () => {
    try {
      const members = await fixDriveFamilyOperations.loadFamilyMembersFromStorage();
      
      // Create account owner
      const accountOwner = fixDriveFamilyOperations.createAccountOwner(profile, user);
      
      // Combine with members
      const allMembers = fixDriveFamilyOperations.combineAccountOwnerWithMembers(accountOwner, members);
      
      setFamilyMembers(allMembers);
    } catch (error) {
      console.error('Error refreshing family members:', error);
    }
  }, [profile, user]);

  return {
    familyMembers,
    loading,
    getFamilyMemberOptions,
    getFamilyMemberById,
    refreshFamilyMembers
  };
};