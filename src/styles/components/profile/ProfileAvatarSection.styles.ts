import { StyleSheet } from 'react-native';

export const ProfileAvatarSectionStyles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
    marginLeft: 0,
  },

  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    textAlign: 'left',
    marginTop: 0,
    marginHorizontal: 16,
    flex: 1,
    marginLeft: 0,
    marginRight: 50,
  },
  rightCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginRight: 20,
    position: 'absolute',
    right: 0,
  },
  profileNameBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 8,
    width: '100%',
    marginHorizontal: -20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  avatarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarModalBackground: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarModalContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
    maxHeight: '90%',
  },
  avatarModalImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  avatarModalCloseButton: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const getProfileAvatarSectionColors = (isDark: boolean) => {
  const colors = isDark ? {
    text: '#F9FAFB',
    primary: '#3B82F6',
    surface: '#1F2937',
    border: '#374151',
  } : {
    text: '#003366',
    primary: '#083198',
    surface: '#f8f9fa',
    border: '#e9ecef',
  };

  return {
    profileName: { color: colors.text },
    profileNameBox: { 
      backgroundColor: colors.surface,
      borderColor: colors.border 
    },
    rightCircle: { 
      backgroundColor: colors.border 
    },
  };
}; 