/**
 * Family domain types
 */

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

/**
 * Props for family member UI item component.
 */
export interface FamilyMemberItemProps {
  member: FamilyMember;
  isExpanded: boolean;
  isEditing: boolean;
  phoneVerified: boolean;
  onToggle: () => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSave: (updatedData: Partial<FamilyMember>) => void;
  onDelete: () => void;
  onResetPhoneVerification: () => void;
  onVerifyPhone?: () => void;
  saveRef?: React.RefObject<(() => void) | null>;
} 