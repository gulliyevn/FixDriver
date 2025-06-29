// Конфигурация подключения к БД
export const DATABASE_CONFIG = {
  // Development (локальная БД)
  development: {
    host: 'localhost',
    port: 5432,
    database: 'fixdrive_dev',
    username: 'postgres',
    password: 'password',
    ssl: false,
  },
  
  // Production (ваша БД - заполните когда получите ключи)
  production: {
    host: 'YOUR_DB_HOST', // например: 'db.example.com'
    port: 5432,
    database: 'YOUR_DB_NAME', // например: 'fixdrive_prod'
    username: 'YOUR_DB_USER',
    password: 'YOUR_DB_PASSWORD',
    ssl: true, // обычно в production требуется SSL
    connectionString: 'YOUR_CONNECTION_STRING', // полная строка подключения
  },
  
  // Настройки API
  api: {
    baseUrl: __DEV__ 
      ? 'http://localhost:3000/api' 
      : 'https://your-api-domain.com/api',
    timeout: 15000, // 15 секунд для БД запросов
    retries: 3,
  },
  
  // Настройки OTP
  otp: {
    // SMS провайдер настройки
    smsProvider: 'twilio', // 'twilio' | 'aws-sns' | 'local'
    twilio: {
      accountSid: 'YOUR_TWILIO_SID',
      authToken: 'YOUR_TWILIO_TOKEN',
      fromNumber: 'YOUR_TWILIO_PHONE',
    },
    // Настройки кода
    codeLength: 6,
    expiryMinutes: 10,
    maxAttempts: 3,
  },
  
  // Другие сервисы
  services: {
    maps: {
      googleMapsApiKey: 'YOUR_GOOGLE_MAPS_KEY',
    },
    payment: {
      stripePublishableKey: 'YOUR_STRIPE_PUBLIC_KEY',
    },
    notifications: {
      firebaseServerKey: 'YOUR_FIREBASE_KEY',
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