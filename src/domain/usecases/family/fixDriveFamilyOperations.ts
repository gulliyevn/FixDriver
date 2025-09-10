import AsyncStorage from '@react-native-async-storage/async-storage';
import { FamilyMember } from '../../../shared/types/family';

/**
 * Domain usecase for FixDrive family member operations
 * Abstracts data layer access from presentation layer
 */
export const fixDriveFamilyOperations = {
  /**
   * Load family members from storage
   */
  async loadFamilyMembersFromStorage(): Promise<FamilyMember[]> {
    try {
      const savedMembers = await AsyncStorage.getItem('family_members');
      if (savedMembers) {
        return JSON.parse(savedMembers);
      }
      return [];
    } catch (error) {
      console.error('Error loading family members from storage:', error);
      return [];
    }
  },

  /**
   * Create account owner as family member
   */
  createAccountOwner(
    profile: any,
    user: any
  ): FamilyMember {
    return {
      id: 'account-owner',
      name: profile?.name || user?.name || 'User',
      surname: profile?.surname || user?.surname || '',
      type: 'account_owner',
      birthDate: profile?.birthDate || '1990-01-01',
      age: profile?.age || 30,
      phone: profile?.phone || user?.phone,
      phoneVerified: profile?.phoneVerified || false
    };
  },

  /**
   * Combine account owner with family members
   */
  combineAccountOwnerWithMembers(
    accountOwner: FamilyMember,
    members: FamilyMember[]
  ): FamilyMember[] {
    return members.length > 0 
      ? [accountOwner, ...members] 
      : [accountOwner];
  },

  /**
   * Create family member options for dropdown
   */
  createFamilyMemberOptions(members: FamilyMember[]) {
    return members.map(member => ({
      key: member.id,
      label: `${member.name} ${member.surname}`,
      value: member.id,
      member: member
    }));
  },

  /**
   * Find family member by ID
   */
  findFamilyMemberById(members: FamilyMember[], id: string): FamilyMember | undefined {
    return members.find(member => member.id === id);
  }
};
