import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.resendVerification(email);
      setSent(true);
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
          <CardTitle className="text-2xl text-center">
            <span className="text-white">wardaya</span><span className="text-purple-400">subs</span>
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            {sent ? 'Check your inbox' : 'Resend verification email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-md">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">If the account exists and is unverified, a new verification email has been sent.</span>
              </div>
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
                {loading ? 'Sending...' : 'Resend Verification Email'}
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
