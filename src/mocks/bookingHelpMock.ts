export interface BookingHelpSlide {
  id: number;
  title: string;
  icon: string;
  content: string;
  description: string;
}

export const bookingHelpSlides: BookingHelpSlide[] = [
  {
    id: 1,
    title: 'Выбор маршрута',
    icon: 'map',
    content: 'Откройте карту и выберите точку отправления и назначения. Укажите точный адрес для корректного расчета маршрута.',
    description: 'Как правильно выбрать маршрут поездки'
  },
  {
    id: 2,
    title: 'Выбор водителя',
    icon: 'person',
    content: 'Просмотрите доступных водителей, их рейтинг и отзывы. Выберите подходящего водителя для вашей поездки.',
    description: 'Как выбрать подходящего водителя'
  },
  {
    id: 3,
    title: 'Подтверждение заказа',
    icon: 'checkmark-circle',
    content: 'Подтвердите детали поездки: время, адрес, количество пассажиров. Водитель получит уведомление о заказе.',
    description: 'Как подтвердить заказ поездки'
  },
  {
    id: 4,
    title: 'Ожидание водителя',
    icon: 'time',
    content: 'Водитель приедет к указанному адресу в течение 5-10 минут. Вы можете отслеживать его местоположение на карте.',
    description: 'Что делать во время ожидания водителя'
  }
];

export const getBookingHelpSlides = (): BookingHelpSlide[] => {
  return bookingHelpSlides;
}; 