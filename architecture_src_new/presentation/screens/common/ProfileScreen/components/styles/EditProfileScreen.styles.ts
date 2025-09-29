import { StyleSheet } from 'react-native';
import { colors } from '../../../../../../shared/constants/colors';

export const EditProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  verifyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  verifyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export const getEditProfileScreenColors = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;
  
  return {
    container: {
      backgroundColor: currentColors.background,
    },
    header: {
      backgroundColor: currentColors.surface,
      borderBottomColor: currentColors.border,
    },
    title: {
      color: currentColors.text,
    },
    section: {
      backgroundColor: currentColors.surface,
      borderColor: currentColors.border,
    },
    sectionTitle: {
      color: currentColors.text,
    },
    inputLabel: {
      color: currentColors.text,
    },
    input: {
      backgroundColor: currentColors.background,
      borderColor: currentColors.border,
      color: currentColors.text,
    },
    verifyButton: {
      backgroundColor: currentColors.background,
      borderColor: currentColors.primary,
    },
    verifyButtonText: {
      color: currentColors.primary,
    },
    saveButton: {
      backgroundColor: currentColors.primary,
    },
    saveButtonText: {
      color: '#fff',
    },
    infoText: {
      color: currentColors.textSecondary,
    },
    addButton: {
      backgroundColor: currentColors.background,
      borderColor: currentColors.primary,
    },
    addButtonText: {
      color: currentColors.primary,
    },
  };
};
