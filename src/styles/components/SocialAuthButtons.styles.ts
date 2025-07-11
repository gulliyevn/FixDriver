import { StyleSheet } from 'react-native';

export const SocialAuthButtonsStyles = StyleSheet.create({
  container: {
    gap: 12,
  },
  googleButton: {
    backgroundColor: '#F5F5F5', // фирменный светлый фон Google
    borderRadius: 8,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 0,
    padding: 0,
  },
  googleText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  facebookButton: {
    backgroundColor: '#1877F3', // фирменный синий фон Facebook
    borderRadius: 8,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    padding: 0,
  },
  facebookText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  appleButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    padding: 0,
  },
  appleText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 