import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Send, Trash2, LogOut, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import TabImportModal from '../components/TabImportModal.jsx';

const STARTERS = [
  { subject: 'Mathematics', q: 'Explain the Fourier transform and its applications in signal processing' },
  { subject: 'Science',     q: 'Derive and explain the Schrödinger equation' },
  { subject: 'Programming', q: 'Explain Big O notation with real examples' },
  { subject: 'Economics',   q: 'What is the Nash Equilibrium and how is it applied?' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [subject, setSubject]       = useState('General');
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [tabContext, setTabContext]  = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const bottomRef  = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => { loadHistory(); }, [subject]);

  const loadHistory = async () => {
    try {
      const { data } = await axios.get(`/api/history?subject=${subject}`);
      setMessages(data.messages.map((m) => ({ role: m.role, content: m.content })));
    } catch { setMessages([]); }
  };

  const sendQuestion = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const next = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setLoading(true);

    try {
      const { data } = await axios.post('/api/chat/ask', {
        question: q,
        subject,
        messages: messages.slice(-10),
        tabContext,
      });
      setMessages([...next, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Clear all chat history?')) return;
    await axios.delete('/api/history');
    setMessages([]);
    toast.success('History cleared');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQuestion(); }
  };

  const onTextarea = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-paper">
      {/* ── Header ── */}
      <header className="flex-shrink-0 bg-ink h-14 px-6 flex items-center justify-between border-b-2 border-amber">
        <span className="font-display text-xl font-black text-paper">
          Study<span className="text-amber">Mind</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
              tabContext
                ? 'border-amber text-amber bg-amber/10'
                : 'border-white/20 text-white/50 hover:border-amber hover:text-amber'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${tabContext ? 'bg-amber animate-pulse' : 'bg-white/20'}`} />
            {tabContext ? 'Context Active' : 'Import Tab'}
          </button>
          <span className="hidden sm:block text-white/40 font-mono text-xs">{user?.full_name}</span>
          <button onClick={logout} title="Logout" className="text-white/40 hover:text-white transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeSubject={subject}
          onSelect={setSubject}
          tabContext={tabContext}
          onRemoveContext={() => setTabContext(null)}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6 space-y-6">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                <div className="w-16 h-16 bg-ink rounded-2xl flex items-center justify-center text-3xl shadow-[3px_3px_0_#e8a020]">
                  🎓
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold mb-1">What are you studying?</h2>
                  <p className="text-muted text-sm max-w-sm">
                    Ask any university-level question and get a detailed expert explanation.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-w-lg w-full">
                  {STARTERS.map(({ subject: s, q }) => (
                    <button
                      key={q}
                      onClick={() => { setSubject(s); setInput(q); }}
                      className="text-left bg-card border border-border rounded-xl p-3.5 hover:border-amber hover:bg-amber/5 transition-all group"
                    >
                      <span className="block font-mono text-xs text-amber-dark uppercase tracking-wider mb-1">{s}</span>
                      <span className="text-sm text-muted group-hover:text-ink leading-snug">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber flex items-center justify-center text-sm flex-shrink-0">🎓</div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                  <span className="text-muted text-sm italic">Thinking</span>
                  {[0,1,2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 border-t border-border bg-cream px-6 py-4">
            {tabContext && (
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-muted uppercase tracking-wider">Context:</span>
                <span className="flex items-center gap-1.5 bg-sage text-white text-xs font-mono px-2.5 py-0.5 rounded-full">
                  <Link2 size={10} />
                  {(tabContext.title || tabContext.url || 'Tab').slice(0, 35)}
                  <button onClick={() => setTabContext(null)} className="opacity-70 hover:opacity-100 ml-0.5">✕</button>
                </span>
              </div>
            )}

            <div className="flex gap-2 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={onTextarea}
                onKeyDown={onKeyDown}
                placeholder={`Ask a ${subject} question…`}
                rows={1}
                className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm resize-none font-sans focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all min-h-[46px] max-h-40"
              />
              <button
                onClick={sendQuestion}
                disabled={loading || !input.trim()}
                className="w-11 h-11 bg-ink rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all shadow-[2px_2px_0_#e8a020] hover:shadow-[3px_3px_0_#e8a020] hover:-translate-x-px hover:-translate-y-px"
              >
                <Send size={15} className="text-paper" />
              </button>
            </div>

            <div className="flex justify-between mt-1.5">
              <span className="font-mono text-xs text-muted">
                <kbd className="bg-paper border border-border px-1 rounded text-[10px]">Enter</kbd> send ·{' '}
                <kbd className="bg-paper border border-border px-1 rounded text-[10px]">Shift+Enter</kbd> newline
              </span>
              {messages.length > 0 && (
                <button onClick={clearHistory} className="font-mono text-xs text-muted hover:text-ink flex items-center gap-1">
                  <Trash2 size={11} /> Clear
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <TabImportModal
          onClose={() => setShowModal(false)}
          onImport={(ctx) => { setTabContext(ctx); setShowModal(false); toast.success('Tab context imported!'); }}
        />
      )}
    </div>
  );
}
