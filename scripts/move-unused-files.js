const fs = require('fs');
const path = require('path');

// Список неиспользуемых файлов (исключая те, что используются в app/)
const UNUSED_FILES = [
  // components/
  'src/components/AuthStatusIndicator.tsx',
  'src/components/ConditionsModal.tsx',
  'src/components/LanguageTest.tsx',
  'src/components/NotificationDropdown.tsx',
  'src/components/PackageCard.tsx',
  'src/components/PaymentPackageCard.tsx',
  'src/components/PhoneInput.tsx',
  'src/components/PolicyModal.tsx',
  'src/components/ProfileChildrenSection.tsx',
  'src/components/ProfileHeader.tsx',
  'src/components/ProfileNotificationsModal.tsx',
  'src/components/ProfileOption.tsx',
  'src/components/ProgressBar.tsx',
  'src/components/RatingStars.tsx',
  'src/components/RouteBuilder.tsx',
  'src/components/ServerConnectionTest.tsx',
  'src/components/ThemeToggle.tsx',
  'src/components/ErrorDisplay.tsx',
  
  // constants/
  'src/constants/familyTypes.ts',
  'src/constants/map.ts',
  'src/constants/roles.ts',
  'src/constants/vipPackages.ts',
  
  // context/
  'src/context/driver/DriverProfileContext.tsx',
  
  // hooks/
  'src/hooks/driver/DriverUseAddresses.ts',
  'src/hooks/useAuth.ts',
  
  // mocks/
  'src/mocks/asyncStorageMock.ts',
  'src/mocks/balanceMock.ts',
  'src/mocks/carsMock.ts',
  'src/mocks/expoConstantsMock.ts',
  'src/mocks/expoCryptoMock.ts',
  'src/mocks/expoDeviceMock.ts',
  'src/mocks/expoHapticsMock.ts',
  'src/mocks/expoImagePickerMock.ts',
  'src/mocks/expoLinearGradientMock.tsx',
  'src/mocks/expoLocalizationMock.ts',
  'src/mocks/expoLocationMock.ts',
  'src/mocks/expoNotificationsMock.ts',
  'src/mocks/expoRouterMock.ts',
  'src/mocks/expoStatusBarMock.ts',
  'src/mocks/factories.ts',
  'src/mocks/orders.ts',
  'src/mocks/ordersMock.ts',
  'src/mocks/other.ts',
  'src/mocks/paymentHistoryMock.ts',
  'src/mocks/reactNativeCalendarsMock.ts',
  'src/mocks/reactNativeDropdownPickerMock.ts',
  'src/mocks/reactNativeGestureHandlerMock.ts',
  'src/mocks/reactNativeMapsMock.ts',
  'src/mocks/reactNativePermissionsMock.ts',
  'src/mocks/reactNativeReanimatedMock.ts',
  'src/mocks/reactNativeSafeAreaContextMock.ts',
  'src/mocks/reactNativeScreensMock.ts',
  'src/mocks/reactNativeSvgMock.ts',
  'src/mocks/reactNativeWebMock.ts',
  'src/mocks/scheduleMock.ts',
  
  // navigation/
  'src/navigation/ChatNavigator.tsx',
  'src/navigation/RootNavigator.tsx',
  
  // screens/
  'src/screens/auth/TestAuthScreen.tsx',
  'src/screens/client/BookingsScreen.tsx',
  'src/screens/client/ChatScreen.tsx',
  'src/screens/client/DriverCard.tsx',
  'src/screens/client/DriverFilters.tsx',
  'src/screens/client/NotificationsModal.tsx',
  'src/screens/client/PlusScreen.tsx',
  'src/screens/client/ScheduleScreen.tsx',
  'src/screens/common/ProgressScreen.tsx',
  'src/screens/driver/ChatScreen.tsx',
  'src/screens/driver/ClientListScreen.tsx',
  'src/screens/driver/EarningsScreen.tsx',
  'src/screens/driver/PlusScreen.tsx',
  'src/screens/driver/ScheduleScreen.tsx',
  'src/screens/driver/StartTripScreen.tsx',
  'src/screens/profile/ThemeToggleScreen.tsx',
  
  // services/
  'src/services/PackageService.ts',
  'src/services/RouteService.ts',
  'src/services/StripeService.ts',
  'src/services/TrafficService.ts',
  
  // styles/
  'src/styles/animations/BalanceAnimations.ts',
  'src/styles/animations/RulesAnimations.ts',
  'src/styles/components/BalanceTopUpHistory.styles.ts',
  'src/styles/components/NotificationsModal.styles.ts',
  'src/styles/components/driver/DriverIndex.ts',
  'src/styles/screens/DriverProfileScreen.styles.ts',
  'src/styles/screens/chats/ChatItem.styles.ts',
  'src/styles/screens/chats/SwipeStyles.ts',
  'src/styles/screens/drivers/DriverExpanded.styles.ts',
  'src/styles/screens/drivers/SearchAndFilters.styles.ts',
  
  // types/
  'src/types/driver/DriverUser.ts',
  
  // utils/
  'src/utils/driverData.ts',
  'src/utils/driverHelpers.ts',
  'src/utils/navigationHelpers.ts',
  'src/utils/productionHelpers.ts',
  'src/utils/translationValidator.ts',
  'src/utils/vehicleData.ts'
];

function moveUnusedFiles() {
  console.log('🚀 Начинаю перенос неиспользуемых файлов в UNUSED/...\n');
  
  let movedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  UNUSED_FILES.forEach(filePath => {
    try {
      // Проверяем, существует ли файл
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Файл не найден: ${filePath}`);
        skippedCount++;
        return;
      }
      
      // Создаем структуру папок в UNUSED
      const targetPath = path.join('UNUSED', filePath);
      const targetDir = path.dirname(targetPath);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Перемещаем файл
      fs.renameSync(filePath, targetPath);
      console.log(`✅ Перенесен: ${filePath} → ${targetPath}`);
      movedCount++;
      
    } catch (error) {
      console.error(`❌ Ошибка при переносе ${filePath}:`, error.message);
      errorCount++;
    }
  });
  
  console.log('\n📊 РЕЗУЛЬТАТЫ ПЕРЕНОСА:');
  console.log(`✅ Успешно перенесено: ${movedCount} файлов`);
  console.log(`⚠️  Пропущено: ${skippedCount} файлов`);
  console.log(`❌ Ошибок: ${errorCount} файлов`);
  
  // Создаем README в папке UNUSED
  const readmeContent = `# UNUSED FILES

Эта папка содержит файлы, которые были помечены как неиспользуемые в проекте FixDrive.

## Структура

Файлы сохранены с той же структурой папок, что и в src/.

## Восстановление файлов

Чтобы вернуть файл обратно в проект:

\`\`\`bash
# Пример восстановления одного файла
mv UNUSED/src/components/SomeComponent.tsx src/components/

# Пример восстановления всей папки
mv UNUSED/src/components/ src/
\`\`\`

## Дата создания

Создано: ${new Date().toLocaleString('ru-RU')}

## Количество файлов

Всего перенесено: ${movedCount} файлов

## Список файлов

${UNUSED_FILES.map(file => `- ${file}`).join('\n')}
`;

  try {
    fs.writeFileSync('UNUSED/README.md', readmeContent);
    console.log('\n📝 Создан README.md в папке UNUSED/');
  } catch (error) {
    console.error('❌ Ошибка при создании README:', error.message);
  }
}

// Запускаем перенос
if (require.main === module) {
  moveUnusedFiles();
}

module.exports = { moveUnusedFiles, UNUSED_FILES };
