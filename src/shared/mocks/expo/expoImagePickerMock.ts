export const launchImageLibraryAsync = jest.fn(() => 
  Promise.resolve({ 
    canceled: false, 
    assets: [{ uri: 'mock-image-uri' }] 
  })
);

export const launchCameraAsync = jest.fn(() => 
  Promise.resolve({ 
    canceled: false, 
    assets: [{ uri: 'mock-camera-uri' }] 
  })
);

export const MediaTypeOptions = {
  All: 'All',
  Videos: 'Videos',
  Images: 'Images',
};

export const ImagePickerResult = {
  canceled: false,
  assets: [{ uri: 'mock-uri' }],
}; 