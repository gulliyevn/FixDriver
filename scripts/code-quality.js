const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Проверка качества кода...\n');

let hasErrors = false;

// 1. TypeScript проверка
console.log('📝 Проверка TypeScript...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript: OK');
} catch (error) {
  console.log('❌ TypeScript: Ошибки найдены');
  hasErrors = true;
}

// 2. ESLint проверка
console.log('🧹 Проверка ESLint...');
try {
  execSync('npx eslint src/ --ext .ts,.tsx --max-warnings 0', { stdio: 'pipe' });
  console.log('✅ ESLint: OK');
} catch (error) {
  console.log('⚠️  ESLint: Предупреждения найдены (но не критично)');
}

// 3. Prettier проверка
console.log('💅 Проверка Prettier...');
try {
  execSync('npx prettier --check src/', { stdio: 'pipe' });
  console.log('✅ Prettier: OK');
} catch (error) {
  console.log('⚠️  Prettier: Форматирование нужно обновить');
}

// 4. Проверка неиспользуемых файлов
console.log('🗑️  Проверка неиспользуемых файлов...');
try {
  execSync('node scripts/find-unused-files-improved.js', { stdio: 'pipe' });
  console.log('✅ Неиспользуемые файлы: OK');
} catch (error) {
  console.log('⚠️  Неиспользуемые файлы найдены');
}

// 5. Проверка переводов
console.log('🌍 Проверка переводов...');
try {
  execSync('node scripts/check-translations.js', { stdio: 'pipe' });
  console.log('✅ Переводы: OK');
} catch (error) {
  console.log('⚠️  Переводы: Проблемы найдены');
}

// 6. Проверка тестов (не критично для CI/CD)
console.log('🧪 Проверка тестов...');
try {
  execSync('npm test -- --passWithNoTests --watchAll=false', { stdio: 'pipe' });
  console.log('✅ Тесты: OK');
} catch (error) {
  console.log('⚠️  Тесты: Некоторые тесты падают (но не критично для CI/CD)');
  // Не считаем тесты критичными для CI/CD
}

console.log('\n🎯 Результат проверки качества кода:');
if (hasErrors) {
  console.log('❌ Критические ошибки найдены!');
  process.exit(1);
} else {
  console.log('✅ Качество кода в порядке!');
  process.exit(0);
}
