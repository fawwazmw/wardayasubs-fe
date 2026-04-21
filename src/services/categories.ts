import { apiClient } from './api';
import type { Category } from '../types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  },

  async getById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  async create(data: {
    name: string;
    color?: string;
    icon?: string;
  }): Promise<Category> {
    return apiClient.post<Category>('/categories', data);
  },

  async update(
    id: string,
    data: Partial<{ name: string; color?: string; icon?: string }>
  ): Promise<Category> {
    return apiClient.put<Category>(`/categories/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/categories/${id}`);
  },
};
