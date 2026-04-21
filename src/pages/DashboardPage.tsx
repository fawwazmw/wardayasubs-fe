import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import UpcomingRenewals from '../components/UpcomingRenewals';
import SubscriptionList from '../components/SubscriptionList';
import SubscriptionForm from '../components/SubscriptionForm';
import CategoryManager from '../components/CategoryManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type View = 'overview' | 'subscriptions' | 'categories';

export default function DashboardPage() {
  const location = useLocation();
  const [currentView, setCurrentView] = useState<View>('overview');
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const hash = location.hash.replace('#', '') as View;
    if (hash && ['overview', 'subscriptions', 'categories'].includes(hash)) {
      setCurrentView(hash);
    }
  }, [location.hash]);

  const handleEdit = (subscription: any) => {
    setEditingSubscription(subscription);
    setShowSubscriptionForm(true);
  };

  const handleFormSuccess = () => {
    setShowSubscriptionForm(false);
    setEditingSubscription(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFormCancel = () => {
    setShowSubscriptionForm(false);
    setEditingSubscription(null);
  };

  return (
    <Layout>
      {/* Overview View */}
      {currentView === 'overview' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
            <p className="text-gray-600">Track your subscriptions and spending at a glance</p>
          </div>
          <AnalyticsDashboard />
          <UpcomingRenewals />
        </div>
      )}

      {/* Subscriptions View */}
      {currentView === 'subscriptions' && (
        <div>
          {showSubscriptionForm ? (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-2xl">
                  {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <SubscriptionForm
                  subscription={editingSubscription}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">My Subscriptions</h2>
                  <p className="text-gray-600">Manage all your recurring subscriptions</p>
                </div>
                <Button
                  onClick={() => setShowSubscriptionForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subscription
                </Button>
              </div>
              <SubscriptionList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
            </div>
          )}
        </div>
      )}

      {/* Categories View */}
      {currentView === 'categories' && (
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Categories</h2>
            <p className="text-gray-600">Organize your subscriptions with custom categories</p>
          </div>
          <CategoryManager />
        </div>
      )}
    </Layout>
  );
}
