const fs = require('fs');
const path = require('path');

// Список файлов для исправления
const filesToFix = [
  'src/components/FixDriveMapInput.tsx',
  'src/screens/common/FixDriveScreen/components/WeekDaysSelector.tsx',
  'src/screens/common/FixWaveScreen/components/TimeSchedulePage.tsx',
  'src/screens/common/FixWaveScreen/components/WeekDaysSelector.tsx',
  'src/screens/common/FixWaveScreen/components/ScheduleContainerContent.tsx',
  'src/screens/common/FixWaveScreen/hooks/useScheduleContainer.ts',
  'src/screens/common/FixWaveScreen/utils/scheduleUtils.ts',
  'src/services/DistanceCalculationService.ts',
  'src/screens/common/FixDriveScreen/components/FixDriveAddressPage.tsx',
  'src/screens/common/FixWaveScreen/components/AddressPage.tsx'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Исправляем различные синтаксические ошибки
    const fixes = [
      // Убираем лишние скобки после удаления console.log
      [/\)\);\s*$/gm, ''], // Убираем )); в конце строки
      [/\);\s*$/gm, ''], // Убираем ); в конце строки если это не нужно
      [/\(\s*\);\s*$/gm, ''], // Убираем (); в конце строки
      [/\)\s*\);\s*$/gm, ''], // Убираем )); в конце строки
      [/\)\s*\)\s*\);\s*$/gm, ''], // Убираем ))); в конце строки
      
      // Исправляем пустые строки с лишними символами
      [/^\s*\)\s*$/gm, ''], // Убираем строки только со скобкой
      [/^\s*\(\s*\)\s*$/gm, ''], // Убираем строки только с ()
      [/^\s*\)\)\s*$/gm, ''], // Убираем строки только с ))
      
      // Исправляем проблемы с объектами
      [/,\s*\)/g, ')'], // Убираем запятые перед закрывающей скобкой
      [/,\s*}/g, '}'], // Убираем запятые перед закрывающей скобкой объекта
      
      // Исправляем проблемы с функциями
      [/}\s*\)\s*$/gm, '}'], // Убираем лишние скобки после }
    ];
    
    for (const [regex, replacement] of fixes) {
      const newContent = content.replace(regex, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed syntax: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing syntax errors from console.log cleanup...\n');
  
  let totalFixed = 0;
  
  for (const file of filesToFix) {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
      if (fixFile(fullPath)) {
        totalFixed++;
      }
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  }
  
  console.log(`\n🎉 Fixed syntax in ${totalFixed} files!`);
}

main();
