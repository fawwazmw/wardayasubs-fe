import { useState, useEffect } from 'react';
import { insightsService, type ComparisonItem } from '../services/insights';
import { ArrowRightLeft } from 'lucide-react';

export default function BillingComparison() {
  const [subscriptions, setSubscriptions] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const result = await insightsService.getComparison();
      setSubscriptions(result.subscriptions);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load comparison');
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
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6 animate-pulse">
        <div className="h-5 bg-slate-700 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-700/50 rounded-lg"></div>
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

  if (subscriptions.length === 0) {
    return (
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
        <ArrowRightLeft className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">No subscriptions to compare</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Billing Comparison</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-sm font-medium text-gray-400">Name</th>
              <th className="pb-3 text-sm font-medium text-gray-400">Current Price</th>
              <th className="pb-3 text-sm font-medium text-gray-400">Monthly Equiv</th>
              <th className="pb-3 text-sm font-medium text-gray-400">Yearly Equiv</th>
              <th className="pb-3 text-sm font-medium text-gray-400">Potential Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4">
                  <p className="text-white font-medium">{sub.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{sub.currentCycle}</p>
                </td>
                <td className="py-4 text-white">{formatCurrency(sub.currentAmount)}</td>
                <td className="py-4 text-gray-300">{formatCurrency(sub.monthlyEquivalent)}</td>
                <td className="py-4 text-gray-300">{formatCurrency(sub.yearlyEquivalent)}</td>
                <td className="py-4">
                  {sub.potentialSavings > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      Save {formatCurrency(sub.potentialSavings)}/yr by switching to annual
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
