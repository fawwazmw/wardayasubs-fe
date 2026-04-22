import { useState, useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface Shortcut {
  keys: string;
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: 'Ctrl + D', description: 'Go to Dashboard', category: 'Navigation' },
  { keys: 'Ctrl + S', description: 'Go to Subscriptions', category: 'Navigation' },
  { keys: 'Ctrl + P', description: 'Go to Payments', category: 'Navigation' },
  { keys: 'Ctrl + C', description: 'Go to Categories', category: 'Navigation' },
  { keys: 'Ctrl + ,', description: 'Go to Settings', category: 'Navigation' },
  { keys: 'Ctrl + /', description: 'Show this help', category: 'General' },
  { keys: 'Esc', description: 'Close modals', category: 'General' },
];

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('toggle-shortcuts-help', handleToggle);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('toggle-shortcuts-help', handleToggle);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));
  const isMac = navigator.platform.includes('Mac');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Keyboard className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                <p className="text-sm text-gray-400">Quick actions to boost your productivity</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {categories.map((category) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <span className="text-white">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.split(' + ').map((key, i) => (
                          <span key={i} className="flex items-center gap-1">
                            {i > 0 && <span className="text-gray-500">+</span>}
                            <kbd className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs font-mono border border-slate-600">
                              {key === 'Ctrl' && isMac ? '⌘' : key}
                            </kbd>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-slate-700 text-gray-300 rounded text-xs font-mono border border-slate-600">Ctrl + /</kbd> anytime to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
}
