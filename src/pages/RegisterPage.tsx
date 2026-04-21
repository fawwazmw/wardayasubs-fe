import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    currency: 'USD',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.password.length < 8) {
      const errorMsg = 'Password must be at least 8 characters';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.name);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <UserPlus className="h-8 w-8 text-purple-400" />
          </div>
          <CardTitle className="text-2xl text-center text-white">
            Wardaya Subs
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Create your account
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

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
              <label htmlFor="currency" className="block text-sm font-medium text-gray-200">
                Preferred Currency
              </label>
              <select
                id="currency"
                name="currency"
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                <option value="USD" className="bg-slate-800">USD ($)</option>
                <option value="IDR" className="bg-slate-800">IDR (Rp)</option>
                <option value="EUR" className="bg-slate-800">EUR (€)</option>
                <option value="GBP" className="bg-slate-800">GBP (£)</option>
              </select>
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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-300">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sign in
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
