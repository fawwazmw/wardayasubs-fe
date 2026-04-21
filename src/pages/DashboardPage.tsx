import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Download, Upload, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import UpcomingRenewals from '../components/UpcomingRenewals';
import SubscriptionList from '../components/SubscriptionList';
import SubscriptionForm from '../components/SubscriptionForm';
import SubscriptionTemplatePicker from '../components/SubscriptionTemplatePicker';
import PaymentHistory from '../components/PaymentHistory';
import CategoryManager from '../components/CategoryManager';
import { Button } from '@/components/ui/button';
import { subscriptionService } from '../services/subscriptions';
import type { SubscriptionTemplate } from '../data/subscriptionTemplates';

type View = 'overview' | 'subscriptions' | 'payments' | 'categories';

export default function DashboardPage() {
  const location = useLocation();
  const [currentView, setCurrentView] = useState<View>('overview');
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [visible, setVisible] = useState(true);
  const [importing, setImporting] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [templateData, setTemplateData] = useState<any>(null);
  const pendingView = useRef<View | null>(null);

  useEffect(() => {
    const hash = location.hash.replace('#', '') as View;
    if (hash && ['overview', 'subscriptions', 'payments', 'categories'].includes(hash) && hash !== currentView) {
      pendingView.current = hash;
      setVisible(false);
    }
  }, [location.hash]);

  useEffect(() => {
    if (!visible && pendingView.current) {
      const timeout = setTimeout(() => {
        setCurrentView(pendingView.current!);
        pendingView.current = null;
        setVisible(true);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

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
    setTemplateData(null);
  };

  const handleTemplateSelect = (template: SubscriptionTemplate) => {
    // Pre-fill form with template data
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setTemplateData({
      name: template.name,
      amount: template.defaultAmount,
      currency: template.defaultCurrency,
      billingCycle: template.defaultBillingCycle,
      nextBillingDate: nextMonth.toISOString().split('T')[0],
      website: template.website,
      notes: template.description,
      categoryName: template.category,
    });
    setShowTemplatePicker(false);
    setShowSubscriptionForm(true);
  };

  const handleExportCSV = async () => {
    try {
      const subs = await subscriptionService.getAll();
      if (subs.length === 0) return;

      const headers = ['Name', 'Amount', 'Currency', 'Billing Cycle', 'Next Billing Date', 'Status', 'Category', 'Notes'];
      const rows = subs.map((s: any) => [
        `"${(s.name || '').replace(/"/g, '""')}"`,
        s.amount,
        s.currency,
        s.billingCycle,
        s.nextBillingDate?.split('T')[0] || '',
        s.isActive ? 'Active' : 'Inactive',
        `"${(s.category?.name || '').replace(/"/g, '""')}"`,
        `"${(s.notes || '').replace(/"/g, '""')}"`,
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wardaya-subs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export subscriptions');
    }
  };

  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;

      setImporting(true);
      try {
        const text = await file.text();
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) {
          alert('CSV file is empty or invalid');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const subscriptions = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.trim().replace(/^"|"$/g, '')) || [];
          if (values.length < 5) continue;

          const [name, amount, currency, billingCycle, nextBillingDate, status, categoryName, notes] = values;
          
          subscriptions.push({
            name,
            amount: parseFloat(amount),
            currency: currency || 'USD',
            billingCycle: billingCycle.toLowerCase(),
            nextBillingDate,
            isActive: status?.toLowerCase() !== 'inactive',
            categoryName: categoryName || undefined,
            notes: notes || undefined,
          });
        }

        const result = await subscriptionService.importCSV(subscriptions);
        
        if (result.errors && result.errors.length > 0) {
          alert(`Imported ${result.imported} subscription(s). ${result.failed} failed:\n${result.errors.slice(0, 5).join('\n')}`);
        } else {
          alert(result.message);
        }
        
        setRefreshTrigger(prev => prev + 1);
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to import CSV');
      } finally {
        setImporting(false);
      }
    };
    input.click();
  };

  return (
    <Layout>
      <div
        className={`transition-all duration-150 ease-in-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {/* Overview View */}
        {currentView === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
              <p className="text-gray-400">Track your subscriptions and spending at a glance</p>
            </div>
            <AnalyticsDashboard />
            <UpcomingRenewals />
          </div>
        )}

        {/* Subscriptions View */}
        {currentView === 'subscriptions' && (
          <div>
            {showSubscriptionForm ? (
              <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white">
                    {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
                  </h2>
                </div>
                <div className="p-6">
                  <SubscriptionForm
                    subscription={editingSubscription}
                    templateData={templateData}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">My Subscriptions</h2>
                    <p className="text-gray-400">Manage all your recurring subscriptions</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowTemplatePicker(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                    <Button
                      onClick={handleImportCSV}
                      disabled={importing}
                      className="bg-slate-700/50 text-gray-300 hover:bg-slate-700 border border-slate-600"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {importing ? 'Importing...' : 'Import'}
                    </Button>
                    <Button
                      onClick={handleExportCSV}
                      className="bg-slate-700/50 text-gray-300 hover:bg-slate-700 border border-slate-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      onClick={() => setShowSubscriptionForm(true)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subscription
                    </Button>
                  </div>
                </div>
                <SubscriptionList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
              </div>
            )}
          </div>
        )}

        {/* Payments View */}
        {currentView === 'payments' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Payment History</h2>
              <p className="text-gray-400">Track and record your subscription payments</p>
            </div>
            <PaymentHistory />
          </div>
        )}

        {/* Categories View */}
        {currentView === 'categories' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Categories</h2>
              <p className="text-gray-400">Organize your subscriptions with custom categories</p>
            </div>
            <CategoryManager />
          </div>
        )}
      </div>

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <SubscriptionTemplatePicker
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}
    </Layout>
  );
}
