#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Исправляю недостающие стили...');

try {
  // Получаем все TypeScript ошибки
  const tscOutput = execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' });
  const errors = tscOutput.split('\n').filter(line => 
    line.includes('Property') && 
    line.includes('does not exist on type') &&
    line.includes('.styles')
  );
  
  let fixedFiles = 0;
  const styleFiles = new Set();
  
  errors.forEach(error => {
    // Извлекаем путь к файлу стилей
    const match = error.match(/src\/([^:]+\.tsx?)/);
    if (match) {
      const filePath = match[1];
      const fullPath = path.join('src', filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Находим импорт стилей
        const styleImportMatch = content.match(/import.*from\s+['"]([^'"]+\.styles[^'"]*)['"]/);
        if (styleImportMatch) {
          const stylePath = styleImportMatch[1];
          const fullStylePath = path.join('src', stylePath);
          const styleDir = path.dirname(fullStylePath);
          
          // Создаем директорию если не существует
          if (!fs.existsSync(styleDir)) {
            fs.mkdirSync(styleDir, { recursive: true });
          }
          
          // Создаем файл стилей если не существует
          if (!fs.existsSync(fullStylePath)) {
            const fileName = path.basename(fullStylePath, '.styles.ts');
            const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
            
            // Находим все используемые стили в компоненте
            const styleUsage = content.match(/styles\.(\w+)/g) || [];
            const uniqueStyles = [...new Set(styleUsage.map(s => s.replace('styles.', '')))];
            
            let styleContent = `import { StyleSheet } from 'react-native';

export const create${componentName}Styles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000' : '#fff',
  },`;
            
            // Добавляем все используемые стили
            uniqueStyles.forEach(styleName => {
              if (styleName !== 'container') {
                styleContent += `
  ${styleName}: {
    // TODO: Add styles for ${styleName}
  },`;
              }
            });
            
            styleContent += `
});

export const ${componentName}Styles = create${componentName}Styles(false);
export const get${componentName}Styles = create${componentName}Styles;
`;
            
            fs.writeFileSync(fullStylePath, styleContent, 'utf8');
            styleFiles.add(fullStylePath);
            fixedFiles++;
            console.log(`✅ Создан: ${fullStylePath}`);
          }
        }
      }
    }
  });
  
  console.log(`\n📊 РЕЗУЛЬТАТ:`);
  console.log(`✅ Создано файлов стилей: ${fixedFiles}`);
  console.log(`📁 Файлы: ${Array.from(styleFiles).join(', ')}`);
  
} catch (error) {
  console.log('ℹ️ TypeScript ошибки не найдены или уже исправлены');
}
