export interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  currency?: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    subscriptions: number;
  };
}

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  nextBillingDate: string;
  categoryId?: string;
  category?: Category;
  website?: string;
  logo?: string;
  isActive: boolean;
  reminderDays: number;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionRequest {
  name: string;
  description?: string;
  amount: number;
  currency?: string;
  billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate?: string;
  nextBillingDate: string;
  categoryId?: string;
  website?: string;
  logo?: string;
  reminderDays?: number;
  notes?: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  monthlyTotal: number;
  yearlyTotal: number;
  upcomingRenewals: number;
  byCategory: Record<string, { count: number; total: number }>;
}
