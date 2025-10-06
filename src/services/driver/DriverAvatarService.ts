import APIClient from "../APIClient";
import * as ImagePicker from "expo-image-picker";

export interface AvatarData {
  id: string;
  driverId: string;
  url: string;
  thumbnailUrl?: string;
  timestamp: number;
  size: number;
  type: string;
  isDefault: boolean;
}

export interface UploadAvatarResponse {
  success: boolean;
  avatar?: AvatarData;
  error?: string;
}

export class DriverAvatarService {
  /**
   * Получает аватар водителя
   */
  static async getAvatar(driverId: string): Promise<AvatarData | null> {
    try {
      const response = await APIClient.get<AvatarData>(
        `/drivers/${driverId}/avatar`,
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Загружает новый аватар водителя
   */
  static async uploadAvatar(
    driverId: string,
    imageUri: string,
  ): Promise<UploadAvatarResponse> {
    try {
      const formData = new FormData();
      const file: { uri: string; type: string; name: string } = {
        uri: imageUri,
        type: "image/jpeg",
        name: "avatar.jpg",
      };
      formData.append("avatar", file as unknown as Blob);
      formData.append("driverId", driverId);

      const response = await APIClient.post<AvatarData>(
        "/drivers/avatar/upload",
        formData,
      );

      if (response.success && response.data) {
        return {
          success: true,
          avatar: response.data,
        };
      }

      return {
        success: false,
        error: response.error || "Ошибка при загрузке аватара",
      };
    } catch (error) {
      return {
        success: false,
        error: "Ошибка при загрузке аватара",
      };
    }
  }

  /**
   * Удаляет аватар водителя
   */
  static async deleteAvatar(driverId: string): Promise<boolean> {
    try {
      const response = await APIClient.delete<{ success: boolean }>(
        `/drivers/${driverId}/avatar`,
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Открывает галерею для выбора изображения
   */
  static async pickImageFromGallery(): Promise<string | null> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Открывает камеру для съемки
   */
  static async takePhoto(): Promise<string | null> {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Запрашивает разрешения на доступ к камере и галерее
   */
  static async requestPermissions(): Promise<{
    camera: boolean;
    gallery: boolean;
  }> {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      return {
        camera: cameraPermission.status === "granted",
        gallery: mediaLibraryPermission.status === "granted",
      };
    } catch (error) {
      return {
        camera: false,
        gallery: false,
      };
    }
  }
}

export default DriverAvatarService;
