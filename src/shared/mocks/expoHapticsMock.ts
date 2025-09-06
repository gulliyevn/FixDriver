export const notificationAsync = jest.fn((type: string) => Promise.resolve());
export const impactAsync = jest.fn((style: string) => Promise.resolve());
export const selectionAsync = jest.fn(() => Promise.resolve()); 