import { StyleSheet } from 'react-native';

export const ClientProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    color: '#fff',
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003366',
  },
  profilePhone: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 1,
  },
  bell: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#e53935',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  bellBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  bellIcon: {
    color: '#003366',
  },
  statsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginTop: 16,
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#e5e5e5',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  menuItemFirst: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  menuIcon: {
    width: 32,
    marginRight: 12,
  },
  balanceIcon: {
    color: '#001a44',
  },
  menuIconDefault: {
    color: '#003366',
  },
  chevronIcon: {
    color: '#bbb',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#003366',
  },
  menuValue: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '700',
    marginRight: 8,
  },
  menuLabelAbout: {
    flex: 1,
    fontSize: 16,
    color: '#003366',
    marginRight: 24,
  },
  menuVersion: {
    fontSize: 15,
    color: '#888',
    marginRight: 8,
    marginLeft: 0,
  },
  logout: {
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  logoutText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '600',
  },
}); 