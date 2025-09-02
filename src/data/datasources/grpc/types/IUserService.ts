import { User, PaginationParams, PaginatedResponse } from '../../../../shared/types';

export interface IUserService {
  /**
   * Получение пользователя по ID
   */
  getUser(id: string): Promise<User>;

  /**
   * Обновление пользователя
   */
  updateUser(id: string, data: Partial<User>): Promise<User>;

  /**
   * Удаление пользователя
   */
  deleteUser(id: string): Promise<void>;

  /**
   * Получение списка пользователей с пагинацией
   */
  getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>>;

  /**
   * Поиск пользователей
   */
  searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>>;

  /**
   * Обновление аватара
   */
  updateAvatar(id: string, avatarUrl: string): Promise<User>;

  /**
   * Верификация пользователя
   */
  verifyUser(id: string): Promise<User>;

  /**
   * Блокировка/разблокировка пользователя
   */
  toggleUserStatus(id: string, isBlocked: boolean): Promise<User>;
}
