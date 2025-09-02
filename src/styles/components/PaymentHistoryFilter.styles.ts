import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const PaymentHistoryFilterStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    width: '100%',
  },
  animatedModalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 12,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionContainerSelected: {
    backgroundColor: colors.light.primary + '20',
  },
  optionContainerUnselected: {
    backgroundColor: 'transparent',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.light.primary,
  },
  optionTextUnselected: {
    color: colors.light.text,
  },
  checkmark: {
    marginLeft: 'auto',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.light.primary,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.background,
  },
});

export const getPaymentHistoryFilterStyles = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;
  
  return StyleSheet.create({
    modalContainer: {
      backgroundColor: currentColors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '80%',
      width: '100%',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: currentColors.text,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: 12,
    },
    optionContainerSelected: {
      backgroundColor: currentColors.primary + '20',
    },
    optionTextSelected: {
      color: currentColors.primary,
    },
    optionTextUnselected: {
      color: currentColors.text,
    },
    resetButton: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      backgroundColor: currentColors.background,
      borderWidth: 1,
      borderColor: currentColors.border,
      alignItems: 'center',
    },
    applyButton: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      backgroundColor: currentColors.primary,
      alignItems: 'center',
    },
    resetButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: currentColors.text,
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: currentColors.background,
    },
  });
}; 