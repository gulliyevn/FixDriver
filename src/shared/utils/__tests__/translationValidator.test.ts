import { TranslationValidator } from '../translationValidator';

describe('TranslationValidator', () => {
  describe('checkKey', () => {
    it('should check if a key exists in all languages', () => {
      const result = TranslationValidator.checkKey('login.title');
      
      expect(result).toHaveProperty('ru');
      expect(result).toHaveProperty('en');
      expect(result).toHaveProperty('tr');
      expect(result).toHaveProperty('az');
      expect(result).toHaveProperty('fr');
      expect(result).toHaveProperty('ar');
      expect(result).toHaveProperty('es');
      expect(result).toHaveProperty('de');
    });

    it('should return true for existing keys', () => {
      const result = TranslationValidator.checkKey('login.title');
      
      // Проверяем, что ключ существует хотя бы в русском языке
      expect(result.ru).toBe(true);
    });
  });

  describe('getTranslationStats', () => {
    it('should return translation statistics for all languages', () => {
      const stats = TranslationValidator.getTranslationStats();
      
      expect(stats).toHaveProperty('ru');
      expect(stats).toHaveProperty('en');
      expect(stats).toHaveProperty('tr');
      expect(stats).toHaveProperty('az');
      expect(stats).toHaveProperty('fr');
      expect(stats).toHaveProperty('ar');
      expect(stats).toHaveProperty('es');
      expect(stats).toHaveProperty('de');
      
      // Проверяем, что количество ключей больше 0
      expect(stats.ru).toBeGreaterThan(0);
    });
  });

  describe('generateReport', () => {
    it('should generate a report string', () => {
      const report = TranslationValidator.generateReport();
      
      expect(typeof report).toBe('string');
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('validateTranslations', () => {
    it('should return an array of missing translations', () => {
      const missingTranslations = TranslationValidator.validateTranslations();
      
      expect(Array.isArray(missingTranslations)).toBe(true);
      
      // Если есть недостающие переводы, проверяем их структуру
      if (missingTranslations.length > 0) {
        const missing = missingTranslations[0];
        expect(missing).toHaveProperty('key');
        expect(missing).toHaveProperty('namespace');
        expect(missing).toHaveProperty('missingLanguages');
        expect(Array.isArray(missing.missingLanguages)).toBe(true);
      }
    });
  });
}); 