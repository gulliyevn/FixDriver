#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Final ESLint Fix - Target: 0 warnings');
console.log('========================================');

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
    // Добавляем недостающие зависимости
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
    'src/context/ProfileContext.tsx',
    'src/hooks/client/useClientBalance.ts',
    'src/hooks/client/useDriversList.ts',
    'src/hooks/driver/DriverUseAvatar.ts',
    'src/hooks/driver/DriverUseProfile.ts',
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
