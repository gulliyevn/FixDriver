const fs = require('fs');
const path = require('path');

// Список файлов с console.log в основном коде
const filesToProcess = [
  'src/screens/common/FixDriveScreen/components/WeekDaysSelector.tsx',
  'src/screens/common/FixWaveScreen/utils/scheduleUtils.ts',
  'src/screens/common/FixWaveScreen/components/ScheduleContainerContent.tsx',
  'src/screens/common/FixWaveScreen/components/TimeSchedulePage.tsx',
  'src/screens/common/FixWaveScreen/components/WeekDaysSelector.tsx',
  'src/screens/common/FixWaveScreen/hooks/useScheduleContainer.ts',
  'src/components/FixDriveMapInput.tsx'
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Удаляем console.log строки аккуратно
    const consoleLogRegex = /(\s*)console\.log\([^)]*\);?\s*/g;
    const newContent = content.replace(consoleLogRegex, () => {
      modified = true;
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

function main() {
  console.log('🔧 Removing final console.log statements from main code...\n');
  
  let totalFixed = 0;
  
  for (const file of filesToProcess) {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
      if (processFile(fullPath)) {
        totalFixed++;
      }
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  }
  
  console.log(`\n🎉 Fixed ${totalFixed} files!`);
}

main();
