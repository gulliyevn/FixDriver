const fs = require('fs');
const path = require('path');

// Функция для исправления импортов в тестах
function fixTestFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 1. Заменяем импорты @testing-library/react-native на наш testWrapper
    if (content.includes('@testing-library/react-native') && !content.includes('test-utils/testWrapper')) {
      // Удаляем старый импорт render
      content = content.replace(
        /import\s*{\s*([^}]*render[^}]*)\s*}\s*from\s*['"]@testing-library\/react-native['"];?\s*\n?/g,
        ''
      );
      
      // Добавляем новый импорт
      const renderImport = "import { render, fireEvent, waitFor } from '../../test-utils/testWrapper';\n";
      content = renderImport + content;
      modified = true;
    }
    
    // 2. Удаляем моки контекстов если есть testWrapper
    if (content.includes('test-utils/testWrapper')) {
      // Удаляем моки ThemeContext
      content = content.replace(
        /\/\/ Mock dependencies\s*\n?jest\.mock\(['"]\.\.\/\.\.\/\.\.\/context\/ThemeContext['"],\s*\(\)\s*=>\s*\(\{\s*\n?\s*useTheme:\s*jest\.fn\(\),\s*\n?\}\)\);\s*\n?/g,
        ''
      );
      
      // Удаляем моки LanguageContext
      content = content.replace(
        /\/\/ Mock dependencies\s*\n?jest\.mock\(['"]\.\.\/\.\.\/\.\.\/context\/LanguageContext['"],\s*\(\)\s*=>\s*\(\{\s*\n?\s*useLanguage:\s*jest\.fn\(\),\s*\n?\}\)\);\s*\n?/g,
        ''
      );
      
      // Удаляем моки AuthContext
      content = content.replace(
        /\/\/ Mock dependencies\s*\n?jest\.mock\(['"]\.\.\/\.\.\/\.\.\/context\/AuthContext['"],\s*\(\)\s*=>\s*\(\{\s*\n?\s*useAuth:\s*jest\.fn\(\),\s*\n?\}\)\);\s*\n?/g,
        ''
      );
      
      // Удаляем переменные mockUseTheme и подобные
      content = content.replace(
        /const\s+mockUse\w+\s*=\s*\w+\s*as\s*jest\.MockedFunction<[^>]+>;\s*\n?/g,
        ''
      );
      
      // Удаляем beforeEach с моками
      content = content.replace(
        /beforeEach\(\(\)\s*=>\s*\{\s*\n?\s*mockUse\w+\.mockReturnValue\([^}]+\}\);\s*\n?\s*\}\);\s*\n?/g,
        ''
      );
      
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Рекурсивно обходим директорию src и ищем тесты
function processTestFiles(dirPath) {
  let totalFixed = 0;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        totalFixed += processTestFiles(fullPath);
      } else if (stat.isFile() && item.endsWith('.test.tsx') || item.endsWith('.test.ts')) {
        if (fixTestFile(fullPath)) {
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
  console.log('🔧 Fixing test imports...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const totalFixed = processTestFiles(srcDir);
  
  console.log(`\n🎉 Fixed ${totalFixed} test files!`);
}

main();
