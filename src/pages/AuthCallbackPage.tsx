import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        let errorMessage = 'Authentication failed';
        if (error === 'auth_failed') {
          errorMessage = 'Google authentication failed. Please try again.';
        } else if (error === 'server_error') {
          errorMessage = 'Server error occurred. Please try again later.';
        }
        toast.error(errorMessage);
        navigate('/login');
        return;
      }

      if (token) {
        // Store token
        localStorage.setItem('token', token);
        
        // Fetch user data
        try {
          await refreshUser();
          toast.success('Successfully signed in with Google!');
          navigate('/dashboard');
        } catch (err) {
          toast.error('Failed to load user data');
          navigate('/login');
        }
      } else {
        toast.error('No authentication token received');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white">Completing sign in...</p>
      </div>
    </div>
  );
}
