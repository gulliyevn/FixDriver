import { StyleSheet } from 'react-native';

export const SocialAuthButtonsStyles = StyleSheet.create({
  container: {
    gap: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  googleText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  facebookText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  appleText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 