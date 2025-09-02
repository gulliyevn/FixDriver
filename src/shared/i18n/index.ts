// Централизованная система переводов для нового кода
// Используем правильные ключи по мере создания компонентов

import * as React from 'react';
import { TRANSLATION_KEYS } from './translationKeys';

// Типы
export interface I18nConfig {
  language: string;
  fallbackLanguage: string;
}

export interface TranslationData {
  [key: string]: string | TranslationData;
}

// Конфигурация
const config: I18nConfig = {
  language: 'ru',
  fallbackLanguage: 'en',
};

// Временные переводы (пока не создали полные файлы)
const temporaryTranslations: Record<string, TranslationData> = {
  ru: {
    // Аутентификация
    auth: {
      roleSelect: {
        clientTitle: 'Клиент',
        clientSubtitle: 'Безопасные и удобные поездки',
        clientSafe: 'Безопасные поездки с проверенными водителями',
        clientTracking: 'Отслеживание поездки в реальном времени',
        clientPayment: 'Безопасные способы оплаты',
        driverTitle: 'Водитель',
        driverSubtitle: 'Зарабатывайте на своем автомобиле',
        driverFlexible: 'Работайте когда хотите',
        driverIncome: 'Хорошие возможности заработка',
        driverSupport: 'Поддержка 24/7',
        choose: 'Выбрать',
        alreadyAccount: 'Уже есть аккаунт?',
        login: 'Войти',
      },
      login: {
        title: 'Добро пожаловать',
        subtitle: 'Войдите в свой аккаунт',
        email: 'Почта',
        password: 'Пароль',
        emailPlaceholder: 'Введите почту',
        passwordPlaceholder: 'Введите пароль',
        emailRequired: 'Почта обязательна',
        emailInvalid: 'Неверный формат почты',
        passwordRequired: 'Пароль обязателен',
        forgotPassword: 'Забыли пароль?',
        loginButton: 'Войти',
        loginError: 'Ошибка входа',
        loginErrorGeneric: 'Что-то пошло не так',
        or: 'или',
        noAccount: 'Нет аккаунта?',
        registerLink: 'Зарегистрироваться',
      },
      register: {
        title: 'Регистрация',
        clientTitle: 'Регистрация клиента',
        driverTitle: 'Регистрация водителя',
        clientSubtitle: 'Создайте аккаунт клиента',
        driverSubtitle: 'Создайте аккаунт водителя',
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Почта',
        phone: 'Телефон',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        firstNamePlaceholder: 'Введите имя',
        lastNamePlaceholder: 'Введите фамилию',
        emailPlaceholder: 'Введите почту',
        phonePlaceholder: 'Введите номер телефона',
        passwordPlaceholder: 'Введите пароль',
        confirmPasswordPlaceholder: 'Подтвердите пароль',
        country: 'Страна выдачи',
        countryPlaceholder: 'Выберите страну',
        licenseNumber: 'Номер Водительского Удостоверения',
        licenseNumberPlaceholder: '12 АБ 345678',
        licenseExpiry: 'Срок действия ВУ',
        licenseExpiryPlaceholder: '31.12.2030',
        vehicleNumber: 'Номер автомобиля',
        vehicleNumberPlaceholder: 'А123БВ77',
        experience: 'Опыт вождения',
        experiencePlaceholder: 'Выберите опыт',
        countryRequired: 'Укажите страну',
        licenseNumberRequired: 'Укажите номер ВУ',
        licenseExpiryRequired: 'Укажите срок действия ВУ',
        vehicleNumberRequired: 'Укажите номер автомобиля',
        experienceRequired: 'Укажите опыт вождения',
        tariffRequired: 'Выберите тариф',
        carBrandRequired: 'Выберите марку',
        carModelRequired: 'Выберите модель',
        carYearRequired: 'Выберите год выпуска',
        carMileageRequired: 'Выберите пробег',
        experienceUpTo1: 'До 1 года',
        experience1: '1 год',
        experience2: '2 года',
        experience3: '3 года',
        experience4: '4 года',
        experience5: '5 лет',
        experience6: '6 лет',
        experience7: '7 лет',
        experience8: '8 лет',
        experience9: '9 лет',
        experience10: '10 лет',
        experience10plus: '10+ лет',
        tariff: 'Тариф',
        tariffPlaceholder: 'Выберите тариф',
        tariffEconomy: 'Эконом',
        tariffStandard: 'Стандарт',
        tariffPremium: 'Премиум',
        tariffBusiness: 'Бизнес',
        carBrand: 'Марка',
        carBrandPlaceholder: 'Выберите марку',
        carModel: 'Модель',
        carModelPlaceholder: 'Выберите модель',
        carYear: 'Год выпуска',
        carYearPlaceholder: 'Выберите год',
        carMileage: 'Пробег (км)',
        carMileagePlaceholder: 'Выберите пробег',
        mileageUpTo50k: 'до 50k',
        mileageUpTo100k: 'до 100k',
        mileageUpTo150k: 'до 150k',
        mileage150kPlus: '150k+',
        licensePhoto: 'Фото Водительского Удостоверения',
        licensePhotoUpload: 'Загрузить фото Водительского Удостоверения',
        licensePhotoRequired: 'Загрузите фото ВУ',
        techPassportPhoto: 'Фото техпаспорта',
        techPassportPhotoUpload: 'Загрузить фото техпаспорта',
        techPassportPhotoRequired: 'Загрузите фото техпаспорта',
        agreePrefix: 'Я согласен с',
        terms: 'Условиями',
        privacy: 'Политикой конфиденциальности',
        and: 'и',
        firstNameRequired: 'Имя обязательно',
        lastNameRequired: 'Фамилия обязательна',
        emailRequired: 'Почта обязательна',
        emailInvalid: 'Неверный формат почты',
        phoneRequired: 'Телефон обязателен',
        passwordRequired: 'Пароль обязателен',
        passwordShort: 'Пароль должен быть не менее 8 символов',
        passwordsDontMatch: 'Пароли не совпадают',
        agreementRequired: 'Согласитесь с условиями',
        agreementText: 'Я согласен с Условиями и Политикой конфиденциальности',
        registerButton: 'Зарегистрироваться',
        successTitle: 'Успешно',
        successText: 'Регистрация прошла успешно!',
        errorTitle: 'Ошибка',
        errorText: 'Регистрация не удалась. Попробуйте снова.',
        haveAccount: 'Уже есть аккаунт?',
        loginLink: 'Войти',
      },
      terms: {
        title: 'Условия использования',
        section1: {
          title: '1. Общие положения',
          content: 'Здесь будет текст раздела 1...',
        },
        section2: {
          title: '2. Условия использования сервиса',
          content: 'Здесь будет текст раздела 2...',
        },
        section3: {
          title: '3. Обязанности пользователей',
          content: 'Здесь будет текст раздела 3...',
        },
        section4: {
          title: '4. Ограничения ответственности',
          content: 'Здесь будет текст раздела 4...',
        },
        section5: {
          title: '5. Заключительные положения',
          content: 'Здесь будет текст раздела 5...',
        },
      },
      privacy: {
        title: 'Политика конфиденциальности',
        section1: {
          title: '1. Сбор информации',
          content: 'Здесь будет текст раздела 1...',
        },
        section2: {
          title: '2. Использование информации',
          content: 'Здесь будет текст раздела 2...',
        },
        section3: {
          title: '3. Защита данных',
          content: 'Здесь будет текст раздела 3...',
        },
        section4: {
          title: '4. Передача данных',
          content: 'Здесь будет текст раздела 4...',
        },
        section5: {
          title: '5. Ваши права',
          content: 'Здесь будет текст раздела 5...',
        },
      },
    },
    // Общие
    common: {
      buttons: {
        login: 'Войти',
        register: 'Зарегистрироваться',
        cancel: 'Отмена',
        save: 'Сохранить',
        delete: 'Удалить',
        edit: 'Редактировать',
        back: 'Назад',
        next: 'Далее',
        submit: 'Отправить',
        confirm: 'Подтвердить',
      },
      labels: {
        email: 'Почта',
        password: 'Пароль',
        firstName: 'Имя',
        lastName: 'Фамилия',
        phone: 'Телефон',
        address: 'Адрес',
        search: 'Поиск',
      },
      noOptions: 'Нет вариантов',
      permissionRequired: 'Требуется разрешение',
      mediaPermissionDenied: 'Доступ к медиатеке не предоставлен',
      messages: {
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успешно',
        noData: 'Нет данных',
        retry: 'Попробовать снова',
      },
    },
    // Навигация
    navigation: {
      map: 'Карта',
      drivers: 'Водители',
      schedule: 'Расписание',
      chats: 'Чаты',
      profile: 'Профиль',
      orders: 'Заказы',
      earnings: 'Заработки',
    },
    // Профиль
    profile: {
      title: 'Профиль',
      editProfile: 'Редактировать профиль',
      settings: 'Настройки',
      notifications: 'Уведомления',
      language: 'Язык',
      theme: 'Тема',
      logout: 'Выйти',
    },
  },
  en: {
    // Аутентификация
    auth: {
      roleSelect: {
        clientTitle: 'Client',
        clientSubtitle: 'Safe and convenient rides',
        clientSafe: 'Safe rides with verified drivers',
        clientTracking: 'Real-time trip tracking',
        clientPayment: 'Secure payment methods',
        driverTitle: 'Driver',
        driverSubtitle: 'Earn money with your car',
        driverFlexible: 'Work when you want',
        driverIncome: 'Good income opportunities',
        driverSupport: '24/7 support',
        choose: 'Choose',
        alreadyAccount: 'Already have an account?',
        login: 'Login',
      },
      login: {
        title: 'Welcome',
        subtitle: 'Sign in to your account',
        email: 'Email',
        password: 'Password',
        emailPlaceholder: 'Enter email',
        passwordPlaceholder: 'Enter password',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        passwordRequired: 'Password is required',
        forgotPassword: 'Forgot password?',
        loginButton: 'Login',
        loginError: 'Login Error',
        loginErrorGeneric: 'Something went wrong',
        or: 'or',
        noAccount: "Don't have an account?",
        registerLink: 'Register',
      },
      register: {
        title: 'Register',
        clientTitle: 'Client Registration',
        driverTitle: 'Driver Registration',
        clientSubtitle: 'Create your client account',
        driverSubtitle: 'Create your driver account',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        firstNamePlaceholder: 'Enter first name',
        lastNamePlaceholder: 'Enter last name',
        emailPlaceholder: 'Enter email',
        phonePlaceholder: 'Enter phone number',
        passwordPlaceholder: 'Enter password',
        confirmPasswordPlaceholder: 'Confirm password',
        country: 'Country of issue',
        countryPlaceholder: 'Select country',
        licenseNumber: 'License number',
        licenseNumberPlaceholder: '12 AB 345678',
        licenseExpiry: 'License expiry',
        licenseExpiryPlaceholder: '31.12.2030',
        vehicleNumber: 'Vehicle number',
        vehicleNumberPlaceholder: 'A123BC77',
        experience: 'Driving experience',
        experiencePlaceholder: 'Select experience',
        countryRequired: 'Country is required',
        licenseNumberRequired: 'License number is required',
        licenseExpiryRequired: 'License expiry is required',
        vehicleNumberRequired: 'Vehicle number is required',
        experienceRequired: 'Driving experience is required',
        tariffRequired: 'Tariff is required',
        carBrandRequired: 'Brand is required',
        carModelRequired: 'Model is required',
        carYearRequired: 'Year is required',
        carMileageRequired: 'Mileage is required',
        experienceUpTo1: 'Up to 1 year',
        experience1: '1 year',
        experience2: '2 years',
        experience3: '3 years',
        experience4: '4 years',
        experience5: '5 years',
        experience6: '6 years',
        experience7: '7 years',
        experience8: '8 years',
        experience9: '9 years',
        experience10: '10 years',
        experience10plus: '10+ years',
        tariff: 'Tariff',
        tariffPlaceholder: 'Select tariff',
        tariffEconomy: 'Economy',
        tariffStandard: 'Standard',
        tariffPremium: 'Premium',
        tariffBusiness: 'Business',
        carBrand: 'Brand',
        carBrandPlaceholder: 'Select brand',
        carModel: 'Model',
        carModelPlaceholder: 'Select model',
        carYear: 'Year',
        carYearPlaceholder: 'Select year',
        carMileage: 'Mileage (km)',
        carMileagePlaceholder: 'Select mileage',
        mileageUpTo50k: 'up to 50k',
        mileageUpTo100k: 'up to 100k',
        mileageUpTo150k: 'up to 150k',
        mileage150kPlus: '150k+',
        licensePhoto: 'License photo',
        licensePhotoUpload: 'Upload license photo',
        licensePhotoRequired: 'Upload license photo',
        techPassportPhoto: 'Tech passport photo',
        techPassportPhotoUpload: 'Upload tech passport photo',
        techPassportPhotoRequired: 'Upload tech passport photo',
        agreePrefix: 'I agree to the',
        terms: 'Terms',
        privacy: 'Privacy Policy',
        and: 'and',
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        phoneRequired: 'Phone is required',
        passwordRequired: 'Password is required',
        passwordShort: 'Password must be at least 8 characters',
        passwordsDontMatch: 'Passwords do not match',
        agreementRequired: 'Please agree to the terms',
        agreementText: 'I agree to the Terms and Privacy Policy',
        registerButton: 'Register',
        successTitle: 'Success',
        successText: 'Registration successful!',
        errorTitle: 'Error',
        errorText: 'Registration failed. Please try again.',
        haveAccount: 'Already have an account?',
        loginLink: 'Login',
      },
      terms: {
        title: 'Terms of Service',
        section1: {
          title: '1. General Provisions',
          content: 'Section 1 content will be here...',
        },
        section2: {
          title: '2. Service Usage Terms',
          content: 'Section 2 content will be here...',
        },
        section3: {
          title: '3. User Obligations',
          content: 'Section 3 content will be here...',
        },
        section4: {
          title: '4. Liability Limitations',
          content: 'Section 4 content will be here...',
        },
        section5: {
          title: '5. Final Provisions',
          content: 'Section 5 content will be here...',
        },
      },
      privacy: {
        title: 'Privacy Policy',
        section1: {
          title: '1. Information Collection',
          content: 'Section 1 content will be here...',
        },
        section2: {
          title: '2. Information Usage',
          content: 'Section 2 content will be here...',
        },
        section3: {
          title: '3. Data Protection',
          content: 'Section 3 content will be here...',
        },
        section4: {
          title: '4. Data Transfer',
          content: 'Section 4 content will be here...',
        },
        section5: {
          title: '5. Your Rights',
          content: 'Section 5 content will be here...',
        },
      },
    },
    // Общие
    common: {
      buttons: {
        login: 'Login',
        register: 'Register',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
        confirm: 'Confirm',
      },
      labels: {
        email: 'Email',
        password: 'Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone',
        address: 'Address',
        search: 'Search',
      },
      noOptions: 'No options',
      permissionRequired: 'Permission required',
      mediaPermissionDenied: 'Media library access denied',
      messages: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        noData: 'No data',
        retry: 'Try again',
      },
    },
    // Навигация
    navigation: {
      map: 'Map',
      drivers: 'Drivers',
      schedule: 'Schedule',
      chats: 'Chats',
      profile: 'Profile',
      orders: 'Orders',
      earnings: 'Earnings',
    },
    // Профиль
    profile: {
      title: 'Profile',
      editProfile: 'Edit Profile',
      settings: 'Settings',
      notifications: 'Notifications',
      language: 'Language',
      theme: 'Theme',
      logout: 'Logout',
    },
  },
};

// Функция для получения перевода
export const t = (key: string, language: string = config.language): string => {
  const keys = key.split('.');
  let translation: any = temporaryTranslations[language] || temporaryTranslations[config.fallbackLanguage];
  
  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      // Fallback
      const fallbackTranslation: any = temporaryTranslations[config.fallbackLanguage];
      let fallback = fallbackTranslation;
      for (const fk of keys) {
        if (fallback && fallback[fk]) {
          fallback = fallback[fk];
        } else {
          return key; // Возвращаем ключ если перевод не найден
        }
      }
      return fallback;
    }
  }
  
  return typeof translation === 'string' ? translation : key;
};

// Хук для использования в компонентах
export const useI18n = () => {
  const [language, setLanguage] = React.useState(config.language);
  
  const translate = (key: string): string => {
    return t(key, language);
  };
  
  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    config.language = newLanguage;
  };
  
  return {
    t: translate,
    language,
    changeLanguage,
  };
};

// Экспортируем ключи для TypeScript
export { TRANSLATION_KEYS };
