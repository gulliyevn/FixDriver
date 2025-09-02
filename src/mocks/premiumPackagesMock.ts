export interface VipPackage {
  id: string;
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  features: string[];
  icon: string;
  color: string;
}

export const getPremiumPackages = (selectedPeriod: 'month' | 'year', currentColors: any, t?: (key: string) => string): VipPackage[] => {
  // Бесплатный пакет всегда показывается
  const freePackage: VipPackage = {
    id: 'free',
    name: t ? t('premium.packages.free') : 'Бесплатный',
    price: 0,
    period: t ? t('premium.periods.month') : 'месяц', // Период не важен для бесплатного
    features: [
      t ? `${t('premium.features.commission')}: 5%` : 'Комиссия с клиента: 5%',
      t ? t('premium.values.standard') + ' ' + t('premium.features.support').toLowerCase() : 'Стандартная поддержка'
    ],
    icon: 'leaf',
    color: '#6B7280'
  };

  // Платные пакеты зависят от выбранного периода
  const paidPackages: VipPackage[] = selectedPeriod === 'month' ? [
    {
      id: 'plus_month',
      name: t ? t('premium.packages.plus') : 'Плюс',
      price: 6.99,
      period: t ? t('premium.periods.month') : 'месяц',
      features: [
        t ? `${t('premium.features.commission')}: 3%` : 'Комиссия с клиента: 3%',
        t ? `${t('premium.features.cashback')}: 2%` : 'Кэшбэк FixCash: 2%',
        t ? t('premium.features.priority') : 'Приоритет при выборе водителя',
        t ? t('premium.values.fast') + ' ' + t('premium.features.support').toLowerCase() : 'Быстрая поддержка',
        t ? `${t('premium.features.waitGuarantee')}: 5 мин` : 'Гарантия ожидания: 5 мин',
        t ? `${t('premium.features.freeCancellation')}: 1/мес` : 'Бесплатная отмена: 1/мес',
        t ? t('premium.features.multiRoute') : 'Мульти-точки маршрута'
      ],
      icon: 'shield',
      color: currentColors.primary
    },
    {
      id: 'premium_month',
      name: t ? t('premium.packages.premium') : 'Премиум',
      price: 14.99,
      period: t ? t('premium.periods.month') : 'месяц',
      popular: true,
      features: [
        t ? `${t('premium.features.commission')}: 1%` : 'Комиссия с клиента: 1%',
        t ? `${t('premium.features.cashback')}: 5%` : 'Кэшбэк FixCash: 5%',
        t ? t('premium.values.high') + ' ' + t('premium.features.priority').toLowerCase() : 'Высокий приоритет при выборе водителя',
        t ? t('premium.values.vip') + ' ' + t('premium.features.support').toLowerCase() : 'VIP поддержка',
        t ? `${t('premium.features.waitGuarantee')}: 3 мин` : 'Гарантия ожидания: 3 мин',
        t ? `${t('premium.features.freeCancellation')}: 2/мес` : 'Бесплатная отмена: 2/мес',
        t ? t('premium.features.multiRoute') : 'Мульти-точки маршрута',
        t ? t('premium.features.calendarIntegration') : 'Интеграция с календарём',
        t ? t('premium.features.earlyAccess') : 'Ранний доступ к акциям'
      ],
      icon: 'heart',
      color: currentColors.secondary
    },
    {
      id: 'premiumPlus_month',
      name: t ? t('premium.packages.premiumPlus') : 'Премиум+',
      price: 29.99,
      period: t ? t('premium.periods.month') : 'месяц',
      features: [
        t ? `${t('premium.features.commission')}: 0%` : 'Комиссия с клиента: 0%',
        t ? `${t('premium.features.cashback')}: 10%` : 'Кэшбэк FixCash: 10%',
        t ? t('premium.values.maximum') + ' ' + t('premium.features.priority').toLowerCase() : 'Максимальный приоритет при выборе водителя',
        t ? t('premium.values.personal') : 'Персональный',
        t ? `${t('premium.features.waitGuarantee')}: 2 мин` : 'Гарантия ожидания: 2 мин',
        t ? `${t('premium.features.freeCancellation')}: 5/мес` : 'Бесплатная отмена: 5/мес',
        t ? t('premium.features.multiRoute') : 'Мульти-точки маршрута',
        t ? t('premium.features.calendarIntegration') : 'Интеграция с календарём',
        t ? t('premium.features.earlyAccess') : 'Ранний доступ к акциям'
      ],
      icon: 'diamond',
      color: currentColors.accent
    }
  ] : [
    {
      id: 'plus_year',
      name: t ? t('premium.packages.plus') : 'Плюс',
      price: 62.90,
      period: t ? t('premium.periods.year') : 'год',
      features: [
        t ? `${t('premium.features.commission')}: 3%` : 'Комиссия с клиента: 3%',
        t ? `${t('premium.features.cashback')}: 2%` : 'Кэшбэк FixCash: 2%',
        t ? t('premium.features.priority') : 'Приоритет при выборе водителя',
        t ? t('premium.values.fast') + ' ' + t('premium.features.support').toLowerCase() : 'Быстрая поддержка',
        t ? `${t('premium.features.waitGuarantee')}: 5 мин` : 'Гарантия ожидания: 5 мин',
        t ? `${t('premium.features.freeCancellation')}: 1/мес` : 'Бесплатная отмена: 1/мес',
        t ? t('premium.features.multiRoute') : 'Мульти-точки маршрута'
      ],
      icon: 'shield',
      color: currentColors.primary
    },
    {
      id: 'premium_year',
      name: t ? t('premium.packages.premium') : 'Премиум',
      price: 134.90,
      period: t ? t('premium.periods.year') : 'год',
      popular: true,
      features: [
        t ? `${t('premium.features.commission')}: 1%` : 'Комиссия с клиента: 1%',
        t ? `${t('premium.features.cashback')}: 5%` : 'Кэшбэк FixCash: 5%',
        t ? t('premium.values.high') + ' ' + t('premium.features.priority').toLowerCase() : 'Высокий приоритет при выборе водителя',
        t ? t('premium.values.vip') + ' ' + t('premium.features.support').toLowerCase() : 'VIP поддержка',
        t ? `${t('premium.features.waitGuarantee')}: 3 мин` : 'Гарантия ожидания: 3 мин',
        t ? `${t('premium.features.freeCancellation')}: 2/мес` : 'Бесплатная отмена: 2/мес',
        t ? t('premium.features.multiRoute') : 'Мульти-точки маршрута',
        t ? t('premium.features.calendarIntegration') : 'Интеграция с календарём',
        t ? t('premium.features.earlyAccess') : 'Ранний доступ к акциям'
      ],
      icon: 'heart',
      color: currentColors.secondary
    },
    {
      id: 'premiumPlus_year',
      name: t ? t('premium.packages.premiumPlus') : 'Премиум+',
      price: 269.90,
      period: t ? t('premium.periods.year') : 'год',
      features: [
        t ? `${t('premium.features.commission')}: 0%` : 'Комиссия с клиента: 0%',
        t ? `${t('premium.features.cashback')}: 10%` : 'Кэшбэк FixCash: 10%',
        t ? t('premium.values.maximum') + ' ' + t('premium.features.priority').toLowerCase() : 'Максимальный приоритет при выборе водителя',
        t ? t('premium.values.personal') : 'Персональный',
        t ? `${t('premium.features.waitGuarantee')}: 2 мин` : 'Гарантия ожидания: 2 мин',
        t ? `${t('premium.features.freeCancellation')}: 5/мес` : 'Бесплатная отмена: 5/мес',
        t ? t('premium.features.multiRoute') : 'Мульти-точки маршрута',
        t ? t('premium.features.calendarIntegration') : 'Интеграция с календарём',
        t ? t('premium.features.earlyAccess') : 'Ранний доступ к акциям'
      ],
      icon: 'diamond',
      color: currentColors.accent
    }
  ];

  return [freePackage, ...paidPackages];
}; 