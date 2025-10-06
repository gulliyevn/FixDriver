#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Исправляю неиспользуемые переменные error...');

// Находим все .ts и .tsx файлы
const files = glob.sync('src/**/*.{ts,tsx}', { ignore: ['src/**/*.test.*', 'src/**/*.spec.*'] });

let fixedFiles = 0;
let totalFixes = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Заменяем error на _ в catch блоках где error не используется
    const catchErrorRegex = /catch\s*\(\s*error\s*\)\s*{\s*\/\/\s*Ignore\s*error\s*console\.warn\('Error caught',\s*error\);\s*}/g;
    
    content = content.replace(catchErrorRegex, (match) => {
      modified = true;
      totalFixes++;
      return `catch (_) {
        // Ignore error
        console.warn('Error caught');
      }`;
    });
    
    // Также заменяем в других случаях где error не используется
    const unusedErrorRegex = /catch\s*\(\s*error\s*\)\s*{\s*console\.warn\('Error caught',\s*error\);\s*}/g;
    
    content = content.replace(unusedErrorRegex, (match) => {
      modified = true;
      totalFixes++;
      return `catch (_) {
        console.warn('Error caught');
      }`;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixedFiles++;
      console.log(`✅ ${filePath} - исправлено`);
    }
  } catch (error) {
    console.error(`❌ Ошибка в ${filePath}:`, error.message);
  }
});

console.log(`\n📊 РЕЗУЛЬТАТ:`);
console.log(`✅ Файлов исправлено: ${fixedFiles}`);
console.log(`🔧 Переменных исправлено: ${totalFixes}`);
