import { apiClient } from './api';

export interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    return apiClient.get<Notification[]>('/notifications');
  },

  async markAsRead(id: string): Promise<Notification> {
    return apiClient.put<Notification>(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    return apiClient.put<void>('/notifications/read-all');
  },
};
