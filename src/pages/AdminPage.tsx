import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/admin';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { Users, TrendingUp, CreditCard, FolderKanban, Trash2, Search } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user, page, search]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getAllUsers({ page, limit: 10, search }),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
      setPagination(usersData.pagination);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This will delete all their data.`)) return;
    
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted successfully');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Panel</h2>
          <p className="text-gray-400">System overview and user management</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm text-gray-400">Total Users</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400">Total Subscriptions</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalSubscriptions}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.activeSubscriptions} active</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-sm text-gray-400">Total Payments</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalPayments}</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <FolderKanban className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-sm text-gray-400">Total Categories</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalCategories}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search users by email or name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subscriptions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{u.name}</span>
                            {u.isAdmin && (
                              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">Admin</span>
                            )}
                            {!u.emailVerified && (
                              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">Unverified</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u._count.subscriptions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="p-4 border-t border-white/10 flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} users
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white hover:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white hover:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
