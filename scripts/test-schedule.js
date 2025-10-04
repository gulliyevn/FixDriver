#!/usr/bin/env node

/**
 * Скрипт для запуска тестов компонентов расписания
 * Использование: npm run test:schedule
 */

const { exec } = require('child_process');
const path = require('path');

const testPaths = [
  'src/screens/common/FixDriveScreen/components/sections/__tests__/FlexibleScheduleSection.test.tsx',
  'src/screens/common/FixDriveScreen/components/__tests__/WeekDaysSelector.test.tsx',
  'src/screens/common/FixDriveScreen/components/hooks/__tests__/useCustomizedDays.test.tsx',
  'src/utils/__tests__/scheduleStorage.test.ts',
];

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runTest(testPath) {
  return new Promise((resolve, reject) => {
    const command = `npx jest ${testPath} --verbose --colors`;
    
    log(`\n${'='.repeat(80)}`, colors.cyan);
    log(`🧪 Запуск тестов: ${path.basename(testPath)}`, colors.bright);
    log(`${'='.repeat(80)}`, colors.cyan);
    
    const child = exec(command, (error, stdout) => {
      if (error) {
        log(`❌ Тесты не прошли: ${testPath}`, colors.red);
        log(error.message, colors.red);
        reject(error);
      } else {
        log(`✅ Тесты прошли: ${testPath}`, colors.green);
        resolve(stdout);
      }
    });

    child.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}

async function runAllTests() {
  log('\n🚀 Запуск всех тестов расписания...', colors.bright + colors.blue);
  log(`📁 Найдено ${testPaths.length} тестовых файлов`, colors.blue);
  
  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const testPath of testPaths) {
    try {
      await runTest(testPath);
      results.push({ path: testPath, status: 'passed' });
      passedCount++;
    } catch (error) {
      results.push({ path: testPath, status: 'failed', error });
      failedCount++;
    }
  }

  // Сводка результатов
  log('\n' + '='.repeat(80), colors.magenta);
  log('📊 СВОДКА РЕЗУЛЬТАТОВ ТЕСТИРОВАНИЯ', colors.bright + colors.magenta);
  log('='.repeat(80), colors.magenta);

  results.forEach((result) => {
    const icon = result.status === 'passed' ? '✅' : '❌';
    const color = result.status === 'passed' ? colors.green : colors.red;
    const fileName = path.basename(result.path);
    
    log(`${icon} ${fileName}`, color);
  });

  log('\n📈 СТАТИСТИКА:', colors.bright);
  log(`✅ Прошли: ${passedCount}`, colors.green);
  log(`❌ Не прошли: ${failedCount}`, colors.red);
  log(`📊 Всего: ${results.length}`, colors.blue);

  if (failedCount > 0) {
    log('\n🔥 Некоторые тесты не прошли! Проверьте ошибки выше.', colors.red);
    process.exit(1);
  } else {
    log('\n🎉 Все тесты прошли успешно!', colors.green);
    log('🚀 Компоненты расписания готовы к продакшену!', colors.bright + colors.green);
  }
}

// Проверяем аргументы командной строки
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  log('📖 Использование скрипта тестирования расписания:', colors.bright);
  log('');
  log('npm run test:schedule              - Запустить все тесты', colors.blue);
  log('npm run test:schedule --watch      - Запустить в режиме наблюдения', colors.blue);
  log('npm run test:schedule --coverage   - Запустить с покрытием кода', colors.blue);
  log('npm run test:schedule --help       - Показать эту справку', colors.blue);
  log('');
  log('🧪 Тестируемые компоненты:', colors.bright);
  testPaths.forEach(path => {
    log(`  • ${path.basename(path)}`, colors.cyan);
  });
  process.exit(0);
}

if (args.includes('--watch')) {
  log('👀 Запуск в режиме наблюдения...', colors.yellow);
  const command = `npx jest ${testPaths.join(' ')} --watch --verbose`;
  exec(command, { stdio: 'inherit' });
} else if (args.includes('--coverage')) {
  log('📊 Запуск с анализом покрытия кода...', colors.yellow);
  const command = `npx jest ${testPaths.join(' ')} --coverage --verbose`;
  exec(command, { stdio: 'inherit' });
} else {
  runAllTests().catch((error) => {
    log(`💥 Критическая ошибка: ${error.message}`, colors.red);
    process.exit(1);
  });
}
