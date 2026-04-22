import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { subscriptionService } from '../services/subscriptions';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { User, Lock, DollarSign, Save, Eye, EyeOff, Bell, Download, Upload, Database, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

        {/* Appearance */}
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Monitor className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-400 mb-4">Choose your preferred theme</p>
            <div className="flex gap-3">
              <button
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-gray-500'}`} />
                <div className="text-left">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-400'}`}>Dark</p>
                  <p className="text-xs text-gray-500">Easy on the eyes</p>
                </div>
              </button>
              <button
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-purple-400' : 'text-gray-500'}`} />
                <div className="text-left">
                  <p className={`text-sm font-medium ${theme === 'light' ? 'text-white' : 'text-gray-400'}`}>Light</p>
                  <p className="text-xs text-gray-500">Classic bright look</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Change Password - hidden for Google-only users */}
        {!user?.googleId && (
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
        )}

        {/* Connected Account Info */}
        {user?.googleId && (
          <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Connected Account</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex-1">
                  <p className="text-white font-medium">Google Account</p>
                  <p className="text-sm text-gray-400">Signed in via Google ({user.email})</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">Connected</span>
              </div>
            </div>
          </div>
        )}

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

        {/* Data Backup & Restore */}
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Database className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Data Backup & Restore</h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-400">
              Export all your subscriptions, categories, and payment history as a backup file. You can restore this data later or on another device.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={async () => {
                  setBackupLoading(true);
                  try {
                    const data = await subscriptionService.exportAllData();
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `wardaya-subs-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success('Backup downloaded successfully');
                  } catch (err: any) {
                    toast.error(err.response?.data?.error || 'Failed to create backup');
                  } finally {
                    setBackupLoading(false);
                  }
                }}
                disabled={backupLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                {backupLoading ? 'Creating Backup...' : 'Download Backup'}
              </button>

              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = async (e: any) => {
                    const file = e.target?.files?.[0];
                    if (!file) return;

                    setRestoreLoading(true);
                    try {
                      const text = await file.text();
                      const data = JSON.parse(text);
                      
                      if (!confirm('This will import all data from the backup file. Existing data will not be deleted. Continue?')) {
                        setRestoreLoading(false);
                        return;
                      }

                      const result = await subscriptionService.importAllData(data);
                      
                      if (result.errors && result.errors.length > 0) {
                        toast.success(`${result.message}. Some items failed to import.`);
                      } else {
                        toast.success(result.message);
                      }
                      
                      setTimeout(() => window.location.reload(), 1500);
                    } catch (err: any) {
                      toast.error(err.response?.data?.error || 'Failed to restore backup');
                    } finally {
                      setRestoreLoading(false);
                    }
                  };
                  input.click();
                }}
                disabled={restoreLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm border border-slate-600"
              >
                <Upload className="w-4 h-4" />
                {restoreLoading ? 'Restoring...' : 'Restore Backup'}
              </button>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-xs text-yellow-300">
                <strong>Note:</strong> Backup files contain all your subscription data. Keep them secure and don't share them publicly.
              </p>
            </div>
          </div>
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
