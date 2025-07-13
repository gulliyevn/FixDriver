import { StyleSheet } from 'react-native';

export const LanguageButtonStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  flag: {
    marginRight: 8,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  icon: {
    marginLeft: 4,
  },
}); 