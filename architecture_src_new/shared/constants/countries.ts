import { Country } from '../types/countries';

// ISO 3166-1 alpha-2 subset with full country information
export const COUNTRIES_FULL: Country[] = [
  // Europe
  {
    code: 'RU',
    name: 'Россия',
    nameEn: 'Russia',
    flag: '🇷🇺',
    dialCode: '+7',
    format: '(###) ###-##-##',
    emergencyNumber: '112',
    currency: 'RUB',
    timezone: 'Europe/Moscow'
  },
  {
    code: 'KZ',
    name: 'Казахстан',
    nameEn: 'Kazakhstan',
    flag: '🇰🇿',
    dialCode: '+7',
    format: '(###) ###-##-##',
    emergencyNumber: '112',
    currency: 'KZT',
    timezone: 'Asia/Almaty'
  },
  {
    code: 'BY',
    name: 'Беларусь',
    nameEn: 'Belarus',
    flag: '🇧🇾',
    dialCode: '+375',
    format: '(##) ###-##-##',
    emergencyNumber: '112',
    currency: 'BYN',
    timezone: 'Europe/Minsk'
  },
  {
    code: 'UA',
    name: 'Украина',
    nameEn: 'Ukraine',
    flag: '🇺🇦',
    dialCode: '+380',
    format: '(##) ###-##-##',
    emergencyNumber: '112',
    currency: 'UAH',
    timezone: 'Europe/Kiev'
  },
  {
    code: 'AZ',
    name: 'Азербайджан',
    nameEn: 'Azerbaijan',
    flag: '🇦🇿',
    dialCode: '+994',
    format: '(##) ###-##-##',
    emergencyNumber: '112',
    currency: 'AZN',
    timezone: 'Asia/Baku'
  },
  {
    code: 'AM',
    name: 'Армения',
    nameEn: 'Armenia',
    flag: '🇦🇲',
    dialCode: '+374',
    format: '(##) ###-###',
    emergencyNumber: '112',
    currency: 'AMD',
    timezone: 'Asia/Yerevan'
  },
  {
    code: 'GE',
    name: 'Грузия',
    nameEn: 'Georgia',
    flag: '🇬🇪',
    dialCode: '+995',
    format: '(###) ###-###',
    emergencyNumber: '112',
    currency: 'GEL',
    timezone: 'Asia/Tbilisi'
  },
  {
    code: 'KG',
    name: 'Кыргызстан',
    nameEn: 'Kyrgyzstan',
    flag: '🇰🇬',
    dialCode: '+996',
    format: '(###) ###-###',
    emergencyNumber: '112',
    currency: 'KGS',
    timezone: 'Asia/Bishkek'
  },
  {
    code: 'TJ',
    name: 'Таджикистан',
    nameEn: 'Tajikistan',
    flag: '🇹🇯',
    dialCode: '+992',
    format: '(###) ###-###',
    emergencyNumber: '112',
    currency: 'TJS',
    timezone: 'Asia/Dushanbe'
  },
  {
    code: 'TM',
    name: 'Туркменистан',
    nameEn: 'Turkmenistan',
    flag: '🇹🇲',
    dialCode: '+993',
    format: '(##) ###-###',
    emergencyNumber: '112',
    currency: 'TMT',
    timezone: 'Asia/Ashgabat'
  },
  {
    code: 'UZ',
    name: 'Узбекистан',
    nameEn: 'Uzbekistan',
    flag: '🇺🇿',
    dialCode: '+998',
    format: '(##) ###-##-##',
    emergencyNumber: '112',
    currency: 'UZS',
    timezone: 'Asia/Tashkent'
  },
  // Other major countries
  {
    code: 'US',
    name: 'США',
    nameEn: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    format: '(###) ###-####',
    emergencyNumber: '911',
    currency: 'USD',
    timezone: 'America/New_York'
  },
  {
    code: 'GB',
    name: 'Великобритания',
    nameEn: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    format: '#### ######',
    emergencyNumber: '999',
    currency: 'GBP',
    timezone: 'Europe/London'
  },
  {
    code: 'DE',
    name: 'Германия',
    nameEn: 'Germany',
    flag: '🇩🇪',
    dialCode: '+49',
    format: '### #######',
    emergencyNumber: '112',
    currency: 'EUR',
    timezone: 'Europe/Berlin'
  },
  {
    code: 'FR',
    name: 'Франция',
    nameEn: 'France',
    flag: '🇫🇷',
    dialCode: '+33',
    format: '## ## ## ## ##',
    emergencyNumber: '112',
    currency: 'EUR',
    timezone: 'Europe/Paris'
  },
  {
    code: 'IT',
    name: 'Италия',
    nameEn: 'Italy',
    flag: '🇮🇹',
    dialCode: '+39',
    format: '### ### ####',
    emergencyNumber: '112',
    currency: 'EUR',
    timezone: 'Europe/Rome'
  },
  {
    code: 'ES',
    name: 'Испания',
    nameEn: 'Spain',
    flag: '🇪🇸',
    dialCode: '+34',
    format: '### ### ###',
    emergencyNumber: '112',
    currency: 'EUR',
    timezone: 'Europe/Madrid'
  },
  {
    code: 'CN',
    name: 'Китай',
    nameEn: 'China',
    flag: '🇨🇳',
    dialCode: '+86',
    format: '### #### ####',
    emergencyNumber: '110',
    currency: 'CNY',
    timezone: 'Asia/Shanghai'
  },
  {
    code: 'JP',
    name: 'Япония',
    nameEn: 'Japan',
    flag: '🇯🇵',
    dialCode: '+81',
    format: '## #### ####',
    emergencyNumber: '110',
    currency: 'JPY',
    timezone: 'Asia/Tokyo'
  },
  {
    code: 'IN',
    name: 'Индия',
    nameEn: 'India',
    flag: '🇮🇳',
    dialCode: '+91',
    format: '##### #####',
    emergencyNumber: '100',
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  },
  {
    code: 'BR',
    name: 'Бразилия',
    nameEn: 'Brazil',
    flag: '🇧🇷',
    dialCode: '+55',
    format: '(##) #####-####',
    emergencyNumber: '190',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo'
  }
];

// Simple country items for basic UI needs
export type CountryItem = { code: string; name: string };

// Legacy simple array (deprecated - use COUNTRIES_FULL instead)
export const COUNTRIES_SIMPLE: CountryItem[] = COUNTRIES_FULL.map(country => ({
  code: country.code,
  name: country.name
}));


