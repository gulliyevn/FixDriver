# FixDrive

Мобильное приложение для городских поездок с частными водителями.

## Возможности

- Два интерфейса: клиент и водитель (выбор и смена роли)
- Регистрация, логин, восстановление пароля
- Карта маршрута, ETA, бронирование, оплата через Stripe
- Список и фильтрация водителей
- Чат между клиентом и водителем
- Профиль, отзывы, платёжные методы, дети под опекой (для клиентов)
- Управление расписанием и заказами (для водителей)
- Уведомления
- Тёмный/светлый режим (переключатель в профиле)

## Технологии

- React Native + Expo
- TypeScript
- React Navigation
- Stripe API
- Styled-components или StyleSheet
- Context API

## Структура проекта

- `src/components` — UI-компоненты
- `src/screens/auth` — аутентификация и выбор роли
- `src/screens/client` — экраны для клиента
- `src/screens/driver` — экраны для водителя
- `src/screens/profile` — профиль, редактирование, дети, пакеты, тёмная тема
- `src/navigation` — навигация
- `src/services` — работа с API, Stripe, картой и т.д.
- `src/context` — глобальные состояния
- `src/assets` — изображения, иконки, шрифты
- `src/types` — типы и интерфейсы

## Запуск

```sh
npm install
npx expo start
```
cd /Users/gulliyevn/Projects/FixDrive && npx expo start 

FixDrive % npx expo start --clear