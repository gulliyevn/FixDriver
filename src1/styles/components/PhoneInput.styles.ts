import { StyleSheet } from 'react-native';

export const PhoneInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
    margin: 0,
  },
  countryCode: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  required: {
    color: '#DC2626',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  validationIcon: {
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  modalHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    borderRadius: 16,
  },
  countriesList: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 3,
    borderRadius: 14,
    borderBottomWidth: 0,
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedIndicator: {
    marginLeft: 'auto',
  },
}); 