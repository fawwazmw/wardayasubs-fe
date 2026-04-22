import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from '../services/auth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
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
      setLoading(false);
      return;
    }

    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Token is invalid/expired — clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
      // Network error / backend down — keep token, user stays null but token preserved.
      // ProtectedRoute will still allow access since hasToken is true.
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
