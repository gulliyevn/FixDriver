import {
  formatTime,
  formatDate,
  formatCurrency,
  formatPhone,
  formatDistance,
  formatDuration,
  capitalize,
  truncate,
  formatBalance,
  formatDateWithLanguage
} from '../formatters';

describe('Formatters', () => {
  describe('formatTime', () => {
    it('formats time correctly for different languages', () => {
      const testDate = new Date('2024-01-15T14:30:00');
      
      expect(formatTime(testDate, 'ru')).toBe('14:30');
      expect(formatTime(testDate, 'en')).toBe('14:30'); // en-US uses 24-hour format in our implementation
      expect(formatTime(testDate, 'de')).toBe('14:30');
      expect(formatTime(testDate, 'es')).toBe('14:30');
      expect(formatTime(testDate, 'fr')).toBe('14:30');
      expect(formatTime(testDate, 'tr')).toBe('14:30');
      expect(formatTime(testDate, 'ar')).toBe('١٤:٣٠'); // Arabic uses 24-hour format
      expect(formatTime(testDate, 'az')).toBe('14:30');
    });

    it('handles string dates', () => {
      const dateString = '2024-01-15T14:30:00';
      expect(formatTime(dateString, 'ru')).toBe('14:30');
    });

    it('uses default language when not specified', () => {
      const testDate = new Date('2024-01-15T14:30:00');
      expect(formatTime(testDate)).toBe('14:30');
    });

    it('handles unknown language', () => {
      const testDate = new Date('2024-01-15T14:30:00');
      expect(formatTime(testDate, 'unknown')).toBe('14:30'); // falls back to en-US which uses 24-hour format
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const testDate = new Date('2024-01-15');
      expect(formatDate(testDate)).toBe('01/15/2024');
    });

    it('handles string dates', () => {
      const dateString = '2024-01-15';
      expect(formatDate(dateString)).toBe('01/15/2024');
    });

    it('handles different date formats', () => {
      const testDate = new Date('2024-12-25');
      expect(formatDate(testDate)).toBe('12/25/2024');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
      expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000.00');
    });

    it('formats EUR currency correctly', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(0, 'EUR')).toBe('€0.00');
    });

    it('uses USD as default currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('handles negative amounts', () => {
      expect(formatCurrency(-1234.56, 'USD')).toBe('-$1,234.56');
    });

    it('handles large numbers', () => {
      expect(formatCurrency(999999999.99, 'USD')).toBe('$999,999,999.99');
    });
  });

  describe('formatPhone', () => {
    it('formats Russian phone numbers correctly', () => {
      expect(formatPhone('79991234567')).toBe('+7 (999) 123-45-67');
      expect(formatPhone('+79991234567')).toBe('+7 (999) 123-45-67');
    });

    it('formats US phone numbers correctly', () => {
      expect(formatPhone('12345678901')).toBe('+1 (234) 567-89-01');
    });

    it('returns original string for invalid formats', () => {
      expect(formatPhone('123')).toBe('123');
      expect(formatPhone('invalid')).toBe('invalid');
      expect(formatPhone('')).toBe('');
    });

    it('handles already formatted numbers', () => {
      expect(formatPhone('+7 (999) 123-45-67')).toBe('+7 (999) 123-45-67');
    });
  });

  describe('formatDistance', () => {
    it('formats distances in meters correctly', () => {
      expect(formatDistance(500)).toBe('500m');
      expect(formatDistance(999)).toBe('999m');
      expect(formatDistance(0)).toBe('0m');
    });

    it('formats distances in kilometers correctly', () => {
      expect(formatDistance(1000)).toBe('1.0km');
      expect(formatDistance(1500)).toBe('1.5km');
      expect(formatDistance(10000)).toBe('10.0km');
      expect(formatDistance(12345)).toBe('12.3km');
    });

    it('handles edge cases', () => {
      expect(formatDistance(999.9)).toBe('1000m'); // rounds up
      expect(formatDistance(1000.1)).toBe('1.0km');
    });
  });

  describe('formatDuration', () => {
    it('formats durations in minutes correctly', () => {
      expect(formatDuration(30)).toBe('30min');
      expect(formatDuration(59)).toBe('59min');
      expect(formatDuration(0)).toBe('0min');
    });

    it('formats durations in hours correctly', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(90)).toBe('1h 30min');
      expect(formatDuration(120)).toBe('2h');
      expect(formatDuration(150)).toBe('2h 30min');
    });

    it('handles edge cases', () => {
      expect(formatDuration(1440)).toBe('24h'); // 24 hours
      expect(formatDuration(1441)).toBe('24h 1min');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter correctly', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
      expect(capitalize('TEST')).toBe('Test');
      expect(capitalize('mIxEd')).toBe('Mixed');
    });

    it('handles edge cases', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize('a')).toBe('A');
      expect(capitalize('123')).toBe('123');
    });
  });

  describe('truncate', () => {
    it('truncates text correctly', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
      expect(truncate('Long text that needs truncation', 10)).toBe('Long text ...');
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('handles edge cases', () => {
      expect(truncate('', 5)).toBe('');
      expect(truncate('Hello', 0)).toBe('...');
      expect(truncate('Hello', 5)).toBe('Hello');
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('handles exact length matches', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
      expect(truncate('Hello World', 11)).toBe('Hello World');
    });
  });

  describe('formatBalance', () => {
    it('formats balance correctly', () => {
      expect(formatBalance(1234.56)).toBe('1234.56');
      expect(formatBalance(0)).toBe('0.00');
      expect(formatBalance(1000000)).toBe('1000000.00');
    });

    it('handles negative balances', () => {
      expect(formatBalance(-1234.56)).toBe('-1234.56');
    });

    it('handles decimal places correctly', () => {
      expect(formatBalance(1234.5)).toBe('1234.50');
      expect(formatBalance(1234.567)).toBe('1234.57'); // rounds up
    });
  });

  describe('formatDateWithLanguage', () => {
    it('formats date with short format', () => {
      const testDate = new Date('2024-01-15');
      
      expect(formatDateWithLanguage(testDate, 'ru', 'short')).toBe('15.01.2024');
      expect(formatDateWithLanguage(testDate, 'en', 'short')).toBe('01/15/2024');
      expect(formatDateWithLanguage(testDate, 'de', 'short')).toBe('15.01.2024');
      expect(formatDateWithLanguage(testDate, 'es', 'short')).toBe('15/01/2024');
      expect(formatDateWithLanguage(testDate, 'fr', 'short')).toBe('15/01/2024');
      expect(formatDateWithLanguage(testDate, 'tr', 'short')).toBe('15.01.2024');
      expect(formatDateWithLanguage(testDate, 'ar', 'short')).toBe('١٥‏/٠١‏/٢٠٢٤'); // Arabic with RTL marks
      expect(formatDateWithLanguage(testDate, 'az', 'short')).toBe('15.01.2024');
    });

    it('formats date with long format', () => {
      const testDate = new Date('2024-01-15');
      
      expect(formatDateWithLanguage(testDate, 'ru', 'long')).toContain('15 января 2024');
      expect(formatDateWithLanguage(testDate, 'en', 'long')).toContain('January 15, 2024');
      expect(formatDateWithLanguage(testDate, 'de', 'long')).toContain('15. Januar 2024');
      expect(formatDateWithLanguage(testDate, 'es', 'long')).toContain('15 de enero de 2024');
      expect(formatDateWithLanguage(testDate, 'fr', 'long')).toContain('15 janvier 2024');
      expect(formatDateWithLanguage(testDate, 'tr', 'long')).toContain('15 Ocak 2024');
      expect(formatDateWithLanguage(testDate, 'ar', 'long')).toContain('١٥ يناير ٢٠٢٤');
      expect(formatDateWithLanguage(testDate, 'az', 'long')).toContain('15 yanvar 2024');
    });

    it('uses short format as default', () => {
      const testDate = new Date('2024-01-15');
      expect(formatDateWithLanguage(testDate, 'ru')).toBe('15.01.2024');
    });

    it('handles string dates', () => {
      const dateString = '2024-01-15';
      expect(formatDateWithLanguage(dateString, 'ru')).toBe('15.01.2024');
    });

    it('handles unknown language', () => {
      const testDate = new Date('2024-01-15');
      expect(formatDateWithLanguage(testDate, 'unknown')).toBe('01/15/2024'); // falls back to en-US
    });
  });
}); 