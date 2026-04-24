import { useState, useEffect } from 'react';
import { insightsService, type CurrencyConversion } from '../services/insights';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Globe } from 'lucide-react';

export default function CurrencyOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<CurrencyConversion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCurrency();
  }, [user?.currency]);

  const loadCurrency = async () => {
    try {
      setLoading(true);
      const result = await insightsService.getCurrency(user?.currency);
      setData(result);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load currency data');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6 animate-pulse">
        <div className="h-5 bg-slate-700 rounded w-1/4 mb-6"></div>
        <div className="h-16 bg-slate-700/50 rounded-lg mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-700/50 rounded-lg"></div>
          ))}
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

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Currency Overview</h3>
        <span className="text-sm text-gray-400">Base: {data.baseCurrency}</span>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 p-5 mb-6">
        <p className="text-sm text-gray-400 mb-1">Total Spending</p>
        <p className="text-3xl font-bold text-white">
          {formatAmount(data.totalConverted, data.baseCurrency)}
        </p>
        <p className="text-xs text-gray-500 mt-1">Converted to {data.baseCurrency}</p>
      </div>

      {/* Subscription list */}
      {data.subscriptions.length > 0 && (
        <div className="space-y-3">
          {data.subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-white font-medium text-sm">{sub.name}</span>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400">
                  {formatAmount(sub.originalAmount, sub.originalCurrency)}
                </span>
                {sub.originalCurrency !== data.baseCurrency && (
                  <>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                    <span className="text-white font-medium">
                      {formatAmount(sub.convertedAmount, data.baseCurrency)}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
