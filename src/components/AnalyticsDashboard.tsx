import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptions';
import { DollarSign, TrendingUp, CreditCard, Bell } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface Analytics {
  totalSubscriptions: number;
  monthlyTotal: number;
  yearlyTotal: number;
  upcomingRenewals: number;
  byCategory: Record<string, { count: number; total: number }>;
}

const CHART_COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
      setError(err.response?.data?.error || 'Failed to load analytics');
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
          <div key={i} className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl">
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
      bgGradient: 'from-blue-500/10 to-blue-600/10',
    },
    {
      title: 'Yearly Spend',
      value: formatCurrency(analytics.yearlyTotal),
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
    },
    {
      title: 'Active Subscriptions',
      value: analytics.totalSubscriptions.toString(),
      icon: CreditCard,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-500/10 to-green-600/10',
    },
    {
      title: 'Upcoming Renewals',
      value: analytics.upcomingRenewals.toString(),
      icon: Bell,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-500/10 to-orange-600/10',
    },
  ];

  // Prepare chart data
  const categoryEntries = Object.entries(analytics.byCategory);
  const pieData = categoryEntries.map(([name, data]) => ({
    name,
    value: Math.round(data.total * 100) / 100,
  }));
  const barData = categoryEntries.map(([name, data]) => ({
    name: name.length > 12 ? name.slice(0, 12) + '...' : name,
    amount: Math.round(data.total * 100) / 100,
    count: data.count,
  }));

  const hasCategories = categoryEntries.length > 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group relative bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-400">{card.title}</p>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      {hasCategories && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart - Category Distribution */}
          <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Spending Distribution</h3>
            <div className="h-64 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#0f172a',
                      fontSize: '13px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="text-xs text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart - Category Amounts */}
          <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Spending by Category</h3>
            <div className="h-64 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: isDark ? '#9ca3af' : '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: isDark ? '#9ca3af' : '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#0f172a',
                      fontSize: '13px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Monthly']}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} activeBar={{ stroke: '#fff', strokeWidth: 2 }}>
                    {barData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bars - Category Breakdown */}
      {hasCategories && (
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Category Breakdown</h3>
          <div className="space-y-5">
            {categoryEntries.map(([categoryName, data], index) => {
              const percentage = (data.total / analytics.monthlyTotal) * 100;
              const color = CHART_COLORS[index % CHART_COLORS.length];
              return (
                <div key={categoryName} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-semibold text-white">
                        {categoryName}
                      </span>
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                        {data.count} subscription{data.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(data.total)}
                    </span>
                  </div>
                  <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
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
