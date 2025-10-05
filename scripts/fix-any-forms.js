#!/usr/bin/env node

/**
 * Скрипт для исправления `any` типов в формах и простых структурах
 * Группа 4: Form Errors, Context, простые типы (20-30 any)
 * 
 * Заменяет:
 * - setErrors((prev: any) => на setErrors((prev) =>
 * - newErrors: any на newErrors: Record<string, string>
 * - driverLevel: any на driverLevel: unknown
 * - colors: any на colors: Record<string, string>
 * - (prev: any) в setState на просто (prev)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting fix-any-forms.js...\n');

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

  // 1. setErrors((prev: any) => { → setErrors((prev) => {
  // TypeScript может вывести тип из useState
  const pattern1 = /\(prev:\s*any\)\s*=>/g;
  const matches1 = content.match(pattern1);
  if (matches1) {
    content = content.replace(pattern1, '(prev) =>');
    replacements += matches1.length;
  }

  // 2. newErrors: any = {} → newErrors: Record<string, string> = {}
  const pattern2 = /\bnewErrors:\s*any\b/g;
  const matches2 = content.match(pattern2);
  if (matches2) {
    content = content.replace(pattern2, 'newErrors: Record<string, string>');
    replacements += matches2.length;
  }

  // 3. driverLevel: any → driverLevel: unknown
  const pattern3 = /driverLevel:\s*any/g;
  const matches3 = content.match(pattern3);
  if (matches3) {
    content = content.replace(pattern3, 'driverLevel: unknown');
    replacements += matches3.length;
  }

  // 4. colors: any (не в Record) → colors: Record<string, string>
  const pattern4 = /\bcolors:\s*any(?!,)/g;
  const matches4 = content.match(pattern4);
  if (matches4) {
    content = content.replace(pattern4, 'colors: Record<string, string>');
    replacements += matches4.length;
  }

  // 5. newAddresses: any[] → newAddresses: unknown[]
  const pattern5 = /newAddresses:\s*any\[\]/g;
  const matches5 = content.match(pattern5);
  if (matches5) {
    content = content.replace(pattern5, 'newAddresses: unknown[]');
    replacements += matches5.length;
  }

  // 6. item: any в деструктуризации → item: unknown
  // Только в { item }: { item: any }
  const pattern6 = /\{\s*item\s*\}:\s*\{\s*item:\s*any\s*\}/g;
  const matches6 = content.match(pattern6);
  if (matches6) {
    content = content.replace(pattern6, '{ item }: { item: unknown }');
    replacements += matches6.length;
  }

  // 7. chat: any в функциях → chat: unknown
  const pattern7 = /\bchat:\s*any\b/g;
  const matches7 = content.match(pattern7);
  if (matches7) {
    content = content.replace(pattern7, 'chat: unknown');
    replacements += matches7.length;
  }

  // 8. msg: any → msg: unknown
  const pattern8 = /\bmsg:\s*any\b/g;
  const matches8 = content.match(pattern8);
  if (matches8) {
    content = content.replace(pattern8, 'msg: unknown');
    replacements += matches8.length;
  }

  // 9. progress: any, dragX: any в swipe → progress: unknown, dragX: unknown
  const pattern9 = /(progress|dragX):\s*any\b/g;
  const matches9 = content.match(pattern9);
  if (matches9) {
    content = content.replace(pattern9, '$1: unknown');
    replacements += matches9.length;
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

