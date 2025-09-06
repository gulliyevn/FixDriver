export const digestStringAsync = jest.fn((algorithm: string, data: string) => {
  return Promise.resolve('mock-hash-' + data);
});

export const getRandomString = jest.fn((length: number) => {
  return 'mock-random-string-' + length;
});

export const getRandomBytes = jest.fn((length: number) => {
  return new Uint8Array(length).fill(1);
}); 