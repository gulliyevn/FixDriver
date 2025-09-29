import { StyleSheet } from 'react-native';
// ThemeColors not exported; use inferred structure via any

export const createDatePickerModalStyles = (isDark: boolean, colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    backgroundColor: isDark ? (colors.surface || '#1E293B') : '#FFFFFF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  okWrap: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  okText: {
    color: colors.onPrimary || '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  pickerContainer: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: isDark ? (colors.surface || '#1E293B') : '#FFFFFF',
  },
});


