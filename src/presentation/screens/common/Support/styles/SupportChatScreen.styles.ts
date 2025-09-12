import { StyleSheet } from 'react-native';
import { adaptiveColors, adaptiveSizes } from '../../../../../../shared/constants/adaptiveConstants';

/**
 * Support Chat Screen Styles
 * 
 * Centralized styles for support chat screen components
 * Uses adaptive constants for consistent theming
 */

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: '#1F2937',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: adaptiveColors.border,
  },
  headerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: adaptiveSizes.spacing.sm,
    marginRight: adaptiveSizes.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: adaptiveSizes.font.lg,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerTitleDark: {
    color: '#F9FAFB',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: adaptiveSizes.spacing.xs,
  },
  statusText: {
    fontSize: adaptiveSizes.font.sm,
    color: adaptiveColors.textSecondary,
  },
  statusTextDark: {
    color: '#9CA3AF',
  },
  closeButton: {
    padding: adaptiveSizes.spacing.sm,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: adaptiveSizes.spacing.md,
  },
  messageContainer: {
    marginVertical: adaptiveSizes.spacing.sm,
    paddingHorizontal: adaptiveSizes.spacing.lg,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  supportMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: adaptiveSizes.borderRadius.lg,
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.md,
    shadowColor: adaptiveColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: adaptiveColors.primary,
  },
  userBubbleDark: {
    backgroundColor: '#3B82F6',
  },
  supportBubble: {
    backgroundColor: adaptiveColors.background,
    borderWidth: 1,
    borderColor: adaptiveColors.border,
  },
  supportBubbleDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: adaptiveSizes.spacing.xs,
  },
  supportName: {
    fontSize: adaptiveSizes.font.sm,
    fontWeight: '600',
    color: '#003366',
    marginLeft: adaptiveSizes.spacing.xs,
  },
  messageText: {
    fontSize: adaptiveSizes.font.md,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  supportMessageText: {
    color: adaptiveColors.text,
  },
  supportMessageTextDark: {
    color: '#F9FAFB',
  },
  attachmentsContainer: {
    marginTop: adaptiveSizes.spacing.sm,
  },
  attachmentItem: {
    marginBottom: adaptiveSizes.spacing.xs,
  },
  imageAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentName: {
    fontSize: adaptiveSizes.font.sm,
    marginLeft: adaptiveSizes.spacing.sm,
    color: adaptiveColors.textSecondary,
  },
  attachmentNameDark: {
    color: '#9CA3AF',
  },
  messageTime: {
    fontSize: adaptiveSizes.font.xs,
    marginTop: adaptiveSizes.spacing.xs,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  supportMessageTime: {
    color: adaptiveColors.textSecondary,
  },
  supportMessageTimeDark: {
    color: '#9CA3AF',
  },
  quickQuestionsContainer: {
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.md,
  },
  quickQuestionsTitle: {
    fontSize: adaptiveSizes.font.lg,
    fontWeight: '600',
    marginBottom: adaptiveSizes.spacing.md,
    color: adaptiveColors.text,
  },
  quickQuestionsTitleDark: {
    color: '#F9FAFB',
  },
  quickQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: adaptiveSizes.spacing.md,
    paddingHorizontal: adaptiveSizes.spacing.lg,
    backgroundColor: adaptiveColors.background,
    borderRadius: adaptiveSizes.borderRadius.lg,
    borderWidth: 1,
    borderColor: adaptiveColors.border,
    marginBottom: adaptiveSizes.spacing.sm,
  },
  quickQuestionButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  quickQuestionText: {
    flex: 1,
    fontSize: adaptiveSizes.font.md,
    color: adaptiveColors.text,
  },
  quickQuestionTextDark: {
    color: '#F9FAFB',
  },
  attachedFilesPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.sm,
    backgroundColor: adaptiveColors.background,
    borderTopWidth: 1,
    borderTopColor: adaptiveColors.border,
  },
  attachedFilesPreviewDark: {
    backgroundColor: '#374151',
    borderTopColor: '#4B5563',
  },
  attachedFilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: adaptiveColors.surface,
    borderRadius: adaptiveSizes.borderRadius.md,
    paddingHorizontal: adaptiveSizes.spacing.sm,
    paddingVertical: adaptiveSizes.spacing.xs,
    marginRight: adaptiveSizes.spacing.sm,
    marginBottom: adaptiveSizes.spacing.xs,
    borderWidth: 1,
    borderColor: adaptiveColors.border,
  },
  attachedFilePreviewDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
  },
  attachedFilePreviewName: {
    fontSize: adaptiveSizes.font.sm,
    marginLeft: adaptiveSizes.spacing.xs,
    marginRight: adaptiveSizes.spacing.xs,
    color: adaptiveColors.text,
    maxWidth: 100,
  },
  attachedFilePreviewNameDark: {
    color: '#F9FAFB',
  },
  removeFileButton: {
    padding: adaptiveSizes.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.md,
    backgroundColor: adaptiveColors.background,
    borderTopWidth: 1,
    borderTopColor: adaptiveColors.border,
  },
  inputContainerDark: {
    backgroundColor: '#374151',
    borderTopColor: '#4B5563',
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: adaptiveColors.surface,
    borderWidth: 1,
    borderColor: adaptiveColors.border,
    marginRight: adaptiveSizes.spacing.sm,
  },
  attachButtonDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
  },
  textInput: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.md,
    fontSize: adaptiveSizes.font.md,
    maxHeight: 120,
    minHeight: 44,
    borderWidth: 1,
    borderColor: adaptiveColors.border,
    backgroundColor: adaptiveColors.surface,
    color: adaptiveColors.text,
  },
  textInputDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
    color: '#F9FAFB',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: adaptiveColors.primary,
    marginLeft: adaptiveSizes.spacing.sm,
    shadowColor: adaptiveColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDark: {
    backgroundColor: '#3B82F6',
  },
  sendButtonDisabled: {
    backgroundColor: adaptiveColors.border,
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: adaptiveSizes.font.lg,
    color: adaptiveColors.text,
  },
  loadingTextDark: {
    color: '#F9FAFB',
  },
});
