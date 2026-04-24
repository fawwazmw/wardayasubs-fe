import { apiClient } from './api';

export interface ForecastData {
  monthly: number;
  threeMonth: number;
  sixMonth: number;
  yearly: number;
  byMonth: { month: string; amount: number }[];
}

export interface ComparisonItem {
  id: string;
  name: string;
  currentAmount: number;
  currentCycle: string;
  monthlyEquivalent: number;
  yearlyEquivalent: number;
  potentialSavings: number;
}

export interface ScoreItem {
  id: string;
  name: string;
  amount: number;
  usageRating: number | null;
  score: number;
  verdict: string;
  alternatives: { name: string; price: string; description: string }[];
}

export interface CurrencyConversion {
  baseCurrency: string;
  subscriptions: { id: string; name: string; originalAmount: number; originalCurrency: string; convertedAmount: number }[];
  totalConverted: number;
}

export const insightsService = {
  getForecast: () => apiClient.get<ForecastData>('/insights/forecast'),
  getComparison: () => apiClient.get<{ subscriptions: ComparisonItem[] }>('/insights/comparison'),
  getScore: () => apiClient.get<{ subscriptions: ScoreItem[] }>('/insights/score'),
  getCurrency: (base?: string) => apiClient.get<CurrencyConversion>('/insights/currency', { base }),
};
