import { apiClient } from './api';
import type {
  Subscription,
  CreateSubscriptionRequest,
  SubscriptionStats,
} from '../types';

export const subscriptionService = {
  async getAll(params?: {
    isActive?: boolean;
    categoryId?: string;
  }): Promise<Subscription[]> {
    return apiClient.get<Subscription[]>('/subscriptions', params);
  },

  async getById(id: string): Promise<Subscription> {
    return apiClient.get<Subscription>(`/subscriptions/${id}`);
  },

  async create(data: CreateSubscriptionRequest): Promise<Subscription> {
    return apiClient.post<Subscription>('/subscriptions', data);
  },

  async update(
    id: string,
    data: Partial<CreateSubscriptionRequest>
  ): Promise<Subscription> {
    return apiClient.put<Subscription>(`/subscriptions/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/subscriptions/${id}`);
  },

  async bulkDelete(ids: string[]): Promise<{ message: string; count: number }> {
    return apiClient.post<{ message: string; count: number }>('/subscriptions/bulk-delete', { ids });
  },

  async importCSV(subscriptions: any[]): Promise<{ message: string; imported: number; failed: number; errors?: string[] }> {
    return apiClient.post<{ message: string; imported: number; failed: number; errors?: string[] }>('/subscriptions/import', { subscriptions });
  },

  async getStats(): Promise<SubscriptionStats> {
    return apiClient.get<SubscriptionStats>('/subscriptions/stats');
  },

  async getAnalytics(): Promise<any> {
    return apiClient.get<any>('/subscriptions/stats');
  },

  async getUpcoming(days: number = 30): Promise<any[]> {
    return apiClient.get<any[]>('/subscriptions/upcoming', { days });
  },
};
