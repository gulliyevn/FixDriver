export const countryCodeToFlag = (code: string): string => {
  if (!code || code.length !== 2) return '🏳️';
  const base = 127397; // 0x1F1E6 - 'A'
  const chars = code.toUpperCase().split('');
  return String.fromCodePoint(base + chars[0].charCodeAt(0), base + chars[1].charCodeAt(0));
};


