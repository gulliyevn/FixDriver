import { Country, CountryService, Region } from '../types/countries';

/**
 * Countries service implementation
 * Provides accurate and up-to-date country information
 */
export class CountriesHelper implements CountryService {
  private readonly COUNTRIES: Country[] = [
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
      format: '(##) ###-##-##',
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
      format: '(##) ##-##-##',
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
    {
      code: 'MD',
      name: 'Молдова',
      nameEn: 'Moldova',
      flag: '🇲🇩',
      dialCode: '+373',
      format: '(##) ###-###',
      emergencyNumber: '112',
      currency: 'MDL',
      timezone: 'Europe/Chisinau'
    },
    {
      code: 'EE',
      name: 'Эстония',
      nameEn: 'Estonia',
      flag: '🇪🇪',
      dialCode: '+372',
      format: '#### ####',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Tallinn'
    },
    {
      code: 'LV',
      name: 'Латвия',
      nameEn: 'Latvia',
      flag: '🇱🇻',
      dialCode: '+371',
      format: '## ### ###',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Riga'
    },
    {
      code: 'LT',
      name: 'Литва',
      nameEn: 'Lithuania',
      flag: '🇱🇹',
      dialCode: '+370',
      format: '## ### ###',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Vilnius'
    },
    {
      code: 'PL',
      name: 'Польша',
      nameEn: 'Poland',
      flag: '🇵🇱',
      dialCode: '+48',
      format: '### ### ###',
      emergencyNumber: '112',
      currency: 'PLN',
      timezone: 'Europe/Warsaw'
    },
    {
      code: 'CZ',
      name: 'Чехия',
      nameEn: 'Czech Republic',
      flag: '🇨🇿',
      dialCode: '+420',
      format: '### ### ###',
      emergencyNumber: '112',
      currency: 'CZK',
      timezone: 'Europe/Prague'
    },
    {
      code: 'SK',
      name: 'Словакия',
      nameEn: 'Slovakia',
      flag: '🇸🇰',
      dialCode: '+421',
      format: '### ### ###',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Bratislava'
    },
    {
      code: 'HU',
      name: 'Венгрия',
      nameEn: 'Hungary',
      flag: '🇭🇺',
      dialCode: '+36',
      format: '## ### ####',
      emergencyNumber: '112',
      currency: 'HUF',
      timezone: 'Europe/Budapest'
    },
    {
      code: 'RO',
      name: 'Румыния',
      nameEn: 'Romania',
      flag: '🇷🇴',
      dialCode: '+40',
      format: '## ### ####',
      emergencyNumber: '112',
      currency: 'RON',
      timezone: 'Europe/Bucharest'
    },
    {
      code: 'BG',
      name: 'Болгария',
      nameEn: 'Bulgaria',
      flag: '🇧🇬',
      dialCode: '+359',
      format: '## ### ###',
      emergencyNumber: '112',
      currency: 'BGN',
      timezone: 'Europe/Sofia'
    },
    {
      code: 'HR',
      name: 'Хорватия',
      nameEn: 'Croatia',
      flag: '🇭🇷',
      dialCode: '+385',
      format: '## ### ###',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Zagreb'
    },
    {
      code: 'SI',
      name: 'Словения',
      nameEn: 'Slovenia',
      flag: '🇸🇮',
      dialCode: '+386',
      format: '## ### ###',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Ljubljana'
    },
    {
      code: 'AT',
      name: 'Австрия',
      nameEn: 'Austria',
      flag: '🇦🇹',
      dialCode: '+43',
      format: '### ### ###',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Vienna'
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
      code: 'CH',
      name: 'Швейцария',
      nameEn: 'Switzerland',
      flag: '🇨🇭',
      dialCode: '+41',
      format: '## ### ####',
      emergencyNumber: '112',
      currency: 'CHF',
      timezone: 'Europe/Zurich'
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
      code: 'FR',
      name: 'Франция',
      nameEn: 'France',
      flag: '🇫🇷',
      dialCode: '+33',
      format: '# ## ## ## ##',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Paris'
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
      code: 'IE',
      name: 'Ирландия',
      nameEn: 'Ireland',
      flag: '🇮🇪',
      dialCode: '+353',
      format: '## ### ####',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Dublin'
    },
    {
      code: 'NL',
      name: 'Нидерланды',
      nameEn: 'Netherlands',
      flag: '🇳🇱',
      dialCode: '+31',
      format: '# ########',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Amsterdam'
    },
    {
      code: 'BE',
      name: 'Бельгия',
      nameEn: 'Belgium',
      flag: '🇧🇪',
      dialCode: '+32',
      format: '### ### ###',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Brussels'
    },
    {
      code: 'DK',
      name: 'Дания',
      nameEn: 'Denmark',
      flag: '🇩🇰',
      dialCode: '+45',
      format: '#### ####',
      emergencyNumber: '112',
      currency: 'DKK',
      timezone: 'Europe/Copenhagen'
    },
    {
      code: 'NO',
      name: 'Норвегия',
      nameEn: 'Norway',
      flag: '🇳🇴',
      dialCode: '+47',
      format: '### ## ###',
      emergencyNumber: '112',
      currency: 'NOK',
      timezone: 'Europe/Oslo'
    },
    {
      code: 'SE',
      name: 'Швеция',
      nameEn: 'Sweden',
      flag: '🇸🇪',
      dialCode: '+46',
      format: '## ### ####',
      emergencyNumber: '112',
      currency: 'SEK',
      timezone: 'Europe/Stockholm'
    },
    {
      code: 'FI',
      name: 'Финляндия',
      nameEn: 'Finland',
      flag: '🇫🇮',
      dialCode: '+358',
      format: '## ### ####',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Helsinki'
    },
    {
      code: 'GR',
      name: 'Греция',
      nameEn: 'Greece',
      flag: '🇬🇷',
      dialCode: '+30',
      format: '### ### ####',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Athens'
    },
    {
      code: 'PT',
      name: 'Португалия',
      nameEn: 'Portugal',
      flag: '🇵🇹',
      dialCode: '+351',
      format: '### ### ###',
      emergencyNumber: '112',
      currency: 'EUR',
      timezone: 'Europe/Lisbon'
    },
    {
      code: 'TR',
      name: 'Турция',
      nameEn: 'Turkey',
      flag: '🇹🇷',
      dialCode: '+90',
      format: '(###) ###-##-##',
      emergencyNumber: '112',
      currency: 'TRY',
      timezone: 'Europe/Istanbul'
    },

    // Asia
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
      format: '##-####-####',
      emergencyNumber: '110',
      currency: 'JPY',
      timezone: 'Asia/Tokyo'
    },
    {
      code: 'KR',
      name: 'Южная Корея',
      nameEn: 'South Korea',
      flag: '🇰🇷',
      dialCode: '+82',
      format: '##-###-####',
      emergencyNumber: '112',
      currency: 'KRW',
      timezone: 'Asia/Seoul'
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
      code: 'TH',
      name: 'Таиланд',
      nameEn: 'Thailand',
      flag: '🇹🇭',
      dialCode: '+66',
      format: '## ### ####',
      emergencyNumber: '191',
      currency: 'THB',
      timezone: 'Asia/Bangkok'
    },
    {
      code: 'VN',
      name: 'Вьетнам',
      nameEn: 'Vietnam',
      flag: '🇻🇳',
      dialCode: '+84',
      format: '## #### ####',
      emergencyNumber: '113',
      currency: 'VND',
      timezone: 'Asia/Ho_Chi_Minh'
    },
    {
      code: 'MY',
      name: 'Малайзия',
      nameEn: 'Malaysia',
      flag: '🇲🇾',
      dialCode: '+60',
      format: '## ### ####',
      emergencyNumber: '999',
      currency: 'MYR',
      timezone: 'Asia/Kuala_Lumpur'
    },
    {
      code: 'SG',
      name: 'Сингапур',
      nameEn: 'Singapore',
      flag: '🇸🇬',
      dialCode: '+65',
      format: '#### ####',
      emergencyNumber: '999',
      currency: 'SGD',
      timezone: 'Asia/Singapore'
    },
    {
      code: 'ID',
      name: 'Индонезия',
      nameEn: 'Indonesia',
      flag: '🇮🇩',
      dialCode: '+62',
      format: '## ### ####',
      emergencyNumber: '110',
      currency: 'IDR',
      timezone: 'Asia/Jakarta'
    },
    {
      code: 'PH',
      name: 'Филиппины',
      nameEn: 'Philippines',
      flag: '🇵🇭',
      dialCode: '+63',
      format: '## ### ####',
      emergencyNumber: '911',
      currency: 'PHP',
      timezone: 'Asia/Manila'
    },
    {
      code: 'PK',
      name: 'Пакистан',
      nameEn: 'Pakistan',
      flag: '🇵🇰',
      dialCode: '+92',
      format: '## ### ####',
      emergencyNumber: '15',
      currency: 'PKR',
      timezone: 'Asia/Karachi'
    },
    {
      code: 'BD',
      name: 'Бангладеш',
      nameEn: 'Bangladesh',
      flag: '🇧🇩',
      dialCode: '+880',
      format: '## ### ###',
      emergencyNumber: '999',
      currency: 'BDT',
      timezone: 'Asia/Dhaka'
    },
    {
      code: 'LK',
      name: 'Шри-Ланка',
      nameEn: 'Sri Lanka',
      flag: '🇱🇰',
      dialCode: '+94',
      format: '## ### ####',
      emergencyNumber: '119',
      currency: 'LKR',
      timezone: 'Asia/Colombo'
    },
    {
      code: 'NP',
      name: 'Непал',
      nameEn: 'Nepal',
      flag: '🇳🇵',
      dialCode: '+977',
      format: '## ### ###',
      emergencyNumber: '100',
      currency: 'NPR',
      timezone: 'Asia/Kathmandu'
    },
    {
      code: 'MM',
      name: 'Мьянма',
      nameEn: 'Myanmar',
      flag: '🇲🇲',
      dialCode: '+95',
      format: '## ### ###',
      emergencyNumber: '199',
      currency: 'MMK',
      timezone: 'Asia/Yangon'
    },
    {
      code: 'KH',
      name: 'Камбоджа',
      nameEn: 'Cambodia',
      flag: '🇰🇭',
      dialCode: '+855',
      format: '## ### ###',
      emergencyNumber: '117',
      currency: 'KHR',
      timezone: 'Asia/Phnom_Penh'
    },
    {
      code: 'LA',
      name: 'Лаос',
      nameEn: 'Laos',
      flag: '🇱🇦',
      dialCode: '+856',
      format: '## ### ###',
      emergencyNumber: '1191',
      currency: 'LAK',
      timezone: 'Asia/Vientiane'
    },
    {
      code: 'MN',
      name: 'Монголия',
      nameEn: 'Mongolia',
      flag: '🇲🇳',
      dialCode: '+976',
      format: '## ## ####',
      emergencyNumber: '102',
      currency: 'MNT',
      timezone: 'Asia/Ulaanbaatar'
    },

    // North America
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
      code: 'CA',
      name: 'Канада',
      nameEn: 'Canada',
      flag: '🇨🇦',
      dialCode: '+1',
      format: '(###) ###-####',
      emergencyNumber: '911',
      currency: 'CAD',
      timezone: 'America/Toronto'
    },
    {
      code: 'MX',
      name: 'Мексика',
      nameEn: 'Mexico',
      flag: '🇲🇽',
      dialCode: '+52',
      format: '### ### ####',
      emergencyNumber: '911',
      currency: 'MXN',
      timezone: 'America/Mexico_City'
    },

    // South America
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
    },
    {
      code: 'AR',
      name: 'Аргентина',
      nameEn: 'Argentina',
      flag: '🇦🇷',
      dialCode: '+54',
      format: '(##) ####-####',
      emergencyNumber: '911',
      currency: 'ARS',
      timezone: 'America/Argentina/Buenos_Aires'
    },
    {
      code: 'CL',
      name: 'Чили',
      nameEn: 'Chile',
      flag: '🇨🇱',
      dialCode: '+56',
      format: '## #### ####',
      emergencyNumber: '133',
      currency: 'CLP',
      timezone: 'America/Santiago'
    },
    {
      code: 'CO',
      name: 'Колумбия',
      nameEn: 'Colombia',
      flag: '🇨🇴',
      dialCode: '+57',
      format: '### ### ####',
      emergencyNumber: '123',
      currency: 'COP',
      timezone: 'America/Bogota'
    },
    {
      code: 'PE',
      name: 'Перу',
      nameEn: 'Peru',
      flag: '🇵🇪',
      dialCode: '+51',
      format: '### ### ###',
      emergencyNumber: '105',
      currency: 'PEN',
      timezone: 'America/Lima'
    },
    {
      code: 'VE',
      name: 'Венесуэла',
      nameEn: 'Venezuela',
      flag: '🇻🇪',
      dialCode: '+58',
      format: '### ### ####',
      emergencyNumber: '171',
      currency: 'VES',
      timezone: 'America/Caracas'
    },
    {
      code: 'EC',
      name: 'Эквадор',
      nameEn: 'Ecuador',
      flag: '🇪🇨',
      dialCode: '+593',
      format: '## ### ####',
      emergencyNumber: '911',
      currency: 'USD',
      timezone: 'America/Guayaquil'
    },
    {
      code: 'UY',
      name: 'Уругвай',
      nameEn: 'Uruguay',
      flag: '🇺🇾',
      dialCode: '+598',
      format: '## ### ###',
      emergencyNumber: '911',
      currency: 'UYU',
      timezone: 'America/Montevideo'
    },
    {
      code: 'PY',
      name: 'Парагвай',
      nameEn: 'Paraguay',
      flag: '🇵🇾',
      dialCode: '+595',
      format: '## ### ###',
      emergencyNumber: '911',
      currency: 'PYG',
      timezone: 'America/Asuncion'
    },
    {
      code: 'BO',
      name: 'Боливия',
      nameEn: 'Bolivia',
      flag: '🇧🇴',
      dialCode: '+591',
      format: '## ### ###',
      emergencyNumber: '110',
      currency: 'BOB',
      timezone: 'America/La_Paz'
    },

    // Africa
    {
      code: 'ZA',
      name: 'ЮАР',
      nameEn: 'South Africa',
      flag: '🇿🇦',
      dialCode: '+27',
      format: '## ### ####',
      emergencyNumber: '10111',
      currency: 'ZAR',
      timezone: 'Africa/Johannesburg'
    },
    {
      code: 'EG',
      name: 'Египет',
      nameEn: 'Egypt',
      flag: '🇪🇬',
      dialCode: '+20',
      format: '## #### ####',
      emergencyNumber: '122',
      currency: 'EGP',
      timezone: 'Africa/Cairo'
    },
    {
      code: 'NG',
      name: 'Нигерия',
      nameEn: 'Nigeria',
      flag: '🇳🇬',
      dialCode: '+234',
      format: '## ### ####',
      emergencyNumber: '112',
      currency: 'NGN',
      timezone: 'Africa/Lagos'
    },
    {
      code: 'KE',
      name: 'Кения',
      nameEn: 'Kenya',
      flag: '🇰🇪',
      dialCode: '+254',
      format: '## ### ####',
      emergencyNumber: '999',
      currency: 'KES',
      timezone: 'Africa/Nairobi'
    },
    {
      code: 'GH',
      name: 'Гана',
      nameEn: 'Ghana',
      flag: '🇬🇭',
      dialCode: '+233',
      format: '## ### ####',
      emergencyNumber: '999',
      currency: 'GHS',
      timezone: 'Africa/Accra'
    },
    {
      code: 'UG',
      name: 'Уганда',
      nameEn: 'Uganda',
      flag: '🇺🇬',
      dialCode: '+256',
      format: '## ### ###',
      emergencyNumber: '999',
      currency: 'UGX',
      timezone: 'Africa/Kampala'
    },
    {
      code: 'TZ',
      name: 'Танзания',
      nameEn: 'Tanzania',
      flag: '🇹🇿',
      dialCode: '+255',
      format: '## ### ####',
      emergencyNumber: '112',
      currency: 'TZS',
      timezone: 'Africa/Dar_es_Salaam'
    },
    {
      code: 'ET',
      name: 'Эфиопия',
      nameEn: 'Ethiopia',
      flag: '🇪🇹',
      dialCode: '+251',
      format: '## ### ####',
      emergencyNumber: '911',
      currency: 'ETB',
      timezone: 'Africa/Addis_Ababa'
    },
    {
      code: 'DZ',
      name: 'Алжир',
      nameEn: 'Algeria',
      flag: '🇩🇿',
      dialCode: '+213',
      format: '## ### ####',
      emergencyNumber: '17',
      currency: 'DZD',
      timezone: 'Africa/Algiers'
    },
    {
      code: 'MA',
      name: 'Марокко',
      nameEn: 'Morocco',
      flag: '🇲🇦',
      dialCode: '+212',
      format: '## ### ####',
      emergencyNumber: '19',
      currency: 'MAD',
      timezone: 'Africa/Casablanca'
    },
    {
      code: 'TN',
      name: 'Тунис',
      nameEn: 'Tunisia',
      flag: '🇹🇳',
      dialCode: '+216',
      format: '## ### ###',
      emergencyNumber: '197',
      currency: 'TND',
      timezone: 'Africa/Tunis'
    },
    {
      code: 'LY',
      name: 'Ливия',
      nameEn: 'Libya',
      flag: '🇱🇾',
      dialCode: '+218',
      format: '## ### ###',
      emergencyNumber: '1515',
      currency: 'LYD',
      timezone: 'Africa/Tripoli'
    },
    {
      code: 'SD',
      name: 'Судан',
      nameEn: 'Sudan',
      flag: '🇸🇩',
      dialCode: '+249',
      format: '## ### ####',
      emergencyNumber: '999',
      currency: 'SDG',
      timezone: 'Africa/Khartoum'
    },
    {
      code: 'SS',
      name: 'Южный Судан',
      nameEn: 'South Sudan',
      flag: '🇸🇸',
      dialCode: '+211',
      format: '## ### ####',
      emergencyNumber: '999',
      currency: 'SSP',
      timezone: 'Africa/Juba'
    },

    // Oceania
    {
      code: 'AU',
      name: 'Австралия',
      nameEn: 'Australia',
      flag: '🇦🇺',
      dialCode: '+61',
      format: '# #### ####',
      emergencyNumber: '000',
      currency: 'AUD',
      timezone: 'Australia/Sydney'
    },
    {
      code: 'NZ',
      name: 'Новая Зеландия',
      nameEn: 'New Zealand',
      flag: '🇳🇿',
      dialCode: '+64',
      format: '## ### ####',
      emergencyNumber: '111',
      currency: 'NZD',
      timezone: 'Pacific/Auckland'
    },
    {
      code: 'FJ',
      name: 'Фиджи',
      nameEn: 'Fiji',
      flag: '🇫🇯',
      dialCode: '+679',
      format: '### ####',
      emergencyNumber: '911',
      currency: 'FJD',
      timezone: 'Pacific/Fiji'
    },
    {
      code: 'PG',
      name: 'Папуа - Новая Гвинея',
      nameEn: 'Papua New Guinea',
      flag: '🇵🇬',
      dialCode: '+675',
      format: '### ####',
      emergencyNumber: '000',
      currency: 'PGK',
      timezone: 'Pacific/Port_Moresby'
    },
    {
      code: 'NC',
      name: 'Новая Каледония',
      nameEn: 'New Caledonia',
      flag: '🇳🇨',
      dialCode: '+687',
      format: '## ####',
      emergencyNumber: '17',
      currency: 'XPF',
      timezone: 'Pacific/Noumea'
    },
    {
      code: 'PF',
      name: 'Французская Полинезия',
      nameEn: 'French Polynesia',
      flag: '🇵🇫',
      dialCode: '+689',
      format: '## ####',
      emergencyNumber: '17',
      currency: 'XPF',
      timezone: 'Pacific/Tahiti'
    },

    // Middle East
    {
      code: 'IL',
      name: 'Израиль',
      nameEn: 'Israel',
      flag: '🇮🇱',
      dialCode: '+972',
      format: '#-###-####',
      emergencyNumber: '100',
      currency: 'ILS',
      timezone: 'Asia/Jerusalem'
    },
    {
      code: 'SA',
      name: 'Саудовская Аравия',
      nameEn: 'Saudi Arabia',
      flag: '🇸🇦',
      dialCode: '+966',
      format: '# #### ####',
      emergencyNumber: '911',
      currency: 'SAR',
      timezone: 'Asia/Riyadh'
    },
    {
      code: 'AE',
      name: 'ОАЭ',
      nameEn: 'United Arab Emirates',
      flag: '🇦🇪',
      dialCode: '+971',
      format: '# ### ####',
      emergencyNumber: '999',
      currency: 'AED',
      timezone: 'Asia/Dubai'
    },
    {
      code: 'QA',
      name: 'Катар',
      nameEn: 'Qatar',
      flag: '🇶🇦',
      dialCode: '+974',
      format: '#### ####',
      emergencyNumber: '999',
      currency: 'QAR',
      timezone: 'Asia/Qatar'
    },
    {
      code: 'KW',
      name: 'Кувейт',
      nameEn: 'Kuwait',
      flag: '🇰🇼',
      dialCode: '+965',
      format: '#### ####',
      emergencyNumber: '112',
      currency: 'KWD',
      timezone: 'Asia/Kuwait'
    },
    {
      code: 'BH',
      name: 'Бахрейн',
      nameEn: 'Bahrain',
      flag: '🇧🇭',
      dialCode: '+973',
      format: '#### ####',
      emergencyNumber: '999',
      currency: 'BHD',
      timezone: 'Asia/Bahrain'
    },
    {
      code: 'OM',
      name: 'Оман',
      nameEn: 'Oman',
      flag: '🇴🇲',
      dialCode: '+968',
      format: '#### ####',
      emergencyNumber: '9999',
      currency: 'OMR',
      timezone: 'Asia/Muscat'
    },
    {
      code: 'JO',
      name: 'Иордания',
      nameEn: 'Jordan',
      flag: '🇯🇴',
      dialCode: '+962',
      format: '## ### ####',
      emergencyNumber: '911',
      currency: 'JOD',
      timezone: 'Asia/Amman'
    },
    {
      code: 'LB',
      name: 'Ливан',
      nameEn: 'Lebanon',
      flag: '🇱🇧',
      dialCode: '+961',
      format: '## ### ###',
      emergencyNumber: '112',
      currency: 'LBP',
      timezone: 'Asia/Beirut'
    },
    {
      code: 'SY',
      name: 'Сирия',
      nameEn: 'Syria',
      flag: '🇸🇾',
      dialCode: '+963',
      format: '## ### ###',
      emergencyNumber: '112',
      currency: 'SYP',
      timezone: 'Asia/Damascus'
    },
    {
      code: 'IQ',
      name: 'Ирак',
      nameEn: 'Iraq',
      flag: '🇮🇶',
      dialCode: '+964',
      format: '## ### ####',
      emergencyNumber: '104',
      currency: 'IQD',
      timezone: 'Asia/Baghdad'
    },
    {
      code: 'IR',
      name: 'Иран',
      nameEn: 'Iran',
      flag: '🇮🇷',
      dialCode: '+98',
      format: '## ### ####',
      emergencyNumber: '110',
      currency: 'IRR',
      timezone: 'Asia/Tehran'
    },
    {
      code: 'AF',
      name: 'Афганистан',
      nameEn: 'Afghanistan',
      flag: '🇦🇫',
      dialCode: '+93',
      format: '## ### ####',
      emergencyNumber: '119',
      currency: 'AFN',
      timezone: 'Asia/Kabul'
    }
  ].sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  /**
   * Get all countries
   */
  getAllCountries(): Country[] {
    return this.COUNTRIES;
  }

  /**
   * Get country by ISO code
   */
  getCountryByCode(code: string): Country | null {
    const upperCode = code.toUpperCase();
    return this.COUNTRIES.find(country => country.code === upperCode) || null;
  }

  /**
   * Get country by dial code
   */
  getCountryByDialCode(dialCode: string): Country | null {
    return this.COUNTRIES.find(country => country.dialCode === dialCode) || null;
  }

  /**
   * Search countries by name
   */
  searchCountries(query: string): Country[] {
    const lowerQuery = query.toLowerCase();
    return this.COUNTRIES.filter(country => 
      country.name.toLowerCase().includes(lowerQuery) ||
      country.nameEn.toLowerCase().includes(lowerQuery) ||
      country.code.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get emergency number for country
   */
  getEmergencyNumber(countryCode: string): string {
    const country = this.getCountryByCode(countryCode);
    return country?.emergencyNumber || '112'; // Default European standard
  }

  /**
   * Get countries by region
   */
  getCountriesByRegion(region: string): Country[] {
    // This is a simplified mapping - in a real app you'd have more detailed region data
    const regionMap: Record<string, string[]> = {
      [Region.EUROPE]: ['RU', 'KZ', 'BY', 'UA', 'AZ', 'AM', 'GE', 'KG', 'TJ', 'TM', 'UZ', 'MD', 'EE', 'LV', 'LT', 'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'AT', 'DE', 'CH', 'IT', 'ES', 'FR', 'GB', 'IE', 'NL', 'BE', 'DK', 'NO', 'SE', 'FI', 'GR', 'PT', 'TR'],
      [Region.ASIA]: ['CN', 'JP', 'KR', 'IN', 'TH', 'VN', 'MY', 'SG', 'ID', 'PH', 'PK', 'BD', 'LK', 'NP', 'MM', 'KH', 'LA', 'MN'],
      [Region.NORTH_AMERICA]: ['US', 'CA', 'MX'],
      [Region.SOUTH_AMERICA]: ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO'],
      [Region.AFRICA]: ['ZA', 'EG', 'NG', 'KE', 'GH', 'UG', 'TZ', 'ET', 'DZ', 'MA', 'TN', 'LY', 'SD', 'SS'],
      [Region.OCEANIA]: ['AU', 'NZ', 'FJ', 'PG', 'NC', 'PF'],
      [Region.MIDDLE_EAST]: ['IL', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'SY', 'IQ', 'IR', 'AF']
    };
    
    const countryCodes = regionMap[region] || [];
    return this.COUNTRIES.filter(country => countryCodes.includes(country.code));
  }
}

// Default instance for backward compatibility
export const countriesHelper = new CountriesHelper();

// Legacy function exports for smooth migration
export const COUNTRIES = countriesHelper.getAllCountries();
export const getCountryByCode = (code: string) => countriesHelper.getCountryByCode(code);
export const getCountryByDialCode = (dialCode: string) => countriesHelper.getCountryByDialCode(dialCode);
export const searchCountries = (query: string) => countriesHelper.searchCountries(query);
export const getEmergencyNumber = (countryCode: string) => countriesHelper.getEmergencyNumber(countryCode);
export const getCountriesByRegion = (region: string) => countriesHelper.getCountriesByRegion(region);
