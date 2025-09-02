export interface SafetyHelpSlide {
  id: number;
  title: string;
  icon: string;
  content: string;
  description: string;
}

export const safetyHelpSlides: SafetyHelpSlide[] = [
  {
    id: 1,
    title: 'Проверка водителей',
    icon: 'shield-checkmark',
    content: 'Все водители проходят тщательную проверку документов, транспортных средств и криминального прошлого. Мы гарантируем безопасность каждой поездки.',
    description: 'Как обеспечивается безопасность водителей'
  },
  {
    id: 2,
    title: 'Отслеживание маршрута',
    icon: 'location',
    content: 'Ваши близкие могут отслеживать ваш маршрут в реальном времени. Поделитесь ссылкой на поездку для дополнительной безопасности.',
    description: 'Как отслеживать маршрут поездки'
  },
  {
    id: 3,
    title: 'Экстренная кнопка',
    icon: 'warning',
    content: 'В приложении доступна экстренная кнопка для быстрого вызова помощи. При нажатии автоматически отправляется сигнал в службу безопасности.',
    description: 'Как использовать экстренную кнопку'
  },
  {
    id: 4,
    title: 'Рейтинговая система',
    icon: 'star',
    content: 'После каждой поездки вы можете оценить водителя. Это помогает поддерживать высокое качество сервиса и безопасность.',
    description: 'Как работает рейтинговая система'
  }
];

export const getSafetyHelpSlides = (): SafetyHelpSlide[] => {
  return safetyHelpSlides;
}; 