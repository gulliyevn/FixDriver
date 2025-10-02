const fs = require('fs');
const path = require('path');

// Функция для обработки файла
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Заменяем throw new Error на console.error и return
    const throwErrorRegex = /throw new Error\(([^)]+)\);?/g;
    const newContent = content.replace(throwErrorRegex, (match, errorMessage) => {
      modified = true;
      return `console.error(${errorMessage}); return;`;
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

// Рекурсивно обходим директорию src
function processDirectory(dirPath) {
  let totalFixed = 0;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        totalFixed += processDirectory(fullPath);
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
  console.log('🔧 Fixing throw new Error statements...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const totalFixed = processDirectory(srcDir);
  
  console.log(`\n🎉 Fixed ${totalFixed} files with throw new Error statements!`);
}

main();
