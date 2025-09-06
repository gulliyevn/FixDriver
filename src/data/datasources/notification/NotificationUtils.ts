import { NOTIFICATION_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class NotificationUtils {
  // Format time for display
  static formatTime(dateString: string, language: string = 'en'): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return NOTIFICATION_CONSTANTS.TIME_FORMATS.JUST_NOW;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${NOTIFICATION_CONSTANTS.TIME_FORMATS.MINUTES_AGO}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${NOTIFICATION_CONSTANTS.TIME_FORMATS.HOURS_AGO}`;
    } else if (diffDays === 1) {
      return NOTIFICATION_CONSTANTS.TIME_FORMATS.YESTERDAY;
    } else {
      // Map language to locale
      const localeMap: Record<string, string> = NOTIFICATION_CONSTANTS.LOCALE_MAP;
      const locale = localeMap[language] || NOTIFICATION_CONSTANTS.DEFAULT_LOCALE;
      
      return date.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  // Validate notification data
  static validateNotification(notification: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!notification.userId) {
      errors.push('User ID is required');
    }

    if (!notification.title || notification.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!notification.message || notification.message.trim().length === 0) {
      errors.push('Message is required');
    }

    if (!notification.type || !NOTIFICATION_CONSTANTS.VALID_TYPES.includes(notification.type)) {
      errors.push('Valid notification type is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate notification ID
  static generateNotificationId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check if notification is recent (within last hour)
  static isRecentNotification(createdAt: string): boolean {
    const notificationTime = new Date(createdAt).getTime();
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return notificationTime > oneHourAgo;
  }

  // Get notification priority based on type
  static getNotificationPriority(type: string): number {
    const priorityMap: Record<string, number> = NOTIFICATION_CONSTANTS.PRIORITY_MAP;
    return priorityMap[type] || NOTIFICATION_CONSTANTS.DEFAULT_PRIORITY;
  }
}
