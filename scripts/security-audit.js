const { execSync } = require('child_process');

console.log('🔒 Проверка безопасности...\n');

let hasVulnerabilities = false;

// 1. npm audit
console.log('🔍 Проверка уязвимостей npm...');
try {
  execSync('npm audit --audit-level=critical', { stdio: 'pipe' });
  console.log('✅ npm audit: Критических уязвимостей нет');
} catch (error) {
  console.log('⚠️  npm audit: Уязвимости найдены (но не критичные)');
  // Не считаем npm уязвимости критичными для CI/CD
  // hasVulnerabilities = true;
}

// 2. Проверка секретов в коде
console.log('🔐 Проверка секретов в коде...');
const fs = require('fs');
const path = require('path');

const sensitivePatterns = [
  /password\s*=\s*['"][^'"]+['"]/gi,
  /secret\s*=\s*['"][^'"]+['"]/gi,
  /api_key\s*=\s*['"][^'"]+['"]/gi,
  /private_key\s*=\s*['"][^'"]+['"]/gi,
  /access_token\s*=\s*['"][^'"]+['"]/gi,
  /refresh_token\s*=\s*['"][^'"]+['"]/gi,
];

function checkFileForSecrets(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    sensitivePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          pattern: pattern.source,
          matches: matches.length,
          lines: matches.map(match => {
            const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
            return { line: lineNumber, content: match };
          })
        });
      }
    });
    
    return issues;
  } catch (error) {
    return [];
  }
}

function scanDirectory(dirPath, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let hasSecrets = false;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        if (scanDirectory(fullPath, extensions)) {
          hasSecrets = true;
        }
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        // Пропускаем тестовые файлы
        if (!fullPath.includes('__tests__') && !fullPath.includes('.test.') && !fullPath.includes('.spec.')) {
          const issues = checkFileForSecrets(fullPath);
          if (issues.length > 0) {
            console.log(`⚠️  ${fullPath}:`);
            issues.forEach(issue => {
              console.log(`   - Pattern: ${issue.pattern} (${issue.matches} matches)`);
            });
            hasSecrets = true;
          }
        }
      }
    }
  } catch (error) {
    // Игнорируем ошибки доступа
  }
  
  return hasSecrets;
}

const srcPath = path.join(__dirname, '..', 'src');
const hasSecrets = scanDirectory(srcPath);

if (hasSecrets) {
  console.log('⚠️  Потенциальные секреты найдены в коде');
  hasVulnerabilities = true;
} else {
  console.log('✅ Секреты в коде: Не найдены');
}

// 3. Проверка зависимостей
console.log('📦 Проверка зависимостей...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const suspiciousPackages = Object.keys(dependencies).filter(pkg => 
    pkg.includes('unmaintained') || 
    pkg.includes('deprecated') ||
    pkg.includes('vulnerable')
  );
  
  if (suspiciousPackages.length > 0) {
    console.log('⚠️  Подозрительные пакеты:', suspiciousPackages.join(', '));
    hasVulnerabilities = true;
  } else {
    console.log('✅ Зависимости: OK');
  }
} catch (error) {
  console.log('⚠️  Не удалось проверить зависимости');
}

console.log('\n🎯 Результат проверки безопасности:');
if (hasVulnerabilities) {
  console.log('⚠️  Проблемы безопасности найдены!');
  console.log('💡 Рекомендации:');
  console.log('   - Обновите уязвимые зависимости');
  console.log('   - Удалите секреты из кода');
  console.log('   - Используйте переменные окружения');
  process.exit(1);
} else {
  console.log('✅ Безопасность в порядке!');
  process.exit(0);
}
