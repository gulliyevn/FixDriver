// Конфигурация подключения к БД
export const DATABASE_CONFIG = {
  // Development (локальная БД)
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fixdrive_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: false,
  },
  
  // Production (ваша БД - заполните когда получите ключи)
  production: {
    host: process.env.DB_HOST || 'your-db-host',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fixdrive_prod',
    username: process.env.DB_USER || 'your-db-user',
    password: process.env.DB_PASSWORD || 'your-db-password',
    ssl: true, // обычно в production требуется SSL
    connectionString: process.env.DB_CONNECTION_STRING || 'your-connection-string',
  },
  
  // Настройки API
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.fixdrive.com/api',
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '15000'),
    retries: 3,
  },
  
  // Настройки OTP
  otp: {
    // SMS провайдер настройки
    smsProvider: process.env.SMS_PROVIDER || 'twilio',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || 'your-twilio-sid',
      authToken: process.env.TWILIO_AUTH_TOKEN || 'your-twilio-token',
      fromNumber: process.env.TWILIO_PHONE_NUMBER || 'your-twilio-phone',
    },
    // Настройки кода
    codeLength: 6,
    expiryMinutes: 10,
    maxAttempts: 3,
  },
  
  // Другие сервисы
  services: {
    maps: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'your-google-maps-key',
      maptilerApiKey: process.env.EXPO_PUBLIC_MAPTILER_API_KEY || 'your-maptiler-key',
    },
    payment: {
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'your-stripe-public-key',
    },
    notifications: {
      firebaseServerKey: process.env.FIREBASE_SERVER_KEY || 'your-firebase-key',
    },
    traffic: {
      hereApiKey: process.env.HERE_API_KEY || 'your-here-api-key',
      openweatherApiKey: process.env.OPENWEATHER_API_KEY || 'your-openweather-key',
    },
  },
};

// Получение текущей конфигурации
export const getCurrentConfig = () => {
  return __DEV__ ? DATABASE_CONFIG.development : DATABASE_CONFIG.production;
};

// SQL запросы для БД
export const SQL_QUERIES = {
  // Таблица водителей (ваша схема)
  drivers: {
    create: `
      INSERT INTO drivers (
        email, password_hash, phone_number, first_name, last_name,
        license_number, license_expiry_date, vehicle_brand, vehicle_model,
        vehicle_number, vehicle_year, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, email, phone_number, first_name, last_name, 
                license_number, license_expiry_date, vehicle_brand, 
                vehicle_model, vehicle_number, vehicle_year, status, 
                rating, created_at, updated_at
    `,
    
    findByEmail: `
      SELECT id, email, password_hash, phone_number, first_name, last_name,
             license_number, license_expiry_date, vehicle_brand, vehicle_model,
             vehicle_number, vehicle_year, status, rating, created_at, updated_at
      FROM drivers WHERE email = $1
    `,
    
    findByPhone: `
      SELECT id, email, phone_number, first_name, last_name,
             license_number, license_expiry_date, vehicle_brand, vehicle_model,
             vehicle_number, vehicle_year, status, rating, created_at, updated_at
      FROM drivers WHERE phone_number = $1
    `,
    
    updateStatus: `
      UPDATE drivers SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 RETURNING *
    `,
    
    verifyPhone: `
      UPDATE drivers SET phone_verified = true, updated_at = CURRENT_TIMESTAMP 
      WHERE phone_number = $1 RETURNING *
    `,
  },
  
  // Таблица клиентов
  clients: {
    create: `
      INSERT INTO clients (email, password_hash, phone_number, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, phone_number, first_name, last_name, created_at, updated_at
    `,
    
    findByEmail: `
      SELECT id, email, password_hash, phone_number, first_name, last_name,
             created_at, updated_at
      FROM clients WHERE email = $1
    `,
    
    verifyPhone: `
      UPDATE clients SET phone_verified = true, updated_at = CURRENT_TIMESTAMP 
      WHERE phone_number = $1 RETURNING *
    `,
  },
  
  // OTP коды
  otp: {
    create: `
      INSERT INTO otp_codes (phone_number, code, expires_at, attempts)
      VALUES ($1, $2, $3, 0)
      ON CONFLICT (phone_number) 
      DO UPDATE SET code = $2, expires_at = $3, attempts = 0, created_at = CURRENT_TIMESTAMP
    `,
    
    verify: `
      SELECT code, expires_at, attempts 
      FROM otp_codes 
      WHERE phone_number = $1 AND expires_at > CURRENT_TIMESTAMP
    `,
    
    incrementAttempts: `
      UPDATE otp_codes SET attempts = attempts + 1 
      WHERE phone_number = $1
    `,
    
    delete: `
      DELETE FROM otp_codes WHERE phone_number = $1
    `,
  },
};

export default DATABASE_CONFIG; 