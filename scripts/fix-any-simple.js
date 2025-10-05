#!/usr/bin/env node

/**
 * Скрипт для исправления простых `any` типов
 * Группа 2: Простые замены (error handling, ComponentType, data objects)
 * 
 * Заменяет:
 * - React.ComponentType<any> на React.ComponentType<React.PropsWithChildren>
 * - errorInfo: any на errorInfo: unknown
 * - data: Record<string, any> на Record<string, unknown>
 * - obj: any на obj: unknown
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting fix-any-simple.js...\n');

// Находим все файлы с no-explicit-any
const eslintOutput = execSync(
  'npx eslint src/**/*.{ts,tsx} --format=compact 2>&1 | grep "no-explicit-any"',
  { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
);

// Парсим файлы
const files = new Set();
eslintOutput.split('\n').forEach(line => {
  const match = line.match(/^([^:]+):/);
  if (match) {
    files.add(match[1]);
  }
});

let totalReplacements = 0;
const filesProcessed = [];

console.log(`📋 Found ${files.size} files with no-explicit-any\n`);

files.forEach(filePath => {
  if (!filePath || !fs.existsSync(filePath)) return;
  
  const relativePath = path.relative(process.cwd(), filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let replacements = 0;

  // 1. React.ComponentType<any> → React.ComponentType<React.PropsWithChildren>
  const pattern1 = /React\.ComponentType<any>/g;
  const matches1 = content.match(pattern1);
  if (matches1) {
    content = content.replace(
      pattern1,
      'React.ComponentType<React.PropsWithChildren>'
    );
    replacements += matches1.length;
  }

  // 2. errorInfo: any → errorInfo: unknown
  const pattern2 = /errorInfo:\s*any/g;
  const matches2 = content.match(pattern2);
  if (matches2) {
    content = content.replace(pattern2, 'errorInfo: unknown');
    replacements += matches2.length;
  }

  // 3. Record<string, any> → Record<string, unknown>
  const pattern3 = /Record<string,\s*any>/g;
  const matches3 = content.match(pattern3);
  if (matches3) {
    content = content.replace(pattern3, 'Record<string, unknown>');
    replacements += matches3.length;
  }

  // 4. : any) в параметрах функций (осторожно) → : unknown)
  // Только для явных случаев: obj: any, data: any, item: any
  const pattern4 = /\b(obj|data|item|value|result|response):\s*any\b/g;
  const matches4 = content.match(pattern4);
  if (matches4) {
    content = content.replace(pattern4, '$1: unknown');
    replacements += matches4.length;
  }

  // 5. errorInfo?: any → errorInfo?: unknown
  const pattern5 = /errorInfo\?:\s*any/g;
  const matches5 = content.match(pattern5);
  if (matches5) {
    content = content.replace(pattern5, 'errorInfo?: unknown');
    replacements += matches5.length;
  }

  // Сохраняем файл только если были изменения
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesProcessed.push({ path: relativePath, count: replacements });
    totalReplacements += replacements;
  }
});

// Выводим результаты
console.log('═══════════════════════════════════════');
if (filesProcessed.length > 0) {
  console.log(`✅ Processed ${filesProcessed.length} files:\n`);
  filesProcessed.forEach(({ path, count }) => {
    console.log(`   📝 ${path}: ${count} replacements`);
  });
  console.log(`\n✅ TOTAL: ${totalReplacements} replacements`);
} else {
  console.log('ℹ️  No files needed changes');
}
console.log('═══════════════════════════════════════\n');

console.log('📊 Next steps:');
console.log('   1. Run: npm run lint');
console.log('   2. Run: npx tsc --noEmit --project src/tsconfig.json');
console.log('   3. Check the results\n');

