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
    id: 'free',
    name: 'Бесплатный',
    price: 0,
    period: selectedPeriod === 'month' ? 'месяц' : 'год',
    features: [
      'Комиссия с клиента: 5%',
      'Стандартная поддержка'
    ],
    icon: 'remove-circle',
    color: '#6B7280',
    description: 'Базовые функции без дополнительных возможностей.'
  },
  {
    id: 'basic',
    name: 'Плюс',
    price: selectedPeriod === 'month' ? 6.99 : 62.90,
    period: selectedPeriod === 'month' ? 'месяц' : 'год',
    features: [
      'Комиссия с клиента: 3%',
      'Кэшбэк FixCash: 2%',
      'Приоритет при выборе водителя',
      'Быстрая поддержка',
      'Гарантия ожидания: 5 мин',
      'Бесплатная отмена: 1/мес',
      'Мульти-точки маршрута'
    ],
    icon: 'star',
    color: currentColors.primary,
    description: 'Приоритет, лучшие водители, кэшбэк 2%.'
  },
  {
    id: 'premium',
    name: 'Премиум',
    price: selectedPeriod === 'month' ? 14.99 : 134.90,
    period: selectedPeriod === 'month' ? 'месяц' : 'год',
    popular: true,
    features: [
      'Комиссия с клиента: 1%',
      'Кэшбэк FixCash: 5%',
      'Высокий приоритет при выборе водителя',
      'VIP поддержка',
      'Гарантия ожидания: 3 мин',
      'Бесплатная отмена: 2/мес',
      'Мульти-точки маршрута',
      'Интеграция с календарём',
      'Ранний доступ к акциям'
    ],
    icon: 'diamond',
    color: currentColors.secondary,
    description: 'Всё из Плюс, эксклюзивные водители, кэшбэк 5%, VIP поддержка.'
  },
  {
    id: 'family',
    name: 'Премиум+',
    price: selectedPeriod === 'month' ? 29.99 : 269.90,
    period: selectedPeriod === 'month' ? 'месяц' : 'год',
    features: [
      'Комиссия с клиента: 0%',
      'Кэшбэк FixCash: 10%',
      'Максимальный приоритет при выборе водителя',
      'Персональный',
      'Гарантия ожидания: 2 мин',
      'Бесплатная отмена: 5/мес',
      'Мульти-точки маршрута',
      'Интеграция с календарём',
      'Ранний доступ к акциям'
    ],
    icon: 'people',
    color: currentColors.accent,
    description: 'Всё из Премиум, максимальные привилегии, кэшбэк 10%, персональный менеджер.'
  }
]; 