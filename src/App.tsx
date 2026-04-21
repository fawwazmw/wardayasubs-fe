import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { 
  BarChart3, 
  Bell, 
  FolderKanban, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function HomePage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Wardaya Subs</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
                <a href="/login">Login</a>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <a href="/register">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/20 mb-8">
            <Zap className="w-4 h-4" />
            Track smarter, save more
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Take Control of Your
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Subscription Spending
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Track all your subscriptions in one place, get renewal reminders, and discover insights 
            about your spending habits. Never miss a payment or waste money on unused services again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 shadow-lg shadow-blue-500/30"
            >
              <a href="/register" className="flex items-center gap-2">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 text-lg px-8"
            >
              <a href="/login">Sign In</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">$500+</div>
                <div className="text-gray-400 text-sm">Average Yearly Savings</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">10+</div>
                <div className="text-gray-400 text-sm">Subscriptions Tracked</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-400 text-sm">Free Forever</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful features to help you manage and optimize your subscription spending
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Smart Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Visualize your spending patterns with beautiful charts and insights. Know exactly where your money goes each month.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Renewal Reminders</CardTitle>
              <CardDescription className="text-gray-400">
                Get notified before your subscriptions renew. Never get surprised by unexpected charges on your card again.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Custom Categories</CardTitle>
              <CardDescription className="text-gray-400">
                Organize subscriptions your way. Create custom categories to match your lifestyle and budget preferences.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Spending Trends</CardTitle>
              <CardDescription className="text-gray-400">
                Track how your subscription costs change over time. Identify opportunities to save money and cut unused services.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Secure & Private</CardTitle>
              <CardDescription className="text-gray-400">
                Your financial data is encrypted and secure. We never share your information with third parties or advertisers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Lightning Fast</CardTitle>
              <CardDescription className="text-gray-400">
                Built with modern technology for instant loading and smooth interactions. Manage subscriptions in seconds.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl md:text-4xl text-white mb-4">
                Why Choose Wardaya Subs?
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Join users who are taking control of their subscription spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">No Credit Card Required</h4>
                    <p className="text-gray-400 text-sm">Start tracking immediately without any payment information</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Unlimited Subscriptions</h4>
                    <p className="text-gray-400 text-sm">Track as many subscriptions as you need, no limits</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Multi-Currency Support</h4>
                    <p className="text-gray-400 text-sm">Track subscriptions in any currency you use</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Export Your Data</h4>
                    <p className="text-gray-400 text-sm">Your data belongs to you, export it anytime</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Start tracking your subscriptions today and discover how much you can save
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-10 shadow-lg shadow-blue-500/30"
          >
            <a href="/register" className="flex items-center gap-2">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>© 2026 Wardaya Subs. Built for better financial control.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
