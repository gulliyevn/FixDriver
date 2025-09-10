import { useCallback } from 'react';
import { Alert } from 'react-native';
import { familyOperations, FamilyMember, NewFamilyMember } from '../../../domain/usecases/family/familyOperations';
import { useI18n } from '../useI18n';

interface UseFamilyMembersActionsProps {
  clientId: string;
  familyMembers: FamilyMember[];
  setFamilyMembers: (members: FamilyMember[]) => void;
  setLoading: (loading: boolean) => void;
  setEditingFamilyMember: (id: string | null) => void;
  setExpandedFamilyMember: (id: string | null) => void;
  setFamilyPhoneVerification: (verification: {[key: string]: boolean}) => void;
  setFamilyPhoneVerifying: (verifying: {[key: string]: boolean}) => void;
  closeAddFamilyModal: () => void;
}

/**
 * Hook for family members actions
 */
export const useFamilyMembersActions = ({
  clientId,
  familyMembers,
  setFamilyMembers,
  setLoading,
  setEditingFamilyMember,
  setExpandedFamilyMember,
  setFamilyPhoneVerification,
  setFamilyPhoneVerifying,
  closeAddFamilyModal,
}: UseFamilyMembersActionsProps) => {
  const { t } = useI18n();

  /**
   * Load family members from storage
   */
  const loadFamilyMembers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const savedMembers = await familyOperations.loadFamilyMembers();
      
      if (savedMembers.length > 0) {
        setFamilyMembers(savedMembers);
      } else {
        // If no saved data, set initial values
        const initialMembers = familyOperations.createInitialFamilyMembers(t);
        setFamilyMembers(initialMembers);
        await familyOperations.saveFamilyMembers(initialMembers);
      }
    } catch (error) {
      console.error('Error loading family members:', error);
    } finally {
      setLoading(false);
    }
  }, [setFamilyMembers, setLoading, t]);

  /**
   * Save family members to storage and mock DB
   */
  const saveFamilyMembers = useCallback(async (members: FamilyMember[]): Promise<void> => {
    try {
      // Save to AsyncStorage
      await familyOperations.saveFamilyMembers(members);
      
      // Sync with mock DB
      members.forEach(member => {
        const { id, ...memberData } = member;
        const updated = familyOperations.updateInMockDB(clientId, id, memberData);
        if (!updated) {
          familyOperations.addToMockDB(clientId, memberData);
        }
      });
    } catch (error) {
      console.error('Error saving family members:', error);
    }
  }, [clientId]);

  /**
   * Add new family member
   */
  const addFamilyMember = useCallback((newMember: NewFamilyMember): void => {
    // Check that required fields are filled
    if (!newMember.name.trim() || !newMember.surname.trim()) {
      Alert.alert(t('common.error'), t('profile.family.fillNameSurname'));
      return;
    }

    // Create new family member
    const familyMember = familyOperations.createFamilyMember(newMember);

    // Add to list and save
    const updatedMembers = [...familyMembers, familyMember];
    setFamilyMembers(updatedMembers);
    saveFamilyMembers(updatedMembers);
    
    // Also add to mock DB directly
    const { id, ...memberData } = familyMember;
    console.log('useFamilyMembers - adding to mock DB:', { clientId, memberData });
    familyOperations.addToMockDB(clientId, memberData);
    
    // Close modal
    closeAddFamilyModal();
    
    Alert.alert(
      t('common.success'),
      t('profile.family.addMemberSuccess'),
      [{ text: t('common.ok') }]
    );
  }, [familyMembers, setFamilyMembers, saveFamilyMembers, clientId, closeAddFamilyModal, t]);

  /**
   * Save family member changes
   */
  const saveFamilyMember = useCallback((memberId: string, updatedData: Partial<FamilyMember>): void => {
    const updatedMembers = familyMembers.map(member => 
      member.id === memberId ? { 
        ...member, 
        ...updatedData,
        // Reset phone verification if number changed
        phoneVerified: updatedData.phone !== member.phone ? false : member.phoneVerified
      } : member
    );
    setFamilyMembers(updatedMembers);
    saveFamilyMembers(updatedMembers);
    
    // Also update in mock DB
    const member = updatedMembers.find(m => m.id === memberId);
    if (member) {
      const { id, ...memberData } = member;
      familyOperations.updateInMockDB(clientId, id, memberData);
    }
    
    setEditingFamilyMember(null);
  }, [familyMembers, setFamilyMembers, saveFamilyMembers, clientId, setEditingFamilyMember]);

  /**
   * Delete family member
   */
  const deleteFamilyMember = useCallback((memberId: string): void => {
    const updatedMembers = familyMembers.filter(member => member.id !== memberId);
    setFamilyMembers(updatedMembers);
    saveFamilyMembers(updatedMembers);
    
    // Also delete from mock DB
    familyOperations.deleteFromMockDB(clientId, memberId);
    
    setExpandedFamilyMember(null);
    setEditingFamilyMember(null);
  }, [familyMembers, setFamilyMembers, saveFamilyMembers, clientId, setExpandedFamilyMember, setEditingFamilyMember]);

  /**
   * Verify family phone
   */
  const verifyFamilyPhone = useCallback((memberId: string): void => {
    const member = familyMembers.find(m => m.id === memberId);
    if (!member || !member.phone) {
      Alert.alert(t('common.error'), t('profile.verificationModal.phoneNotSpecified'));
      return;
    }

    const codeSentTitle = t('profile.verifyPhone.success.title');
    const codeSentMessage = t('profile.verifyPhone.success.message');
    const cancelText = t('common.cancel');
    const verifyText = t('common.verify');
    const successTitle = t('common.success');
    const successMessage = t('profile.verifyPhone.phoneVerifiedSuccess');
    const errorTitle = t('profile.verifyPhone.error.title');
    const errorMessage = t('profile.verifyPhone.error.message');

    // First show "Code sent"
    Alert.alert(
      codeSentTitle,
      codeSentMessage,
      [
        { text: cancelText, style: 'cancel' },
        {
          text: verifyText,
          onPress: () => {
            // Then show code input field
            Alert.prompt(
              t('profile.verificationModal.enterCode'),
              t('profile.verificationModal.enterSmsCode'),
              [
                { text: cancelText, style: 'cancel' },
                {
                  text: verifyText,
                  onPress: async (code) => {
                    if (code === '1234') {
                      setFamilyPhoneVerifying(prev => ({ ...prev, [memberId]: true }));
                      setTimeout(() => {
                        setFamilyPhoneVerification(prev => ({ ...prev, [memberId]: true }));
                        setFamilyPhoneVerifying(prev => ({ ...prev, [memberId]: false }));
                        // Update status in family member data
                        const updatedMembers = familyMembers.map(member => 
                          member.id === memberId 
                            ? { ...member, phoneVerified: true }
                            : member
                        );
                        setFamilyMembers(updatedMembers);
                        saveFamilyMembers(updatedMembers);
                        Alert.alert(successTitle, successMessage);
                      }, 1000);
                    } else {
                      Alert.alert(errorTitle, errorMessage);
                    }
                  }
                }
              ],
              'plain-text'
            );
          }
        }
      ]
    );
  }, [familyMembers, setFamilyMembers, saveFamilyMembers, setFamilyPhoneVerification, setFamilyPhoneVerifying, t]);

  return {
    loadFamilyMembers,
    saveFamilyMembers,
    addFamilyMember,
    saveFamilyMember,
    deleteFamilyMember,
    verifyFamilyPhone,
  };
};
