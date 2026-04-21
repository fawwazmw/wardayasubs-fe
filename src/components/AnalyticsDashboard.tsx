import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptions';
import { DollarSign, TrendingUp, CreditCard, Bell } from 'lucide-react';

interface Analytics {
  totalSubscriptions: number;
  monthlyTotal: number;
  yearlyTotal: number;
  upcomingRenewals: number;
  byCategory: Record<string, { count: number; total: number }>;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getAnalytics();
      setAnalytics(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-lg">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const statCards = [
    {
      title: 'Monthly Spend',
      value: formatCurrency(analytics.monthlyTotal),
      icon: DollarSign,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Yearly Spend',
      value: formatCurrency(analytics.yearlyTotal),
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
    {
      title: 'Active Subscriptions',
      value: analytics.totalSubscriptions.toString(),
      icon: CreditCard,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
    },
    {
      title: 'Upcoming Renewals',
      value: analytics.upcomingRenewals.toString(),
      icon: Bell,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* By Category */}
      {Object.keys(analytics.byCategory).length > 0 && (
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Spending by Category</h3>
          <div className="space-y-5">
            {Object.entries(analytics.byCategory).map(([categoryName, data]) => {
              const percentage = (data.total / analytics.monthlyTotal) * 100;
              return (
                <div key={categoryName} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {categoryName}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {data.count} subscription{data.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(data.total)}
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out group-hover:from-purple-600 group-hover:to-purple-700"
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {percentage.toFixed(1)}% of monthly spend
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
