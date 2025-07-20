# API: Удаление аккаунта

## Endpoint
```
DELETE /api/profile/account
```

## Описание
Полностью удаляет аккаунт пользователя и все связанные с ним данные из базы данных.

## Заголовки
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Ответ

### Успешный ответ (200)
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### Ошибка (400/401/500)
```json
{
  "success": false,
  "error": "Error message"
}
```

## Логика удаления на бэкенде

### 1. Проверка авторизации
- Валидация JWT токена
- Проверка существования пользователя

### 2. Удаление связанных данных (в правильном порядке)
```sql
-- 1. Удаляем активные сессии
DELETE FROM user_sessions WHERE user_id = ?;

-- 2. Удаляем уведомления
DELETE FROM user_notifications WHERE user_id = ?;

-- 3. Удаляем историю платежей
DELETE FROM payment_history WHERE user_id = ?;

-- 4. Удаляем карты
DELETE FROM user_cards WHERE user_id = ?;

-- 5. Удаляем адреса
DELETE FROM user_addresses WHERE user_id = ?;

-- 6. Удаляем детей (для клиентов)
DELETE FROM user_children WHERE user_id = ?;

-- 7. Удаляем автомобили (для водителей)
DELETE FROM user_cars WHERE user_id = ?;

-- 8. Удаляем поездки
DELETE FROM trips WHERE user_id = ? OR driver_id = ?;

-- 9. Удаляем бронирования
DELETE FROM bookings WHERE user_id = ?;

-- 10. Удаляем чаты
DELETE FROM chat_messages WHERE user_id = ? OR driver_id = ?;
DELETE FROM chats WHERE user_id = ? OR driver_id = ?;

-- 11. Удаляем основной аккаунт
DELETE FROM users WHERE id = ?;
```

### 3. Логирование
```sql
INSERT INTO audit_logs (
  action, 
  user_id, 
  details, 
  ip_address, 
  user_agent, 
  created_at
) VALUES (
  'account_deleted',
  ?, 
  'User account permanently deleted',
  ?, 
  ?, 
  NOW()
);
```

### 4. Инвалидация токенов
- Добавить токен в черный список
- Или удалить из таблицы активных токенов

## Безопасность

### GDPR Compliance
- Полное удаление данных (не soft delete)
- Логирование для аудита
- Уведомление пользователя об удалении

### Дополнительные проверки
- Подтверждение пароля перед удалением
- Проверка на активные поездки
- Проверка на неоплаченные долги

## Пример реализации на Node.js/Express

```javascript
router.delete('/profile/account', authenticateToken, async (req, res) => {
  const transaction = await db.beginTransaction();
  
  try {
    const userId = req.user.id;
    
    // Проверяем активные поездки
    const activeTrips = await db.query(
      'SELECT COUNT(*) as count FROM trips WHERE user_id = ? AND status IN ("active", "in_progress")',
      [userId]
    );
    
    if (activeTrips[0].count > 0) {
      throw new Error('Cannot delete account with active trips');
    }
    
    // Удаляем все связанные данные
    await db.query('DELETE FROM user_sessions WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM user_notifications WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM payment_history WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM user_cards WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM user_addresses WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM user_children WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM user_cars WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM trips WHERE user_id = ? OR driver_id = ?', [userId, userId]);
    await db.query('DELETE FROM bookings WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM chat_messages WHERE user_id = ? OR driver_id = ?', [userId, userId]);
    await db.query('DELETE FROM chats WHERE user_id = ? OR driver_id = ?', [userId, userId]);
    
    // Удаляем основной аккаунт
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
    
    // Логируем удаление
    await db.query(
      'INSERT INTO audit_logs (action, user_id, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      ['account_deleted', userId, 'User account permanently deleted', req.ip, req.get('User-Agent')]
    );
    
    await transaction.commit();
    
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Тестирование

### Тест 1: Успешное удаление
```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/profile/account
```

### Тест 2: Без авторизации
```bash
curl -X DELETE \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/profile/account
```

### Тест 3: С активными поездками
```bash
# Сначала создаем активную поездку, затем пытаемся удалить аккаунт
``` 