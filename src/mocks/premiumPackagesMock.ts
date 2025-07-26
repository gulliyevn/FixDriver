export interface VipPackage {
  id: string;
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  features: string[];
  icon: string;
  color: string;
  description: string;
}

export const getPremiumPackages = (selectedPeriod: 'month' | 'year', currentColors: any): VipPackage[] => [
  {
    id: 'basic',
    name: 'Плюс',
    price: selectedPeriod === 'month' ? 19.99 : 199.99,
    period: selectedPeriod === 'month' ? 'месяц' : 'год',
    features: [
      'Приоритетное бронирование',
      'Лучшие водители (4.8+ рейтинг)',
      'Дополнительный кэшбэк 10%',
      'Премиум поддержка'
    ],
    icon: 'star',
    color: currentColors.primary,
    description: 'Приоритет, лучшие водители, кэшбэк 10%.'
  },
  {
    id: 'premium',
    name: 'Премиум',
    price: selectedPeriod === 'month' ? 39.99 : 399.99,
    period: selectedPeriod === 'month' ? 'месяц' : 'год',
    popular: true,
    features: [
      'Все из Плюс',
      'Эксклюзивные водители (5.0 рейтинг)',
      'Максимальный кэшбэк 15%',
      'Персональный менеджер',
      'Бесплатные отмены'
    ],
    icon: 'diamond',
    color: currentColors.secondary,
    description: 'Всё из Плюс, эксклюзивные водители, кэшбэк 15%, менеджер.'
  },
  {
    id: 'family',
    name: 'Премиум+',
    price: selectedPeriod === 'month' ? 59.99 : 599.99,
    period: selectedPeriod === 'month' ? 'месяц' : 'год',
    features: [
      'Все из Премиум',
      'До 5 членов семьи',
      'Детские кресла включены',
      'Специальные семейные маршруты',
      'Приоритет для детей'
    ],
    icon: 'people',
    color: currentColors.accent,
    description: 'Всё из Премиум, до 5 членов семьи, детские кресла, семейные маршруты.'
  }
]; 