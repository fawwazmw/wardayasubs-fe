import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.forgotPassword(email);
      setSent(true);
      // In dev mode, backend returns the token for testing
      if (result.resetToken) {
        setDevToken(result.resetToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Mail className="h-8 w-8 text-purple-400" />
          </div>
          <CardTitle className="text-2xl text-center text-white">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            {sent ? 'Check your email for a reset link' : 'Enter your email to receive a reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-md">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">If an account with that email exists, a reset link has been generated.</span>
              </div>

              {devToken && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-4 py-3 rounded-md">
                  <p className="text-xs font-medium mb-1">Dev Mode - Reset Link:</p>
                  <Link
                    to={`/reset-password?token=${devToken}`}
                    className="text-sm text-purple-400 hover:text-purple-300 underline break-all"
                  >
                    Click here to reset password
                  </Link>
                </div>
              )}

              <div className="text-center text-sm pt-2 border-t border-white/10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-gray-300 hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center text-sm pt-2 border-t border-white/10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-gray-300 hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
