import { StyleSheet } from 'react-native';

/**
 * Edit Profile Screen Styles
 * 
 * Unified styles for both client and driver profile editing
 * Based on existing styles from shared/styles/
 */

export const EditProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#003366',
  },
  editButton: {
    padding: 8,
  },
  
  // Avatar section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  roleSwitchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    marginBottom: 8,
  },
  roleSwitchText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Form fields
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#003366',
  },
  inputDisabled: {
    backgroundColor: '#f9f9f9',
    opacity: 0.6,
  },
  inputWithAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithActionInput: {
    flex: 1,
    marginRight: 8,
  },
  verificationButton: {
    padding: 8,
  },
  
  // Empty states
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Family member cards
  familyMemberCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 8,
  },
  familyMemberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  familyMemberInfo: {
    flex: 1,
  },
  familyMemberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
  },
  familyMemberPhone: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  familyMemberActions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  editButton: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  deleteButtonText: {
    color: '#EF4444',
  },
  
  // Vehicle cards
  vehicleCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 12,
    marginBottom: 8,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
  },
  vehicleDetails: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  vehicleMileage: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  vehicleStatus: {
    alignItems: 'flex-end',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
  },
  pendingBadge: {
    backgroundColor: '#FFFBEB',
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedText: {
    color: '#10B981',
  },
  pendingText: {
    color: '#F59E0B',
  },
  
  // VIP section
  vipCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 16,
  },
  vipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vipInfo: {
    flex: 1,
  },
  vipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
  },
  vipSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#003366',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Swipe actions (for vehicles)
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 16,
  },
  swipeActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  swipeActionInnerLeft: {
    marginRight: 4,
  },
  swipeActionInnerRight: {
    marginLeft: 4,
  },
  swipeAction: {
    width: 100,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 12,
  },
  swipeActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  favoriteAction: {
    backgroundColor: '#F59E0B',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
  },
});

export const getEditProfileScreenColors = (isDark: boolean) => {
  const colors = isDark ? {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6',
    border: '#374151',
    card: '#1F2937',
    danger: '#F87171',
  } : {
    background: '#ffffff',
    surface: '#f9f9f9',
    text: '#003366',
    textSecondary: '#666666',
    primary: '#083198',
    border: '#f0f0f0',
    card: '#ffffff',
    danger: '#e53935',
  };

  return {
    container: { backgroundColor: colors.background },
    sectionTitle: { color: colors.text },
    input: { 
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text 
    },
    label: { color: colors.text },
    addButton: { backgroundColor: colors.primary },
  };
};
