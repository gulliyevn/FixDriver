import { StyleSheet } from 'react-native';

export const PhotoUploadStyles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  requiredStar: {
    color: '#DC2626',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#23408E',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: 'rgba(35, 64, 142, 0.05)',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#23408E',
    fontWeight: '500',
  },
  photoPreview: {
    marginTop: 12,
    alignItems: 'center',
  },
  photoPreviewImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoPreviewText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
}); 