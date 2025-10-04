#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const srcPath = path.join(projectRoot, 'src');

// Паттерны для автоматизации
const AUTOMATABLE_PATTERNS = [
  // Простые типы
  { pattern: /: any\s*=\s*\[\]/, replacement: ': unknown[] = []' },
  { pattern: /: any\s*=\s*\{\}/, replacement: ': Record<string, unknown> = {}' },
  { pattern: /: any\s*=\s*null/, replacement: ': unknown = null' },
  { pattern: /: any\s*=\s*undefined/, replacement: ': unknown = undefined' },
  { pattern: /: any\s*=\s*''/, replacement: ': string = \'\'' },
  { pattern: /: any\s*=\s*0/, replacement: ': number = 0' },
  { pattern: /: any\s*=\s*false/, replacement: ': boolean = false' },
  { pattern: /: any\s*=\s*true/, replacement: ': boolean = true' },
  
  // Функции
  { pattern: /: any\s*=\s*\(\)\s*=>\s*\{\}/, replacement: ': () => void = () => {}' },
  { pattern: /: any\s*=\s*\(\)\s*=>\s*null/, replacement: ': () => null = () => null' },
  
  // Массивы и объекты
  { pattern: /: any\[\]/, replacement: ': unknown[]' },
  { pattern: /: any\s*=\s*\[\]/, replacement: ': unknown[] = []' },
  { pattern: /: any\s*=\s*\{\}/, replacement: ': Record<string, unknown> = {}' },
  
  // React компоненты
  { pattern: /: any\s*as\s*any/, replacement: ': unknown as unknown' },
  { pattern: /as\s*any\s*\)/, replacement: 'as unknown)' },
  
  // События
  { pattern: /event:\s*any/, replacement: 'event: unknown' },
  { pattern: /error:\s*any/, replacement: 'error: unknown' },
  { pattern: /data:\s*any/, replacement: 'data: unknown' },
  { pattern: /item:\s*any/, replacement: 'item: unknown' },
  { pattern: /value:\s*any/, replacement: 'value: unknown' },
  { pattern: /result:\s*any/, replacement: 'result: unknown' },
  { pattern: /config:\s*any/, replacement: 'config: unknown' },
  
  // Стили
  { pattern: /styles:\s*any/, replacement: 'styles: Record<string, unknown>' },
  { pattern: /colors:\s*any/, replacement: 'colors: Record<string, string>' },
  
  // Навигация
  { pattern: /navigation:\s*any/, replacement: 'navigation: unknown' },
  { pattern: /params:\s*any/, replacement: 'params: Record<string, unknown>' },
  
  // API
  { pattern: /response:\s*any/, replacement: 'response: unknown' },
  { pattern: /request:\s*any/, replacement: 'request: unknown' },
];

// Паттерны для ручного исправления
const MANUAL_PATTERNS = [
  // Сложные типы
  /: any\s*=\s*new\s+\w+\(/,
  /: any\s*=\s*await\s+/,
  /: any\s*=\s*JSON\.parse/,
  /: any\s*=\s*require\(/,
  /: any\s*=\s*import\(/,
  
  // Сложные объекты
  /: any\s*=\s*\{[\s\S]*\}/,
  /: any\s*=\s*\[[\s\S]*\]/,
  
  // Функции с параметрами
  /: any\s*=\s*\([^)]*\)\s*=>/,
  
  // Сложные выражения
  /: any\s*=\s*[^=;,\n]+\.[^=;,\n]+/,
];

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const results = {
    file: filePath,
    automatable: [],
    manual: [],
    total: 0
  };
  
  lines.forEach((line, index) => {
    if (line.includes('any')) {
      results.total++;
      
      // Проверяем автоматизируемые паттерны
      for (const pattern of AUTOMATABLE_PATTERNS) {
        if (pattern.pattern.test(line)) {
          results.automatable.push({
            line: index + 1,
            content: line.trim(),
            pattern: pattern.pattern.toString(),
            replacement: pattern.replacement
          });
          return;
        }
      }
      
      // Проверяем ручные паттерны
      for (const pattern of MANUAL_PATTERNS) {
        if (pattern.test(line)) {
          results.manual.push({
            line: index + 1,
            content: line.trim()
          });
          return;
        }
      }
      
      // Если не подходит ни под один паттерн, считаем ручным
      results.manual.push({
        line: index + 1,
        content: line.trim()
      });
    }
  });
  
  return results;
}

function traverseDirectory(directory) {
  const results = [];
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const result = analyzeFile(fullPath);
        if (result.total > 0) {
          results.push(result);
        }
      }
    }
  }
  
  walkDir(directory);
  return results;
}

console.log('🔍 Анализ any типов...\n');

const results = traverseDirectory(srcPath);

let totalAutomatable = 0;
let totalManual = 0;
let totalAny = 0;

console.log('📊 РЕЗУЛЬТАТЫ АНАЛИЗА:\n');

results.forEach(result => {
  if (result.total > 0) {
    console.log(`📁 ${result.file.replace(projectRoot + '/', '')}`);
    console.log(`   Всего any: ${result.total}`);
    console.log(`   Автоматизируемых: ${result.automatable.length}`);
    console.log(`   Ручных: ${result.manual.length}`);
    
    totalAutomatable += result.automatable.length;
    totalManual += result.manual.length;
    totalAny += result.total;
    
    if (result.automatable.length > 0) {
      console.log('   ✅ Автоматизируемые примеры:');
      result.automatable.slice(0, 3).forEach(item => {
        console.log(`      Строка ${item.line}: ${item.content}`);
        console.log(`      → ${item.replacement}`);
      });
    }
    
    if (result.manual.length > 0) {
      console.log('   🔧 Ручные примеры:');
      result.manual.slice(0, 3).forEach(item => {
        console.log(`      Строка ${item.line}: ${item.content}`);
      });
    }
    
    console.log('');
  }
});

console.log('📈 ИТОГОВАЯ СТАТИСТИКА:');
console.log(`   Всего any типов: ${totalAny}`);
console.log(`   Автоматизируемых: ${totalAutomatable} (${Math.round(totalAutomatable/totalAny*100)}%)`);
console.log(`   Ручных: ${totalManual} (${Math.round(totalManual/totalAny*100)}%)`);

console.log('\n🚀 РЕКОМЕНДАЦИИ:');
console.log(`   1. Автоматизировать ${totalAutomatable} типов скриптом`);
console.log(`   2. Исправить ${totalManual} типов вручную`);
console.log(`   3. Экономия времени: ${Math.round(totalAutomatable/totalAny*100)}%`);
