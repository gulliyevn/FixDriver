export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  canGoBack: jest.fn(() => true),
  canGoForward: jest.fn(() => false),
}));

export const useLocalSearchParams = jest.fn(() => ({}));

export const useGlobalSearchParams = jest.fn(() => ({}));

export const useSegments = jest.fn(() => []);

export const useRootNavigationState = jest.fn(() => ({
  key: 'mock-key',
  index: 0,
  routeNames: ['index'],
  type: 'stack',
})); 