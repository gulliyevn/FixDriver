import { StyleSheet } from 'react-native';

export const EditClientProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  // Секции
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 16,
  },
  // Аватар
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    textAlign: 'center',
    marginTop: 0,
    marginHorizontal: 16,
  },
  rightCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  arrowsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftArrow: {
    transform: [{ rotate: '180deg' }],
  },
  rightArrow: {
    transform: [{ rotate: '0deg' }],
  },
  profileNameBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 8,
    marginHorizontal: -20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#003366',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  // Поля ввода
  inputField: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 8,
    marginLeft: 10,
  },
  // Семейная информация
  familySection: {
    marginBottom: 24,
  },
  familyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
  },
  familyType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addFamilyButton: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addFamilyText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: '500',
  },
  // VIP статус
  vipSection: {
    marginBottom: 24,
  },
  vipCard: {
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  vipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF8F00',
    marginBottom: 8,
  },
  vipDescription: {
    fontSize: 14,
    color: '#FF8F00',
    marginBottom: 12,
  },
  vipButton: {
    backgroundColor: '#FF8F00',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  vipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Кнопка стать водителем
  becomeDriverSection: {
    marginBottom: 24,
  },
  becomeDriverButton: {
    backgroundColor: '#003366',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  becomeDriverText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Кнопка сохранения
  saveButton: {
    backgroundColor: '#003366',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export const getEditClientProfileScreenColors = (isDark: boolean) => {
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
    backButton: { color: colors.primary },
    sectionTitle: { color: colors.text },
    inputField: { 
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text 
    },
    inputLabel: { color: colors.text },
    familyItem: { backgroundColor: colors.surface },
    familyName: { color: colors.text },
    familyType: { color: colors.textSecondary },
    addFamilyButton: { backgroundColor: colors.surface },
    addFamilyText: { color: colors.text },
    addPhotoButton: { 
      backgroundColor: colors.background,
      borderColor: colors.primary 
    },
    profileName: { color: colors.text },
    profileNameBox: { 
      backgroundColor: colors.surface,
      borderColor: colors.border 
    },
    rightCircle: { 
      backgroundColor: colors.border 
    },
  };
}; 