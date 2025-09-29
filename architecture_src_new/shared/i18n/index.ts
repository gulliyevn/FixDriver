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

// ===== Context =====
type I18nContextValue = {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

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
        rememberMe: 'Запомнить меня',
        loginError: 'Ошибка входа',
        loginErrorGeneric: 'Что-то пошло не так',
        userNotFound: 'Пользователь с таким email не найден',
        invalidPassword: 'Неверный пароль',
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
        passwordPolicy: 'Пароль: минимум 8 символов, 1 заглавная, 1 цифра, 1 спецсимвол',
        policy: {
          minLength: 'Минимум 8 символов',
          uppercase: 'Хотя бы одна заглавная буква',
          digit: 'Хотя бы одна цифра',
          special: 'Хотя бы один спецсимвол',
        },
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
        contactSupport: 'Связаться с поддержкой',
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
      back: 'Назад',
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
          loginRequired: 'Войдите в аккаунт для просмотра профиля',
      editProfile: 'Редактировать профиль',
      editClientProfile: 'Редактировать профиль клиента',
      editDriverProfile: 'Редактировать профиль водителя',
      personalInfo: 'Личная информация',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      phone: 'Телефон',
      firstNamePlaceholder: 'Введите имя',
      lastNamePlaceholder: 'Введите фамилию',
      emailPlaceholder: 'Введите email',
      phonePlaceholder: 'Введите телефон',
      verify: 'Подтвердить',
      emailVerificationSent: 'Письмо подтверждения отправлено',
      phoneVerificationSent: 'SMS подтверждения отправлен',
      verificationError: 'Ошибка отправки подтверждения',
      profileUpdated: 'Профиль обновлен',
      updateError: 'Ошибка обновления профиля',
      unsavedChanges: 'Несохраненные изменения',
      unsavedChangesMessage: 'У вас есть несохраненные изменения. Что делать?',
      discardChanges: 'Отменить изменения',
      familyMembers: 'Члены семьи',
      familyMembersDescription: 'Добавьте членов семьи для совместных поездок',
      addFamilyMember: 'Добавить члена семьи',
      vehicles: 'Автомобили',
      vehiclesDescription: 'Управляйте своими автомобилями',
      addVehicle: 'Добавить автомобиль',
      settings: 'Настройки',
          notifications: 'Уведомления',
          language: 'Язык',
          theme: 'Тема',
      logout: {
        title: 'Выйти',
        message: 'Вы уверены, что хотите выйти?',
        confirm: 'Да, выйти',
      },
      menu: {
        balance: 'Баланс',
        cards: 'Карты',
        trips: 'Поездки',
        rating: 'Рейтинг',
        paymentHistory: 'История платежей',
        settings: 'Настройки',
        residence: 'Место жительства',
        help: 'Помощь',
        about: 'О приложении',
        vehicles: 'Транспорт',
        premium: 'Премиум',
      },
    },
    // Премиум пакеты
    premium: {
      title: 'Премиум статус',
      periods: {
        month: 'Месяц',
        year: 'Год',
      },
      packages: {
        standard: 'Стандарт',
        free: 'Бесплатный',
        plus: 'Плюс',
        premium: 'Премиум',
        premiumPlus: 'Премиум+',
      },
      descriptions: {
        free: 'Базовые функции без дополнительных возможностей.',
        plus: 'Приоритет, лучшие водители, кэшбэк 2%.',
        premium: 'Всё из Плюс, эксклюзивные водители, кэшбэк 5%, VIP поддержка.',
        premiumPlus: 'Всё из Премиум, максимальные привилегии, кэшбэк 10%, персональный менеджер.',
      },
      features: {
        commission: 'Комиссия с клиента',
        cashback: 'Кэшбэк FixCash за поездку',
        priority: 'Приоритет при выборе водителя',
        support: 'Служба поддержки',
        waitGuarantee: 'Гарантия ожидания',
        freeCancellation: 'Бесплатная отмена поездки',
        multiRoute: 'Мульти-точки маршрута',
        calendarIntegration: 'Интеграция с календарём',
        earlyAccess: 'Ранний доступ к акциям',
        placeholder: 'Функция премиум пакета',
      },
      values: {
        standard: 'Стандартная',
        fast: 'Быстрая',
        vip: 'VIP',
        personal: 'Персональный',
        high: 'Высокий',
        maximum: 'Максимум',
      },
      purchase: {
        confirmTitle: 'Подтверждение покупки',
        confirmMessage: 'Вы уверены, что хотите приобрести план?',
        cancel: 'Отмена',
        cancelButton: 'Отмена',
        confirmButton: 'Подтвердить',
        insufficientFunds: 'Недостаточно средств',
        insufficientMessage: 'У вас недостаточно средств для покупки этого плана.',
        topUpBalance: 'Пополнить баланс',
      },
    },
    // Заработки
    earnings: {
      title: 'Заработки',
      topDrivers: 'Топ водители',
      earnings: 'Заработок',
      rides: 'Поездки',
      level: 'Уровень',
      position: 'Позиция',
      today: 'Сегодня',
      week: 'Неделя',
      month: 'Месяц',
      year: 'Год',
      filter: 'Фильтр',
      changeStatus: 'Изменить статус',
    },
    // Карта
    map: {
      title: 'Карта',
      currentLocation: 'Текущее местоположение',
      searchPlaceholder: 'Поиск места...',
      noResults: 'Результаты не найдены',
      permissionDenied: 'Доступ к местоположению запрещен',
      locationError: 'Ошибка получения местоположения',
      nearbyDrivers: 'Ближайшие водители',
      noDriversFound: 'Водители не найдены',
      driverAvailable: 'Доступен',
      driverBusy: 'Занят',
      driverOffline: 'Офлайн',
      reportDriver: 'Пожаловаться на водителя',
      shareRoute: 'Поделиться маршрутом',
      settings: 'Настройки',
      mapType: 'Тип карты',
      standard: 'Стандартная',
      satellite: 'Спутник',
      hybrid: 'Гибридная',
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
        rememberMe: 'Remember me',
        loginError: 'Login Error',
        loginErrorGeneric: 'Something went wrong',
        userNotFound: 'User with this email not found',
        invalidPassword: 'Invalid password',
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
        passwordPolicy: 'Password: min 8 chars, 1 uppercase, 1 digit, 1 special',
        policy: {
          minLength: 'At least 8 characters',
          uppercase: 'At least one uppercase letter',
          digit: 'At least one digit',
          special: 'At least one special character',
        },
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

    // Клиентские экраны
    client: {
      driversScreen: {
        actions: {
          chat: 'Чат',
          call: 'Звонок',
        },
        call: {
          callTitle: 'Связаться с водителем',
          internetCall: 'Интернет-звонок',
          networkCall: 'Звонок по сети',
        },
      },
    },

    // Водительские диалоги
    driver: {
      tripDialogs: {
        startTrip: {
          title: 'Начать поездку',
          message: 'Начать поездку с {clientName}?',
        },
        waiting: {
          title: 'Ожидание',
          message: 'Ожидание {clientName}...',
        },
        beginTrip: {
          title: 'Начать поездку',
          message: 'Начать поездку с {clientName}?',
        },
        cancelTrip: {
          title: 'Отменить поездку',
          message: 'Отменить поездку с {clientName}?',
        },
        endTrip: {
          title: 'Завершить поездку',
          message: 'Завершить поездку с {clientName}?',
        },
        emergency: {
          title: 'Экстренные действия',
          message: 'Выберите действие:',
          stop: 'Остановить',
          end: 'Завершить',
        },
        stopTrip: {
          title: 'Остановить поездку',
          message: 'Остановить поездку?',
        },
        forceEndTrip: {
          title: 'Принудительно завершить',
          message: 'Принудительно завершить поездку?',
        },
        continueTrip: {
          title: 'Продолжить поездку',
          message: 'Продолжить поездку?',
        },
        buttons: {
          cancelAction: 'Отмена',
          okAction: 'ОК',
        },
      },
      status: {
        goOnlineMessage: 'Вы станете онлайн и сможете принимать заказы',
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
        contactSupport: 'Contact support',
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
      back: 'Back',
      close: 'Закрыть',
      rating: {
        title: 'Оцените поездку',
        message: 'Пожалуйста, оцените качество поездки',
        commentLabel: 'Комментарий (необязательно)',
        commentRequired: 'Комментарий (обязательно)',
        commentPlaceholder: 'Оставьте комментарий о поездке...',
        commentStopPlaceholder: 'Объясните причину остановки...',
        commentEndPlaceholder: 'Объясните причину завершения...',
        submit: 'Отправить',
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
      loginRequired: 'Please log in to view your profile',
      editProfile: 'Edit Profile',
      editClientProfile: 'Edit Client Profile',
      editDriverProfile: 'Edit Driver Profile',
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      firstNamePlaceholder: 'Enter first name',
      lastNamePlaceholder: 'Enter last name',
      emailPlaceholder: 'Enter email',
      phonePlaceholder: 'Enter phone',
      verify: 'Verify',
      emailVerificationSent: 'Verification email sent',
      phoneVerificationSent: 'Verification SMS sent',
      verificationError: 'Verification error',
      profileUpdated: 'Profile updated',
      updateError: 'Profile update error',
      unsavedChanges: 'Unsaved Changes',
      unsavedChangesMessage: 'You have unsaved changes. What to do?',
      discardChanges: 'Discard Changes',
      familyMembers: 'Family Members',
      familyMembersDescription: 'Add family members for shared trips',
      addFamilyMember: 'Add Family Member',
      vehicles: 'Vehicles',
      vehiclesDescription: 'Manage your vehicles',
      addVehicle: 'Add Vehicle',
      settings: 'Settings',
      notifications: 'Notifications',
      language: 'Language',
      theme: 'Theme',
      logout: {
        title: 'Logout',
        message: 'Are you sure you want to logout?',
        confirm: 'Yes, logout',
      },
      menu: {
        balance: 'Balance',
        cards: 'Cards',
        trips: 'Trips',
        rating: 'Rating',
        paymentHistory: 'Payment History',
        settings: 'Settings',
        residence: 'Residence',
        help: 'Help',
        about: 'About App',
        vehicles: 'Vehicles',
        premium: 'Premium',
      },
    },
    // Premium packages
    premium: {
      title: 'Premium Status',
      periods: {
        month: 'Month',
        year: 'Year',
      },
      packages: {
        standard: 'Standard',
        free: 'Free',
        plus: 'Plus',
        premium: 'Premium',
        premiumPlus: 'Premium+',
      },
      descriptions: {
        free: 'Basic features without additional capabilities.',
        plus: 'Priority, best drivers, 2% cashback.',
        premium: 'All from Plus, exclusive drivers, 5% cashback, VIP support.',
        premiumPlus: 'All from Premium, maximum privileges, 10% cashback, personal manager.',
      },
      features: {
        commission: 'Client commission',
        cashback: 'FixCash cashback per trip',
        priority: 'Driver selection priority',
        support: 'Support service',
        waitGuarantee: 'Wait guarantee',
        freeCancellation: 'Free trip cancellation',
        multiRoute: 'Multi-point routes',
        calendarIntegration: 'Calendar integration',
        earlyAccess: 'Early access to promotions',
        placeholder: 'Premium package feature',
      },
      values: {
        standard: 'Standard',
        fast: 'Fast',
        vip: 'VIP',
        personal: 'Personal',
        high: 'High',
        maximum: 'Maximum',
      },
      purchase: {
        confirmTitle: 'Purchase Confirmation',
        confirmMessage: 'Are you sure you want to purchase this plan?',
        cancel: 'Cancel',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
        insufficientFunds: 'Insufficient funds',
        insufficientMessage: 'You do not have enough funds to purchase this plan.',
        topUpBalance: 'Top up balance',
      },
    },
    // Заработки
    earnings: {
      title: 'Earnings',
      topDrivers: 'Top Drivers',
      earnings: 'Earnings',
      rides: 'Rides',
      level: 'Level',
      position: 'Position',
      today: 'Today',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      filter: 'Filter',
      changeStatus: 'Change Status',
    },
    // Карта
    map: {
      title: 'Map',
      currentLocation: 'Current Location',
      searchPlaceholder: 'Search place...',
      noResults: 'No results found',
      permissionDenied: 'Location permission denied',
      locationError: 'Location error',
      nearbyDrivers: 'Nearby Drivers',
      noDriversFound: 'No drivers found',
      driverAvailable: 'Available',
      driverBusy: 'Busy',
      driverOffline: 'Offline',
      reportDriver: 'Report Driver',
      shareRoute: 'Share Route',
      settings: 'Settings',
      mapType: 'Map Type',
      standard: 'Standard',
      satellite: 'Satellite',
      hybrid: 'Hybrid',
    },
  },
};

// Функция для получения перевода
export const t = (key: string, params?: Record<string, string | number>, language: string = config.language): string => {
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
      translation = fallback;
      break;
    }
  }
  
  let result = typeof translation === 'string' ? translation : key;
  
  // Если есть параметры, делаем интерполяцию
  if (params && typeof result === 'string') {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
    });
  }
  
  return result;
};

// Provider and hook based on React Context
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = React.useState(config.language);

  const changeLanguage = React.useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    config.language = newLanguage;
  }, []);

  const translate = React.useCallback((key: string): string => t(key, undefined, language), [language]);

  const value = React.useMemo(() => ({ language, changeLanguage, t: translate }), [language, changeLanguage, translate]);

  return React.createElement(I18nContext.Provider, { value }, children as any);
};

export const useI18n = () => {
  const ctx = React.useContext(I18nContext);
  if (!ctx) {
    // Fallback to local state if provider not present (dev safety)
    const [language, setLanguage] = React.useState(config.language);
    const changeLanguage = (newLanguage: string) => {
      setLanguage(newLanguage);
      config.language = newLanguage;
    };
    const translate = (key: string) => t(key, undefined, language);
    return { t: translate, language, changeLanguage };
  }
  return ctx;
};

// Экспортируем ключи для TypeScript
export { TRANSLATION_KEYS };

