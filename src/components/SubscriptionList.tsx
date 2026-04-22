import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptions';
import { categoryService } from '../services/categories';
import { Calendar, DollarSign, Edit2, Trash2, Tag, Search, Filter, Power, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: string;
  isActive: boolean;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const perPage = 9;

  useEffect(() => {
    loadSubscriptions();
    loadCategories();
  }, [refreshTrigger]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getAll();
      setSubscriptions(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      // silent - filters just won't show categories
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      await subscriptionService.delete(id);
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      toast.success('Subscription deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete subscription');
    }
  };

  const handleToggleActive = async (sub: Subscription) => {
    try {
      const updated = await subscriptionService.update(sub.id, {
        isActive: !sub.isActive,
      } as any);
      setSubscriptions(subscriptions.map(s => s.id === sub.id ? { ...s, isActive: updated.isActive } : s));
      toast.success(updated.isActive ? 'Subscription activated' : 'Subscription deactivated');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update subscription');
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map(s => s.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    const count = selectedIds.size;
    if (!confirm(`Are you sure you want to delete ${count} subscription${count > 1 ? 's' : ''}?`)) return;
    
    setBulkDeleting(true);
    try {
      const result = await subscriptionService.bulkDelete(Array.from(selectedIds));
      setSubscriptions(subscriptions.filter(sub => !selectedIds.has(sub.id)));
      setSelectedIds(new Set());
      toast.success(result.message);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete subscriptions');
    } finally {
      setBulkDeleting(false);
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

  const filtered = subscriptions.filter((sub) => {
    if (search && !sub.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus === 'active' && !sub.isActive) return false;
    if (filterStatus === 'inactive' && sub.isActive) return false;
    if (filterCategory && sub.category?.id !== filterCategory) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, filterStatus, filterCategory]);

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

  const selectClasses = "px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">
              {selectedIds.size} subscription{selectedIds.size > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-4 py-2 text-sm bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="px-4 py-2 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkDeleting ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={selectClasses}
          >
            <option value="all" className="bg-slate-800 text-white">All Status</option>
            <option value="active" className="bg-slate-800 text-white">Active</option>
            <option value="inactive" className="bg-slate-800 text-white">Inactive</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={selectClasses}
          >
            <option value="" className="bg-slate-800 text-white">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-800 text-white">
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {(search || filterStatus !== 'all' || filterCategory || selectedIds.size > 0) && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filtered.length} of {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
          </p>
          {filtered.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              {selectedIds.size === paginated.length ? (
                <>
                  <CheckSquare className="w-4 h-4" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  Select All
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50">
            <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300">No subscriptions match your filters</p>
            <button
              onClick={() => { setSearch(''); setFilterStatus('all'); setFilterCategory(''); }}
              className="mt-3 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((sub) => (
            <div
              key={sub.id}
              className={`bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 ${
                !sub.isActive ? 'opacity-60' : ''
              } ${selectedIds.has(sub.id) ? 'ring-2 ring-purple-500/50' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggleSelect(sub.id)}
                    className="mt-1 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {selectedIds.has(sub.id) ? (
                      <CheckSquare className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
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
                </div>
                <button
                  onClick={() => handleToggleActive(sub)}
                  title={sub.isActive ? 'Deactivate' : 'Activate'}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    sub.isActive
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {sub.isActive ? 'Active' : 'Inactive'}
                </button>
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white hover:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                p === page
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white hover:border-purple-500/50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white hover:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
