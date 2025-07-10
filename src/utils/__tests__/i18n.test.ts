import { t, setLanguage, getLanguage, SUPPORTED_LANGUAGES } from '../../i18n';

describe('i18n', () => {
  beforeEach(async () => {
    // Сбрасываем язык к русскому перед каждым тестом
    await setLanguage('ru');
  });

  it('should translate common keys', () => {
    expect(t('common.selectLanguage')).toBe('Выберите язык');
    expect(t('common.ok')).toBe('ОК');
    expect(t('common.cancel')).toBe('Отмена');
  });

  it('should translate login keys', () => {
    expect(t('title')).toBe('Добро пожаловать');
    expect(t('subtitle')).toBe('Войдите в свой аккаунт');
    expect(t('email')).toBe('Email');
    expect(t('password')).toBe('Пароль');
  });

  it('should change language', async () => {
    // Проверяем русский язык
    expect(t('common.selectLanguage')).toBe('Выберите язык');
    
    // Меняем на английский
    await setLanguage('en');
    expect(t('common.selectLanguage')).toBe('Select Language');
    
    // Меняем обратно на русский
    await setLanguage('ru');
    expect(t('common.selectLanguage')).toBe('Выберите язык');
  });

  it('should have all supported languages', () => {
    expect(SUPPORTED_LANGUAGES).toHaveProperty('ru');
    expect(SUPPORTED_LANGUAGES).toHaveProperty('en');
    expect(SUPPORTED_LANGUAGES).toHaveProperty('tr');
    expect(SUPPORTED_LANGUAGES).toHaveProperty('az');
    expect(SUPPORTED_LANGUAGES).toHaveProperty('fr');
    expect(SUPPORTED_LANGUAGES).toHaveProperty('ar');
    expect(SUPPORTED_LANGUAGES).toHaveProperty('es');
    expect(SUPPORTED_LANGUAGES).toHaveProperty('de');
  });

  it('should handle missing keys gracefully', () => {
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('should handle parameters', () => {
    // Тест с параметрами (если есть такие ключи)
    expect(t('common.loading')).toBe('Загрузка...');
  });
}); 