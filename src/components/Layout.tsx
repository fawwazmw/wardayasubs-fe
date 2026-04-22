import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { LayoutDashboard, CreditCard, FolderOpen, Receipt, LogOut, User, Menu, X, Settings, Home, Shield, MessageCircle } from 'lucide-react';
import NotificationBell from './NotificationBell';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import { useGlobalShortcuts } from '../hooks/useKeyboardShortcuts';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDark = theme === 'dark';

  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isOnDashboard = location.pathname === '/dashboard';
  const currentView = isOnDashboard ? (location.hash.replace('#', '') || 'overview') : '';

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'payments', label: 'Payments', icon: Receipt },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
  ];

  const handleNavClick = (viewId: string) => {
    navigate(`/dashboard#${viewId}`);
    setSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100'}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className={`fixed inset-0 z-40 lg:hidden backdrop-blur-sm ${isDark ? 'bg-black/60' : 'bg-black/20'}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDark ? 'bg-slate-900/95 border-r border-white/10' : 'bg-white/95 border-r border-slate-200'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo + Notification */}
          <div className={`flex items-center justify-between p-6 ${isDark ? 'border-b border-white/10' : 'border-b border-slate-200'}`}>
            <h1 className="text-xl font-bold">
              <span className={isDark ? 'text-white' : 'text-slate-900'}>wardaya</span><span className="text-purple-500">subs</span>
            </h1>
            <div className="flex items-center gap-1">
              <NotificationBell align="left" />
              <button
                onClick={() => setSidebarOpen(false)}
                className={`lg:hidden transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                      : isDark
                        ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User section */}
          {user && (
            <div className={`p-4 ${isDark ? 'border-t border-white/10' : 'border-t border-slate-200'}`}>
              <button
                onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-left ${
                  isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {user.name || 'User'}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{user.email}</p>
                </div>
                <Settings className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} />
              </button>
              <button
                onClick={() => { navigate('/'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Landing Page</span>
              </button>
              {user.isAdmin && (
                <button
                  onClick={() => { navigate('/admin'); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Admin Panel</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar for mobile only */}
        <header className={`lg:hidden sticky top-0 z-30 backdrop-blur-xl ${
          isDark ? 'bg-slate-900/80 border-b border-white/10' : 'bg-white/80 border-b border-slate-200'
        }`}>
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold">
              <span className={isDark ? 'text-white' : 'text-slate-900'}>wardaya</span><span className="text-purple-500">subs</span>
            </h1>
            <NotificationBell align="right" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsHelp />
    </div>
  );
}
