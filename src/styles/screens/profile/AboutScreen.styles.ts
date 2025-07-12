import { StyleSheet } from 'react-native';

export const AboutScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
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
  appInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  linksSection: {
    marginBottom: 24,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
    marginLeft: 12,
    flex: 1,
  },
}); 