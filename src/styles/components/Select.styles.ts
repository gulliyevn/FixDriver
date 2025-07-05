import { StyleSheet } from 'react-native';

export const SelectStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  picker: {
    fontSize: 16,
    color: '#111827',
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  select: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.84,
    elevation: 2,
  },
  selectText: {
    fontSize: 16,
    flex: 1,
  },
  required: {
    color: '#DC2626',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 80,
    zIndex: 3000,
    elevation: 3000,
  },
  dropdown: {
    width: '100%',
    height: '90%',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 3005,
    zIndex: 3001,
  },
  dropdownCompact: {
    height: 'auto',
    maxHeight: 300,
    borderRadius: 16,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.3)',
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
  },
  optionsList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  optionsListCompact: {
    flex: 0,
    paddingVertical: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  optionCompact: {
    paddingVertical: 18,
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionIconCompact: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
}); 