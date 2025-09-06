// Данные для формы регистрации водителя

export const experienceOptions = [
  { label: 'До 1 года', value: '0-1' },
  { label: '1 год', value: '1' },
  { label: '2 года', value: '2' },
  { label: '3 года', value: '3' },
  { label: '4 года', value: '4' },
  { label: '5 лет', value: '5' },
  { label: '6 лет', value: '6' },
  { label: '7 лет', value: '7' },
  { label: '8 лет', value: '8' },
  { label: '9 лет', value: '9' },
  { label: '10 лет', value: '10' },
  { label: '11 лет', value: '11' },
  { label: '12 лет', value: '12' },
  { label: '13 лет', value: '13' },
  { label: '14 лет', value: '14' },
  { label: '15 лет', value: '15' },
  { label: '16 лет', value: '16' },
  { label: '17 лет', value: '17' },
  { label: '18 лет', value: '18' },
  { label: '19 лет', value: '19' },
  { label: '20 лет', value: '20' },
  { label: '21 год', value: '21' },
  { label: '22 года', value: '22' },
  { label: '23 года', value: '23' },
  { label: '24 года', value: '24' },
  { label: '25 лет', value: '25' },
  { label: '26 лет', value: '26' },
  { label: '27 лет', value: '27' },
  { label: '28 лет', value: '28' },
  { label: '29 лет', value: '29' },
  { label: '30 лет', value: '30' },
  { label: '30+ лет', value: '30+' },
];

export const carBrands = [
  { label: 'Mercedes', value: 'Mercedes' },
  { label: 'Toyota', value: 'Toyota' },
  { label: 'BMW', value: 'BMW' },
  { label: 'Hyundai', value: 'Hyundai' },
];

export const carModelsByBrand: Record<string, { label: string; value: string; tariff?: string }[]> = {
  Mercedes: [
    { label: 'E-class', value: 'E-class', tariff: 'Plus' },
    { label: 'S-class', value: 'S-class', tariff: 'Premium' },
    { label: 'C-class', value: 'C-class', tariff: 'Basic' },
  ],
  Toyota: [
    { label: 'Camry', value: 'Camry', tariff: 'Plus' },
    { label: 'Corolla', value: 'Corolla', tariff: 'Basic' },
  ],
  BMW: [
    { label: '5 Series', value: '5 Series', tariff: 'Plus' },
    { label: '7 Series', value: '7 Series', tariff: 'Premium' },
    { label: '3 Series', value: '3 Series', tariff: 'Basic' },
  ],
  Hyundai: [
    { label: 'Sonata', value: 'Sonata', tariff: 'Basic' },
    { label: 'Genesis', value: 'Genesis', tariff: 'Plus' },
  ],
};

// Генерируем годы от 1990 до текущего года + 1
export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear + 1; year >= 1990; year--) {
    yearOptions.push({ label: year.toString(), value: year.toString() });
  }
  return yearOptions;
};

export const getTariffOptions = (t: (key: string) => string) => [
  { label: t('auth.register.tariffEconomy'), value: 'Economy' },
  { label: t('auth.register.tariffStandard'), value: 'Standard' },
  { label: t('auth.register.tariffPremium'), value: 'Premium' },
  { label: t('auth.register.tariffBusiness'), value: 'Business' },
];