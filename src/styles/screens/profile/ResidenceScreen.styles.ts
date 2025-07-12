import { StyleSheet } from 'react-native';

export const ResidenceScreenStyles = StyleSheet.create({
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  description: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  addressItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#888',
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  defaultBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
}); 