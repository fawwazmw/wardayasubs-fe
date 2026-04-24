import { useState, useEffect } from 'react';
import { insightsService, type ScoreItem } from '../services/insights';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function SubscriptionScore() {
  const [subscriptions, setSubscriptions] = useState<ScoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      setLoading(true);
      const result = await insightsService.getScore();
      setSubscriptions(result.subscriptions);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load scores');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return { bar: 'bg-green-500', text: 'text-green-400' };
    if (score >= 40) return { bar: 'bg-yellow-500', text: 'text-yellow-400' };
    return { bar: 'bg-red-500', text: 'text-red-400' };
  };

  const getVerdictBadge = (verdict: string) => {
    const lower = verdict.toLowerCase();
    if (lower.includes('great') || lower.includes('keep') || lower.includes('good')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (lower.includes('consider') || lower.includes('review') || lower.includes('okay')) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6 animate-pulse">
        <div className="h-5 bg-slate-700 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-700/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl">
        {error}
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6 text-center">
        <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">No subscription scores available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Subscription Value Scores</h3>

      <div className="space-y-4">
        {subscriptions.map((sub) => {
          const scoreColor = getScoreColor(sub.score);
          const isExpanded = expandedId === sub.id;

          return (
            <div key={sub.id} className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-white font-medium">{sub.name}</h4>
                    <span className="text-sm text-gray-400">{formatCurrency(sub.amount)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getVerdictBadge(sub.verdict)}`}>
                      {sub.verdict}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {sub.usageRating !== null && (
                      <span className="text-sm text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => i < sub.usageRating! ? '★' : '☆').join('')}
                      </span>
                    )}
                    <span className={`text-sm font-bold ${scoreColor.text}`}>{sub.score}</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="relative w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${scoreColor.bar}`}
                    style={{ width: `${Math.min(sub.score, 100)}%` }}
                  />
                </div>

                {/* Expand button for alternatives */}
                {sub.alternatives && sub.alternatives.length > 0 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                    className="flex items-center gap-1 mt-3 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isExpanded ? 'Hide' : 'Show'} alternatives ({sub.alternatives.length})
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Alternatives section */}
              {isExpanded && sub.alternatives && sub.alternatives.length > 0 && (
                <div className="border-t border-white/5 bg-slate-900/30 p-4">
                  <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">AI-Suggested Alternatives</p>
                  <div className="space-y-3">
                    {sub.alternatives.map((alt, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-sm">{alt.name}</span>
                            <span className="text-green-400 text-xs font-medium">{alt.price}</span>
                          </div>
                          <p className="text-gray-400 text-xs">{alt.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
