#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 Final Push to 0 ESLint Warnings');
console.log('==================================');

// Функция для исправления файла
function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Исправляем различные паттерны
  const fixes = [
    // Добавляем недостающие зависимости в useEffect
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'([^']+)'/g,
      replacement: '$1, $3]);',
      description: 'Add missing dependency'
    },
    {
      pattern: /(\s+}, \[\]);\s*\/\/.*missing dependency.*'([^']+)'/g,
      replacement: '$1, $2]);',
      description: 'Add missing dependency to empty array'
    },
    // Добавляем недостающие зависимости в useCallback
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'([^']+)'/g,
      replacement: '$1, $3]);',
      description: 'Add missing dependency to useCallback'
    },
    // Обертываем функции в useCallback
    {
      pattern: /(\s+)(const\s+(\w+)\s*=\s*async\s*\([^)]*\)\s*=>\s*\{)/g,
      replacement: '$1const $3 = useCallback(async ($4) => {',
      description: 'Wrap async function in useCallback'
    },
    {
      pattern: /(\s+)(const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{)/g,
      replacement: '$1const $3 = useCallback(($4) => {',
      description: 'Wrap function in useCallback'
    },
    // Добавляем импорт useCallback если его нет
    {
      pattern: /(import\s+React,\s*\{[^}]*\})/g,
      replacement: '$1, useCallback',
      description: 'Add useCallback import'
    },
    {
      pattern: /(import\s+React\s+from\s+"react")/g,
      replacement: 'import React, { useCallback } from "react"',
      description: 'Add useCallback import to React import'
    },
    // Исправляем конкретные случаи
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'getNextLocalMidnightDate'/g,
      replacement: '$1, getNextLocalMidnightDate]);',
      description: 'Add getNextLocalMidnightDate dependency'
    },
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'saveVIPTimeData'/g,
      replacement: '$1, saveVIPTimeData]);',
      description: 'Add saveVIPTimeData dependency'
    },
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'isVIP'/g,
      replacement: '$1, isVIP]);',
      description: 'Add isVIP dependency'
    },
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'addEarnings'/g,
      replacement: '$1, addEarnings]);',
      description: 'Add addEarnings dependency'
    },
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'resetEarnings'/g,
      replacement: '$1, resetEarnings]);',
      description: 'Add resetEarnings dependency'
    },
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'loadVIPTimeData'/g,
      replacement: '$1, loadVIPTimeData]);',
      description: 'Add loadVIPTimeData dependency'
    },
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'performDayCheck'/g,
      replacement: '$1, performDayCheck]);',
      description: 'Add performDayCheck dependency'
    },
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'checkDailyNotification'/g,
      replacement: '$1, checkDailyNotification]);',
      description: 'Add checkDailyNotification dependency'
    },
    {
      pattern: /(\s+}, \[[\s\S]*?)(\s*\]);\s*\/\/.*missing dependency.*'processAutoRenewal'/g,
      replacement: '$1, processAutoRenewal]);',
      description: 'Add processAutoRenewal dependency'
    }
  ];

  for (const fix of fixes) {
    const newContent = content.replace(fix.pattern, fix.replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
      console.log(`✅ ${fix.description} in ${filePath}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`📝 Modified: ${filePath}`);
  }

  return modified;
}

// Основная функция
function main() {
  const filesToFix = [
    'src/components/EarningsScreen/hooks/useVIPTimeTracking.ts',
    'src/context/PackageContext.tsx',
    'src/hooks/driver/DriverUseProfile.ts',
    'src/hooks/driver/DriverUseAvatar.ts',
    'src/hooks/client/useDriversList.ts',
    'src/hooks/client/useClientBalance.ts',
    'src/context/ProfileContext.tsx',
    'src/screens/client/DriversScreen.tsx'
  ];

  let fixedCount = 0;

  for (const file of filesToFix) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }

  console.log(`\n🎉 Fixed ${fixedCount} files`);
  console.log('🔍 Run "npm run lint" to check results');
}

main();
