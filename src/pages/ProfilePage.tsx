import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { User, Lock, DollarSign, Save, Eye, EyeOff, Bell } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    currency: user?.currency || 'USD',
    notifyRenewalReminders: user?.notifyRenewalReminders ?? true,
    notifyEmailReminders: user?.notifyEmailReminders ?? true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClasses = "w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500";
  const selectClasses = "w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');

    try {
      await authService.updateProfile({
        name: profileData.name,
        currency: profileData.currency,
        notifyRenewalReminders: profileData.notifyRenewalReminders,
        notifyEmailReminders: profileData.notifyEmailReminders,
      });
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to update profile';
      setProfileError(msg);
      toast.error(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      await authService.updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to change password';
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Profile Settings</h2>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        {/* Profile Info */}
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Account Information</h3>
          </div>
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
            {profileError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {profileError}
              </div>
            )}

            <div>
              <label className={labelClasses}>Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className={`${inputClasses} opacity-50 cursor-not-allowed`}
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className={labelClasses}>Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
                className={inputClasses}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className={labelClasses}>Preferred Currency</label>
              <select
                value={profileData.currency}
                onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                className={selectClasses}
              >
                <option value="USD" className="bg-slate-800 text-white">USD ($)</option>
                <option value="EUR" className="bg-slate-800 text-white">EUR</option>
                <option value="GBP" className="bg-slate-800 text-white">GBP</option>
                <option value="IDR" className="bg-slate-800 text-white">IDR (Rp)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all font-medium text-sm"
              >
                <Save className="w-4 h-4" />
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Lock className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Change Password</h3>
          </div>
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {passwordError}
              </div>
            )}

            <div>
              <label className={labelClasses}>Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className={`${inputClasses} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClasses}>New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={8}
                  className={`${inputClasses} pr-10`}
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  className={`${inputClasses} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all font-medium text-sm"
              >
                <Lock className="w-4 h-4" />
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
          </div>
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.notifyRenewalReminders}
                  onChange={(e) => setProfileData({ ...profileData, notifyRenewalReminders: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-800/50 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                />
                <div>
                  <p className="text-white font-medium">In-app renewal reminders</p>
                  <p className="text-sm text-gray-400">Show notifications in the app before subscriptions renew</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.notifyEmailReminders}
                  onChange={(e) => setProfileData({ ...profileData, notifyEmailReminders: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-800/50 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                />
                <div>
                  <p className="text-white font-medium">Email renewal reminders</p>
                  <p className="text-sm text-gray-400">Receive email notifications before subscriptions renew</p>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all font-medium text-sm"
              >
                <Save className="w-4 h-4" />
                {profileLoading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
          <p className="text-sm text-gray-500">
            Account created {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          </p>
        </div>
      </div>
    </Layout>
  );
}
