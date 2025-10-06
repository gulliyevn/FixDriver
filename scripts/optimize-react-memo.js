#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 React.memo Optimization Script');
console.log('================================');

// Найти все .tsx файлы в src/components
function findTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Проверить, нужна ли оптимизация компонента
function needsOptimization(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Проверяем, что это React компонент
  if (!content.includes('React.FC') && !content.includes('const ') && !content.includes('function ')) {
    return false;
  }
  
  // Проверяем, что уже не оптимизирован
  if (content.includes('React.memo') || content.includes('memo(')) {
    return false;
  }
  
  // Проверяем размер файла (больше 200 строк)
  const lines = content.split('\n').length;
  if (lines < 200) {
    return false;
  }
  
  return true;
}

// Оптимизировать компонент
function optimizeComponent(filePath) {
  console.log(`📝 Optimizing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Добавить memo в импорты
  if (content.includes('import React')) {
    if (content.includes('import React, {') && !content.includes('memo')) {
      content = content.replace(
        /import React, \{([^}]+)\}/,
        (match, imports) => {
          const importList = imports.split(',').map(imp => imp.trim());
          if (!importList.includes('memo')) {
            importList.push('memo');
          }
          return `import React, { ${importList.join(', ')} }`;
        }
      );
    } else if (content.includes('import React from') && !content.includes('memo')) {
      content = content.replace(
        'import React from "react"',
        'import React, { memo } from "react"'
      );
    }
  }
  
  // Найти основной компонент (более простой подход)
  const componentMatch = content.match(/const\s+(\w+)\s*[=:]\s*\([^)]*\)\s*=>\s*\{/);
  if (componentMatch) {
    const componentName = componentMatch[1];
    
    // Заменить объявление компонента
    content = content.replace(
      new RegExp(`const\\s+${componentName}\\s*[=:].*?=>\\s*\\{`),
      `const ${componentName} = memo(() => {`
    );
    
    // Найти последний }; и заменить на });
    const lines = content.split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim() === '};') {
        lines[i] = '});';
        break;
      }
    }
    content = lines.join('\n');
    
    // Добавить displayName перед export
    const exportMatch = content.match(/export\s+default\s+(\w+)/);
    if (exportMatch) {
      const exportName = exportMatch[1];
      content = content.replace(
        `export default ${exportName}`,
        `${exportName}.displayName = '${exportName}';\n\nexport default ${exportName}`
      );
    }
  }
  
  // Сохранить файл
  fs.writeFileSync(filePath, content);
  console.log(`✅ Optimized: ${filePath}`);
}

// Основная функция
function main() {
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  
  if (!fs.existsSync(componentsDir)) {
    console.error('❌ Components directory not found');
    process.exit(1);
  }
  
  const tsxFiles = findTsxFiles(componentsDir);
  console.log(`📁 Found ${tsxFiles.length} .tsx files`);
  
  const filesToOptimize = tsxFiles.filter(needsOptimization);
  console.log(`🎯 ${filesToOptimize.length} files need optimization`);
  
  if (filesToOptimize.length === 0) {
    console.log('✅ All components are already optimized!');
    return;
  }
  
  // Оптимизировать файлы
  for (const file of filesToOptimize) {
    try {
      optimizeComponent(file);
    } catch (error) {
      console.error(`❌ Error optimizing ${file}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Optimization complete!`);
  console.log(`📊 Optimized ${filesToOptimize.length} components`);
  
  // Проверить TypeScript
  console.log('\n🔍 Checking TypeScript...');
  try {
    execSync('npm run type-check', { stdio: 'inherit' });
    console.log('✅ TypeScript check passed');
  } catch (error) {
    console.error('❌ TypeScript check failed');
  }
}

main();
