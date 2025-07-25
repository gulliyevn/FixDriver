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

export interface FamilyMemberItemProps {
  member: FamilyMember;
  isExpanded: boolean;
  isEditing: boolean;
  phoneVerified: boolean;
  isVerifyingPhone: boolean;
  onToggle: () => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSave: (updatedData: Partial<FamilyMember>) => void;
  onDelete: () => void;
  onVerifyPhone: () => void;
  onResetPhoneVerification: () => void;
} 