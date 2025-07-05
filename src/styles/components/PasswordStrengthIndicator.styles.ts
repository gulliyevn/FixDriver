import { StyleSheet } from 'react-native';

export const PasswordStrengthIndicatorStyles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  strengthInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  feedbackContainer: {
    marginTop: 8,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
}); 