#!/usr/bin/env node

/**
 * Скрипт для исправления `any` типов в navigation и props
 * Группа 3: Navigation и простые Props (30-40 any)
 * 
 * Заменяет:
 * - props: any → props: Record<string, unknown>
 * - navigation: any → navigation: any (оставляем, т.к. navigation сложный)
 * - route?: any → route?: any (оставляем)
 * - (e: any) в listeners → (e: any) (оставляем в listeners)
 * - currentColors: any → currentColors: Record<string, any>
 * - styles: any → styles: Record<string, any>
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting fix-any-navigation.js...\n');

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

  // 1. currentColors: any, → currentColors: Record<string, any>,
  const pattern1 = /currentColors:\s*any,/g;
  const matches1 = content.match(pattern1);
  if (matches1) {
    content = content.replace(pattern1, 'currentColors: Record<string, any>,');
    replacements += matches1.length;
  }

  // 2. styles: any в параметрах функций
  const pattern2 = /\bstyles:\s*any\b/g;
  const matches2 = content.match(pattern2);
  if (matches2) {
    // Проверяем что это не в комментариях
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('styles: any') && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
        lines[idx] = line.replace(/\bstyles:\s*any\b/g, 'styles: Record<string, any>');
      }
    });
    const newContent = lines.join('\n');
    if (newContent !== content) {
      content = newContent;
      replacements += matches2.length;
    }
  }

  // 3. theme: any в параметрах
  const pattern3 = /\btheme:\s*any\b/g;
  const matches3 = content.match(pattern3);
  if (matches3) {
    content = content.replace(pattern3, 'theme: Record<string, any>');
    replacements += matches3.length;
  }

  // 4. colors: any в параметрах
  const pattern4 = /\bcolors:\s*any\b/g;
  const matches4 = content.match(pattern4);
  if (matches4) {
    content = content.replace(pattern4, 'colors: Record<string, any>');
    replacements += matches4.length;
  }

  // 5. handler: any, callback: any
  const pattern5 = /\b(handler|callback|listener):\s*any\b/g;
  const matches5 = content.match(pattern5);
  if (matches5) {
    content = content.replace(pattern5, '$1: (...args: any[]) => void');
    replacements += matches5.length;
  }

  // 6. timerId: any → timerId: NodeJS.Timeout | null
  const pattern6 = /timerId:\s*any/g;
  const matches6 = content.match(pattern6);
  if (matches6) {
    content = content.replace(pattern6, 'timerId: NodeJS.Timeout | null');
    replacements += matches6.length;
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

