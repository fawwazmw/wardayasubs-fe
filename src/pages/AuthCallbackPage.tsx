import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error(
        error === 'auth_failed'
          ? 'Google authentication failed. Please try again.'
          : 'Server error occurred. Please try again later.'
      );
      window.location.href = '/login';
      return;
    }

    if (token) {
      // Store token and do a hard redirect to dashboard.
      // This ensures AuthProvider re-initializes with the token in localStorage.
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } else {
      toast.error('No authentication token received');
      window.location.href = '/login';
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white">Completing sign in...</p>
      </div>
    </div>
  );
}
