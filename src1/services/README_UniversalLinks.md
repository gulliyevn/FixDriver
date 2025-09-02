# Настройка универсальных ссылок для FixDrive

## Что нужно сделать в продакшене:

### 1. Домен и SSL
- Приобрести домен (например, `fixdrive.app`)
- Настроить SSL сертификат
- Создать веб-страницу для обработки ссылок

### 2. iOS (Associated Domains)
В `ios/FixDrive/FixDrive.entitlements`:
```xml
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:fixdrive.app</string>
</array>
```

В `ios/FixDrive/Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.fixdrive.app</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>fixdrive</string>
        </array>
    </dict>
</array>
```

### 3. Android (App Links)
В `android/app/src/main/AndroidManifest.xml`:
```xml
<activity>
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https" android:host="fixdrive.app" />
    </intent-filter>
</activity>
```

### 4. Веб-страница (/.well-known/apple-app-site-association)
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.fixdrive.app",
        "paths": ["/route*"]
      }
    ]
  }
}
```

### 5. Веб-страница (/.well-known/assetlinks.json)
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.fixdrive.app",
    "sha256_cert_fingerprints": ["SHA256_FINGERPRINT"]
  }
}]
```

### 6. Код приложения
В `App.tsx` добавить обработку ссылок:
```typescript
import { Linking } from 'react-native';
import UniversalLinkHandler from './src/services/UniversalLinkHandler';

// В useEffect:
Linking.addEventListener('url', (event) => {
  UniversalLinkHandler.handleIncomingUrl(event.url);
});
```

### 7. Обновить ClientTripShareService.ts
Заменить:
```typescript
const FIXDRIVE_DOMAIN = 'https://example.com';
```
На:
```typescript
const FIXDRIVE_DOMAIN = 'https://fixdrive.app';
```

### 8. Добавить проверку установки приложения
В `ClientTripShareService.ts` раскомментировать:
```typescript
const isAppInstalled = await checkAppInstalled();
const shareUrl = isAppInstalled ? fixDriveUrl : fallbackUrl;
```

## Формат ссылок
- `https://fixdrive.app/route?o=55.75,37.61&d=55.80,37.50&w=55.76,37.62|55.77,37.60&t=driving`
- `fixdrive://route?o=55.75,37.61&d=55.80,37.50&t=driving`

## Тестирование
1. Установить приложение на устройство
2. Открыть ссылку в браузере
3. Приложение должно открыться с маршрутом
