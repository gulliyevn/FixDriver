export type OptionItem = { label: string; value: string };

// Returns tariff options with localized labels using provided t()
export const getTariffOptions = (t: (key: string) => string): OptionItem[] => {
  return [
    { label: t('auth.register.tariff'), value: '' },
    { label: 'Economy', value: 'economy' },
    { label: 'Comfort', value: 'comfort' },
    { label: 'Business', value: 'business' },
    { label: 'VIP', value: 'vip' },
  ];
};

// Experience options can be constructed inline in the form, but provided here if needed
export const getExperienceOptions = (t: (key: string) => string): OptionItem[] => {
  return [
    { label: t('auth.register.experienceUpTo1'), value: '0-1' },
    { label: t('auth.register.experience1'), value: '1' },
    { label: t('auth.register.experience2'), value: '2' },
    { label: t('auth.register.experience3'), value: '3' },
    { label: t('auth.register.experience4'), value: '4' },
    { label: t('auth.register.experience5'), value: '5' },
    { label: t('auth.register.experience6'), value: '6' },
    { label: t('auth.register.experience7'), value: '7' },
    { label: t('auth.register.experience8'), value: '8' },
    { label: t('auth.register.experience9'), value: '9' },
    { label: t('auth.register.experience10'), value: '10' },
    { label: t('auth.register.experience10plus'), value: '10+' },
  ];
};


