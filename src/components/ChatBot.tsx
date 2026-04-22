import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ImagePlus, Bot, User, Loader2, CreditCard } from 'lucide-react';
import { chatService, type ChatResponse } from '../services/chat';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  action?: ChatResponse['action'];
  subscription?: any;
  loading?: boolean;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m Wardaya, your subscription assistant. I can help you:\n\n- **Add subscriptions** — just tell me, e.g. "subscribed to Netflix $15.99/month"\n- **Read receipts** — upload a photo of a receipt or confirmation\n- **Answer questions** — "how much do I spend monthly?"',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const addMessage = (msg: Omit<Message, 'id'>) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setMessages(prev => [...prev, { ...msg, id }]);
    return id;
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    addMessage({ role: 'user', content: text });

    const loadingId = addMessage({ role: 'assistant', content: '', loading: true });
    setSending(true);

    try {
      const res = await chatService.sendMessage(text);
      updateMessage(loadingId, {
        content: res.message,
        loading: false,
        action: res.action,
        subscription: res.subscription,
      });

      if (res.action === 'add_subscription' && res.subscription) {
        toast.success(`Added "${res.subscription.name}" to your subscriptions!`);
      } else if (res.action === 'update_subscription' && res.subscription) {
        toast.success(`Updated "${res.subscription.name}"!`);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to send message. Please try again.';
      updateMessage(loadingId, { content: errorMsg, loading: false });
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || sending) return;

    // Reset file input
    e.target.value = '';

    const imageUrl = URL.createObjectURL(file);
    addMessage({ role: 'user', content: 'Uploaded an image for analysis', imageUrl });

    const loadingId = addMessage({ role: 'assistant', content: '', loading: true });
    setSending(true);

    try {
      const res = await chatService.sendImage(file);
      updateMessage(loadingId, {
        content: res.message,
        loading: false,
        action: res.action,
        subscription: res.subscription,
      });

      if (res.action === 'add_subscription' && res.subscription) {
        toast.success(`Added "${res.subscription.name}" from receipt!`);
      } else if (res.action === 'update_subscription' && res.subscription) {
        toast.success(`Updated "${res.subscription.name}" from receipt!`);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to analyze image. Please try again.';
      updateMessage(loadingId, { content: errorMsg, loading: false });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center justify-center"
          title="Chat with Wardaya AI"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
          isDark
            ? 'bg-slate-900 border-white/10'
            : 'bg-white border-slate-200'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <p className="text-sm font-semibold">Wardaya AI</p>
                <p className="text-xs text-purple-200">Subscription Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? '' : 'bg-slate-50'}`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                    : isDark ? 'bg-slate-700' : 'bg-slate-200'
                }`}>
                  {msg.role === 'assistant'
                    ? <Bot className="w-4 h-4 text-white" />
                    : <User className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-slate-600'}`} />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
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
                        <img
                          src={msg.imageUrl}
                          alt="Uploaded"
                          className="rounded-lg mb-2 max-h-40 object-cover"
                        />
                      )}
                      <div className="whitespace-pre-wrap">
                        {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i}>{part.slice(2, -2)}</strong>;
                          }
                          return <span key={i}>{part}</span>;
                        })}
                      </div>
                      {msg.subscription && (
                        <div className={`mt-2 p-2.5 rounded-lg flex items-center gap-2 ${
                          msg.action === 'update_subscription'
                            ? isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                            : isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
                        }`}>
                          <CreditCard className={`w-4 h-4 flex-shrink-0 ${msg.action === 'update_subscription' ? 'text-blue-500' : 'text-green-500'}`} />
                          <div className="text-xs">
                            <p className={`font-medium ${
                              msg.action === 'update_subscription'
                                ? isDark ? 'text-blue-400' : 'text-blue-700'
                                : isDark ? 'text-green-400' : 'text-green-700'
                            }`}>
                              {msg.action === 'update_subscription' ? 'Updated: ' : ''}{msg.subscription.name}
                            </p>
                            <p className={
                              msg.action === 'update_subscription'
                                ? isDark ? 'text-blue-400/70' : 'text-blue-600'
                                : isDark ? 'text-green-400/70' : 'text-green-600'
                            }>
                              {msg.subscription.currency} {msg.subscription.amount}/{msg.subscription.billingCycle}
                              {msg.subscription.category ? ` - ${msg.subscription.category.name}` : ''}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`flex-shrink-0 p-3 ${isDark ? 'border-t border-white/10' : 'border-t border-slate-200'}`}>
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
              isDark ? 'bg-slate-800 border border-white/10' : 'bg-slate-100 border border-slate-200'
            }`}>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                  isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-slate-200 text-slate-500'
                }`}
                title="Upload receipt/screenshot"
              >
                <ImagePlus className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={sending}
                className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-500 disabled:opacity-50 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:hover:bg-purple-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
