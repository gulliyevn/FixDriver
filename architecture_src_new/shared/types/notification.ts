export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'trip' | 'payment' | 'driver' | 'system' | 'order';
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface PushNotificationPayload {
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface NotificationFilters {
  type?: Notification['type'];
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<Notification['type'], number>;
}
