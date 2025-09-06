// Централизованное управление ключами переводов
// Предотвращает дубликаты и обеспечивает консистентность

export const TRANSLATION_KEYS = {
  // Аутентификация
  AUTH: {
    ROLE_SELECT: {
      CLIENT_TITLE: 'common.roleSelect.clientTitle',
      CLIENT_SUBTITLE: 'common.roleSelect.clientSubtitle',
      CLIENT_SAFE: 'common.roleSelect.clientSafe',
      CLIENT_TRACKING: 'common.roleSelect.clientTracking',
      CLIENT_PAYMENT: 'common.roleSelect.clientPayment',
      DRIVER_TITLE: 'common.roleSelect.driverTitle',
      DRIVER_SUBTITLE: 'common.roleSelect.driverSubtitle',
      DRIVER_FLEXIBLE: 'common.roleSelect.driverFlexible',
      DRIVER_INCOME: 'common.roleSelect.driverIncome',
      DRIVER_SUPPORT: 'common.roleSelect.driverSupport',
      CHOOSE: 'common.roleSelect.choose',
      ALREADY_ACCOUNT: 'common.roleSelect.alreadyAccount',
      LOGIN: 'common.roleSelect.login',
    },
    LOGIN: {
      TITLE: 'auth.login.title',
      SUBTITLE: 'auth.login.subtitle',
      EMAIL: 'auth.login.email',
      PASSWORD: 'auth.login.password',
      EMAIL_PLACEHOLDER: 'auth.login.emailPlaceholder',
      PASSWORD_PLACEHOLDER: 'auth.login.passwordPlaceholder',
      EMAIL_REQUIRED: 'auth.login.emailRequired',
      EMAIL_INVALID: 'auth.login.emailInvalid',
      PASSWORD_REQUIRED: 'auth.login.passwordRequired',
      FORGOT_PASSWORD: 'auth.login.forgotPassword',
      LOGIN_BUTTON: 'auth.login.loginButton',
      LOGIN_ERROR: 'auth.login.loginError',
      LOGIN_ERROR_GENERIC: 'auth.login.loginErrorGeneric',
      USER_NOT_FOUND: 'auth.login.userNotFound',
      INVALID_PASSWORD: 'auth.login.invalidPassword',
      OR: 'auth.login.or',
      NO_ACCOUNT: 'auth.login.noAccount',
      REGISTER_LINK: 'auth.login.registerLink',
      SOCIAL_LOGIN: 'auth.login.socialLogin',
    },
    REGISTER: {
      TITLE: 'auth.register.title',
      CLIENT_TITLE: 'auth.register.clientTitle',
      DRIVER_TITLE: 'auth.register.driverTitle',
      CLIENT_SUBTITLE: 'auth.register.clientSubtitle',
      DRIVER_SUBTITLE: 'auth.register.driverSubtitle',
      FIRST_NAME: 'auth.register.firstName',
      LAST_NAME: 'auth.register.lastName',
      EMAIL: 'auth.register.email',
      PHONE: 'auth.register.phone',
      PASSWORD: 'auth.register.password',
      CONFIRM_PASSWORD: 'auth.register.confirmPassword',
      FIRST_NAME_PLACEHOLDER: 'auth.register.firstNamePlaceholder',
      LAST_NAME_PLACEHOLDER: 'auth.register.lastNamePlaceholder',
      EMAIL_PLACEHOLDER: 'auth.register.emailPlaceholder',
      PHONE_PLACEHOLDER: 'auth.register.phonePlaceholder',
      PASSWORD_PLACEHOLDER: 'auth.register.passwordPlaceholder',
      CONFIRM_PASSWORD_PLACEHOLDER: 'auth.register.confirmPasswordPlaceholder',
      FIRST_NAME_REQUIRED: 'auth.register.firstNameRequired',
      LAST_NAME_REQUIRED: 'auth.register.lastNameRequired',
      EMAIL_REQUIRED: 'auth.register.emailRequired',
      EMAIL_INVALID: 'auth.register.emailInvalid',
      PHONE_REQUIRED: 'auth.register.phoneRequired',
      PASSWORD_REQUIRED: 'auth.register.passwordRequired',
      PASSWORD_SHORT: 'auth.register.passwordShort',
      PASSWORD_POLICY: 'auth.register.passwordPolicy',
      POLICY_MIN_LENGTH: 'auth.register.policy.minLength',
      POLICY_UPPERCASE: 'auth.register.policy.uppercase',
      POLICY_DIGIT: 'auth.register.policy.digit',
      POLICY_SPECIAL: 'auth.register.policy.special',
      PASSWORDS_DONT_MATCH: 'auth.register.passwordsDontMatch',
      AGREEMENT_REQUIRED: 'auth.register.agreementRequired',
      AGREEMENT_TEXT: 'auth.register.agreementText',
      REGISTER_BUTTON: 'auth.register.registerButton',
      SUCCESS_TITLE: 'auth.register.successTitle',
      SUCCESS_TEXT: 'auth.register.successText',
      ERROR_TITLE: 'auth.register.errorTitle',
      ERROR_TEXT: 'auth.register.errorText',
      HAVE_ACCOUNT: 'auth.register.haveAccount',
      LOGIN_LINK: 'auth.register.loginLink',
      COUNTRY: 'auth.register.country',
      COUNTRY_PLACEHOLDER: 'auth.register.countryPlaceholder',
      LICENSE_NUMBER: 'auth.register.licenseNumber',
      LICENSE_NUMBER_PLACEHOLDER: 'auth.register.licenseNumberPlaceholder',
      LICENSE_EXPIRY: 'auth.register.licenseExpiry',
      LICENSE_EXPIRY_PLACEHOLDER: 'auth.register.licenseExpiryPlaceholder',
      VEHICLE_NUMBER: 'auth.register.vehicleNumber',
      VEHICLE_NUMBER_PLACEHOLDER: 'auth.register.vehicleNumberPlaceholder',
      EXPERIENCE: 'auth.register.experience',
      EXPERIENCE_PLACEHOLDER: 'auth.register.experiencePlaceholder',
      TARIFF: 'auth.register.tariff',
      TARIFF_PLACEHOLDER: 'auth.register.tariffPlaceholder',
      CAR_BRAND: 'auth.register.carBrand',
      CAR_BRAND_PLACEHOLDER: 'auth.register.carBrandPlaceholder',
      CAR_MODEL: 'auth.register.carModel',
      CAR_MODEL_PLACEHOLDER: 'auth.register.carModelPlaceholder',
      CAR_YEAR: 'auth.register.carYear',
      CAR_YEAR_PLACEHOLDER: 'auth.register.carYearPlaceholder',
      CAR_MILEAGE: 'auth.register.carMileage',
      CAR_MILEAGE_PLACEHOLDER: 'auth.register.carMileagePlaceholder',
      LICENSE_PHOTO: 'auth.register.licensePhoto',
      LICENSE_PHOTO_UPLOAD: 'auth.register.licensePhotoUpload',
      TECH_PASSPORT_PHOTO: 'auth.register.techPassportPhoto',
      TECH_PASSPORT_PHOTO_UPLOAD: 'auth.register.techPassportPhotoUpload',
      AGREE_PREFIX: 'auth.register.agreePrefix',
      TERMS: 'auth.register.terms',
      PRIVACY: 'auth.register.privacy',
      AND: 'auth.register.and',
    },
    TERMS: {
      TITLE: 'auth.terms.title',
      SECTION1_TITLE: 'auth.terms.section1.title',
      SECTION1_CONTENT: 'auth.terms.section1.content',
      SECTION2_TITLE: 'auth.terms.section2.title',
      SECTION2_CONTENT: 'auth.terms.section2.content',
      SECTION3_TITLE: 'auth.terms.section3.title',
      SECTION3_CONTENT: 'auth.terms.section3.content',
      SECTION4_TITLE: 'auth.terms.section4.title',
      SECTION4_CONTENT: 'auth.terms.section4.content',
      SECTION5_TITLE: 'auth.terms.section5.title',
      SECTION5_CONTENT: 'auth.terms.section5.content',
    },
    PRIVACY: {
      TITLE: 'auth.privacy.title',
      SECTION1_TITLE: 'auth.privacy.section1.title',
      SECTION1_CONTENT: 'auth.privacy.section1.content',
      SECTION2_TITLE: 'auth.privacy.section2.title',
      SECTION2_CONTENT: 'auth.privacy.section2.content',
      SECTION3_TITLE: 'auth.privacy.section3.title',
      SECTION3_CONTENT: 'auth.privacy.section3.content',
      SECTION4_TITLE: 'auth.privacy.section4.title',
      SECTION4_CONTENT: 'auth.privacy.section4.content',
      SECTION5_TITLE: 'auth.privacy.section5.title',
      SECTION5_CONTENT: 'auth.privacy.section5.content',
    },
    DRIVER_REGISTER: {
      TITLE: 'auth.driverRegister.title',
      SUBTITLE: 'auth.driverRegister.subtitle',
      PERSONAL_INFO: 'auth.driverRegister.personalInfo',
      DOCUMENTS: 'auth.driverRegister.documents',
      VEHICLE: 'auth.driverRegister.vehicle',
      SECURITY: 'auth.driverRegister.security',
      COUNTRY: 'auth.driverRegister.country',
      LICENSE_NUMBER: 'auth.driverRegister.licenseNumber',
      LICENSE_EXPIRY: 'auth.driverRegister.licenseExpiry',
      LICENSE_PHOTO: 'auth.driverRegister.licensePhoto',
      PASSPORT_PHOTO: 'auth.driverRegister.passportPhoto',
      VEHICLE_NUMBER: 'auth.driverRegister.vehicleNumber',
      EXPERIENCE: 'auth.driverRegister.experience',
      TARIFF: 'auth.driverRegister.tariff',
      CAR_BRAND: 'auth.driverRegister.carBrand',
      CAR_MODEL: 'auth.driverRegister.carModel',
      CAR_YEAR: 'auth.driverRegister.carYear',
      CAR_MILEAGE: 'auth.driverRegister.carMileage',
      UPLOAD_PHOTO: 'auth.driverRegister.uploadPhoto',
    },
  },

  // Общие
  COMMON: {
    BUTTONS: {
      LOGIN: 'common.buttons.login',
      REGISTER: 'common.buttons.register',
      CANCEL: 'common.buttons.cancel',
      SAVE: 'common.buttons.save',
      DELETE: 'common.buttons.delete',
      EDIT: 'common.buttons.edit',
      BACK: 'common.buttons.back',
      NEXT: 'common.buttons.next',
      SUBMIT: 'common.buttons.submit',
      CONFIRM: 'common.buttons.confirm',
      CONTACT_SUPPORT: 'common.buttons.contactSupport',
    },
    LABELS: {
      EMAIL: 'common.labels.email',
      PASSWORD: 'common.labels.password',
      FIRST_NAME: 'common.labels.firstName',
      LAST_NAME: 'common.labels.lastName',
      PHONE: 'common.labels.phone',
      ADDRESS: 'common.labels.address',
    },
    MESSAGES: {
      LOADING: 'common.messages.loading',
      ERROR: 'common.messages.error',
      SUCCESS: 'common.messages.success',
      NO_DATA: 'common.messages.noData',
      RETRY: 'common.messages.retry',
    },
  },

  // Навигация
  NAVIGATION: {
    MAP: 'navigation.map',
    DRIVERS: 'navigation.drivers',
    SCHEDULE: 'navigation.schedule',
    CHATS: 'navigation.chats',
    PROFILE: 'navigation.profile',
    ORDERS: 'navigation.orders',
    EARNINGS: 'navigation.earnings',
  },

  // Профиль
  PROFILE: {
    TITLE: 'profile.title',
    EDIT_PROFILE: 'profile.editProfile',
    SETTINGS: 'profile.settings',
    NOTIFICATIONS: 'profile.notifications',
    LANGUAGE: 'profile.language',
    THEME: 'profile.theme',
    LOGOUT: 'profile.logout',
  },
} as const;

// Типы для TypeScript
export type TranslationKey = typeof TRANSLATION_KEYS[keyof typeof TRANSLATION_KEYS];

// Функция для получения ключа с проверкой
export const getTranslationKey = (key: string): string => {
  // Здесь можно добавить логику проверки существования ключа
  return key;
};

// Функция для проверки дубликатов
export const checkDuplicateKeys = (): string[] => {
  const keys: string[] = [];
  const duplicates: string[] = [];

  const extractKeys = (obj: any, prefix = ''): void => {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        if (keys.includes(value)) {
          duplicates.push(value);
        } else {
          keys.push(value);
        }
      } else if (typeof value === 'object') {
        extractKeys(value, fullKey);
      }
    }
  };

  extractKeys(TRANSLATION_KEYS);
  return duplicates;
};
