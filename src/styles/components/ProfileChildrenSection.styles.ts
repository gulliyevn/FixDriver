import { StyleSheet } from 'react-native';

export const ProfileChildrenSectionStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  childInfo: {
    flex: 1,
    marginLeft: 12,
  },
  childName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 14,
  },
  chevronIcon: {
    // Стили для иконки chevron-forward
  },
  addIcon: {
    // Стили для иконки add-circle
  },
  // Стили для темной темы
  cardDark: {
    backgroundColor: '#1F2937',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  titleLight: {
    color: '#1F2937',
  },
  childItemDark: {
    borderBottomColor: '#374151',
  },
  childItemLight: {
    borderBottomColor: '#F3F4F6',
  },
  childNameDark: {
    color: '#F9FAFB',
  },
  childNameLight: {
    color: '#1F2937',
  },
  childDetailsDark: {
    color: '#9CA3AF',
  },
  childDetailsLight: {
    color: '#6B7280',
  },
}); 