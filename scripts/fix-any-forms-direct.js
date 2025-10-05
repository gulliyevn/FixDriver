#!/usr/bin/env node

/**
 * Скрипт для исправления `any` типов в формах - прямая обработка файлов
 * Группа 4: Form Errors и простые типы
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting fix-any-forms-direct.js...\n');

// Файлы для обработки
const FILES = [
  'src/screens/auth/ClientRegisterScreen.tsx',
  'src/screens/auth/DriverRegisterScreen.tsx',
  'src/screens/common/chats/ChatScreen.tsx',
  'src/screens/common/chats/ChatListScreen.tsx',
  'src/screens/common/FixDriveScreen/components/FixDriveAddressPage.tsx',
  'src/screens/common/FixDriveScreen/components/CustomizationModal.tsx',
  'src/screens/common/FixWaveScreen/utils/progressUtils.ts',
  'src/context/LevelProgressContext.tsx',
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

  // 1. setErrors((prev: any) => { → setErrors((prev) => {
  const pattern1 = /setErrors\(\(prev:\s*any\)\s*=>/g;
  const matches1 = content.match(pattern1);
  if (matches1) {
    content = content.replace(pattern1, 'setErrors((prev) =>');
    replacements += matches1.length;
    console.log(`   ✅ Replaced ${matches1.length} setErrors with inferred types`);
  }

  // 2. newErrors: any = {} → newErrors: Record<string, string> = {}
  const pattern2 = /const newErrors:\s*any\b/g;
  const matches2 = content.match(pattern2);
  if (matches2) {
    content = content.replace(pattern2, 'const newErrors: Record<string, string>');
    replacements += matches2.length;
    console.log(`   ✅ Replaced ${matches2.length} newErrors types`);
  }

  // 3. newAddresses: any[] → newAddresses: unknown[]
  const pattern3 = /newAddresses:\s*any\[\]/g;
  const matches3 = content.match(pattern3);
  if (matches3) {
    content = content.replace(pattern3, 'newAddresses: unknown[]');
    replacements += matches3.length;
    console.log(`   ✅ Replaced ${matches3.length} newAddresses types`);
  }

  // 4. route?: any → route?: { params?: { chatId?: string } }
  const pattern4 = /route\?:\s*any\b/g;
  const matches4 = content.match(pattern4);
  if (matches4) {
    content = content.replace(pattern4, 'route?: { params?: { chatId?: string } }');
    replacements += matches4.length;
    console.log(`   ✅ Replaced ${matches4.length} route types`);
  }

  // 5. { item }: { item: any } → { item }: { item: unknown }
  const pattern5 = /\{\s*item\s*\}:\s*\{\s*item:\s*any\s*\}/g;
  const matches5 = content.match(pattern5);
  if (matches5) {
    content = content.replace(pattern5, '{ item }: { item: unknown }');
    replacements += matches5.length;
    console.log(`   ✅ Replaced ${matches5.length} item destructuring types`);
  }

  // 6. openChat = (chat: any) → openChat = (chat: unknown)
  const pattern6 = /\(chat:\s*any\)/g;
  const matches6 = content.match(pattern6);
  if (matches6) {
    content = content.replace(pattern6, '(chat: unknown)');
    replacements += matches6.length;
    console.log(`   ✅ Replaced ${matches6.length} chat parameter types`);
  }

  // 7. msg: any → msg: unknown
  const pattern7 = /\(msg:\s*any\)/g;
  const matches7 = content.match(pattern7);
  if (matches7) {
    content = content.replace(pattern7, '(msg: unknown)');
    replacements += matches7.length;
    console.log(`   ✅ Replaced ${matches7.length} msg parameter types`);
  }

  // 8. progress: any, dragX: any → progress: unknown, dragX: unknown
  const pattern8 = /\b(progress|dragX):\s*any\b/g;
  const matches8 = content.match(pattern8);
  if (matches8) {
    content = content.replace(pattern8, '$1: unknown');
    replacements += matches8.length;
    console.log(`   ✅ Replaced ${matches8.length} swipe action types`);
  }

  // 9. colors: any → colors: Record<string, string>
  const pattern9 = /\bcolors:\s*any;/g;
  const matches9 = content.match(pattern9);
  if (matches9) {
    content = content.replace(pattern9, 'colors: Record<string, string>;');
    replacements += matches9.length;
    console.log(`   ✅ Replaced ${matches9.length} colors types`);
  }

  // 10. data: any в параметрах → data: unknown
  const pattern10 = /\bdata:\s*any\b/g;
  const matches10 = content.match(pattern10);
  if (matches10 && !filePath.includes('test')) {
    content = content.replace(pattern10, 'data: unknown');
    replacements += matches10.length;
    console.log(`   ✅ Replaced ${matches10.length} data types`);
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
console.log('   2. Run: npx tsc --noEmit --project src/tsconfig.json');
console.log('   3. Check the results\n');

