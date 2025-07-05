export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  format?: string;
}

export const COUNTRIES: Country[] = [
  { code: 'AZ', name: 'Азербайджан', flag: '🇦🇿', dialCode: '+994', format: '(##) ###-##-##' },
  { code: 'RU', name: 'Россия', flag: '🇷🇺', dialCode: '+7', format: '(###) ###-##-##' },
  { code: 'TR', name: 'Турция', flag: '🇹🇷', dialCode: '+90', format: '(###) ###-##-##' },
  { code: 'GE', name: 'Грузия', flag: '🇬🇪', dialCode: '+995', format: '(###) ###-###' },
  { code: 'KZ', name: 'Казахстан', flag: '🇰🇿', dialCode: '+7', format: '(###) ###-##-##' },
  { code: 'UZ', name: 'Узбекистан', flag: '🇺🇿', dialCode: '+998', format: '(##) ###-##-##' },
  { code: 'KG', name: 'Кыргызстан', flag: '🇰🇬', dialCode: '+996', format: '(###) ###-###' },
  { code: 'TJ', name: 'Таджикистан', flag: '🇹🇯', dialCode: '+992', format: '(##) ###-##-##' },
  { code: 'TM', name: 'Туркменистан', flag: '🇹🇲', dialCode: '+993', format: '(##) ##-##-##' },
  { code: 'BY', name: 'Беларусь', flag: '🇧🇾', dialCode: '+375', format: '(##) ###-##-##' },
  { code: 'UA', name: 'Украина', flag: '🇺🇦', dialCode: '+380', format: '(##) ###-##-##' },
  { code: 'MD', name: 'Молдова', flag: '🇲🇩', dialCode: '+373', format: '(##) ###-###' },
  { code: 'US', name: 'США', flag: '🇺🇸', dialCode: '+1', format: '(###) ###-####' },
  { code: 'CA', name: 'Канада', flag: '🇨🇦', dialCode: '+1', format: '(###) ###-####' },
  { code: 'GB', name: 'Великобритания', flag: '🇬🇧', dialCode: '+44', format: '#### ######' },
  { code: 'DE', name: 'Германия', flag: '🇩🇪', dialCode: '+49', format: '### #######' },
  { code: 'FR', name: 'Франция', flag: '🇫🇷', dialCode: '+33', format: '# ## ## ## ##' },
  { code: 'IT', name: 'Италия', flag: '🇮🇹', dialCode: '+39', format: '### ### ####' },
  { code: 'ES', name: 'Испания', flag: '🇪🇸', dialCode: '+34', format: '### ### ###' },
  { code: 'NL', name: 'Нидерланды', flag: '🇳🇱', dialCode: '+31', format: '# ########' },
  { code: 'AE', name: 'ОАЭ', flag: '🇦🇪', dialCode: '+971', format: '# ### ####' },
  { code: 'SA', name: 'Саудовская Аравия', flag: '🇸🇦', dialCode: '+966', format: '# #### ####' },
  { code: 'IL', name: 'Израиль', flag: '🇮🇱', dialCode: '+972', format: '#-###-####' },
  { code: 'CN', name: 'Китай', flag: '🇨🇳', dialCode: '+86', format: '### #### ####' },
  { code: 'JP', name: 'Япония', flag: '🇯🇵', dialCode: '+81', format: '##-####-####' },
  { code: 'KR', name: 'Южная Корея', flag: '🇰🇷', dialCode: '+82', format: '##-###-####' },
  { code: 'IN', name: 'Индия', flag: '🇮🇳', dialCode: '+91', format: '##### #####' },
  { code: 'AU', name: 'Австралия', flag: '🇦🇺', dialCode: '+61', format: '# #### ####' },
  { code: 'BR', name: 'Бразилия', flag: '🇧🇷', dialCode: '+55', format: '(##) #####-####' },
]; 