import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from '../services/auth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Token is invalid/expired — clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } else if (!err.response) {
        // Network error (backend down) — keep token, retry later
        // But set user to null so UI knows we don't have user data
        setUser(null);
        // Retry after 5 seconds
        setTimeout(() => {
          loadProfile();
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = async (email: string, password: string) => {
    await authService.login({ email, password });
    const profile = await authService.getProfile();
    setUser(profile);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    const profile = await authService.getProfile();
    setUser(profile);
  }, []);

  // isAuthenticated = has a valid user OR has a token (backend might be down)
  const isAuthenticated = !!user || !!localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
