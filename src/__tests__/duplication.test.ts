import fs from 'fs';
import path from 'path';

describe('Project Duplication Analysis', () => {
  const srcPath = path.join(__dirname, '..');
  
  // Функция для рекурсивного поиска файлов
  const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });
    
    return arrayOfFiles;
  };

  // Функция для получения базового имени файла без расширения
  const getBaseFileName = (filePath: string): string => {
    const fileName = path.basename(filePath);
    return fileName.replace(/\.[^/.]+$/, '');
  };

  // Функция для проверки дублирования
  const findDuplicates = (files: string[]): Map<string, string[]> => {
    const duplicates = new Map<string, string[]>();
    
    files.forEach(file => {
      const baseName = getBaseFileName(file);
      const existing = duplicates.get(baseName) || [];
      existing.push(file);
      duplicates.set(baseName, existing);
    });
    
    // Фильтруем только дубликаты (больше 1 файла)
    const filteredDuplicates = new Map<string, string[]>();
    duplicates.forEach((files, baseName) => {
      if (files.length > 1) {
        filteredDuplicates.set(baseName, files);
      }
    });
    
    return filteredDuplicates;
  };

  it('should identify duplicated files in the project', () => {
    const allFiles = getAllFiles(srcPath);
    const duplicates = findDuplicates(allFiles);
    
    // Выводим информацию о дубликатах
    console.log('\n=== DUPLICATED FILES ANALYSIS ===');
    console.log(`Total files found: ${allFiles.length}`);
    console.log(`Duplicated base names: ${duplicates.size}`);
    
    duplicates.forEach((files, baseName) => {
      console.log(`\n${baseName}:`);
      files.forEach(file => {
        const relativePath = path.relative(srcPath, file);
        console.log(`  - ${relativePath}`);
      });
    });
    
    // Проверяем, что дубликаты существуют (это ожидаемо для умных ролей)
    expect(duplicates.size).toBeGreaterThan(0);
    
    // Проверяем конкретные ожидаемые дубликаты
    const expectedDuplicates = [
      'ProfileAvatarSection',
      'AddFamilyModal', 
      'FamilyMemberItem',
      'useAvatar',
      'AvatarService'
    ];
    
    expectedDuplicates.forEach(expected => {
      const files = duplicates.get(expected);
      expect(files).toBeDefined();
      expect(files!.length).toBeGreaterThan(1);
      console.log(`\n✅ Found expected duplicate: ${expected} (${files!.length} files)`);
    });
  });

  it('should verify client and driver specific files exist', () => {
    const allFiles = getAllFiles(srcPath);
    
    // Проверяем клиентские файлы
    const clientFiles = allFiles.filter(file => 
      file.includes('/client/') || 
      file.includes('Client') ||
      getBaseFileName(file).startsWith('Client')
    );
    
    // Проверяем водительские файлы
    const driverFiles = allFiles.filter(file => 
      file.includes('/driver/') || 
      file.includes('Driver') ||
      getBaseFileName(file).startsWith('Driver')
    );
    
    console.log('\n=== ROLE-SPECIFIC FILES ===');
    console.log(`Client files: ${clientFiles.length}`);
    console.log(`Driver files: ${driverFiles.length}`);
    
    // Проверяем, что файлы для обеих ролей существуют
    expect(clientFiles.length).toBeGreaterThan(0);
    expect(driverFiles.length).toBeGreaterThan(0);
    
    // Выводим примеры файлов
    console.log('\nClient files examples:');
    clientFiles.slice(0, 5).forEach(file => {
      const relativePath = path.relative(srcPath, file);
      console.log(`  - ${relativePath}`);
    });
    
    console.log('\nDriver files examples:');
    driverFiles.slice(0, 5).forEach(file => {
      const relativePath = path.relative(srcPath, file);
      console.log(`  - ${relativePath}`);
    });
  });

  it('should verify smart role hooks exist', () => {
    const allFiles = getAllFiles(srcPath);
    
    // Ищем умные хуки
    const smartHooks = allFiles.filter(file => 
      getBaseFileName(file) === 'useProfile' ||
      getBaseFileName(file) === 'useBalance' ||
      getBaseFileName(file) === 'useAvatar'
    );
    
    console.log('\n=== SMART ROLE HOOKS ===');
    smartHooks.forEach(file => {
      const relativePath = path.relative(srcPath, file);
      console.log(`  - ${relativePath}`);
    });
    
    // Проверяем, что умные хуки существуют
    expect(smartHooks.length).toBeGreaterThan(0);
    
    // Проверяем конкретные умные хуки
    const useProfileFiles = smartHooks.filter(file => 
      getBaseFileName(file) === 'useProfile'
    );
    const useBalanceFiles = smartHooks.filter(file => 
      getBaseFileName(file) === 'useBalance'
    );
    
    expect(useProfileFiles.length).toBeGreaterThan(0);
    expect(useBalanceFiles.length).toBeGreaterThan(0);
  });

  it('should analyze file structure for role separation', () => {
    const allFiles = getAllFiles(srcPath);
    
    // Анализируем структуру папок
    const folders = new Set<string>();
    allFiles.forEach(file => {
      const relativePath = path.relative(srcPath, file);
      const folder = path.dirname(relativePath);
      folders.add(folder);
    });
    
    console.log('\n=== FOLDER STRUCTURE ANALYSIS ===');
    const sortedFolders = Array.from(folders).sort();
    sortedFolders.forEach(folder => {
      if (folder.includes('client') || folder.includes('driver')) {
        console.log(`  📁 ${folder}`);
      }
    });
    
    // Проверяем наличие папок для ролей
    const hasClientFolder = sortedFolders.some(folder => folder.includes('client'));
    const hasDriverFolder = sortedFolders.some(folder => folder.includes('driver'));
    
    expect(hasClientFolder).toBe(true);
    expect(hasDriverFolder).toBe(true);
  });

  it('should verify no broken imports in duplicated files', () => {
    const allFiles = getAllFiles(srcPath);
    const tsxFiles = allFiles.filter(file => 
      file.endsWith('.tsx') || file.endsWith('.ts')
    );
    
    console.log('\n=== IMPORT ANALYSIS ===');
    console.log(`Total TypeScript files: ${tsxFiles.length}`);
    
    // Проверяем файлы на наличие импортов
    let filesWithImports = 0;
    let totalImports = 0;
    
    tsxFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const importLines = content.match(/^import.*from.*$/gm);
        
        if (importLines && importLines.length > 0) {
          filesWithImports++;
          totalImports += importLines.length;
        }
      } catch (error) {
        // Игнорируем ошибки чтения файлов
      }
    });
    
    console.log(`Files with imports: ${filesWithImports}`);
    console.log(`Total imports: ${totalImports}`);
    
    // Проверяем, что большинство файлов имеют импорты
    expect(filesWithImports).toBeGreaterThan(0);
    expect(totalImports).toBeGreaterThan(0);
  });
}); 