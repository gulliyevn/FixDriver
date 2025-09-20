import { Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: 'notification_1',
    userId: 'user1',
    title: 'Добро пожаловать в FixDrive!',
    message: 'Спасибо за регистрацию. Начните планировать свои поездки прямо сейчас!',
    type: 'system',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 часа назад
  },
  {
    id: 'notification_2',
    userId: 'user1',
    title: 'Новый водитель поблизости',
    message: 'В вашем районе появился новый водитель с рейтингом 4.9',
    type: 'driver',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 минут назад
  },
  {
    id: 'notification_3',
    userId: 'user1',
    title: 'Поездка подтверждена',
    message: 'Ваша поездка на завтра в 09:00 подтверждена водителем',
    type: 'trip',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 час назад
  },
  {
    id: 'notification_4',
    userId: 'user1',
    title: 'Напоминание о поездке',
    message: 'Не забудьте о запланированной поездке завтра в 14:30',
    type: 'trip',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 минут назад
  },
  {
    id: 'notification_5',
    userId: 'user1',
    title: 'Обновление приложения',
    message: 'Доступна новая версия приложения с улучшенным интерфейсом',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 часа назад
  },
  {
    id: 'notification_6',
    userId: 'user1',
    title: 'Водитель отменил поездку',
    message: 'К сожалению, водитель отменил вашу поездку. Мы найдем замену',
    type: 'trip',
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 минут назад
  },
  {
    id: 'notification_7',
    userId: 'user1',
    title: 'Новое предложение',
    message: 'Специальное предложение: скидка 20% на первую поездку',
    type: 'promotion',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 минут назад
  },
  {
    id: 'notification_8',
    userId: 'user1',
    title: 'Оценка поездки',
    message: 'Пожалуйста, оцените вашу последнюю поездку с водителем',
    type: 'rating',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 часа назад
  },
];