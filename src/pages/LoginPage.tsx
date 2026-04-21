import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
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
          <CardTitle className="text-2xl text-center text-white">
            Wardaya Subs
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Signing in...' : 'Sign in'}
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
