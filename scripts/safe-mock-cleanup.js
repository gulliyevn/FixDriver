// Безопасная очистка mock данных - заменяет mock данные на реальные API вызовы
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
let processedFiles = 0;
let mockReplacements = 0;

// Паттерны для замены mock данных
const mockReplacementPatterns = {
  // Замены для AuthService
  'mockUsers': 'await APIClient.get("/auth/users")',
  'findAuthUserByCredentials': 'await APIClient.post("/auth/login", credentials)',
  'findAuthUserByEmail': 'await APIClient.post("/auth/find-by-email", { email })',
  
  // Замены для BalanceService
  'balanceMock': 'await APIClient.get("/balance")',
  'mockTransactions': 'await APIClient.get("/balance/transactions")',
  
  // Замены для DriverService
  'mockDrivers': 'await APIClient.get("/drivers")',
  'mockDriverVehicles': 'await APIClient.get("/drivers/vehicles")',
  
  // Замены для OrderService
  'mockOrders': 'await APIClient.get("/orders")',
  'mockTrips': 'await APIClient.get("/orders/trips")',
  
  // Замены для ChatService
  'mockChats': 'await APIClient.get("/chats")',
  'mockMessages': 'await APIClient.get("/chats/messages")',
  
  // Замены для NotificationService
  'mockNotifications': 'await APIClient.get("/notifications")',
  
  // Замены для EarningsService
  'mockEarnings': 'await APIClient.get("/earnings")',
  'mockEarningsDetails': 'await APIClient.get("/earnings/details")',
};

// Файлы которые НЕ трогаем (содержат важные mock данные для разработки)
const protectedFiles = [
  'src/mocks/',
  'src/test-utils/',
  '__tests__',
  '.test.',
  '.spec.',
];

function isProtectedFile(filePath) {
  return protectedFiles.some(protected => filePath.includes(protected));
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Проверяем, содержит ли файл mock данные
    const mockPatterns = [
      /mock\w+/gi,
      /Mock\w+/g,
      /MOCK_\w+/g,
      /\/\/\s*MOCK/g,
      /\/\*\s*MOCK/g,
    ];
    
    const hasMockData = mockPatterns.some(pattern => pattern.test(content));
    
    if (!hasMockData) {
      return false;
    }
    
    console.log(`📝 Обработка: ${filePath}`);
    
    // Заменяем mock импорты на реальные API вызовы
    Object.entries(mockReplacementPatterns).forEach(([mockPattern, apiCall]) => {
      const regex = new RegExp(`\\b${mockPattern}\\b`, 'g');
      if (content.match(regex)) {
        content = content.replace(regex, apiCall);
        hasChanges = true;
        mockReplacements++;
      }
    });
    
    // Заменяем комментарии с mock данными
    content = content.replace(/\/\/\s*MOCK.*$/gm, '');
    content = content.replace(/\/\*\s*MOCK[\s\S]*?\*\//g, '');
    
    // Убираем пустые строки
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      processedFiles++;
      console.log(`✅ Обновлен: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Ошибка обработки ${filePath}:`, error.message);
    return false;
  }
}

function scanDirectory(directory) {
  const items = fs.readdirSync(directory);
  
  items.forEach(item => {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!item.startsWith('.') && item !== 'node_modules' && item !== 'build') {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
      if (!isProtectedFile(fullPath)) {
        processFile(fullPath);
      }
    }
  });
}

console.log('🧹 Безопасная очистка mock данных...\n');

// Обрабатываем только src/ директорию
const srcDir = path.join(rootDir, 'src');
if (fs.existsSync(srcDir)) {
  scanDirectory(srcDir);
}

console.log(`\n🎉 Обработка завершена!`);
console.log(`📊 Статистика:`);
console.log(`   - Обработано файлов: ${processedFiles}`);
console.log(`   - Заменено mock данных: ${mockReplacements}`);

if (processedFiles > 0) {
  console.log('\n✨ Запуск Prettier для форматирования...');
  try {
    const { execSync } = require('child_process');
    execSync('npx prettier --write src/', { stdio: 'inherit' });
    console.log('✅ Prettier завершен.');
  } catch (error) {
    console.error('❌ Ошибка Prettier:', error.message);
  }
} else {
  console.log('\n✅ Mock данные не найдены или уже очищены.');
}
