import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ImagePlus, Bot, User, Loader2, CreditCard, Plus, Trash2, MessageCircle, PanelLeftOpen, ArrowLeft, DollarSign, Tag, Power } from 'lucide-react';
import { chatService, type ChatSession, type ChatResponse, type ActionResult } from '../services/chat';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  action?: string;
  subscription?: any;
  payment?: any;
  category?: any;
  deletedName?: string;
  actions?: ActionResult[];
  loading?: boolean;
}

function ActionCard({ isDark, action, icon, children }: {
  isDark: boolean; action: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    add_subscription:    { bg: isDark ? 'bg-green-500/10' : 'bg-green-50', border: isDark ? 'border-green-500/20' : 'border-green-200', text: isDark ? 'text-green-400' : 'text-green-700', icon: 'text-green-500' },
    update_subscription: { bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50', border: isDark ? 'border-blue-500/20' : 'border-blue-200', text: isDark ? 'text-blue-400' : 'text-blue-700', icon: 'text-blue-500' },
    toggle_subscription: { bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50', border: isDark ? 'border-yellow-500/20' : 'border-yellow-200', text: isDark ? 'text-yellow-400' : 'text-yellow-700', icon: 'text-yellow-500' },
    record_payment:      { bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50', border: isDark ? 'border-purple-500/20' : 'border-purple-200', text: isDark ? 'text-purple-400' : 'text-purple-700', icon: 'text-purple-500' },
    create_category:     { bg: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50', border: isDark ? 'border-indigo-500/20' : 'border-indigo-200', text: isDark ? 'text-indigo-400' : 'text-indigo-700', icon: 'text-indigo-500' },
    delete:              { bg: isDark ? 'bg-red-500/10' : 'bg-red-50', border: isDark ? 'border-red-500/20' : 'border-red-200', text: isDark ? 'text-red-400' : 'text-red-700', icon: 'text-red-500' },
  };
  const c = colors[action] || colors['add_subscription'];

  return (
    <div className={`mt-2 p-2 sm:p-2.5 rounded-lg flex items-center gap-2 border ${c.bg} ${c.border}`}>
      <div className={`flex-shrink-0 ${c.icon}`}>{icon}</div>
      <div className={`text-xs min-w-0 ${c.text}`}>{children}</div>
    </div>
  );
}

function ActionResultCard({ r, isDark }: { r: any; isDark: boolean }) {
  if (r.subscription) {
    const act = r.action || '';
    return (
      <ActionCard isDark={isDark} action={act} icon={
        act === 'toggle_subscription' ? <Power className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />
      }>
        <p className="font-medium truncate">
          {act === 'update_subscription' ? 'Updated: ' : act === 'toggle_subscription' ? (r.subscription.isActive ? 'Activated: ' : 'Deactivated: ') : ''}
          {r.subscription.name}
        </p>
        <p className="truncate">
          {r.subscription.currency} {r.subscription.amount}/{r.subscription.billingCycle}
          {r.subscription.category ? ` - ${r.subscription.category.name}` : ''}
        </p>
      </ActionCard>
    );
  }
  if (r.payment) {
    return (
      <ActionCard isDark={isDark} action="record_payment" icon={<DollarSign className="w-4 h-4" />}>
        <p className="font-medium truncate">Payment: {r.payment.subscription?.name}</p>
        <p className="truncate">{r.payment.currency} {r.payment.amount} on {new Date(r.payment.paidAt).toLocaleDateString()}</p>
      </ActionCard>
    );
  }
  if (r.category) {
    return (
      <ActionCard isDark={isDark} action="create_category" icon={<Tag className="w-4 h-4" />}>
        <p className="font-medium truncate">Category: {r.category.name}</p>
      </ActionCard>
    );
  }
  if (r.deletedName) {
    return (
      <ActionCard isDark={isDark} action="delete" icon={<Trash2 className="w-4 h-4" />}>
        <p className="font-medium truncate">Deleted: {r.deletedName}</p>
      </ActionCard>
    );
  }
  return null;
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => { loadSessions(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (activeSessionId) inputRef.current?.focus();
  }, [activeSessionId]);

  const loadSessions = async () => {
    try {
      setLoadingSessions(true);
      const data = await chatService.getSessions();
      setSessions(data);
      if (data.length > 0 && !activeSessionId) {
        await selectSession(data[0].id);
      }
    } catch { /* silent */ } finally {
      setLoadingSessions(false);
    }
  };

  const selectSession = async (id: string) => {
    try {
      const session = await chatService.getSession(id);
      setActiveSessionId(id);
      setMessages(session.messages.map(m => ({
        id: m.id, role: m.role, content: m.content, action: m.action || undefined,
      })));
      setShowSidebar(false);
    } catch {
      toast.error('Failed to load session');
    }
  };

  const handleNewSession = async () => {
    try {
      const session = await chatService.createSession();
      setSessions(prev => [{ ...session, _count: { messages: 0 } } as any, ...prev]);
      setActiveSessionId(session.id);
      setMessages([]);
      setShowSidebar(false);
    } catch {
      toast.error('Failed to create session');
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await chatService.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (activeSessionId === id) {
        setActiveSessionId(null);
        setMessages([]);
      }
      toast.success('Session deleted');
    } catch {
      toast.error('Failed to delete session');
    }
  };

  const addMessage = useCallback((msg: Omit<DisplayMessage, 'id'>) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setMessages(prev => [...prev, { ...msg, id }]);
    return id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<DisplayMessage>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const ensureSession = async (): Promise<string> => {
    if (activeSessionId) return activeSessionId;
    const session = await chatService.createSession();
    setSessions(prev => [{ ...session, _count: { messages: 0 } } as any, ...prev]);
    setActiveSessionId(session.id);
    return session.id;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    addMessage({ role: 'user', content: text });
    const loadingId = addMessage({ role: 'assistant', content: '', loading: true });
    setSending(true);
    try {
      const sessionId = await ensureSession();
      const res = await chatService.sendMessage(sessionId, text);
      updateMessage(loadingId, {
        content: res.message, loading: false, action: res.action,
        subscription: res.subscription, payment: res.payment,
        category: res.category, deletedName: res.deletedName,
        actions: res.actions,
      });
      handleActionToast(res);
      loadSessions();
    } catch (err: any) {
      updateMessage(loadingId, { content: err.response?.data?.error || 'Failed to send message.', loading: false });
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || sending) return;
    e.target.value = '';
    const imageUrl = URL.createObjectURL(file);
    addMessage({ role: 'user', content: 'Uploaded an image for analysis', imageUrl });
    const loadingId = addMessage({ role: 'assistant', content: '', loading: true });
    setSending(true);
    try {
      const sessionId = await ensureSession();
      const res = await chatService.sendImage(sessionId, file);
      updateMessage(loadingId, {
        content: res.message, loading: false, action: res.action,
        subscription: res.subscription, payment: res.payment,
        category: res.category, deletedName: res.deletedName,
        actions: res.actions,
      });
      handleActionToast(res);
      loadSessions();
    } catch (err: any) {
      updateMessage(loadingId, { content: err.response?.data?.error || 'Failed to analyze image.', loading: false });
    } finally {
      setSending(false);
    }
  };

  const toastForAction = (r: ActionResult) => {
    switch (r.action) {
      case 'add_subscription':
        if (r.subscription) toast.success(`Added "${r.subscription.name}"!`);
        break;
      case 'update_subscription':
        if (r.subscription) toast.success(`Updated "${r.subscription.name}"!`);
        break;
      case 'delete_subscription':
        if (r.deletedName) toast.success(`Deleted "${r.deletedName}"!`);
        break;
      case 'toggle_subscription':
        if (r.subscription) toast.success(`${r.subscription.isActive ? 'Activated' : 'Deactivated'} "${r.subscription.name}"!`);
        break;
      case 'record_payment':
        if (r.payment) toast.success(`Payment recorded for "${r.payment.subscription.name}"!`);
        break;
      case 'create_category':
        if (r.category) toast.success(`Category "${r.category.name}" created!`);
        break;
      case 'delete_category':
        if (r.deletedName) toast.success(`Category "${r.deletedName}" deleted!`);
        break;
    }
  };

  const handleActionToast = (res: ChatResponse) => {
    if (res.actions) {
      res.actions.forEach(toastForAction);
    } else {
      toastForAction(res);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // ===== Session Sidebar Content (shared between desktop & mobile) =====
  const sidebarContent = (
    <>
      <div className={`p-4 flex items-center justify-between flex-shrink-0 ${
        isDark ? 'border-b border-white/10' : 'border-b border-slate-200'
      }`}>
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Chat Sessions</h3>
        <button
          onClick={handleNewSession}
          className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          title="New chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loadingSessions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>No sessions yet</p>
            <button onClick={handleNewSession} className="mt-2 text-sm text-purple-400 hover:text-purple-300">
              Start a new chat
            </button>
          </div>
        ) : (
          sessions.map(session => (
            <button
              key={session.id}
              onClick={() => selectSession(session.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group flex items-center justify-between ${
                activeSessionId === session.id
                  ? 'bg-purple-600/20 text-purple-400'
                  : isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.title}</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                  {formatTime(session.updatedAt)} · {session._count.messages} msg{session._count.messages !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={(e) => handleDeleteSession(session.id, e)}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
                title="Delete session"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </button>
          ))
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] min-h-[350px] gap-0 sm:gap-4 relative">
      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div
          className={`fixed inset-0 z-40 md:hidden ${isDark ? 'bg-black/60' : 'bg-black/20'}`}
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Session Sidebar — mobile: overlay, desktop: inline */}
      <div className={`
        md:relative md:block md:w-72 md:flex-shrink-0
        ${showSidebar ? 'fixed inset-y-0 left-0 z-50 w-72' : 'hidden md:block'}
      `}>
        <div className={`w-72 h-full flex flex-col rounded-none md:rounded-xl border-r md:border overflow-hidden ${
          isDark ? 'bg-slate-900 md:bg-slate-800/60 border-white/10' : 'bg-white border-slate-200'
        }`}>
          {/* Mobile back button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowSidebar(false)}
              className={`flex items-center gap-2 px-4 py-3 w-full text-sm ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to chat
            </button>
          </div>
          {sidebarContent}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col rounded-none sm:rounded-xl border overflow-hidden min-w-0 ${
        isDark ? 'bg-slate-800/60 border-white/10' : 'bg-white border-slate-200'
      }`}>
        {/* Chat Header */}
        <div className={`px-3 sm:px-4 py-3 flex items-center gap-3 flex-shrink-0 ${
          isDark ? 'border-b border-white/10' : 'border-b border-slate-200'
        }`}>
          <button
            onClick={() => setShowSidebar(true)}
            className={`p-1.5 rounded-lg transition-colors md:hidden ${
              isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
            title="Chat sessions"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Wardaya AI</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Subscription Assistant</p>
          </div>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 ${isDark ? '' : 'bg-slate-50'}`}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-4">
                <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className={`text-base sm:text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Wardaya AI Assistant
              </h3>
              <p className={`text-sm max-w-md ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                Add subscriptions, read receipts, and get spending insights. Try:
              </p>
              <div className="mt-4 space-y-2 w-full max-w-sm">
                {[
                  'I just subscribed to Netflix for $15.99/month',
                  'How much do I spend monthly?',
                  'What renews this week?',
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(example); inputRef.current?.focus(); }}
                    className={`block w-full text-left text-sm px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                      isDark
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                  : isDark ? 'bg-slate-700' : 'bg-slate-200'
              }`}>
                {msg.role === 'assistant'
                  ? <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  : <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? 'text-gray-300' : 'text-slate-600'}`} />
                }
              </div>

              <div className={`max-w-[80%] sm:max-w-[70%] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : isDark
                    ? 'bg-slate-800 text-gray-200'
                    : 'bg-white text-slate-800 border border-slate-200'
              }`}>
                {msg.loading ? (
                  <div className="flex items-center gap-2 py-1">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>Thinking...</span>
                  </div>
                ) : (
                  <>
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="Uploaded" className="rounded-lg mb-2 max-h-36 sm:max-h-48 object-cover" />
                    )}
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
                        return <span key={i}>{part}</span>;
                      })}
                    </div>
                    {/* Action result cards — multi or single */}
                    {msg.actions ? (
                      msg.actions.map((r, i) => (
                        <ActionResultCard key={i} r={r} isDark={isDark} />
                      ))
                    ) : (
                      <ActionResultCard r={msg} isDark={isDark} />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`flex-shrink-0 p-3 sm:p-4 ${isDark ? 'border-t border-white/10' : 'border-t border-slate-200'}`}>
          <div className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 ${
            isDark ? 'bg-slate-900/50 border border-white/10' : 'bg-slate-100 border border-slate-200'
          }`}>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 flex-shrink-0 ${
                isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-slate-200 text-slate-500'
              }`}
              title="Upload receipt/screenshot"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} className="hidden" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={sending}
              className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-500 disabled:opacity-50 min-w-0 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:hover:bg-purple-600 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
