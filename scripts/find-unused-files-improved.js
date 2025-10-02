const fs = require('fs');
const path = require('path');

// Функция для рекурсивного поиска всех файлов
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // Пропускаем node_modules и другие системные папки
      if (!['node_modules', '.git', 'coverage', 'ios', 'android'].includes(file)) {
        try {
          arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } catch (error) {
          console.warn(`Skipping directory ${fullPath}: ${error.message}`);
        }
      }
    } else {
      // Только TypeScript/JavaScript файлы
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Функция для извлечения импортов из файла
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    // Регулярные выражения для поиска импортов
    const importRegexes = [
      /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
      /import\s+['"]([^'"]+)['"]/g,
      /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    ];

    importRegexes.forEach(regex => {
      let match;
      while ((match = regex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('./') || importPath.startsWith('../') || importPath.startsWith('src/')) {
          imports.push(importPath);
        }
      }
    });

    return imports;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

// Функция для разрешения относительных путей
function resolveImportPath(importPath, currentFile) {
  if (importPath.startsWith('src/')) {
    return path.resolve(process.cwd(), importPath);
  }
  
  const currentDir = path.dirname(currentFile);
  const resolvedPath = path.resolve(currentDir, importPath);
  
  // Пробуем разные расширения
  const extensions = ['.ts', '.tsx', '.js', '.jsx', ''];
  for (const ext of extensions) {
    const fullPath = resolvedPath + ext;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  
  return null;
}

// Основная функция анализа
function findUnusedFiles() {
  // Ищем файлы во всех папках проекта (кроме node_modules)
  const projectRoot = process.cwd();
  const allFiles = getAllFiles(projectRoot);
  
  // Фильтруем только файлы из src/
  const srcFiles = allFiles.filter(file => file.includes('/src/'));
  
  console.log(`🔍 Найдено ${srcFiles.length} файлов в src/`);
  
  // Создаем карту всех файлов
  const fileMap = new Map();
  srcFiles.forEach(file => {
    fileMap.set(file, {
      imports: extractImports(file),
      isUsed: false,
      usedBy: []
    });
  });
  
  // Отмечаем файлы как используемые (проверяем импорты из всех файлов проекта)
  allFiles.forEach(file => {
    const fileInfo = fileMap.get(file);
    if (fileInfo) {
      fileInfo.imports.forEach(importPath => {
        const resolvedPath = resolveImportPath(importPath, file);
        if (resolvedPath && fileMap.has(resolvedPath)) {
          const importedFile = fileMap.get(resolvedPath);
          importedFile.isUsed = true;
          importedFile.usedBy.push(file);
        }
      });
    }
  });
  
  // Находим неиспользуемые файлы
  const unusedFiles = [];
  const usedFiles = [];
  
  fileMap.forEach((info, filePath) => {
    const relativePath = path.relative(process.cwd(), filePath);
    
    if (info.isUsed) {
      usedFiles.push({
        path: relativePath,
        usedBy: info.usedBy.map(f => path.relative(process.cwd(), f))
      });
    } else {
      // Проверяем, не является ли файл точкой входа или специальным файлом
      const isEntryPoint = relativePath.includes('App.tsx') || 
                          relativePath.includes('index.ts') ||
                          relativePath.includes('main.ts') ||
                          relativePath.includes('jest.config') ||
                          relativePath.includes('metro.config') ||
                          relativePath.includes('babel.config');
      
      if (!isEntryPoint) {
        unusedFiles.push(relativePath);
      }
    }
  });
  
  // Выводим результаты
  console.log('\n📊 РЕЗУЛЬТАТЫ АНАЛИЗА:');
  console.log(`✅ Используемых файлов: ${usedFiles.length}`);
  console.log(`❌ Неиспользуемых файлов: ${unusedFiles.length}`);
  
  if (unusedFiles.length > 0) {
    console.log('\n🚨 НЕИСПОЛЬЗУЕМЫЕ ФАЙЛЫ:');
    unusedFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  // Группируем по папкам
  const unusedByFolder = {};
  unusedFiles.forEach(file => {
    const folder = file.split('/')[1] || 'root';
    if (!unusedByFolder[folder]) {
      unusedByFolder[folder] = [];
    }
    unusedByFolder[folder].push(file);
  });
  
  console.log('\n📁 НЕИСПОЛЬЗУЕМЫЕ ФАЙЛЫ ПО ПАПКАМ:');
  Object.entries(unusedByFolder).forEach(([folder, files]) => {
    console.log(`\n${folder}/ (${files.length} файлов):`);
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
  });
  
  return {
    unusedFiles,
    usedFiles,
    totalFiles: srcFiles.length
  };
}

// Запускаем анализ
if (require.main === module) {
  findUnusedFiles();
}

module.exports = { findUnusedFiles };
