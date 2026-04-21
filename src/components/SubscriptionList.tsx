import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptions';
import { Calendar, DollarSign, Edit2, Trash2, Tag } from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: string;
  status: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

interface SubscriptionListProps {
  onEdit: (subscription: Subscription) => void;
  refreshTrigger?: number;
}

export default function SubscriptionList({ onEdit, refreshTrigger }: SubscriptionListProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubscriptions();
  }, [refreshTrigger]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getAll();
      setSubscriptions(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      await subscriptionService.delete(id);
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete subscription');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50">
          <DollarSign className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-lg text-gray-300">No subscriptions yet</p>
          <p className="text-sm mt-2 text-gray-500">Add your first subscription to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((sub) => (
        <div
          key={sub.id}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{sub.name}</h3>
              {sub.category && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Tag className="w-3.5 h-3.5" style={{ color: sub.category.color }} />
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${sub.category.color}20`,
                      color: sub.category.color,
                    }}
                  >
                    {sub.category.name}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                sub.status === 'ACTIVE'
                  ? 'bg-green-500/20 text-green-400'
                  : sub.status === 'PAUSED'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {sub.status}
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DollarSign className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(sub.amount, sub.currency)}
                </p>
                <p className="text-xs text-gray-400">per {sub.billingCycle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Next: {formatDate(sub.nextBillingDate)}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-700/50">
            <button
              onClick={() => onEdit(sub)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors border border-purple-500/30"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => handleDelete(sub.id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
