import AsyncStorage from '@react-native-async-storage/async-storage';
import { addFamilyMember as addToMockDB, updateFamilyMember as updateInMockDB, deleteFamilyMember as deleteFromMockDB } from '../../../shared/mocks/familyMembers';
import { getDefaultDate, calculateAge } from '../../../shared/utils/profileHelpers';

export interface FamilyMember {
  id: string;
  name: string;
  surname: string;
  type: string;
  birthDate: string;
  age: number;
  phone?: string;
  phoneVerified?: boolean;
}

export interface NewFamilyMember {
  name: string;
  surname: string;
  type: string;
  age: string;
  phone: string;
}

/**
 * Domain usecase for family member operations
 * Abstracts data layer access from presentation layer
 */
export const familyOperations = {
  /**
   * Load family members from storage
   */
  async loadFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const savedMembers = await AsyncStorage.getItem('family_members');
      if (savedMembers) {
        return JSON.parse(savedMembers);
      }
      return [];
    } catch (error) {
      console.error('Error loading family members:', error);
      return [];
    }
  },

  /**
   * Save family members to storage
   */
  async saveFamilyMembers(members: FamilyMember[]): Promise<void> {
    try {
      await AsyncStorage.setItem('family_members', JSON.stringify(members));
    } catch (error) {
      console.error('Error saving family members:', error);
      throw error;
    }
  },

  /**
   * Create new family member
   */
  createFamilyMember(newMember: NewFamilyMember): FamilyMember {
    return {
      id: Date.now().toString(),
      name: newMember.name,
      surname: newMember.surname,
      type: newMember.type,
      birthDate: newMember.age,
      age: calculateAge(newMember.age),
      phone: newMember.phone.trim() || undefined,
      phoneVerified: false,
    };
  },

  /**
   * Add family member to mock DB
   */
  addToMockDB(clientId: string, memberData: Omit<FamilyMember, 'id'>): void {
    try {
      addToMockDB(clientId, memberData);
    } catch (error) {
      console.error('Error adding family member to mock DB:', error);
      throw error;
    }
  },

  /**
   * Update family member in mock DB
   */
  updateInMockDB(clientId: string, memberId: string, memberData: Omit<FamilyMember, 'id'>): FamilyMember | null {
    try {
      return updateInMockDB(clientId, memberId, memberData);
    } catch (error) {
      console.error('Error updating family member in mock DB:', error);
      return null;
    }
  },

  /**
   * Delete family member from mock DB
   */
  deleteFromMockDB(clientId: string, memberId: string): void {
    try {
      deleteFromMockDB(clientId, memberId);
    } catch (error) {
      console.error('Error deleting family member from mock DB:', error);
      throw error;
    }
  },

  /**
   * Get default family member data
   */
  getDefaultNewFamilyMember(): NewFamilyMember {
    return {
      name: '',
      surname: '',
      type: '',
      age: getDefaultDate(),
      phone: '',
    };
  },

  /**
   * Create initial family members
   */
  createInitialFamilyMembers(t: (key: string) => string): FamilyMember[] {
    return [
      { 
        id: '1', 
        name: t('profile.family.defaultMembers.child.name'), 
        surname: t('profile.family.defaultMembers.child.surname'),
        type: 'child', 
        birthDate: '2015-03-15',
        age: 8,
        phone: '+7 999 123-45-67',
        phoneVerified: true
      },
      { 
        id: '2', 
        name: t('profile.family.defaultMembers.spouse.name'), 
        surname: t('profile.family.defaultMembers.spouse.surname'),
        type: 'spouse', 
        birthDate: '1988-07-22',
        age: 35,
        phone: undefined,
        phoneVerified: false
      },
    ];
  }
};
