import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      verify();
    } else {
      setLoading(false);
      setError('No verification token provided.');
    }
  }, [token]);

  const verify = async () => {
    try {
      await authService.verifyEmail(token);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. The link may have expired.');
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
            Email Verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
              <p className="text-gray-300 text-sm">Verifying your email...</p>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-md">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Email verified successfully! You can now log in.</span>
              </div>
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-md">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
              <div className="text-center text-sm">
                <Link
                  to="/resend-verification"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Request a new verification link
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
