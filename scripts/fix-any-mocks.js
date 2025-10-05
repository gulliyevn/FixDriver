#!/usr/bin/env node

/**
 * Скрипт для исправления `any` типов в моках и тестах
 * Группа 1: Моки и тесты (50-60 any)
 * 
 * Заменяет:
 * - ({ children, ...props }: any) => на ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
 * - : any в mock компонентах
 */

const fs = require('fs');
const path = require('path');

// Файлы для обработки
const FILES = [
  'src/test-utils/testWrapper.tsx',
  'src/mocks/reactNativeScreensMock.tsx',
  'src/mocks/reactNativeDropdownPickerMock.tsx',
  'src/mocks/expoStatusBarMock.tsx',
  'src/mocks/reactNativeSvgMock.tsx',
  'src/mocks/reactNativeGestureHandlerMock.tsx',
  'src/mocks/expoLinearGradientMock.tsx',
  'src/mocks/reactNativeCalendarsMock.tsx',
];

let totalReplacements = 0;

console.log('🚀 Starting fix-any-mocks.js...\n');

FILES.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`);
    return;
  }

  console.log(`📝 Processing ${filePath}...`);
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let replacements = 0;
  const originalContent = content;

  // 1. Заменяем ({ children, ...props }: any) => на React.PropsWithChildren
  const pattern1 = /\(\{\s*children[^}]*\}\s*:\s*any\)\s*=>/g;
  const matches1 = content.match(pattern1);
  if (matches1) {
    content = content.replace(
      pattern1,
      '({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>'
    );
    replacements += matches1.length;
    console.log(`   ✅ Replaced ${matches1.length} mock component props`);
  }

  // 2. Заменяем let ProviderName: any; на let ProviderName: React.ComponentType<any>;
  const pattern2 = /let\s+(\w+Provider)\s*:\s*any;/g;
  const matches2 = content.match(pattern2);
  if (matches2) {
    content = content.replace(
      pattern2,
      'let $1: React.ComponentType<any>;'
    );
    replacements += matches2.length;
    console.log(`   ✅ Replaced ${matches2.length} provider type declarations`);
  }

  // 3. Заменяем ({ ...props }: any) => на Record<string, unknown>
  const pattern3 = /\(\{\s*\.\.\.props\s*\}\s*:\s*any\)\s*=>/g;
  const matches3 = content.match(pattern3);
  if (matches3) {
    content = content.replace(
      pattern3,
      '({ ...props }: Record<string, unknown>) =>'
    );
    replacements += matches3.length;
    console.log(`   ✅ Replaced ${matches3.length} props spreads`);
  }

  // 4. Добавляем React import если его нет и мы что-то изменили
  if (replacements > 0 && !content.includes('import React')) {
    // Проверяем есть ли уже импорт React
    if (content.includes("import { ") || content.includes("import type")) {
      // Добавляем в начало файла
      content = "import React from 'react';\n" + content;
      console.log(`   ✅ Added React import`);
    }
  }

  // Сохраняем файл только если были изменения
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`   ✨ Saved ${filePath} (${replacements} replacements)\n`);
    totalReplacements += replacements;
  } else {
    console.log(`   ℹ️  No changes needed\n`);
  }
});

console.log('═══════════════════════════════════════');
console.log(`✅ COMPLETED: ${totalReplacements} total replacements`);
console.log('═══════════════════════════════════════\n');

console.log('📊 Next steps:');
console.log('   1. Run: npm run lint');
console.log('   2. Run: npx tsc --noEmit --project src/tsconfig.json');
console.log('   3. Check the results and commit if OK\n');

