import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Wait for auth check to complete before deciding
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Also check localStorage as fallback (for OAuth callback flow where user state hasn't updated yet)
  const hasToken = !!localStorage.getItem('token');

  if (!user && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
