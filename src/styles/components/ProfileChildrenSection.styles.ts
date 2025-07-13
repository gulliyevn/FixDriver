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
}); 