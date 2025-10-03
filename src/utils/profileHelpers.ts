import { Alert } from "react-native";

// Функция для получения дефолтной даты (теперь всегда 06.11.2000)
export const getDefaultDate = (): string => {
  return "2000-11-06";
};

// Функция для точного расчета возраста
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Если день рождения еще не наступил в этом году, уменьшаем возраст на 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
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
  },
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
  t: (key: string) => string,
  changeRole?: (role: "client" | "driver") => void,
): void => {
  // После завершения анимации проверяем, есть ли уже аккаунт водителя

  const hasDriverAccount = false; // Заглушка, нужно заменить на реальную проверку

  if (hasDriverAccount) {
    // Если уже есть аккаунт водителя, переключаемся на профиль водителя
    try {
      // Просто меняем роль - RootNavigator автоматически переключится
      if (changeRole) {
        changeRole("driver");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось переключиться к водительскому профилю");
    }
  } else {
    // Если нет аккаунта водителя, показываем уведомление
    Alert.alert(
      t("profile.becomeDriverModal.title") || "Стать водителем",
      t("profile.becomeDriverModal.message") || "Открыть страницу водителя?",
      [
        {
          text: t("profile.becomeDriverModal.cancel") || "Отмена",
          style: "cancel",
        },
        {
          text: t("profile.becomeDriverModal.proceed") || "Перейти",
          onPress: async () => {
            // Автоматически входим как водитель
            const success = await login("driver@example.com", "password123");
            if (!success) {
              Alert.alert("Ошибка", "Не удалось войти как водитель");
            }
          },
        },
      ],
    );
  }
};

// Функция для обработки нажатия на круг в профиле водителя (переключение к клиенту)
export const handleDriverCirclePress = (
  navigation: any,
  login: (email: string, password: string) => Promise<boolean>,
  t: (key: string) => string,
  changeRole?: (role: "client" | "driver") => void,
): void => {
  // После завершения анимации проверяем, есть ли уже аккаунт клиента

  const hasClientAccount = false; // Заглушка, нужно заменить на реальную проверку

  if (hasClientAccount) {
    // Если уже есть аккаунт клиента, переключаемся на профиль клиента
    try {
      // Просто меняем роль - RootNavigator автоматически переключится
      if (changeRole) {
        changeRole("client");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось переключиться к клиентскому профилю");
    }
  } else {
    // Если нет аккаунта клиента, показываем уведомление
    Alert.alert(
      t("profile.becomeClientModal.title") || "Стать клиентом",
      t("profile.becomeClientModal.message") || "Открыть страницу клиента?",
      [
        {
          text: t("profile.becomeClientModal.cancel") || "Отмена",
          style: "cancel",
        },
        {
          text: t("profile.becomeClientModal.proceed") || "Перейти",
          onPress: async () => {
            // Автоматически входим как клиент
            const success = await login("client@example.com", "password123");
            if (!success) {
              Alert.alert(
                t("errors.error"),
                t("profile.becomeClientModal.loginError") ||
                  "Не удалось войти как клиент",
              );
            }
          },
        },
      ],
    );
  }
};
