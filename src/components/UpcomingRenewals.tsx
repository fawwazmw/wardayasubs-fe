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
      setError(err.response?.data?.message || 'Failed to load upcoming renewals');
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
      border: 'border-red-200',
      bg: 'bg-red-50/50'
    };
    if (days <= 7) return {
      badge: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
      border: 'border-orange-200',
      bg: 'bg-orange-50/50'
    };
    return {
      badge: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      border: 'border-blue-200',
      bg: 'bg-blue-50/50'
    };
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Upcoming Renewals</h3>
              <p className="text-sm text-gray-500">Stay on top of your subscriptions</p>
            </div>
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm hover:shadow transition-shadow"
          >
            <option value={7}>Next 7 days</option>
            <option value={14}>Next 14 days</option>
            <option value={30}>Next 30 days</option>
            <option value={60}>Next 60 days</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        {upcoming.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No upcoming renewals</p>
            <p className="text-sm text-gray-400 mt-1">
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
                  className={`group relative border-2 ${urgencyStyle.border} ${urgencyStyle.bg} rounded-xl p-4 hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 truncate">
                        {sub.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(sub.nextBillingDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">
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
