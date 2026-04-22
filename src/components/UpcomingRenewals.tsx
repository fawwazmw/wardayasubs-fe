import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptions';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

interface UpcomingSubscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  nextBillingDate: string;
  daysUntilBilling: number;
}

export default function UpcomingRenewals() {
  const [upcoming, setUpcoming] = useState<UpcomingSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadUpcoming();
  }, [days]);

  const loadUpcoming = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getUpcoming(days);
      setUpcoming(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load upcoming renewals');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUrgencyStyle = (days: number) => {
    if (days <= 3) return {
      badge: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
      border: 'border-red-500/30',
      bg: 'bg-red-500/5'
    };
    if (days <= 7) return {
      badge: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/5'
    };
    return {
      badge: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5'
    };
  };

  if (loading) {
    return (
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-700/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Upcoming Renewals</h3>
              <p className="text-sm text-gray-400">Stay on top of your subscriptions</p>
            </div>
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-white/20 transition-colors"
          >
            <option value={7} className="bg-slate-800 text-white">Next 7 days</option>
            <option value={14} className="bg-slate-800 text-white">Next 14 days</option>
            <option value={30} className="bg-slate-800 text-white">Next 30 days</option>
            <option value={60} className="bg-slate-800 text-white">Next 60 days</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        {upcoming.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4">
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">No upcoming renewals</p>
            <p className="text-sm text-gray-500 mt-1">
              in the next {days} days
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((sub) => {
              const urgencyStyle = getUrgencyStyle(sub.daysUntilBilling);
              return (
                <div
                  key={sub.id}
                  className={`group relative border ${urgencyStyle.border} ${urgencyStyle.bg} rounded-xl p-4 hover:bg-white/5 transition-all duration-200`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-1 truncate">
                        {sub.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(sub.nextBillingDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-white text-lg">
                          {formatCurrency(sub.amount, sub.currency)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${urgencyStyle.badge}`}
                      >
                        {sub.daysUntilBilling === 0
                          ? 'Today'
                          : sub.daysUntilBilling === 1
                          ? 'Tomorrow'
                          : `${sub.daysUntilBilling}d`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
