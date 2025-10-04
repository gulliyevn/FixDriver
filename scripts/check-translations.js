#!/usr/bin/env node

/**
 * Скрипт для проверки полноты переводов
 * Запуск: node scripts/check-translations.js
 */

const { TranslationValidator } = require('./translationValidator.js');

console.log('🔍 Проверка полноты переводов...\n');

try {
  // Генерируем отчет
  const report = TranslationValidator.generateReport();
  console.log(report);
  
  // Получаем статистику
  const stats = TranslationValidator.getTranslationStats();
  console.log('\n📊 Статистика переводов:');
  console.log('─'.repeat(50));
  
  Object.entries(stats).forEach(([language, count]) => {
    const flag = getLanguageFlag(language);
    console.log(`${flag} ${language.toUpperCase()}: ${count} ключей`);
  });
  
  // Проверяем конкретные ключи
  console.log('\n🔑 Проверка ключевых переводов:');
  console.log('─'.repeat(50));
  
  const keyChecks = [
    'login.title',
    'login.subtitle',
    'login.emailPlaceholder',
    'login.passwordPlaceholder',
    'login.forgotPassword',
    'login.loginButton',
    'login.noAccount',
    'login.registerLink',
    'common.ok',
    'common.cancel',
    'common.loading',
    'common.error'
  ];
  
  keyChecks.forEach(key => {
    const result = TranslationValidator.checkKey(key);
    const missingLanguages = Object.entries(result)
      .filter(([, exists]) => !exists)
      .map(([lang]) => lang);
    
    if (missingLanguages.length === 0) {
      console.log(`✅ ${key}: все языки`);
    } else {
      console.log(`❌ ${key}: отсутствует в ${missingLanguages.join(', ')}`);
    }
  });
  
  // Проверяем общие проблемы
  console.log('\n🔧 Рекомендации:');
  console.log('─'.repeat(50));
  
  const missingTranslations = TranslationValidator.validateTranslations();
  
  if (missingTranslations.length === 0) {
    console.log('✅ Все переводы полные!');
  } else {
    console.log(`⚠️  Найдено ${missingTranslations.length} недостающих переводов`);
    console.log('💡 Рекомендуется добавить недостающие переводы');
    
    // Группируем по языкам
    const missingByLanguage = {};
    missingTranslations.forEach(missing => {
      missing.missingLanguages.forEach(lang => {
        if (!missingByLanguage[lang]) {
          missingByLanguage[lang] = [];
        }
        missingByLanguage[lang].push(missing.key);
      });
    });
    
    console.log('\n📋 По языкам:');
    Object.entries(missingByLanguage).forEach(([lang, keys]) => {
      const flag = getLanguageFlag(lang);
      console.log(`${flag} ${lang.toUpperCase()}: ${keys.length} ключей`);
    });
  }
  
} catch (error) {
  console.error('❌ Ошибка при проверке переводов:', error);
  process.exit(1);
}

function getLanguageFlag(language) {
  const flags = {
    ru: '🇷🇺',
    en: '🇺🇸',
    tr: '🇹🇷',
    az: '🇦🇿',
    fr: '🇫🇷',
    ar: '🇸🇦',
    es: '🇪🇸',
    de: '🇩🇪'
  };
  return flags[language] || '🌐';
} 