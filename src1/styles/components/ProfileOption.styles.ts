import { StyleSheet } from 'react-native';

export const ProfileOptionStyles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  iconWrap: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
  },
  value: {
    fontSize: 16,
    color: '#19c100',
    marginRight: 8,
    fontWeight: '600',
  },
  arrow: {
    marginLeft: 4,
    color: '#bbb',
  },
  logout: {
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  logoutText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '600',
  },
}); 