const fs = require('fs');
const path = require('path');

// Функция для быстрого исправления простых тестов
function quickFixTest(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 1. Заменяем импорты @testing-library/react-native на testWrapper
    if (content.includes('@testing-library/react-native') && !content.includes('test-utils/testWrapper')) {
      // Находим строку с импортом render
      const renderImportMatch = content.match(/import\s*{\s*([^}]*render[^}]*)\s*}\s*from\s*['"]@testing-library\/react-native['"];?\s*\n?/);
      
      if (renderImportMatch) {
        const imports = renderImportMatch[1];
        
        // Удаляем старый импорт
        content = content.replace(renderImportMatch[0], '');
        
        // Добавляем новый импорт
        const newImport = `import { ${imports} } from '../../test-utils/testWrapper';\n`;
        content = newImport + content;
        modified = true;
      }
    }
    
    // 2. Удаляем простые моки контекстов
    if (content.includes('test-utils/testWrapper')) {
      // Удаляем моки ThemeContext
      content = content.replace(
        /\/\/ Mock ThemeContext\s*\n?jest\.mock\(['"]\.\.\/\.\.\/\.\.\/context\/ThemeContext['"],\s*\(\)\s*=>\s*\(\{\s*\n?\s*useTheme:\s*\(\)\s*=>\s*\(\{\s*\n?\s*isDark:\s*false,\s*\n?\s*\}\),\s*\n?\}\)\);\s*\n?/g,
        ''
      );
      
      // Удаляем моки LanguageContext
      content = content.replace(
        /\/\/ Mock LanguageContext\s*\n?jest\.mock\(['"]\.\.\/\.\.\/\.\.\/context\/LanguageContext['"],\s*\(\)\s*=>\s*\(\{\s*\n?\s*useLanguage:\s*\(\)\s*=>\s*\(\{\s*\n?\s*t:\s*\([^)]*\)\s*=>\s*[^,]+,\s*\n?\s*\}\),\s*\n?\}\)\);\s*\n?/g,
        ''
      );
      
      // Удаляем моки AuthContext
      content = content.replace(
        /\/\/ Mock AuthContext\s*\n?jest\.mock\(['"]\.\.\/\.\.\/\.\.\/context\/AuthContext['"],\s*\(\)\s*=>\s*\(\{\s*\n?\s*useAuth:\s*\(\)\s*=>\s*\(\{\s*\n?\s*user:\s*null,\s*\n?\s*isAuthenticated:\s*false,\s*\n?\s*loading:\s*false,\s*\n?\s*\}\),\s*\n?\}\)\);\s*\n?/g,
        ''
      );
      
      // Удаляем ThemeProvider wrapper
      content = content.replace(
        /const\s+renderWithTheme\s*=\s*\([^)]*\)\s*=>\s*\{\s*\n?\s*return\s+render\(\s*\n?\s*<ThemeProvider[^>]*>\s*\n?\s*\{[^}]*\}\s*\n?\s*<\/ThemeProvider>\s*\n?\s*\);\s*\n?\};/g,
        'const renderWithTheme = (component) => render(component);'
      );
      
      // Удаляем LanguageProvider wrapper
      content = content.replace(
        /const\s+renderWithLanguage\s*=\s*\([^)]*\)\s*=>\s*\{\s*\n?\s*return\s+render\(\s*\n?\s*<LanguageProvider[^>]*>\s*\n?\s*\{[^}]*\}\s*\n?\s*<\/LanguageProvider>\s*\n?\s*\);\s*\n?\};/g,
        'const renderWithLanguage = (component) => render(component);'
      );
      
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Quick fixed: ${filePath}`);
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
      } else if (stat.isFile() && (item.endsWith('.test.tsx') || item.endsWith('.test.ts'))) {
        // Пропускаем уже исправленные файлы
        if (!item.includes('Button.test.tsx') && !item.includes('ErrorDisplay.test.tsx') && !item.includes('DatePicker.test.tsx')) {
          if (quickFixTest(fullPath)) {
            totalFixed++;
          }
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
  console.log('🔧 Quick fixing test files...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const totalFixed = processTestFiles(srcDir);
  
  console.log(`\n🎉 Quick fixed ${totalFixed} test files!`);
}

main();
