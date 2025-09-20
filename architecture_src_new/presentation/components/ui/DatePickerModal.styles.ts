import { StyleSheet } from 'react-native';

export const createDatePickerModalStyles = (isDark: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
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
    color: isDark ? '#F8FAFC' : '#1F2937',
  },
  okWrap: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: isDark ? '#3B82F6' : '#2563EB',
  },
  okText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});


