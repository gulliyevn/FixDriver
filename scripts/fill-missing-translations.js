#!/usr/bin/env node

/**
 * Автозаполнение недостающих переводов во всех языках по образцу RU
 * Запуск: node scripts/fill-missing-translations.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const I18N_DIR = path.join(ROOT, 'src', 'i18n');

// Языки и неймспейсы должны совпадать с валидатором
const LANGUAGES = ['ru', 'en', 'tr', 'az', 'fr', 'ar', 'es', 'de'];
const NAMESPACES = [
  'common',
  'login',
  'register',
  'profile',
  'errors',
  'notifications',
  'support',
  'navigation',
  'components',
  'driver',
  'client',
];

function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return {};
  }
}

function writeJson(filePath, data) {
  const sortObject = (obj) => {
    if (Array.isArray(obj)) return obj.map(sortObject);
    if (obj && typeof obj === 'object') {
      const sorted = {};
      Object.keys(obj)
        .sort((a, b) => a.localeCompare(b))
        .forEach((key) => {
          sorted[key] = sortObject(obj[key]);
        });
      return sorted;
    }
    return obj;
  };
  const sorted = sortObject(data);
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
}

function deepFill(base, target) {
  if (!target || typeof target !== 'object' || Array.isArray(target)) {
    target = {};
  }
  const result = { ...target };
  for (const [key, baseValue] of Object.entries(base)) {
    const targetValue = target[key];
    if (typeof baseValue === 'string') {
      // Если строки нет или пустая — копируем RU как плейсхолдер
      if (typeof targetValue !== 'string' || targetValue.trim().length === 0) {
        result[key] = baseValue;
      }
    } else if (baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue)) {
      result[key] = deepFill(baseValue, targetValue);
    } else {
      // Прочие типы не ожидаются; пропускаем
    }
  }
  return result;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

let totalFilled = 0;

for (const ns of NAMESPACES) {
  const nsDir = path.join(I18N_DIR, ns);
  const ruPath = path.join(nsDir, 'ru.json');
  const base = readJson(ruPath);
  if (!Object.keys(base).length) {
    console.warn(`⚠️  Пропущен неймспейс ${ns}: нет ru.json`);
    continue;
  }

  for (const lang of LANGUAGES) {
    if (lang === 'ru') continue;
    ensureDir(nsDir);
    const langPath = path.join(nsDir, `${lang}.json`);
    const current = readJson(langPath);
    const before = JSON.stringify(current);
    const filled = deepFill(base, current);
    const after = JSON.stringify(filled);
    if (before !== after) {
      writeJson(langPath, filled);
      const beforeCount = (before.match(/:\s*"/g) || []).length;
      const afterCount = (after.match(/:\s*"/g) || []).length;
      totalFilled += Math.max(0, afterCount - beforeCount);
      console.log(`✅ Заполнены пропуски: ${ns}/${lang}.json`);
    }
  }
}

console.log(`\n🎯 Готово. Добавлено (или заполнено) значений: ${totalFilled}`);


