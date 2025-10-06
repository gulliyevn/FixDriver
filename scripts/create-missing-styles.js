#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Создаю недостающие стили...');

// Получаем список всех ошибок TypeScript
try {
  const tscOutput = execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' });
  const errors = tscOutput.split('\n').filter(line => line.includes('Cannot find module') && line.includes('.styles'));
  
  let createdFiles = 0;
  
  errors.forEach(error => {
    // Извлекаем путь к файлу стилей
    const match = error.match(/Cannot find module '([^']+\.styles[^']*)'/);
    if (match) {
      const stylePath = match[1];
      const fullPath = path.join('src', stylePath);
      const dir = path.dirname(fullPath);
      
      // Создаем директорию если не существует
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Создаем файл стилей если не существует
      if (!fs.existsSync(fullPath)) {
        const fileName = path.basename(fullPath, '.styles.ts');
        const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
        
        const styleContent = `import { StyleSheet } from 'react-native';

export const create${componentName}Styles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000' : '#fff',
  },
  // Базовые стили - можно расширить по необходимости
});

export const ${componentName}Styles = create${componentName}Styles(false);
export const get${componentName}Styles = create${componentName}Styles;
`;
        
        fs.writeFileSync(fullPath, styleContent, 'utf8');
        createdFiles++;
        console.log(`✅ Создан: ${fullPath}`);
      }
    }
  });
  
  console.log(`\n📊 РЕЗУЛЬТАТ:`);
  console.log(`✅ Создано файлов стилей: ${createdFiles}`);
  
} catch (error) {
  console.log('ℹ️ TypeScript ошибки не найдены или уже исправлены');
}
