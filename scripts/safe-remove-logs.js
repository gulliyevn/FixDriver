#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Безопасное удаление console.log...');

// Функция для рекурсивного поиска файлов
function findFiles(dir, pattern, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findFiles(fullPath, pattern, files);
    } else if (stat.isFile() && pattern.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Находим все TypeScript файлы
const tsFiles = findFiles(path.join(__dirname, '..', 'src'), /\.(ts|tsx)$/);
let totalRemoved = 0;
let filesProcessed = 0;

console.log(`📁 Найдено ${tsFiles.length} файлов для обработки`);

tsFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // БЕЗОПАСНОЕ удаление console.log - только отдельные строки
    const lines = content.split('\n');
    const filteredLines = lines.filter(line => {
      // Убираем строки которые содержат ТОЛЬКО console.log/warn/error
      const trimmed = line.trim();
      if (trimmed.match(/^\s*console\.(log|warn|error|info|debug)\([^;]*\);\s*$/)) {
        totalRemoved++;
        return false;
      }
      return true;
    });
    
    if (filteredLines.length !== lines.length) {
      content = filteredLines.join('\n');
      filesProcessed++;
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${filePath}: удалено ${lines.length - filteredLines.length} console.log`);
    }
  } catch (error) {
    console.error(`❌ Ошибка в ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Обработка завершена!`);
console.log(`📊 Статистика:`);
console.log(`   - Файлов обработано: ${filesProcessed}`);
console.log(`   - Console.log удалено: ${totalRemoved}`);
console.log(`   - Общее количество файлов: ${tsFiles.length}`);
