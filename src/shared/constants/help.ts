import { HelpContent } from '../types/help';

export const DEFAULT_HELP_CONTENT: HelpContent = {
  sections: [
    {
      id: 'booking',
      titleKey: 'help.howToOrder',
      descriptionKey: 'help.howToOrderDesc',
      icon: 'car',
      modalType: 'booking',
    },
    {
      id: 'payment',
      titleKey: 'help.paymentAndRates',
      descriptionKey: 'help.paymentAndRatesDesc',
      icon: 'card',
      modalType: 'payment',
    },
    {
      id: 'safety',
      titleKey: 'help.safetyTitle',
      descriptionKey: 'help.safetyDesc',
      icon: 'shield-checkmark',
      modalType: 'safety',
    },
    {
      id: 'rules',
      titleKey: 'help.rulesTitle',
      descriptionKey: 'help.rulesDesc',
      icon: 'document-text',
      modalType: 'rules',
    },
    {
      id: 'support',
      titleKey: 'help.support',
      descriptionKey: 'help.supportDesc',
      icon: 'chatbubbles',
      action: {
        type: 'navigation',
        value: 'SupportChat',
      },
    },
  ],
  contact: {
    whatsappNumber: '+994516995513',
    messageKey: 'support.whatsappMessage',
    fallbackUrl: 'https://wa.me/994516995513',
  },
};

