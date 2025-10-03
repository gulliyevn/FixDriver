import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import { User } from "../types/user";

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  birthDate?: string;
  rating?: number;
  address?: string;
  createdAt: string;
  role: string;
  avatar?: string;
}

/**
 * Хук для работы с профилем пользователя
 * Теперь использует ProfileContext вместо собственного состояния
 */
export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    console.error("useProfile must be used within ProfileProvider");
    return;
  }

  const {
    profile,
    loading,
    updateProfile: contextUpdateProfile,
    loadProfile,
  } = context;

  // Адаптируем updateProfile для обратной совместимости
  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      await contextUpdateProfile(updatedData as Partial<User>);
      return true;
    } catch (err) {
      return false;
    }
  };

  // clearProfile не нужен, так как ProfileContext управляет профилем автоматически
  const clearProfile = async () => {
    // Профиль очищается через AuthContext.logout()
  };

  return {
    profile,
    loading,
    error: !profile && !loading ? "Не удалось загрузить профиль" : null,
    loadProfile,
    updateProfile,
    clearProfile,
  };
};
