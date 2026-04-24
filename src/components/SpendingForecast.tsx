import { useState, useEffect } from 'react';
import { insightsService, type ForecastData } from '../services/insights';
import { DollarSign, TrendingUp, Calendar, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

export default function SpendingForecast() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      setLoading(true);
      const result = await insightsService.getForecast();
      setData(result);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load forecast');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-slate-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6 animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-slate-700/50 rounded"></div>
        </div>
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

  if (!data) return null;

  const summaryCards = [
    { title: 'Monthly', value: formatCurrency(data.monthly), icon: DollarSign, gradient: 'from-blue-500 to-blue-600', bgGradient: 'from-blue-500/10 to-blue-600/10' },
    { title: '3-Month', value: formatCurrency(data.threeMonth), icon: Calendar, gradient: 'from-purple-500 to-purple-600', bgGradient: 'from-purple-500/10 to-purple-600/10' },
    { title: '6-Month', value: formatCurrency(data.sixMonth), icon: TrendingUp, gradient: 'from-green-500 to-green-600', bgGradient: 'from-green-500/10 to-green-600/10' },
    { title: 'Yearly', value: formatCurrency(data.yearly), icon: Target, gradient: 'from-orange-500 to-orange-600', bgGradient: 'from-orange-500/10 to-orange-600/10' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Spending Forecast</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
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
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Area Chart */}
      {data.byMonth.length > 0 && (
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
          <h4 className="text-lg font-bold text-white mb-4">12-Month Projection</h4>
          <div style={{ width: '100%', height: 288 }}>
            <ResponsiveContainer width="100%" height={288}>
              <AreaChart data={data.byMonth} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} />
                <XAxis
                  dataKey="month"
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
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#0f172a',
                    fontSize: '13px',
                  }}
                  formatter={(value: any) => [formatCurrency(value as number), 'Projected']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#forecastGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
