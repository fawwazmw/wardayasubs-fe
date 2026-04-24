import { useState, useEffect, useRef } from 'react';
import { notificationService } from '../services/notifications';
import type { Notification } from '../services/notifications';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NotificationBellProps {
  align?: 'left' | 'right';
}

export default function NotificationBell({ align = 'left' }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch {
      // silent
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {
      // silent
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch {
      // silent
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2 transition-colors rounded-lg ${
          isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={`absolute top-full mt-2 w-80 rounded-xl shadow-2xl z-50 overflow-hidden ${
          align === 'right' ? 'right-0' : 'left-0'
        } ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200'}`}>
          <div className={`flex items-center justify-between p-4 ${isDark ? 'border-b border-white/10' : 'border-b border-slate-200'}`}>
            <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>No notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 transition-colors ${
                    isDark
                      ? `border-b border-white/5 hover:bg-white/5 ${!n.read ? 'bg-purple-500/5' : ''}`
                      : `border-b border-slate-100 hover:bg-slate-50 ${!n.read ? 'bg-purple-50' : ''}`
                  }`}
                >
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    !n.read ? 'bg-purple-500' : 'bg-transparent'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      !n.read
                        ? isDark ? 'text-white' : 'text-slate-900'
                        : isDark ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      {n.message}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{formatTime(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1 text-gray-500 hover:text-purple-400 transition-colors flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
