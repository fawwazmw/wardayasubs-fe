import { apiClient } from './api';

export const adminService = {
  async getSystemStats(): Promise<any> {
    return apiClient.get<any>('/admin/stats');
  },

  async getAllUsers(params?: { page?: number; limit?: number; search?: string }): Promise<any> {
    return apiClient.get<any>('/admin/users', params);
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/admin/users/${id}`);
  },
};
