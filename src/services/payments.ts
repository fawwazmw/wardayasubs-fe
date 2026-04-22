import { apiClient } from './api';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  paidAt: string;
  subscriptionId: string;
  subscription: {
    id: string;
    name: string;
    currency: string;
  };
  createdAt: string;
}

export const paymentService = {
  async getAll(subscriptionId?: string): Promise<Payment[]> {
    return apiClient.get<Payment[]>('/payments', subscriptionId ? { subscriptionId } : undefined);
  },

  async create(data: { amount: number; currency: string; paidAt?: string; subscriptionId: string }): Promise<Payment> {
    return apiClient.post<Payment>('/payments', data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/payments/${id}`);
  },
};
