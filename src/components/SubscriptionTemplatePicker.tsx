import { useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { subscriptionTemplates, getTemplatesByCategory, searchTemplates } from '../data/subscriptionTemplates';
import type { SubscriptionTemplate } from '../data/subscriptionTemplates';
import { Button } from './ui/button';

interface SubscriptionTemplatePickerProps {
  onSelect: (template: SubscriptionTemplate) => void;
  onClose: () => void;
}

export default function SubscriptionTemplatePicker({ onSelect, onClose }: SubscriptionTemplatePickerProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = getTemplatesByCategory();
  const categoryNames = Object.keys(categories).sort();

  const filteredTemplates = search
    ? searchTemplates(search)
    : selectedCategory === 'all'
    ? subscriptionTemplates
    : categories[selectedCategory] || [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Quick Add Template</h2>
                <p className="text-sm text-gray-400">Choose from popular subscription services</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {!search && (
          <div className="px-6 py-3 border-b border-white/10 overflow-x-auto">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All
              </button>
              {categoryNames.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => onSelect(template)}
                  className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-purple-500/50 rounded-xl p-4 text-left transition-all hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold">{template.name}</h3>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: template.defaultCurrency,
                      }).format(template.defaultAmount)}
                    </span>
                    <span className="text-xs text-gray-500">per {template.defaultBillingCycle}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50">
          <p className="text-xs text-gray-500 text-center">
            Prices are estimates. You can adjust them after selection.
          </p>
        </div>
      </div>
    </div>
  );
}
