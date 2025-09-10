/**
 * 👨‍👩‍👧‍👦 FAMILY MEMBERS MOCK DATA
 * 
 * Mock family members data for development and testing.
 * Clean implementation with English comments and data.
 */

import { FamilyMember } from '../../types/family';

// Mock DB for family members linked to clientId
export const familyMembersMock: { [clientId: string]: FamilyMember[] } = {
  'client1': [
    {
      id: '1',
      name: 'Anna',
      surname: 'Ivanova',
      type: 'daughter',
      birthDate: '2015-03-15',
      age: 8,
      phone: '+994501234567',
      phoneVerified: true
    },
    {
      id: '2',
      name: 'Maria',
      surname: 'Ivanova',
      type: 'wife',
      birthDate: '1988-07-22',
      age: 35,
      phone: '+994509876543',
      phoneVerified: true
    },
    {
      id: '3',
      name: 'Peter',
      surname: 'Ivanov',
      type: 'son',
      birthDate: '2012-11-08',
      age: 11,
      phone: '+994507654321',
      phoneVerified: false
    }
  ],
  'client2': [
    {
      id: '4',
      name: 'Elena',
      surname: 'Petrova',
      type: 'daughter',
      birthDate: '2018-05-20',
      age: 5,
      phone: '+994501112233',
      phoneVerified: true
    }
  ],
  'client3': []
};

// Mock family member types
export const mockFamilyMemberTypes = [
  { type: 'wife', name: 'Wife', icon: '👩' },
  { type: 'husband', name: 'Husband', icon: '👨' },
  { type: 'daughter', name: 'Daughter', icon: '👧' },
  { type: 'son', name: 'Son', icon: '👦' },
  { type: 'mother', name: 'Mother', icon: '👩' },
  { type: 'father', name: 'Father', icon: '👨' },
  { type: 'sister', name: 'Sister', icon: '👩' },
  { type: 'brother', name: 'Brother', icon: '👨' }
];

// Mock family member statuses
export const mockFamilyMemberStatuses = [
  { status: 'active', name: 'Active', color: '#4CAF50' },
  { status: 'pending', name: 'Pending', color: '#FF9800' },
  { status: 'inactive', name: 'Inactive', color: '#F44336' }
];

// Helper functions
export const getFamilyMembersByClientId = (clientId: string): FamilyMember[] => {
  return familyMembersMock[clientId] || [];
};

export const addFamilyMember = (clientId: string, member: FamilyMember): void => {
  if (!familyMembersMock[clientId]) {
    familyMembersMock[clientId] = [];
  }
  familyMembersMock[clientId].push(member);
};

export const removeFamilyMember = (clientId: string, memberId: string): void => {
  if (familyMembersMock[clientId]) {
    familyMembersMock[clientId] = familyMembersMock[clientId].filter(
      member => member.id !== memberId
    );
  }
};

export const updateFamilyMember = (clientId: string, memberId: string, updates: Partial<FamilyMember>): void => {
  if (familyMembersMock[clientId]) {
    const memberIndex = familyMembersMock[clientId].findIndex(member => member.id === memberId);
    if (memberIndex !== -1) {
      familyMembersMock[clientId][memberIndex] = {
        ...familyMembersMock[clientId][memberIndex],
        ...updates
      };
    }
  }
};