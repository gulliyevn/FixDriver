import { Alert } from 'react-native';

// Функция для получения дефолтной даты (18 лет назад)
export const getDefaultDate = (): string => {
  const today = new Date();
  const defaultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return defaultDate.toISOString().split('T')[0]; // Формат YYYY-MM-DD
};

// Функция для проверки изменений в форме
export const hasChanges = (
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
  },
  originalData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
  }
): boolean => {
  return (
    formData.firstName !== originalData.firstName ||
    formData.lastName !== originalData.lastName ||
    formData.phone !== originalData.phone ||
    formData.email !== originalData.email ||
    formData.birthDate !== originalData.birthDate
  );
};

// Функция для обработки нажатия на круг (переключение между клиентом и водителем)
export const handleCirclePress = (
  navigation: any,
  login: (email: string, password: string) => Promise<boolean>,
  t: (key: string) => string
): void => {
  // После завершения анимации проверяем, есть ли уже аккаунт водителя
  // TODO: Здесь должна быть проверка статуса водителя
  const hasDriverAccount = false; // Заглушка, нужно заменить на реальную проверку
  
  if (hasDriverAccount) {
    // Если уже есть аккаунт водителя, переключаемся на профиль водителя
    navigation.navigate('DriverProfile' as any);
  } else {
    // Если нет аккаунта водителя, показываем уведомление
    Alert.alert(
      t('profile.becomeDriverModal.title') || 'Стать водителем',
      t('profile.becomeDriverModal.message') || 'Открыть страницу водителя?',
      [
        { text: t('profile.becomeDriverModal.cancel') || 'Отмена', style: 'cancel' },
        { 
          text: t('profile.becomeDriverModal.proceed') || 'Перейти',
          onPress: async () => {
            // Автоматически входим как водитель
            const success = await login('driver@example.com', 'password123');
            if (!success) {
              Alert.alert('Ошибка', 'Не удалось войти как водитель');
            }
          }
        }
      ]
    );
  }
}; 