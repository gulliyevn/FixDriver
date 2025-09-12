/**
 * BalanceScreen styles
 * Styling for Balance screen components
 */

import { StyleSheet } from 'react-native';

export const BalanceScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  
  // Balance Card Styles
  balanceContainer: {
    marginBottom: 24,
  },
  cardContainer: {
    alignItems: 'center',
  },
  balanceCard: {
    width: '100%',
    maxWidth: 340,
    height: 200,
    borderRadius: 16,
    padding: 20,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  balanceCardBorder: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Card Front Styles
  cardFrontContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 8,
  },
  balanceCurrency: {
    fontSize: 16,
  },
  balanceSubtext: {
    fontSize: 12,
  },
  flipButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  
  // Card Back Styles
  cardBackContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardBackHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardBackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardNumberText: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 2,
    marginRight: 8,
  },
  copyButton: {
    padding: 4,
  },
  cardDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardDetailsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cvvContainer: {
    position: 'relative',
  },
  cvvSticker: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cvvStickerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardNameContainer: {
    alignItems: 'center',
  },
  cardNameText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
  },
  copiedNotification: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  copiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copiedText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  
  // Card Decoration Styles
  cardFrontDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  cardFrontPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  cardFrontAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  cardBackDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  cardBackPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  cardBackAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  
  // Actions Styles
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  topUpButton: {
    // Styled via backgroundColor prop
  },
  withdrawButton: {
    // Styled via backgroundColor prop
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalPayBtn: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalPayBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancelBtn: {
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 16,
  },
  
  // Quick Amount Styles
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  quickAmountButton: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // History Styles
  historyContainer: {
    marginBottom: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  historyViewAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyItemInfo: {
    flex: 1,
  },
  historyItemDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyItemDate: {
    fontSize: 12,
  },
  historyItemAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
