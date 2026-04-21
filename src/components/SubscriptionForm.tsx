import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptions';
import { categoryService } from '../services/categories';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface SubscriptionFormProps {
  subscription?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SubscriptionForm({ subscription, onSuccess, onCancel }: SubscriptionFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '',
    firstBillingDate: '',
    status: 'active',
    categoryId: '',
    reminderDays: '3',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
    if (subscription) {
      setFormData({
        name: subscription.name || '',
        amount: subscription.amount?.toString() || '',
        currency: subscription.currency || 'USD',
        billingCycle: (subscription.billingCycle || 'monthly').toLowerCase(),
        nextBillingDate: subscription.nextBillingDate?.split('T')[0] || '',
        firstBillingDate: subscription.startDate?.split('T')[0] || '',
        status: subscription.isActive === false ? 'inactive' : 'active',
        categoryId: subscription.categoryId || '',
        reminderDays: subscription.reminderDays?.toString() || '3',
        notes: subscription.notes || '',
      });
    }
  }, [subscription]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        billingCycle: formData.billingCycle,
        nextBillingDate: new Date(formData.nextBillingDate).toISOString(),
        startDate: formData.firstBillingDate ? new Date(formData.firstBillingDate).toISOString() : undefined,
        categoryId: formData.categoryId || undefined,
        reminderDays: parseInt(formData.reminderDays),
        notes: formData.notes || undefined,
      };

      if (subscription) {
        await subscriptionService.update(subscription.id, payload);
        toast.success('Subscription updated');
      } else {
        await subscriptionService.create(payload);
        toast.success('Subscription created');
      }

      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to save subscription';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClasses = "w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500";
  const selectClasses = "w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className={labelClasses}>
          Subscription Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClasses}
          placeholder="Netflix, Spotify, etc."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Amount *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className={inputClasses}
            placeholder="9.99"
          />
        </div>

        <div>
          <label className={labelClasses}>
            Currency *
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
            className={selectClasses}
          >
            <option value="USD" className="bg-slate-800 text-white">USD</option>
            <option value="EUR" className="bg-slate-800 text-white">EUR</option>
            <option value="GBP" className="bg-slate-800 text-white">GBP</option>
            <option value="IDR" className="bg-slate-800 text-white">IDR</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClasses}>
          Billing Cycle *
        </label>
        <select
          name="billingCycle"
          value={formData.billingCycle}
          onChange={handleChange}
          required
          className={selectClasses}
        >
          <option value="monthly" className="bg-slate-800 text-white">Monthly</option>
          <option value="yearly" className="bg-slate-800 text-white">Yearly</option>
          <option value="weekly" className="bg-slate-800 text-white">Weekly</option>
          <option value="quarterly" className="bg-slate-800 text-white">Quarterly</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Next Billing Date *
          </label>
          <input
            type="date"
            name="nextBillingDate"
            value={formData.nextBillingDate}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>
            First Billing Date
          </label>
          <input
            type="date"
            name="firstBillingDate"
            value={formData.firstBillingDate}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>
          Category
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={selectClasses}
        >
          <option value="" className="bg-slate-800 text-white">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id} className="bg-slate-800 text-white">
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasses}>
          Reminder Days Before
        </label>
        <input
          type="number"
          name="reminderDays"
          value={formData.reminderDays}
          onChange={handleChange}
          min="0"
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className={`${inputClasses} resize-none`}
          placeholder="Additional notes..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          {loading ? 'Saving...' : subscription ? 'Update Subscription' : 'Create Subscription'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-700/50 text-gray-300 py-2.5 px-4 rounded-lg hover:bg-slate-700 transition-colors font-medium border border-slate-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
