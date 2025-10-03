const fs = require('fs');
const path = require('path');

// Функция для удаления TODO комментариев
function removeTodos(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 1. Удаляем TODO комментарии на отдельных строках
    const todoLineRegex = /^\s*\/\/\s*TODO.*$/gm;
    if (todoLineRegex.test(content)) {
      content = content.replace(todoLineRegex, '');
      modified = true;
    }
    
    // 2. Удаляем TODO комментарии в конце строк
    const todoEndRegex = /\s*\/\/\s*TODO.*$/gm;
    if (todoEndRegex.test(content)) {
      content = content.replace(todoEndRegex, '');
      modified = true;
    }
    
    // 3. Удаляем TODO в блочных комментариях
    const todoBlockRegex = /\/\*[\s\S]*?TODO[\s\S]*?\*\//g;
    if (todoBlockRegex.test(content)) {
      content = content.replace(todoBlockRegex, '');
      modified = true;
    }
    
    // 4. Удаляем TODO в JSX комментариях
    const todoJsxRegex = /\{\s*\/\*[\s\S]*?TODO[\s\S]*?\*\/\s*\}/g;
    if (todoJsxRegex.test(content)) {
      content = content.replace(todoJsxRegex, '');
      modified = true;
    }
    
    // 5. Удаляем пустые строки, которые могли остаться
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Removed TODOs: ${filePath}`);
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
        if (removeTodos(fullPath)) {
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
  console.log('🔧 Removing TODO comments...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const totalFixed = processDirectory(srcDir);
  
  console.log(`\n🎉 Removed TODOs from ${totalFixed} files!`);
}

main();
