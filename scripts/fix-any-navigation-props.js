#!/usr/bin/env node

/**
 * Скрипт для исправления navigation props в screen компонентах
 * Группа 5: Navigation Props (12-15 any)
 * 
 * Убирает лишние | { navigation: any } так как они уже есть в ClientScreenProps/DriverScreenProps
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting fix-any-navigation-props.js...\n');

// Файлы для обработки
const FILES = [
  'src/screens/client/HelpScreen.tsx',
  'src/screens/client/TripsScreen.tsx',
  'src/screens/client/CardsScreen.tsx',
  'src/screens/client/PaymentHistoryScreen.tsx',
  'src/screens/client/ResidenceScreen.tsx',
  'src/screens/client/SettingsScreen.tsx',
  'src/screens/client/AboutScreen.tsx',
  'src/screens/client/BalanceScreen.tsx',
];

let totalReplacements = 0;
const filesProcessed = [];

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

  // 1. Удаляем | { navigation: any } из типов
  const pattern1 = /\|\s*\{\s*navigation:\s*any\s*\}/g;
  const matches1 = content.match(pattern1);
  if (matches1) {
    content = content.replace(pattern1, '');
    replacements += matches1.length;
    console.log(`   ✅ Removed ${matches1.length} navigation: any unions`);
  }

  // 2. Удаляем | { navigation: any; route?: any } из типов
  const pattern2 = /\|\s*\{\s*navigation:\s*any;\s*route\?:\s*any\s*\}/g;
  const matches2 = content.match(pattern2);
  if (matches2) {
    content = content.replace(pattern2, '');
    replacements += matches2.length;
    console.log(`   ✅ Removed ${matches2.length} navigation/route: any unions`);
  }

  // Сохраняем файл только если были изменения
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`   ✨ Saved ${filePath} (${replacements} replacements)\n`);
    filesProcessed.push({ path: filePath, count: replacements });
    totalReplacements += replacements;
  } else {
    console.log(`   ℹ️  No changes needed\n`);
  }
});

console.log('═══════════════════════════════════════');
console.log(`✅ COMPLETED: ${totalReplacements} total replacements in ${filesProcessed.length} files`);
console.log('═══════════════════════════════════════\n');

console.log('📊 Next steps:');
console.log('   1. Run: npm run lint');
console.log('   2. Run: npx tsc --noEmit');
console.log('   3. Check the results\n');

