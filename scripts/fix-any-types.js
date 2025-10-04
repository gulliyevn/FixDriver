#!/usr/bin/env node

/**
 * Скрипт для полуавтоматического исправления any типов
 * Часть можно автоматизировать, часть нужно делать вручную
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Исправление any типов...\n');

// 1. Простые автоматические замены
const simpleReplacements = [
  // Стили
  { from: 'styles: any', to: 'styles: StyleSheet.NamedStyles<any>' },
  { from: 'style: any', to: 'style: ViewStyle' },
  
  // События
  { from: 'event: any', to: 'event: unknown' },
  { from: 'onPress: any', to: 'onPress: () => void' },
  
  // Базовые типы
  { from: 'data: any', to: 'data: Record<string, unknown>' },
  { from: 'response: any', to: 'response: unknown' },
  { from: 'params: any', to: 'params: Record<string, unknown>' },
  
  // Массивы
  { from: 'items: any[]', to: 'items: unknown[]' },
  { from: 'list: any[]', to: 'list: unknown[]' },
  
  // Функции
  { from: 'callback: any', to: 'callback: (...args: unknown[]) => void' },
  { from: 'handler: any', to: 'handler: (...args: unknown[]) => void' },
];

// 2. Найти все файлы с any
function findAnyFiles() {
  try {
    const result = execSync('npm run lint 2>&1 | grep "no-explicit-any"', { encoding: 'utf8' });
    const lines = result.split('\n').filter(line => line.includes('.tsx') || line.includes('.ts'));
    
    const files = new Set();
    lines.forEach(line => {
      // Ищем путь к файлу в строке
      const match = line.match(/(\/Users\/[^:]+\.(tsx?))/);
      if (match) {
        files.add(match[1]);
      }
    });
    
    return Array.from(files);
  } catch (error) {
    console.log('❌ Ошибка при поиске файлов с any:', error.message);
    return [];
  }
}

// 3. Применить простые замены
function applySimpleReplacements(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    simpleReplacements.forEach(({ from, to }) => {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(from)) {
        content = content.replace(regex, to);
        changed = true;
        console.log(`  ✅ ${from} → ${to}`);
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`❌ Ошибка при обработке ${filePath}:`, error.message);
    return false;
  }
}

// 4. Найти сложные any для ручного исправления
function findComplexAny(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const complexAny = [];
    
    lines.forEach((line, index) => {
      // Ищем сложные any которые нужно исправлять вручную
      if (line.includes(': any') && 
          !line.includes('styles: any') && 
          !line.includes('event: any') &&
          !line.includes('response: any') &&
          !line.includes('data: any') &&
          !line.includes('params: any')) {
        
        complexAny.push({
          line: index + 1,
          content: line.trim(),
          file: filePath
        });
      }
    });
    
    return complexAny;
  } catch (error) {
    console.log(`❌ Ошибка при анализе ${filePath}:`, error.message);
    return [];
  }
}

// 5. Основная функция
function main() {
  console.log('📊 Поиск файлов с any типами...');
  const files = findAnyFiles();
  
  if (files.length === 0) {
    console.log('✅ Файлов с any не найдено!');
    return;
  }
  
  console.log(`📁 Найдено ${files.length} файлов с any типами\n`);
  
  let totalFixed = 0;
  const complexAny = [];
  
  files.forEach(file => {
    console.log(`🔧 Обработка: ${file}`);
    
    // Применить простые замены
    if (applySimpleReplacements(file)) {
      totalFixed++;
    }
    
    // Найти сложные any
    const complex = findComplexAny(file);
    complexAny.push(...complex);
  });
  
  console.log(`\n✅ Автоматически исправлено: ${totalFixed} файлов`);
  
  if (complexAny.length > 0) {
    console.log(`\n⚠️  НУЖНО ИСПРАВИТЬ ВРУЧНУЮ (${complexAny.length} случаев):`);
    console.log('=' .repeat(60));
    
    complexAny.forEach((item, index) => {
      console.log(`${index + 1}. ${item.file}:${item.line}`);
      console.log(`   ${item.content}`);
      console.log('');
    });
    
    console.log('=' .repeat(60));
    console.log('💡 Рекомендации для ручного исправления:');
    console.log('1. Создайте интерфейсы для сложных объектов');
    console.log('2. Используйте generic типы для переиспользуемых функций');
    console.log('3. Добавьте типы для API ответов');
    console.log('4. Используйте union типы для разных вариантов');
  }
  
  console.log('\n🎯 Следующие шаги:');
  console.log('1. Запустите: npm run lint');
  console.log('2. Исправьте оставшиеся any вручную');
  console.log('3. Создайте интерфейсы для сложных типов');
}

// Запуск
main();
