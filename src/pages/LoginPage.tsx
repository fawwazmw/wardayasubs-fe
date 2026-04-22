import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { LogIn, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle OAuth error redirects
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError === 'auth_failed') {
      setError('Google authentication failed. Please try again.');
    } else if (oauthError === 'server_error') {
      setError('Server error occurred. Please try again later.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      const code = err.response?.data?.code;
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      if (code === 'EMAIL_NOT_VERIFIED') {
        setError('EMAIL_NOT_VERIFIED');
      } else {
        setError(errorMessage);
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <LogIn className="h-8 w-8 text-purple-400" />
          </div>
          <CardTitle className="text-2xl text-center">
            <span className="text-white">wardaya</span><span className="text-purple-400">subs</span>
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              error === 'EMAIL_NOT_VERIFIED' ? (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 px-4 py-3 rounded-md">
                  <p className="text-sm mb-2">Your email is not verified yet.</p>
                  <Link
                    to="/resend-verification"
                    className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Resend verification email
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
                window.location.href = `${baseUrl}/api/auth/google`;
              }}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-300">Don't have an account? </span>
              <Link
                to="/register"
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sign up
              </Link>
            </div>

            <div className="text-center text-sm pt-2 border-t border-white/10">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-gray-300 hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to landing page
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
