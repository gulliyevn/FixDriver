import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../../constants/colors';

export const BalanceScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45, // Устанавливаем отступ сверху
    paddingBottom: 6, // Отступ снизу
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  // Основной баланс
  balanceCard: {
    backgroundColor: '#003366',
    borderRadius: 16,
    padding: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  balanceCurrency: {
    color: '#fff',
    fontSize: 24,
    marginLeft: 6,
    fontWeight: '700',
    marginBottom: 14,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 12,
    marginTop: -4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 0,
  },
  withdrawButton: {
    backgroundColor: '#e53935',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Быстрое пополнение
  quickTopUp: {
    marginBottom: 24,
  },
  quickTopUpCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  quickTopUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  quickTopUpIcon: {
    marginRight: 8,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickAmountButtonLarge: {
    width: 90,
    height: 44,
    backgroundColor: '#003366',
    marginHorizontal: 8,
    marginBottom: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAmountTextLarge: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
  },
  // История операций
  transactionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  showAllText: {
    fontSize: 14,
    color: '#003366',
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  // Цвета для транзакций
  transactionAmountPayment: {
    color: '#e53935',
  },
  transactionAmountTopUp: {
    color: '#4caf50',
  },
  transactionAmountRefund: {
    color: '#2196f3',
  },
  statusBadgeCompleted: {
    backgroundColor: '#4caf50',
  },
  statusBadgePending: {
    backgroundColor: '#ff9800',
  },
  // Cashback система
  cashbackSection: {
    marginBottom: 24,
  },
  cashbackCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  cashbackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cashbackText: {
    marginLeft: 16,
    flex: 1,
  },
  cashbackAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4caf50',
    marginBottom: 4,
  },
  cashbackLabel: {
    fontSize: 14,
    color: '#888',
  },
  cashbackButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cashbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cashbackDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  balanceCardBorder: {
    borderWidth: 2,
    // borderColor будет задаваться динамически через dynamicStyles
  },
  // === Новые стили для вынесенных из TSX инлайн-стилей ===
  cardFrontButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardFrontButton2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardFrontBtnText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  cardBackBtnContainer: {
    position: 'absolute',
    right: -8,
    top: -8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayDark: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 20,
  },
  modalPayBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  modalPayBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalCancelBtn: {
    alignItems: 'center',
    marginTop: 4,
  },
  modalCancelBtnText: {
    fontSize: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBackTextCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 0,
  },
  cardNumberText: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#fff',
  },
  cardNumberContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -8 }],
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  copiedNotification: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  copiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copiedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardDetailsContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 24,
    gap: 5,
  },
  cardDetailsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    opacity: 0.8,
  },
  cardNameContainer: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    paddingLeft: 8,
  },
  cardNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
    letterSpacing: 1,
  },
  cvvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  cvvSticker: {
    position: 'absolute',
    left: -8,
    top: -2,
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#555',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  cvvStickerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

// === ДОБАВЛЕНО: Стили для анимированных и обычных View/Text из BalanceScreen.tsx ===

export const balanceCardAnimated: ViewStyle = {
  backfaceVisibility: 'hidden',
  position: 'absolute',
  width: '100%',
  height: 220,
  top: 0,
  left: 0,
  padding: 32,
};

export const balanceCardFrontRow: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const cashbackText: TextStyle = {
  color: '#fff',
  opacity: 0.7,
  fontSize: 16,
  marginTop: -2,
};

export const flipButton: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  height: 80,
};

export const balanceActionsMargin: ViewStyle = {
  marginTop: 8,
};

export const balanceCardBack: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  height: 180,
  paddingLeft: 24,
  paddingTop: 16,
};

export const cardBackRow: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'nowrap',
};

export const cardBackText: TextStyle = {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  marginRight: 16,
};

export const cardBackTextNormal: TextStyle = {
  color: '#fff',
  fontSize: 16,
  marginRight: 16,
};

export const cardBackTextLetter: TextStyle = {
  color: '#fff',
  fontSize: 24,
  fontWeight: '700',
  letterSpacing: 2,
};

export const cardBackTextLast: TextStyle = {
  color: '#fff',
  fontSize: 16,
};

export const sectionTitleCenter: TextStyle = {
  textAlign: 'center',
  marginBottom: 16,
};

// Функция для получения динамических стилей в зависимости от темы
export const getBalanceScreenStyles = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;
  
  return {
    container: {
      backgroundColor: currentColors.background,
    },
    header: {
      borderBottomColor: currentColors.border,
    },
    title: {
      color: currentColors.text,
    },
    sectionTitle: {
      color: currentColors.text,
    },
    quickAmountButton: {
      backgroundColor: currentColors.surface,
    },
    quickAmountText: {
      color: currentColors.text,
    },
    showAllText: {
      color: currentColors.primary,
    },
    transactionItem: {
      backgroundColor: currentColors.surface,
    },
    transactionIcon: {
      backgroundColor: currentColors.card,
    },
    transactionDescription: {
      color: currentColors.text,
    },
    transactionDate: {
      color: currentColors.textSecondary,
    },
    cashbackCard: {
      backgroundColor: currentColors.surface,
    },
    cashbackAmount: {
      color: currentColors.success,
    },
    cashbackLabel: {
      color: currentColors.textSecondary,
    },
    cashbackButton: {
      backgroundColor: currentColors.success,
    },
    cashbackDescription: {
      color: currentColors.textSecondary,
    },
    quickTopUpCard: {
      backgroundColor: currentColors.surface,
    },
    quickTopUpHeader: {
      justifyContent: 'center',
    },
    quickTopUpIcon: {},
    quickAmountsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 12,
    },
    quickAmountButtonLarge: {
      backgroundColor: currentColors.primary,
      width: 90,
      height: 44,
      marginHorizontal: 8,
      marginBottom: 12,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quickAmountTextLarge: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
    balanceCard: {
      height: 180,
    },
  };
}; 

// Функция для получения цветовых стилей в зависимости от темы
export const getBalanceScreenColors = (isDark: boolean) => {
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
    header: { 
      backgroundColor: colors.background,
      borderBottomColor: colors.border 
    },
    title: { color: colors.text },
    sectionTitle: { color: colors.text },
  };
}; 

export const cardWrapper: ViewStyle = {
  marginTop: 24,
};

export const cardContainer: ViewStyle = {
  position: 'relative',
  height: 220,
  overflow: 'visible',
  marginBottom: 40,
  width: '95%',
  alignSelf: 'flex-end',
  marginLeft: 'auto',
  left: 0,
}; 

export const cardContainerWithWidth: ViewStyle = {
  position: 'relative',
  height: 220,
  overflow: 'visible',
  marginBottom: 40,
  alignSelf: 'flex-end',
  marginLeft: 'auto',
  left: 0,
  paddingRight: 16,
}; 

export const animatedCardFront: ViewStyle = {
  position: 'absolute',
  width: '100%',
  backfaceVisibility: 'hidden',
};

export const animatedCardBack: ViewStyle = {
  position: 'absolute',
  width: '100%',
  backfaceVisibility: 'hidden',
};

export const cardSpacer: ViewStyle = {
  height: 180,
}; 

export const flipButtonBack: ViewStyle = {
  height: 40,
  width: 40,
  justifyContent: 'center',
  alignItems: 'center',
}; 

export const flipButtonFront: ViewStyle = {
  height: 80,
  justifyContent: 'center',
  alignItems: 'center',
};

  // === Новые стили для вынесенных из TSX инлайн-стилей ===
  // cardFrontButton: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderWidth: 2,
  //   borderRadius: 16,
  //   paddingVertical: 12,
  //   paddingHorizontal: 16,
  //   marginRight: 6,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.12,
  //   shadowRadius: 8,
  //   elevation: 4,
  // },
  // cardFrontButton2: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderWidth: 2,
  //   borderRadius: 16,
  //   paddingVertical: 12,
  //   paddingHorizontal: 16,
  //   marginLeft: 6,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.12,
  //   shadowRadius: 8,
  //   elevation: 4,
  // },
  // cardFrontBtnText: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   marginLeft: 8,
  // },
  // cardBackBtnContainer: {
  //   position: 'absolute',
  //   right: 16,
  //   top: '50%',
  //   transform: [{ translateY: -16 }],
  // },
  // modalOverlay: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0,0,0,0.4)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // modalOverlayDark: {
  //   backgroundColor: 'rgba(0,0,0,0.7)',
  // },
  // modalContainer: {
  //   borderRadius: 16,
  //   padding: 24,
  //   width: '85%',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 8 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 24,
  //   elevation: 16,
  // },
  // modalTitle: {
  //   fontSize: 20,
  //   fontWeight: '700',
  //   marginBottom: 16,
  // },
  // modalLabel: {
  //   fontSize: 16,
  //   marginBottom: 8,
  // },
  // modalInput: {
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   padding: 12,
  //   fontSize: 18,
  //   marginBottom: 20,
  // },
  // modalPayBtn: {
  //   borderRadius: 10,
  //   paddingVertical: 14,
  //   alignItems: 'center',
  //   marginBottom: 8,
  // },
  // modalPayBtnText: {
  //   color: '#fff',
  //   fontSize: 18,
  //   fontWeight: '600',
  // },
  // modalCancelBtn: {
  //   alignItems: 'center',
  //   marginTop: 4,
  // },
  // modalCancelBtnText: {
  //   fontSize: 16,
  // }, 