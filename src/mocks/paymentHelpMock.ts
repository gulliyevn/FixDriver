export interface PaymentHelpSlide {
  id: number;
  title: string;
  icon: string;
  content: string;
  description: string;
}

export const paymentHelpSlides: PaymentHelpSlide[] = [
  {
    id: 1,
    title: 'Способы оплаты',
    icon: 'card',
    content: 'Доступны различные способы оплаты: банковские карты, электронные кошельки, наличные при получении. Выберите удобный для вас способ.',
    description: 'Какие способы оплаты доступны'
  },
  {
    id: 2,
    title: 'Расчет тарифа',
    icon: 'calculator',
    content: 'Тариф рассчитывается автоматически на основе расстояния, времени поездки и выбранного тарифного плана. Все цены указаны в манатах.',
    description: 'Как рассчитывается стоимость поездки'
  },
  {
    id: 3,
    title: 'Тарифные планы',
    icon: 'pricetag',
    content: 'Выберите подходящий тарифный план: базовый, премиум или корпоративный. Каждый план имеет свои преимущества и особенности.',
    description: 'Какие тарифные планы доступны'
  },
  {
    id: 4,
    title: 'Возврат средств',
    icon: 'refresh',
    content: 'В случае отмены поездки или технических проблем, средства возвращаются на ваш счет в течение 1-3 рабочих дней.',
    description: 'Как происходит возврат средств'
  }
];

export const getPaymentHelpSlides = (): PaymentHelpSlide[] => {
  return paymentHelpSlides;
}; 
