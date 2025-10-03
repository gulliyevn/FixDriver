// Безопасная очистка DEV-специфичного кода
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
let processedFiles = 0;
let devCodeRemoved = 0;

// Паттерны для поиска DEV-специфичного кода
const devPatterns = [
  /console\.log\(['"`].*?['"`]\);?/g,
  /console\.warn\(['"`].*?['"`]\);?/g,
  /console\.info\(['"`].*?['"`]\);?/g,
  /console\.debug\(['"`].*?['"`]\);?/g,
  /\/\/\s*DEBUG.*$/gm,
  /\/\/\s*TODO.*$/gm,
  /\/\*\s*DEBUG[\s\S]*?\*\//g,
  /\/\*\s*TODO[\s\S]*?\*\//g,
];

// Файлы которые НЕ трогаем
const protectedFiles = [
  'src/test-utils/',
  '__tests__',
  '.test.',
  '.spec.',
  'src/utils/devTools.ts', // Специально оставляем devTools
  'src/utils/storageKeysDev.ts', // Специально оставляем storageKeysDev
];

function isProtectedFile(filePath) {
  return protectedFiles.some(protected => filePath.includes(protected));
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    let fileDevCodeRemoved = 0;
    
    // Проверяем, содержит ли файл DEV-специфичный код
    const hasDevCode = devPatterns.some(pattern => pattern.test(content));
    
    if (!hasDevCode) {
      return false;
    }
    
    console.log(`🔧 Обработка: ${filePath}`);
    
    // Удаляем DEV-специфичный код
    devPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, '');
        fileDevCodeRemoved += matches.length;
        hasChanges = true;
      }
    });
    
    // Убираем пустые строки
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      processedFiles++;
      devCodeRemoved += fileDevCodeRemoved;
      console.log(`✅ Очищен: ${filePath} (удалено ${fileDevCodeRemoved} элементов DEV-кода)`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Ошибка обработки ${filePath}:`, error.message);
    return false;
  }
}

function scanDirectory(directory) {
  const items = fs.readdirSync(directory);
  
  items.forEach(item => {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!item.startsWith('.') && item !== 'node_modules' && item !== 'build') {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
      if (!isProtectedFile(fullPath)) {
        processFile(fullPath);
      }
    }
  });
}

console.log('🏭 Очистка DEV-специфичного кода...\n');

// Обрабатываем только src/ директорию
const srcDir = path.join(rootDir, 'src');
if (fs.existsSync(srcDir)) {
  scanDirectory(srcDir);
}

console.log(`\n🎉 Очистка завершена!`);
console.log(`📊 Статистика:`);
console.log(`   - Обработано файлов: ${processedFiles}`);
console.log(`   - Удалено элементов DEV-кода: ${devCodeRemoved}`);

if (processedFiles > 0) {
  console.log('\n✨ Запуск Prettier для форматирования...');
  try {
    const { execSync } = require('child_process');
    execSync('npx prettier --write src/', { stdio: 'inherit' });
    console.log('✅ Prettier завершен.');
  } catch (error) {
    console.error('❌ Ошибка Prettier:', error.message);
  }
} else {
  console.log('\n✅ DEV-специфичный код не найден или уже очищен.');
}
