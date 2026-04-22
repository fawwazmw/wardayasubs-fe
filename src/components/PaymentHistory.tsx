import { useState, useEffect } from 'react';
import { paymentService } from '../services/payments';
import type { Payment } from '../services/payments';
import { subscriptionService } from '../services/subscriptions';
import { Calendar, DollarSign, Trash2, Plus, Receipt } from 'lucide-react';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterSubId, setFilterSubId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subscriptionId: '',
    amount: '',
    currency: 'USD',
    paidAt: new Date().toISOString().split('T')[0],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadPayments();
  }, [filterSubId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, subsData] = await Promise.all([
        paymentService.getAll(),
        subscriptionService.getAll(),
      ]);
      setPayments(paymentsData);
      setSubscriptions(subsData);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      const data = await paymentService.getAll(filterSubId || undefined);
      setPayments(data);
    } catch (err: any) {
      // silent on filter change
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const payment = await paymentService.create({
        subscriptionId: formData.subscriptionId,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        paidAt: new Date(formData.paidAt).toISOString(),
      });
      setPayments([payment, ...payments]);
      setShowForm(false);
      setFormData({
        subscriptionId: '',
        amount: '',
        currency: 'USD',
        paidAt: new Date().toISOString().split('T')[0],
      });
      toast.success('Payment recorded');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to record payment';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this payment record?')) return;
    try {
      await paymentService.delete(id);
      setPayments(payments.filter(p => p.id !== id));
      toast.success('Payment deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete payment');
    }
  };

  const handleSubSelect = (subId: string) => {
    setFormData(prev => {
      const sub = subscriptions.find(s => s.id === subId);
      return {
        ...prev,
        subscriptionId: subId,
        amount: sub ? sub.amount.toString() : prev.amount,
        currency: sub ? sub.currency : prev.currency,
      };
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const inputClasses = "w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500";
  const selectClasses = "w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading payments...</p>
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

  // Calculate total spent
  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary + Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-white/10 px-6 py-4">
          <p className="text-sm text-gray-400">Total Recorded</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalSpent, 'USD')}</p>
          <p className="text-xs text-gray-500">{payments.length} payment{payments.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterSubId}
            onChange={(e) => setFilterSubId(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="" className="bg-slate-800 text-white">All Subscriptions</option>
            {subscriptions.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-800 text-white">{s.name}</option>
            ))}
          </select>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-500/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Record Payment
            </button>
          )}
        </div>
      </div>

      {/* Record Payment Form */}
      {showForm && (
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Record Payment</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {formError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div>
              <label className={labelClasses}>Subscription *</label>
              <select
                value={formData.subscriptionId}
                onChange={(e) => handleSubSelect(e.target.value)}
                required
                className={selectClasses}
              >
                <option value="" className="bg-slate-800 text-white">Select subscription</option>
                {subscriptions.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-800 text-white">{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className={inputClasses}
                  placeholder="9.99"
                />
              </div>
              <div>
                <label className={labelClasses}>Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className={selectClasses}
                >
                  <option value="USD" className="bg-slate-800 text-white">USD</option>
                  <option value="EUR" className="bg-slate-800 text-white">EUR</option>
                  <option value="GBP" className="bg-slate-800 text-white">GBP</option>
                  <option value="IDR" className="bg-slate-800 text-white">IDR</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Date *</label>
                <input
                  type="date"
                  value={formData.paidAt}
                  onChange={(e) => setFormData({ ...formData, paidAt: e.target.value })}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all font-medium text-sm"
              >
                {formLoading ? 'Saving...' : 'Record Payment'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(''); }}
                className="px-6 py-2.5 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm border border-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment List */}
      {payments.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50">
            <Receipt className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-lg text-gray-300">No payments recorded</p>
            <p className="text-sm mt-2 text-gray-500">Record your first payment to start tracking</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="divide-y divide-white/5">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{payment.subscription.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(payment.paidAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                  <button
                    onClick={() => handleDelete(payment.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete payment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
