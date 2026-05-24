import type { Notification, ServerNotification } from "~/types/notification";

/**
 * サーバーから取得した通知データをクライアント形式に変換
 */
export function convertServerNotificationToClient(
  serverNotification: ServerNotification,
): Notification {
  return {
    id: serverNotification.id,
    title: serverNotification.title,
    message: serverNotification.message,
    type: serverNotification.type as Notification["type"],
    isRead: serverNotification.is_read,
    timestamp: new Date(serverNotification.updated_at),
  };
}

/**
 * サーバーから取得した通知配列をクライアント形式に一括変換
 */
export function convertServerNotificationsToClient(
  serverNotifications: ServerNotification[],
): Notification[] {
  return serverNotifications.map(convertServerNotificationToClient);
}
