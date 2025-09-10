import { useCallback } from 'react';

/**
 * Hook for family members utility functions
 */
export const useFamilyMembersUtils = () => {
  /**
   * Handle phone change with verification reset
   */
  const handlePhoneChange = useCallback((phone: string, setNewFamilyMember: (updater: (prev: any) => any) => void) => {
    setNewFamilyMember((prev: any) => ({ ...prev, phone }));
  }, []);

  /**
   * Validate family member data
   */
  const validateFamilyMember = useCallback((member: { name: string; surname: string }): { isValid: boolean; error?: string } => {
    if (!member.name.trim()) {
      return { isValid: false, error: 'Name is required' };
    }
    if (!member.surname.trim()) {
      return { isValid: false, error: 'Surname is required' };
    }
    return { isValid: true };
  }, []);

  /**
   * Format family member display name
   */
  const formatFamilyMemberName = useCallback((member: { name: string; surname: string }): string => {
    return `${member.name} ${member.surname}`.trim();
  }, []);

  /**
   * Get family member type display name
   */
  const getFamilyMemberTypeDisplay = useCallback((type: string, t: (key: string) => string): string => {
    const typeMap: { [key: string]: string } = {
      'child': t('profile.family.types.child'),
      'spouse': t('profile.family.types.spouse'),
      'parent': t('profile.family.types.parent'),
      'sibling': t('profile.family.types.sibling'),
      'other': t('profile.family.types.other'),
    };
    return typeMap[type] || type;
  }, []);

  /**
   * Check if phone is verified
   */
  const isPhoneVerified = useCallback((member: { phoneVerified?: boolean }): boolean => {
    return member.phoneVerified === true;
  }, []);

  /**
   * Get verification status text
   */
  const getVerificationStatusText = useCallback((isVerified: boolean, t: (key: string) => string): string => {
    return isVerified ? t('common.verified') : t('common.notVerified');
  }, []);

  /**
   * Get verification status color
   */
  const getVerificationStatusColor = useCallback((isVerified: boolean): string => {
    return isVerified ? '#4CAF50' : '#FF9800';
  }, []);

  /**
   * Filter family members by type
   */
  const filterFamilyMembersByType = useCallback((members: any[], type: string): any[] => {
    return members.filter(member => member.type === type);
  }, []);

  /**
   * Sort family members by name
   */
  const sortFamilyMembersByName = useCallback((members: any[]): any[] => {
    return [...members].sort((a, b) => {
      const nameA = `${a.name} ${a.surname}`.toLowerCase();
      const nameB = `${b.name} ${b.surname}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, []);

  /**
   * Get family member statistics
   */
  const getFamilyMemberStats = useCallback((members: any[]): { total: number; verified: number; byType: { [key: string]: number } } => {
    const stats = {
      total: members.length,
      verified: members.filter(m => m.phoneVerified).length,
      byType: {} as { [key: string]: number }
    };

    members.forEach(member => {
      stats.byType[member.type] = (stats.byType[member.type] || 0) + 1;
    });

    return stats;
  }, []);

  return {
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
  };
};
