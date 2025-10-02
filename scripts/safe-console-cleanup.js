const fs = require('fs');
const path = require('path');

// Функция для безопасной обработки файла
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Заменяем console.log на комментарий или удаляем аккуратно
    const consoleLogRegex = /(\s*)console\.log\([^)]*\);?\s*/g;
    const newContent = content.replace(consoleLogRegex, (match, indent) => {
      modified = true;
      // Если это JSX, заменяем на null
      if (match.includes('{') || match.includes('}')) {
        return `${indent}null; // console.log removed`;
      }
      // Иначе просто удаляем
      return '';
    });
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Рекурсивно обходим директорию src, исключая __tests__
function processDirectory(dirPath) {
  let totalFixed = 0;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Пропускаем __tests__ директории
        if (item !== '__tests__') {
          totalFixed += processDirectory(fullPath);
        }
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
        if (processFile(fullPath)) {
          totalFixed++;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
  
  return totalFixed;
}

// Основная функция
function main() {
  console.log('🔧 Safe console.log cleanup (excluding tests)...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const totalFixed = processDirectory(srcDir);
  
  console.log(`\n🎉 Fixed ${totalFixed} files with console.log statements!`);
}

main();
